import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema, otpSendSchema, otpVerifySchema, refreshTokenSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
 *               confirmPassword: { type: string }
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email or phone already registered
 */
router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, message: 'Registration successful', data: result });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json({ success: true, message: 'Login successful', data: result });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /auth/send-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP for phone login
 */
router.post('/send-otp', validate(otpSendSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.sendOTP(req.body.phone);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP and login
 */
router.post('/verify-otp', validate(otpVerifySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.verifyOTP(req.body.phone, req.body.otp);
    res.json({ success: true, message: 'Login successful', data: result });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 */
router.post('/refresh', validate(refreshTokenSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);
    res.json({ success: true, message: 'Token refreshed', data: result });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.logout(req.user!.userId);
    res.json({ success: true, message: 'Logout successful' });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, phone: true, role: true, isVerified: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

export default router;
