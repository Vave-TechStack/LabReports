import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import prisma from '../config/prisma';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(authenticate, authorize('LAB_ASSISTANT', 'ADMIN', 'SUPER_ADMIN'));

/**
 * @openapi
 * /lab/dashboard:
 *   get:
 *     tags: [Lab]
 *     summary: Get lab assistant dashboard stats
 */
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const labAssistant = await prisma.labAssistant.findUnique({ where: { userId: req.user!.userId } });
    if (!labAssistant) return res.status(404).json({ success: false, message: 'Lab assistant profile not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCollections = await prisma.sampleEntry.count({
      where: { labAssistantId: labAssistant.id, collectionDate: { gte: today } },
    });

    const pendingReports = await prisma.booking.count({
      where: {
        branchId: labAssistant.branchId,
        status: { in: ['SAMPLE_COLLECTED', 'LAB_PROCESSING'] },
        isDeleted: false,
      },
    });

    const pendingVerification = await prisma.report.count({
      where: { labAssistantId: labAssistant.id, isVerified: false },
    });

    const todaySamples = await prisma.sampleEntry.findMany({
      where: { labAssistantId: labAssistant.id, collectionDate: { gte: today } },
      include: {
        booking: {
          select: { bookingNumber: true, status: true, patient: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const bookingsReady = await prisma.booking.count({
      where: {
        branchId: labAssistant.branchId,
        status: 'CONFIRMED',
        isDeleted: false,
      },
    });

    res.json({
      success: true,
      data: {
        todayCollections,
        pendingReports,
        pendingVerification,
        todaySamples,
        bookingsReady,
        totalProcessed: await prisma.report.count({ where: { labAssistantId: labAssistant.id } }),
      },
    });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /lab/sample-entry:
 *   post:
 *     tags: [Lab]
 *     summary: Create a sample entry with barcode
 */
router.post('/sample-entry', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const labAssistant = await prisma.labAssistant.findUnique({ where: { userId: req.user!.userId } });
    if (!labAssistant) return res.status(404).json({ success: false, message: 'Lab assistant not found' });

    const { bookingId, sampleType, collectionPlace, notes } = req.body;

    const booking = await prisma.booking.findFirst({ where: { id: bookingId, isDeleted: false } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Generate barcode: BL + timestamp + random 4 digits
    const barcode = `BL${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

    const sampleEntry = await prisma.sampleEntry.create({
      data: {
        bookingId,
        barcode,
        labAssistantId: labAssistant.id,
        sampleType: sampleType || 'BLOOD',
        collectionDate: new Date(),
        collectionTime: new Date().toTimeString().slice(0, 5),
        collectionPlace,
        notes,
      },
      include: {
        booking: {
          select: { bookingNumber: true, patient: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'SAMPLE_COLLECTED', sampleCollectedAt: new Date() },
    });

    res.status(201).json({ success: true, message: 'Sample registered', data: sampleEntry });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /lab/barcode/{barcode}:
 *   get:
 *     tags: [Lab]
 *     summary: Lookup sample by barcode
 */
router.get('/barcode/:barcode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sample = await prisma.sampleEntry.findUnique({
      where: { barcode: req.params.barcode },
      include: {
        booking: {
          include: {
            patient: { select: { firstName: true, lastName: true, phone: true, gender: true, bloodGroup: true, dateOfBirth: true } },
            bookingTests: { include: { test: { select: { id: true, name: true, code: true, parameters: true } } } },
            report: { include: { processedBy: { select: { firstName: true, lastName: true } } } },
          },
        },
        labAssistant: { select: { firstName: true, lastName: true } },
      },
    });

    if (!sample) return res.status(404).json({ success: false, message: 'Sample not found' });

    res.json({ success: true, data: sample });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /lab/pending-bookings:
 *   get:
 *     tags: [Lab]
 *     summary: Get bookings ready for sample collection
 */
router.get('/pending-bookings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const labAssistant = await prisma.labAssistant.findUnique({ where: { userId: req.user!.userId } });
    if (!labAssistant) return res.status(404).json({ success: false, message: 'Lab assistant not found' });

    const { page = '1', limit = '20', search } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = { branchId: labAssistant.branchId, isDeleted: false, status: 'CONFIRMED' };

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: 'insensitive' } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          patient: { select: { firstName: true, lastName: true, phone: true } },
          bookingTests: { include: { test: { select: { id: true, name: true } } } },
        },
        orderBy: { appointmentDate: 'asc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      success: true,
      data: bookings,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /lab/reports/pending:
 *   get:
 *     tags: [Lab]
 *     summary: Get reports pending entry/submission
 */
router.get('/reports/pending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const labAssistant = await prisma.labAssistant.findUnique({ where: { userId: req.user!.userId } });
    if (!labAssistant) return res.status(404).json({ success: false, message: 'Lab assistant not found' });

    const { page = '1', limit = '20' } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {
      branchId: labAssistant.branchId,
      status: { in: ['SAMPLE_COLLECTED', 'LAB_PROCESSING'] },
      isDeleted: false,
      report: null,
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          patient: { select: { firstName: true, lastName: true, phone: true } },
          bookingTests: { include: { test: { select: { id: true, name: true, code: true, parameters: true } } } },
          sampleEntry: { select: { barcode: true, sampleType: true, collectionDate: true } },
        },
        orderBy: { sampleCollectedAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      success: true,
      data: bookings,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /lab/status:
 *   patch:
 *     tags: [Lab]
 *     summary: Update booking lab processing status
 */
router.patch('/status/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const validStatuses = ['SAMPLE_COLLECTED', 'LAB_PROCESSING', 'DOCTOR_VERIFICATION', 'REPORT_READY'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status transition' });
    }

    const updateData: any = { status };
    if (status === 'SAMPLE_COLLECTED') updateData.sampleCollectedAt = new Date();
    if (status === 'LAB_PROCESSING') updateData.labProcessingAt = new Date();

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: updateData,
      select: { id: true, bookingNumber: true, status: true },
    });

    res.json({ success: true, message: 'Status updated', data: booking });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /lab/doctors:
 *   get:
 *     tags: [Lab]
 *     summary: Get available doctors for assignment
 */
router.get('/doctors', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isAvailable: true },
      select: { id: true, firstName: true, lastName: true, specialization: true },
      orderBy: { firstName: 'asc' },
    });
    res.json({ success: true, data: doctors });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /lab/assign-doctor:
 *   post:
 *     tags: [Lab]
 *     summary: Assign a doctor to verify a report
 */
router.post('/assign-doctor', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId, doctorId } = req.body;
    const report = await prisma.report.update({
      where: { id: reportId },
      data: { doctorId },
    });
    res.json({ success: true, message: 'Doctor assigned', data: report });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /lab/print-labels/{id}:
 *   get:
 *     tags: [Lab]
 *     summary: Get label data for a booking
 */
router.get('/print-labels/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, isDeleted: false },
      include: {
        patient: { select: { firstName: true, lastName: true, gender: true } },
        bookingTests: { include: { test: { select: { name: true, code: true } } } },
        sampleEntry: { select: { barcode: true, sampleType: true } },
      },
    });

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
});

export default router;
