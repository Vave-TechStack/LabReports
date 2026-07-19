import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

router.use(authenticate, authorize('DOCTOR', 'ADMIN', 'SUPER_ADMIN'));

/**
 * GET /doctor/dashboard
 * Summary: Get doctor dashboard stats
 */
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.userId } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      pendingVerification,
      verifiedToday,
      totalVerified,
      totalPatients,
      recentReports,
    ] = await Promise.all([
      prisma.report.count({
        where: { doctorId: doctor.id, isVerified: false },
      }),
      prisma.report.count({
        where: { doctorId: doctor.id, verifiedAt: { gte: todayStart } },
      }),
      prisma.report.count({
        where: { doctorId: doctor.id, isVerified: true },
      }),
      prisma.report.groupBy({
        by: ['patientId'],
        where: { doctorId: doctor.id },
        _count: { patientId: true },
      }),
      prisma.report.findMany({
        where: { doctorId: doctor.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          booking: { select: { bookingNumber: true, type: true, appointmentDate: true } },
          patient: { select: { firstName: true, lastName: true, bloodGroup: true, gender: true } },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        pendingVerification,
        verifiedToday,
        totalVerified,
        totalPatients: totalPatients.length,
        recentReports,
        doctor: {
          id: doctor.id,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          specialization: doctor.specialization,
          qualification: doctor.qualification,
          experience: doctor.experience,
          signature: doctor.signature,
        },
      },
    });
  } catch (err) { next(err); }
});

/**
 * GET /doctor/pending-reports
 * Summary: Get reports pending verification
 */
router.get('/pending-reports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { page = '1', limit = '20', search } = req.query as any;

    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.userId } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const where: any = { doctorId: doctor.id, isVerified: false };

    if (search) {
      where.OR = [
        { booking: { bookingNumber: { contains: search, mode: 'insensitive' } } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            select: { bookingNumber: true, type: true, appointmentDate: true, status: true },
          },
          patient: {
            select: { id: true, firstName: true, lastName: true, bloodGroup: true, gender: true, dateOfBirth: true },
          },
          processedBy: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      success: true,
      data: reports,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) { next(err); }
});

/**
 * GET /doctor/reports
 * Summary: Get all reports with filters
 */
router.get('/reports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { page = '1', limit = '20', search, status, from, to } = req.query as any;

    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.userId } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const where: any = { doctorId: doctor.id };

    if (status === 'verified') where.isVerified = true;
    if (status === 'pending') where.isVerified = false;
    if (search) {
      where.OR = [
        { booking: { bookingNumber: { contains: search, mode: 'insensitive' } } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
        { reportNumber: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          booking: { select: { bookingNumber: true, type: true, appointmentDate: true } },
          patient: { select: { id: true, firstName: true, lastName: true, bloodGroup: true, gender: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      success: true,
      data: reports,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) { next(err); }
});

/**
 * GET /doctor/reports/:id
 * Summary: Get single report detail with full data for verification
 */
router.get('/reports/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const report = await prisma.report.findFirst({
      where: { id: req.params.id },
      include: {
        booking: {
          include: {
            bookingTests: {
              include: { test: { select: { id: true, name: true, code: true, parameters: true } } },
            },
            bookingPackages: {
              include: { package: { select: { id: true, name: true, slug: true } } },
            },
            patient: {
              select: {
                id: true, firstName: true, lastName: true, dateOfBirth: true,
                gender: true, bloodGroup: true, medicalHistory: true, allergies: true,
              },
            },
          },
        },
        verifiedBy: { select: { id: true, firstName: true, lastName: true, specialization: true, signature: true } },
        processedBy: { select: { firstName: true, lastName: true } },
      },
    });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
});

/**
 * PATCH /doctor/reports/:id/verify
 * Summary: Verify report with digital signature and comments
 */
router.patch('/reports/:id/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { comments } = req.body;

    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.userId } });
    if (!doctor) return res.status(403).json({ success: false, message: 'Doctor profile required' });

    const report = await prisma.report.findFirst({
      where: { id: req.params.id, doctorId: doctor.id },
    });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found or not assigned to you' });

    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        notes: comments ? `${report.notes || ''}\n--- Doctor's Note: ${comments}` : report.notes,
      },
    });

    // Update booking status to REPORT_READY
    await prisma.booking.update({
      where: { id: report.bookingId },
      data: { status: 'REPORT_READY', reportReadyAt: new Date() },
    });

    res.json({ success: true, message: 'Report verified successfully', data: updated });
  } catch (err) { next(err); }
});

/**
 * GET /doctor/patients
 * Summary: Get patients with report history count
 */
router.get('/patients', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { page = '1', limit = '20', search } = req.query as any;

    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.userId } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    // Get distinct patient IDs from reports assigned to this doctor
    const patientIds = await prisma.report.findMany({
      where: { doctorId: doctor.id },
      select: { patientId: true },
      distinct: ['patientId'],
    });

    const ids = patientIds.map(p => p.patientId);
    const where: any = { id: { in: ids } };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { updatedAt: 'desc' },
        include: {
          user: { select: { email: true, phone: true } },
          _count: { select: { reports: true, bookings: true } },
        },
      }),
      prisma.patient.count({ where }),
    ]);

    res.json({
      success: true,
      data: patients,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) { next(err); }
});

/**
 * GET /doctor/patients/:id/history
 * Summary: Get complete patient history with all reports
 */
router.get('/patients/:id/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');

    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { email: true, phone: true } },
        reports: {
          orderBy: { createdAt: 'desc' },
          include: {
            booking: { select: { bookingNumber: true, appointmentDate: true, type: true } },
            verifiedBy: { select: { firstName: true, lastName: true, specialization: true } },
          },
        },
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: { id: true, bookingNumber: true, status: true, appointmentDate: true, totalAmount: true, createdAt: true },
        },
      },
    });

    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    res.json({ success: true, data: patient });
  } catch (err) { next(err); }
});

/**
 * POST /doctor/signature
 * Summary: Update/upload digital signature
 */
router.post('/signature', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { signature } = req.body;

    if (!signature) return res.status(400).json({ success: false, message: 'Signature data is required' });

    const doctor = await prisma.doctor.update({
      where: { userId: req.user!.userId },
      data: { signature },
    });

    res.json({ success: true, message: 'Signature updated', data: { signature: doctor.signature } });
  } catch (err) { next(err); }
});

/**
 * GET /doctor/signature
 * Summary: Get doctor's digital signature
 */
router.get('/signature', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user!.userId },
      select: { signature: true },
    });
    res.json({ success: true, data: { signature: doctor?.signature || null } });
  } catch (err) { next(err); }
});

/**
 * GET /doctor/prescriptions
 * Summary: Get prescriptions for patients (placeholder for future)
 */
router.get('/prescriptions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { page = '1', limit = '20' } = req.query as any;

    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.userId } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    // Since Prescription model doesn't exist yet, return verified reports as "prescriptions"
    const reports = await prisma.report.findMany({
      where: { doctorId: doctor.id, isVerified: true },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { verifiedAt: 'desc' },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        booking: { select: { bookingNumber: true, appointmentDate: true } },
      },
    });

    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
});

export default router;
