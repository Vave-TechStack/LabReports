import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/authenticate';
import { bookingService } from '../services/booking.service';
import { createBookingSchema, updateBookingStatusSchema, bookingQuerySchema } from '../validators/booking.validator';

const router = Router();

router.post('/', authenticate, authorize('PATIENT'), validate(createBookingSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient) return res.status(400).json({ success: false, message: 'Patient profile not found' });
    const booking = await bookingService.create({ ...req.body, patientId: patient.id });
    res.status(201).json({ success: true, message: 'Booking created', data: booking });
  } catch (err) { next(err); }
});

router.get('/my-bookings', authenticate, authorize('PATIENT'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient) return res.status(400).json({ success: false, message: 'Patient profile not found' });
    const result = await bookingService.getByPatient(patient.id, req.query as any);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
});

router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'LAB_ASSISTANT', 'RECEPTIONIST'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookingService.getAll(req.query as any);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.getById(req.params.id);
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
});

router.patch('/:id/status', authenticate, authorize('ADMIN', 'LAB_ASSISTANT', 'RECEPTIONIST'), validate(updateBookingStatusSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.updateStatus(req.params.id, req.body.status, req.body.cancellationReason);
    res.json({ success: true, message: 'Status updated', data: booking });
  } catch (err) { next(err); }
});

export default router;
