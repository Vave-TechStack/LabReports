import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';
import { setupSwagger } from './config/swagger';
import { redis } from './config/redis';

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

export { io };

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, try again later.' },
});
app.use('/api', apiLimiter);

// Swagger docs
setupSwagger(app);

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'MediLab API is running', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// API Routes
const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;
app.use(API_PREFIX, apiRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`🔌 Client: ${socket.id}`);
  socket.on('join', (userId: string) => socket.join(`user:${userId}`));
  socket.on('disconnect', () => {});
});

// Start
const PORT = parseInt(process.env.PORT || '5000', 10);

async function start() {
  try {
    await redis.connect();
  } catch {
    console.warn('⚠️ Redis connection failed. Running without cache.');
  }

  server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║        MediLab Diagnostics API Server        ║
║──────────────────────────────────────────────║
║  Status: 🟢 Running                          ║
║  Port:   ${PORT}                               ║
║  API:    http://localhost:${PORT}/api/v1         ║
║  Docs:   http://localhost:${PORT}/api-docs       ║
║  Health: http://localhost:${PORT}/health         ║
╚══════════════════════════════════════════════╝
    `);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { API_PREFIX };
export default app;
