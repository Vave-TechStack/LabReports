import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import prisma from '../config/prisma';

const router = Router();

router.use(authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'));

// ==================== DASHBOARD ====================

router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [monthlyIncome, monthlyExpenses, yearlyIncome, yearlyExpenses, pendingInvoices, recentTransactions] = await Promise.all([
      prisma.payment.aggregate({ where: { status: 'SUCCESS', createdAt: { gte: monthStart } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { date: { gte: monthStart } }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: 'SUCCESS', createdAt: { gte: yearStart } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { date: { gte: yearStart } }, _sum: { amount: true } }),
      prisma.invoice.count({ where: { isPaid: false } }),
      prisma.$queryRawUnsafe(`
        (SELECT 'income' as type, p.id, p.amount, p.created_at as date, b.booking_number as ref FROM payments p JOIN bookings b ON b.id = p.booking_id WHERE p.status = 'SUCCESS')
        UNION ALL
        (SELECT 'expense' as type, e.id, e.amount, e.date, e.description as ref FROM expenses e)
        ORDER BY date DESC LIMIT 10
      `) as any,
    ]);

    res.json({
      success: true,
      data: {
        monthlyIncome: monthlyIncome._sum.amount || 0,
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        monthlyProfit: (monthlyIncome._sum.amount || 0) - (monthlyExpenses._sum.amount || 0),
        yearlyIncome: yearlyIncome._sum.amount || 0,
        yearlyExpenses: yearlyExpenses._sum.amount || 0,
        yearlyProfit: (yearlyIncome._sum.amount || 0) - (yearlyExpenses._sum.amount || 0),
        pendingInvoices,
        recentTransactions: Array.isArray(recentTransactions) ? recentTransactions : [],
      },
    });
  } catch (err) { next(err); }
});

// ==================== EXPENSES ====================

router.get('/expenses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', category, fromDate, toDate, branchId } = req.query as any;
    const where: any = {};
    if (category) where.category = category;
    if (branchId) where.branchId = branchId;
    if (fromDate || toDate) {
      where.date = {};
      if (fromDate) where.date.gte = new Date(fromDate);
      if (toDate) where.date.lte = new Date(toDate);
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: { branch: { select: { id: true, name: true } } },
      }),
      prisma.expense.count({ where }),
    ]);

    res.json({
      success: true,
      data: expenses,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

router.post('/expenses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await prisma.expense.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Expense added', data: expense });
  } catch (err) { next(err); }
});

router.put('/expenses/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await prisma.expense.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, message: 'Expense updated', data: expense });
  } catch (err) { next(err); }
});

router.delete('/expenses/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.expense.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) { next(err); }
});

// ==================== INVOICES / INCOME ====================

router.get('/invoices', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search, isPaid, fromDate, toDate } = req.query as any;
    const where: any = {};
    if (isPaid !== undefined) where.isPaid = isPaid === 'true';
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { booking: { bookingNumber: { contains: search, mode: 'insensitive' } } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          patient: { select: { firstName: true, lastName: true } },
          booking: { select: { bookingNumber: true, type: true, status: true } },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      success: true,
      data: invoices,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

// ==================== PROFIT & LOSS ====================

router.get('/profit-loss', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const months = parseInt(req.query.months as string) || 12;
    const data: { month: string; income: number; expenses: number; profit: number }[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 1);

      const [income, expenses] = await Promise.all([
        prisma.payment.aggregate({
          where: { status: 'SUCCESS', createdAt: { gte: monthStart, lt: monthEnd } },
          _sum: { amount: true },
        }),
        prisma.expense.aggregate({
          where: { date: { gte: monthStart, lt: monthEnd } },
          _sum: { amount: true },
        }),
      ]);

      const inc = income._sum.amount || 0;
      const exp = expenses._sum.amount || 0;
      data.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: '2-digit' }),
        income: inc,
        expenses: exp,
        profit: inc - exp,
      });
    }

    // Totals
    const totalIncome = data.reduce((s, d) => s + d.income, 0);
    const totalExpenses = data.reduce((s, d) => s + d.expenses, 0);

    // Expense breakdown
    const expenseBreakdown = await prisma.expense.groupBy({
      by: ['category'],
      _sum: { amount: true },
      where: { date: { gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1) } },
    });

    res.json({
      success: true,
      data: {
        monthly: data,
        totalIncome,
        totalExpenses,
        totalProfit: totalIncome - totalExpenses,
        expenseBreakdown,
      },
    });
  } catch (err) { next(err); }
});

// ==================== GST REPORTS ====================

router.get('/gst-report', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const months = parseInt(req.query.months as string) || 3;
    const data: { month: string; taxableAmount: number; gstAmount: number; invoiceCount: number }[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 1);

      const [invoices] = await Promise.all([
        prisma.invoice.findMany({
          where: { createdAt: { gte: monthStart, lt: monthEnd }, isPaid: true },
          select: { subtotal: true, gstAmount: true },
        }),
      ]);

      data.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: '2-digit' }),
        taxableAmount: invoices.reduce((s, i) => s + i.subtotal, 0),
        gstAmount: invoices.reduce((s, i) => s + i.gstAmount, 0),
        invoiceCount: invoices.length,
      });
    }

    res.json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;
