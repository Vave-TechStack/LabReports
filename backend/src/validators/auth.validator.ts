import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const otpSendSchema = z.object({
  phone: z.string().min(10).max(15),
});

export const otpVerifySchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().length(6),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
