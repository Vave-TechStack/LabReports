import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

router.get('/my-reports', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const reports = await prisma.report.findMany({
      where: { patientId: patient.id },
      include: {
        booking: { select: { bookingNumber: true, createdAt: true } },
        verifiedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const report = await prisma.report.findFirst({
      where: { id: req.params.id },
      include: {
        booking: {
          include: {
            bookingTests: { include: { test: true } },
            patient: { select: { firstName: true, lastName: true, bloodGroup: true, gender: true } },
          },
        },
        verifiedBy: { select: { firstName: true, lastName: true, specialization: true, signature: true } },
      },
    });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
});

router.post('/create', authenticate, authorize('LAB_ASSISTANT', 'DOCTOR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { bookingId, parameters, notes } = req.body;
    const reportNumber = `RPT${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const booking = await prisma.booking.findFirst({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Get lab assistant profile
    const labAssistant = await prisma.labAssistant.findUnique({ where: { userId: req.user!.userId } });

    const report = await prisma.report.create({
      data: {
        bookingId,
        patientId: booking.patientId,
        labAssistantId: labAssistant?.id,
        reportNumber,
        parameters,
        notes,
      },
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'DOCTOR_VERIFICATION' },
    });

    res.status(201).json({ success: true, message: 'Report created', data: report });
  } catch (err) { next(err); }
});

router.patch('/:id/verify', authenticate, authorize('DOCTOR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.userId } });
    if (!doctor) return res.status(403).json({ success: false, message: 'Doctor profile required' });

    const report = await prisma.report.update({
      where: { id: req.params.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        doctorId: doctor.id,
      },
    });

    await prisma.booking.update({
      where: { id: report.bookingId },
      data: { status: 'REPORT_READY', reportReadyAt: new Date() },
    });

    res.json({ success: true, message: 'Report verified', data: report });
  } catch (err) { next(err); }
});

export default router;
