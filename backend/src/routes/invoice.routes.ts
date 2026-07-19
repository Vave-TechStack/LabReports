import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.get('/my-invoices', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const invoices = await prisma.invoice.findMany({
      where: { patientId: patient.id },
      include: {
        booking: { select: { bookingNumber: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: invoices });
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id },
      include: {
        booking: {
          include: {
            bookingTests: { include: { test: { select: { name: true, code: true } } } },
            patient: { select: { firstName: true, lastName: true, address: true, city: true, state: true } },
          },
        },
      },
    });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
});

export default router;
