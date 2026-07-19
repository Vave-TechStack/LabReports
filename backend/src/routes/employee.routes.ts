import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import prisma from '../config/prisma';

const router = Router();

router.use(authenticate, authorize('SUPER_ADMIN', 'ADMIN'));

// ==================== DASHBOARD ====================

router.get('/dashboard', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalEmployees, todayPresent, onLeave, pendingLeaves, departments, branchCounts] = await Promise.all([
      prisma.employee.count(),
      prisma.attendance.count({ where: { date: { gte: today }, status: 'PRESENT' } }),
      prisma.leaveRequest.count({ where: { status: 'APPROVED', startDate: { lte: today }, endDate: { gte: today } } }),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      prisma.employee.groupBy({ by: ['department'], _count: { id: true } }),
      prisma.employee.groupBy({ by: ['branchId'], _count: { id: true } }),
    ]);

    const recentLeaves = await prisma.leaveRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { employee: { select: { firstName: true, lastName: true, department: true } } },
    });

    const recentPayroll = await prisma.payroll.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { employee: { select: { firstName: true, lastName: true, department: true } } },
    });

    res.json({
      success: true,
      data: { totalEmployees, todayPresent, onLeave, pendingLeaves, departments, branchCounts, recentLeaves, recentPayroll },
    });
  } catch (err) { next(err); }
});

// ==================== EMPLOYEES ====================

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search, department, branchId } = req.query as any;
    const where: any = {};
    if (department) where.department = department;
    if (branchId) where.branchId = branchId;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          user: { select: { email: true, phone: true, isActive: true } },
          branch: { select: { id: true, name: true } },
          _count: { select: { attendance: true, leaveRequests: true } },
        },
      }),
      prisma.employee.count({ where }),
    ]);

    res.json({
      success: true,
      data: employees,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await prisma.employee.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Employee added', data: employee });
  } catch (err) { next(err); }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await prisma.employee.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, message: 'Employee updated', data: employee });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.employee.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Employee deleted' });
  } catch (err) { next(err); }
});

// ==================== ATTENDANCE ====================

router.get('/attendance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '30', date, employeeId, status } = req.query as any;
    const where: any = {};
    if (date) where.date = { gte: new Date(date), lt: new Date(new Date(date).getTime() + 86400000) };
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: { employee: { select: { firstName: true, lastName: true, employeeId: true, department: true, branchId: true } } },
      }),
      prisma.attendance.count({ where }),
    ]);

    res.json({ success: true, data: records, meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
});

router.post('/attendance/mark', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, notes } = req.body;
    const record = await prisma.attendance.upsert({
      where: { employeeId_date: { employeeId, date: new Date(date) } },
      update: { status, checkIn: checkIn ? new Date(checkIn) : undefined, checkOut: checkOut ? new Date(checkOut) : undefined, notes },
      create: { employeeId, date: new Date(date), status, checkIn: checkIn ? new Date(checkIn) : undefined, checkOut: checkOut ? new Date(checkOut) : undefined, notes },
    });
    res.json({ success: true, message: 'Attendance marked', data: record });
  } catch (err) { next(err); }
});

router.get('/attendance/today', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    const records = await prisma.attendance.findMany({
      where: { date: { gte: today, lt: tomorrow } },
      include: { employee: { select: { firstName: true, lastName: true, employeeId: true, department: true } } },
      orderBy: { checkIn: 'desc' },
    });
    res.json({ success: true, data: records });
  } catch (err) { next(err); }
});

// ==================== LEAVES ====================

router.get('/leaves', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status, employeeId } = req.query as any;
    const where: any = {};
    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;

    const [leaves, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: { employee: { select: { firstName: true, lastName: true, employeeId: true, department: true } } },
      }),
      prisma.leaveRequest.count({ where }),
    ]);

    res.json({ success: true, data: leaves, meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
});

router.post('/leaves', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leave = await prisma.leaveRequest.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Leave request submitted', data: leave });
  } catch (err) { next(err); }
});

router.patch('/leaves/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, rejectionReason } = req.body;
    const data: any = { status };
    if (status === 'APPROVED') { data.approvedAt = new Date(); data.approvedBy = req.user!.userId; }
    if (status === 'REJECTED') data.rejectionReason = rejectionReason;
    const leave = await prisma.leaveRequest.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: `Leave ${status.toLowerCase()}`, data: leave });
  } catch (err) { next(err); }
});

// ==================== SHIFTS ====================

router.get('/shifts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '30', date, employeeId } = req.query as any;
    const where: any = {};
    if (date) where.date = { gte: new Date(date), lt: new Date(new Date(date).getTime() + 86400000) };
    if (employeeId) where.employeeId = employeeId;

    const [shifts, total] = await Promise.all([
      prisma.shift.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: { employee: { select: { firstName: true, lastName: true, employeeId: true, department: true } } },
      }),
      prisma.shift.count({ where }),
    ]);

    res.json({ success: true, data: shifts, meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
});

router.post('/shifts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId, date, type, startTime, endTime, notes } = req.body;
    const shift = await prisma.shift.upsert({
      where: { employeeId_date: { employeeId, date: new Date(date) } },
      update: { type, startTime, endTime, notes },
      create: { employeeId, date: new Date(date), type, startTime, endTime, notes },
    });
    res.json({ success: true, message: 'Shift assigned', data: shift });
  } catch (err) { next(err); }
});

// ==================== PAYROLL ====================

router.get('/payroll', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', month, year, status, employeeId } = req.query as any;
    const where: any = {};
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);
    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;

    const [records, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: { employee: { select: { firstName: true, lastName: true, employeeId: true, department: true, branchId: true } } },
      }),
      prisma.payroll.count({ where }),
    ]);

    res.json({ success: true, data: records, meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
});

router.post('/payroll/process', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions, notes } = req.body;
    const netSalary = basicSalary + (allowances || 0) - (deductions || 0);
    const record = await prisma.payroll.upsert({
      where: { employeeId_month_year: { employeeId, month, year } },
      update: { basicSalary, allowances: allowances || 0, deductions: deductions || 0, netSalary, notes },
      create: { employeeId, month, year, basicSalary, allowances: allowances || 0, deductions: deductions || 0, netSalary, notes },
    });
    res.json({ success: true, message: 'Payroll processed', data: record });
  } catch (err) { next(err); }
});

router.patch('/payroll/:id/pay', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await prisma.payroll.update({
      where: { id: req.params.id },
      data: { status: 'PAID', paymentDate: new Date() },
    });
    res.json({ success: true, message: 'Payment recorded', data: record });
  } catch (err) { next(err); }
});

router.get('/payroll/summary', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [totalPayroll, paidPayroll, pendingPayroll, departmentTotals] = await Promise.all([
      prisma.payroll.aggregate({ where: { month: currentMonth, year: currentYear }, _sum: { netSalary: true } }),
      prisma.payroll.aggregate({ where: { month: currentMonth, year: currentYear, status: 'PAID' }, _sum: { netSalary: true } }),
      prisma.payroll.count({ where: { month: currentMonth, year: currentYear, status: { not: 'PAID' } } }),
      prisma.payroll.findMany({
        where: { month: currentMonth, year: currentYear },
        include: { employee: { select: { department: true } } },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalPayroll: totalPayroll._sum.netSalary || 0,
        paidPayroll: paidPayroll._sum.netSalary || 0,
        pendingPayroll,
        totalEmployees: await prisma.employee.count(),
        processedCount: await prisma.payroll.count({ where: { month: currentMonth, year: currentYear } }),
      },
    });
  } catch (err) { next(err); }
});

export default router;
