import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import prisma from '../config/prisma';

const router = Router();

router.use(authenticate, authorize('SUPER_ADMIN', 'ADMIN'));

// ==================== DASHBOARD STATS ====================

router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalLeads, newLeadsToday, convertedLeads,
      openTickets, urgentTickets,
      pendingFollowUps, todayFollowUps,
      activeCampaigns, totalCampaigns,
      recentLeads, recentTickets, upcomingFollowUps,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: today } } }),
      prisma.lead.count({ where: { status: 'CONVERTED' } }),
      prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      prisma.supportTicket.count({ where: { priority: 'URGENT', status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      prisma.followUp.count({ where: { status: 'PENDING' } }),
      prisma.followUp.count({ where: { dueDate: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, status: 'PENDING' } }),
      prisma.campaign.count({ where: { status: { in: ['DRAFT', 'SCHEDULED', 'SENDING'] } } }),
      prisma.campaign.count(),
      prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.supportTicket.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: { _count: { select: { messages: true } } },
      }),
      prisma.followUp.findMany({
        where: { status: 'PENDING' },
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: { lead: { select: { firstName: true, lastName: true } } },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalLeads, newLeadsToday, convertedLeads,
        openTickets, urgentTickets,
        pendingFollowUps, todayFollowUps,
        activeCampaigns, totalCampaigns,
        leadStatusCounts: await prisma.lead.groupBy({ by: ['status'], _count: true }),
        ticketStatusCounts: await prisma.supportTicket.groupBy({ by: ['status'], _count: true }),
        recentLeads, recentTickets, upcomingFollowUps,
      },
    });
  } catch (err) { next(err); }
});

// ==================== LEADS ====================

router.get('/leads', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search, status, source } = req.query as any;
    const where: any = {};
    if (status) where.status = status;
    if (source) where.source = source;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          assignedToUser: { select: { id: true, email: true } },
          _count: { select: { followUps: true } },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      success: true,
      data: leads,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

router.post('/leads', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await prisma.lead.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Lead created', data: lead });
  } catch (err) { next(err); }
});

router.put('/leads/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await prisma.lead.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, message: 'Lead updated', data: lead });
  } catch (err) { next(err); }
});

router.patch('/leads/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const data: any = { status };
    if (status === 'CONVERTED') data.convertedAt = new Date();
    const lead = await prisma.lead.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: `Lead marked as ${status}`, data: lead });
  } catch (err) { next(err); }
});

router.delete('/leads/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) { next(err); }
});

// ==================== SUPPORT TICKETS ====================

router.get('/tickets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search, status, priority } = req.query as any;
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { ticketNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          assignedToUser: { select: { id: true, email: true } },
          _count: { select: { messages: true } },
        },
      }),
      prisma.supportTicket.count({ where }),
    ]);

    res.json({
      success: true,
      data: tickets,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

router.post('/tickets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticketNumber = `TKT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const ticket = await prisma.supportTicket.create({
      data: { ...req.body, ticketNumber },
    });
    res.status(201).json({ success: true, message: 'Ticket created', data: ticket });
  } catch (err) { next(err); }
});

router.get('/tickets/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: req.params.id },
      include: {
        assignedToUser: { select: { id: true, email: true } },
        booking: { select: { bookingNumber: true, status: true, patient: { select: { firstName: true, lastName: true } } } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
});

router.patch('/tickets/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, resolution } = req.body;
    const data: any = { status };
    if (resolution && status === 'RESOLVED') data.resolution = resolution;
    const ticket = await prisma.supportTicket.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: `Ticket ${status.toLowerCase()}`, data: ticket });
  } catch (err) { next(err); }
});

router.post('/tickets/:id/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sender, message } = req.body;
    const msg = await prisma.ticketMessage.create({
      data: { ticketId: req.params.id, sender, message, isStaff: true },
    });
    // Update ticket status to in-progress if open
    await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: { status: 'IN_PROGRESS' },
    });
    res.status(201).json({ success: true, data: msg });
  } catch (err) { next(err); }
});

// ==================== FOLLOW-UPS ====================

router.get('/follow-ups', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status, search } = req.query as any;
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      prisma.followUp.findMany({
        where,
        orderBy: { dueDate: 'asc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          lead: { select: { id: true, firstName: true, lastName: true } },
          ticket: { select: { id: true, ticketNumber: true, subject: true } },
          assignedToUser: { select: { id: true, email: true } },
        },
      }),
      prisma.followUp.count({ where }),
    ]);

    res.json({
      success: true,
      data: items,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

router.post('/follow-ups', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.followUp.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Follow-up created', data: item });
  } catch (err) { next(err); }
});

router.put('/follow-ups/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body };
    if (data.status === 'COMPLETED') data.completedAt = new Date();
    const item = await prisma.followUp.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: 'Follow-up updated', data: item });
  } catch (err) { next(err); }
});

router.patch('/follow-ups/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const data: any = { status };
    if (status === 'COMPLETED') data.completedAt = new Date();
    const item = await prisma.followUp.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: `Follow-up ${status.toLowerCase()}`, data: item });
  } catch (err) { next(err); }
});

// ==================== CAMPAIGNS ====================

router.get('/campaigns', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status, type } = req.query as any;
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: { createdByUser: { select: { id: true, email: true } } },
      }),
      prisma.campaign.count({ where }),
    ]);

    res.json({
      success: true,
      data: campaigns,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

router.post('/campaigns', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body, createdBy: req.user!.userId };
    const campaign = await prisma.campaign.create({ data });
    res.status(201).json({ success: true, message: 'Campaign created', data: campaign });
  } catch (err) { next(err); }
});

router.put('/campaigns/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaign = await prisma.campaign.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, message: 'Campaign updated', data: campaign });
  } catch (err) { next(err); }
});

router.patch('/campaigns/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const data: any = { status };
    if (status === 'SENT') data.sentAt = new Date();
    const campaign = await prisma.campaign.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: `Campaign ${status.toLowerCase()}`, data: campaign });
  } catch (err) { next(err); }
});

router.delete('/campaigns/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.campaign.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (err) { next(err); }
});

export default router;
