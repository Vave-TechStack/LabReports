import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    if (!token && req.cookies?.accessToken) token = req.cookies.accessToken;
    if (!token && req.query?.token && typeof req.query.token === 'string') token = req.query.token;
    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    if (decoded.type !== 'access') {
      res.status(401).json({ success: false, message: 'Invalid token type' });
      return;
    }
    req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    next();
  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
      return;
    }
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;
    if (authHeader?.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    if (!token && req.cookies?.accessToken) token = req.cookies.accessToken;
    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      if (decoded.type === 'access') {
        req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
      }
    }
  } catch { /* ignore */ }
  next();
};

export const authorize = (...roles: string[]) => (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  if (!roles.includes(req.user.role)) {
    res.status(403).json({ success: false, message: 'Insufficient permissions' });
    return;
  }
  next();
};
