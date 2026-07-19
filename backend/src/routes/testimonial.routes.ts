import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const testimonials = await prisma.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    res.json({ success: true, data: testimonials });
  } catch (err) { next(err); }
});

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { page = '1', limit = '10' } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
      prisma.testimonial.count(),
    ]);
    res.json({ success: true, data: testimonials, meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
});

export default router;
