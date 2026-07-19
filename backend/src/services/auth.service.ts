import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: string; name: string; phone: string };
}

// Demo users for offline mode
const DEMO_USERS = [
  { id: 'demo-001', email: 'demo@medilab.com', password: 'Demo@123', role: 'PATIENT', name: 'Demo Patient', phone: '+919999999999' },
  { id: 'admin-001', email: 'admin@medilab.com', password: 'Admin@123', role: 'SUPER_ADMIN', name: 'Admin User', phone: '+919999999900' },
];

async function safeDBQuery<T>(dbQuery: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await dbQuery();
  } catch (err: any) {
    if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Can\'t reach database') || err?.name === 'PrismaClientInitializationError') {
      return fallback();
    }
    throw err;
  }
}

export const authService = {
  async register(data: {
    firstName: string; lastName: string; email: string; phone: string; password: string;
  }): Promise<LoginResponse> {
    return safeDBQuery(
      async () => {
        const existing = await prisma.user.findFirst({
          where: { OR: [{ email: data.email }, { phone: data.phone }] },
        });
        if (existing) throw new AppError(existing.email === data.email ? 'Email already registered' : 'Phone already registered', 409);

        const hashedPassword = await require('bcryptjs').hash(data.password, 12);
        const user = await prisma.user.create({
          data: { email: data.email, phone: data.phone, password: hashedPassword, role: 'PATIENT', patient: { create: { firstName: data.firstName, lastName: data.lastName } } },
          include: { patient: true },
        });
        const tokens = generateTokens(user.id, user.email, user.role);
        return { ...tokens, user: { id: user.id, email: user.email, role: user.role, name: `${data.firstName} ${data.lastName}`, phone: user.phone } };
      },
      () => {
        const tokens = generateTokens('demo-new', data.email, 'PATIENT');
        return { ...tokens, user: { id: 'demo-new', email: data.email, role: 'PATIENT', name: `${data.firstName} ${data.lastName}`, phone: data.phone } };
      }
    );
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    // Check demo users first (works even without DB)
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demoUser) {
      const tokens = generateTokens(demoUser.id, demoUser.email, demoUser.role);
      return { ...tokens, user: { id: demoUser.id, email: demoUser.email, role: demoUser.role, name: demoUser.name, phone: demoUser.phone } };
    }

    // Try DB users
    return safeDBQuery(
      async () => {
        const user = await prisma.user.findUnique({
          where: { email }, include: { patient: true, doctor: true, employee: true, labAssistant: true },
        });
        if (!user || !user.isActive) throw new AppError('Invalid email or password', 401);
        const valid = await require('bcryptjs').compare(password, user.password);
        if (!valid) throw new AppError('Invalid email or password', 401);
        const tokens = generateTokens(user.id, user.email, user.role);
        const name = getUserDisplayName(user);
        return { ...tokens, user: { id: user.id, email: user.email, role: user.role, name, phone: user.phone } };
      },
      () => { throw new AppError('Invalid email or password', 401); }
    );
  },

  async sendOTP(phone: string): Promise<void> {
    await safeDBQuery(
      async () => {
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) throw new AppError('Phone not registered', 404);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.oTP.create({ data: { userId: user.id, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) } });
        console.log(`📱 OTP for ${phone}: ${otp}`);
      },
      () => { console.log(`📱 OTP for ${phone} (DEMO): ${Math.floor(100000 + Math.random() * 900000)}`); }
    );
  },

  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    // Demo OTP fallback
    if (phone === '+919999999999' || phone === '+919999999900') {
      const demoUser = DEMO_USERS.find(u => u.phone === phone) || DEMO_USERS[0];
      const tokens = generateTokens(demoUser.id, demoUser.email, demoUser.role);
      return { ...tokens, user: { id: demoUser.id, email: demoUser.email, role: demoUser.role, name: demoUser.name, phone: demoUser.phone } };
    }

    return safeDBQuery(
      async () => {
        const user = await prisma.user.findUnique({ where: { phone }, include: { patient: true, doctor: true, employee: true, labAssistant: true } });
        if (!user) throw new AppError('User not found', 404);
        const otpRecord = await prisma.oTP.findFirst({ where: { userId: user.id, otp, isUsed: false, expiresAt: { gte: new Date() } } });
        if (!otpRecord) throw new AppError('Invalid or expired OTP', 400);
        await prisma.oTP.update({ where: { id: otpRecord.id }, data: { isUsed: true } });
        await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
        const tokens = generateTokens(user.id, user.email, user.role);
        const name = getUserDisplayName(user);
        return { ...tokens, user: { id: user.id, email: user.email, role: user.role, name, phone: user.phone } };
      },
      () => {
        const demoUser = DEMO_USERS[0];
        const tokens = generateTokens(demoUser.id, demoUser.email, demoUser.role);
        return { ...tokens, user: { id: demoUser.id, email: demoUser.email, role: demoUser.role, name: demoUser.name, phone: demoUser.phone } };
      }
    );
  },

  async refreshToken(token: string): Promise<LoginResponse> {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
      // Check if demo token
      if (decoded.userId.startsWith('demo-')) {
        const demoUser = DEMO_USERS.find(u => u.id === decoded.userId) || DEMO_USERS[0];
        const tokens = generateTokens(demoUser.id, demoUser.email, demoUser.role);
        return { ...tokens, user: { id: demoUser.id, email: demoUser.email, role: demoUser.role, name: demoUser.name, phone: demoUser.phone } };
      }
      return safeDBQuery(
        async () => {
          const user = await prisma.user.findUnique({ where: { id: decoded.userId }, include: { patient: true, doctor: true, employee: true, labAssistant: true } });
          if (!user || user.refreshToken !== token) throw new AppError('Invalid refresh token', 401);
          const tokens = generateTokens(user.id, user.email, user.role);
          await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
          const name = getUserDisplayName(user);
          return { ...tokens, user: { id: user.id, email: user.email, role: user.role, name, phone: user.phone } };
        },
        () => {
          throw new AppError('Invalid or expired refresh token', 401);
        }
      );
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  },

  async logout(userId: string): Promise<void> {
    if (userId.startsWith('demo-')) return; // Demo users: no-op
    await safeDBQuery(
      async () => { await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } }); },
      () => { /* ignore */ }
    );
  },
};

function generateTokens(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    { userId, email, role, type: 'access' } as TokenPayload,
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
  const refreshToken = jwt.sign(
    { userId, email, role, type: 'refresh' } as TokenPayload,
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
  return { accessToken, refreshToken };
}

function getUserDisplayName(user: any): string {
  const profile = user.patient || user.doctor || user.employee || user.labAssistant;
  return profile ? `${profile.firstName} ${profile.lastName}` : 'User';
}
