import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/contact.validator';

const router = Router();

router.get('/profile', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user!.userId },
      include: { user: { select: { email: true, phone: true, role: true } } },
    });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (err) { next(err); }
});

router.put('/profile', authenticate, validate(updateProfileSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const patient = await prisma.patient.update({
      where: { userId: req.user!.userId },
      data: {
        ...req.body,
        ...(req.body.dateOfBirth && { dateOfBirth: new Date(req.body.dateOfBirth) }),
      },
    });
    res.json({ success: true, message: 'Profile updated', data: patient });
  } catch (err) { next(err); }
});

router.get('/history', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    const reports = await prisma.report.findMany({
      where: { patientId: patient.id },
      include: { booking: { select: { bookingNumber: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
});

router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'DOCTOR'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { page = '1', limit = '10', search } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where, skip, take: parseInt(limit),
        include: { user: { select: { email: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);
    res.json({
      success: true,
      data: patients,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

export default router;
