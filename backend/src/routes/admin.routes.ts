import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import prisma from '../config/prisma';

const router = Router();

router.use(authenticate, authorize('SUPER_ADMIN', 'ADMIN'));

/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard stats
 */
router.get('/dashboard', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalPatients, totalDoctors, totalBookings, totalTests,
      todayBookings, pendingBookings, monthlyRevenue,
      totalRevenue, totalBranches, totalUsers
    ] = await Promise.all([
      prisma.patient.count({ where: { isDeleted: false } }),
      prisma.doctor.count({ where: { isActive: true } }),
      prisma.booking.count({ where: { isDeleted: false } }),
      prisma.test.count({ where: { isDeleted: false } }),
      prisma.booking.count({ where: { createdAt: { gte: today }, isDeleted: false } }),
      prisma.booking.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'SAMPLE_COLLECTED', 'LAB_PROCESSING'] }, isDeleted: false } }),
      prisma.payment.aggregate({ where: { status: 'SUCCESS', createdAt: { gte: monthStart } }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
      prisma.branch.count({ where: { isDeleted: false } }),
      prisma.user.count({ where: { isDeleted: false } }),
    ]);

    const paymentStatusCounts = await prisma.payment.groupBy({
      by: ['status'],
      _count: true,
    });

    const bookingStatusCounts = await prisma.booking.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { isDeleted: false },
    });

    res.json({
      success: true,
      data: {
        totalPatients, totalDoctors, totalBookings, totalTests,
        todayBookings, pendingBookings,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalBranches, totalUsers,
        paymentStatusCounts,
        bookingStatusCounts,
      },
    });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /admin/revenue:
 *   get:
 *     tags: [Admin]
 *     summary: Get revenue data for charts
 */
router.get('/revenue', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const months = parseInt(req.query.months as string) || 12;
    const revenueData: { month: string; revenue: number; bookings: number }[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 1);

      const [revenue, bookingCount] = await Promise.all([
        prisma.payment.aggregate({
          where: { status: 'SUCCESS', createdAt: { gte: monthStart, lt: monthEnd } },
          _sum: { amount: true },
        }),
        prisma.booking.count({
          where: { createdAt: { gte: monthStart, lt: monthEnd }, isDeleted: false },
        }),
      ]);

      revenueData.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: '2-digit' }),
        revenue: revenue._sum.amount || 0,
        bookings: bookingCount,
      });
    }

    res.json({ success: true, data: revenueData });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /admin/bookings:
 *   get:
 *     tags: [Admin]
 *     summary: Get all bookings for admin
 */
router.get('/bookings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', status, search, fromDate, toDate } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = { isDeleted: false };

    if (status) where.status = status;
    if (fromDate) where.appointmentDate = { ...where.appointmentDate, gte: new Date(fromDate) };
    if (toDate) where.appointmentDate = { ...where.appointmentDate, lte: new Date(toDate) };
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
          payments: { select: { status: true, amount: true, gateway: true } },
          branch: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
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
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users for admin
 */
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', role, search } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = { isDeleted: false };
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, phone: true, role: true, isActive: true, isVerified: true, createdAt: true, lastLogin: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /admin/users/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update user role or status
 */
router.patch('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, isActive } = req.body;
    const data: any = {};
    if (role) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, role: true, isActive: true },
    });
    res.json({ success: true, message: 'User updated', data: user });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /admin/patients:
 *   get:
 *     tags: [Admin]
 *     summary: Get all patients for admin
 */
router.get('/patients', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', search } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { user: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          user: { select: { email: true, phone: true, isActive: true } },
          _count: { select: { bookings: true, reports: true, invoices: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
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

/**
 * @openapi
 * /admin/branches:
 *   get:
 *     tags: [Admin]
 *     summary: Get all branches for admin
 */
router.get('/branches', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branches = await prisma.branch.findMany({
      where: { isDeleted: false },
      include: {
        _count: { select: { employees: true, labAssistants: true, bookings: true, inventories: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: branches });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /admin/branches:
 *   post:
 *     tags: [Admin]
 *     summary: Create a branch
 */
router.post('/branches', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branch = await prisma.branch.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Branch created', data: branch });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /admin/branches/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a branch
 */
router.put('/branches/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branch = await prisma.branch.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, message: 'Branch updated', data: branch });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /admin/branches/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Soft delete a branch
 */
router.delete('/branches/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.branch.update({ where: { id: req.params.id }, data: { isDeleted: true } });
    res.json({ success: true, message: 'Branch deleted' });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /admin/settings:
 *   get:
 *     tags: [Admin]
 *     summary: Get site settings
 */
router.get('/settings', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.pageContent.findMany();
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /admin/recent-bookings:
 *   get:
 *     tags: [Admin]
 *     summary: Get recent bookings for dashboard
 */
router.get('/recent-bookings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const bookings = await prisma.booking.findMany({
      where: { isDeleted: false },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        bookingTests: { include: { test: { select: { name: true } } }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
});

export default router;
