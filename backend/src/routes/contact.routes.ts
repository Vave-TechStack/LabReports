import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/authenticate';
import { contactFormSchema } from '../validators/contact.validator';

const router = Router();

router.post('/', validate(contactFormSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const message = await prisma.contactMessage.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Message sent successfully', data: message });
  } catch (err) { next(err); }
});

router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { page = '1', limit = '10' } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
      prisma.contactMessage.count(),
    ]);
    res.json({
      success: true,
      data: messages,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

export default router;
