import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/authenticate';
import { createBlogSchema } from '../validators/contact.validator';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { page = '1', limit = '10' } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { published: true };
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({ where, orderBy: { publishedAt: 'desc' }, skip, take: parseInt(limit), select: { id: true, title: true, slug: true, excerpt: true, author: true, image: true, tags: true, publishedAt: true } }),
      prisma.blog.count({ where }),
    ]);
    res.json({ success: true, data: blogs, meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const blog = await prisma.blog.findFirst({ where: { slug: req.params.slug, published: true } });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
});

router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(createBlogSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const blog = await prisma.blog.create({
      data: { ...req.body, slug, publishedAt: req.body.published ? new Date() : null },
    });
    res.status(201).json({ success: true, message: 'Blog created', data: blog });
  } catch (err) { next(err); }
});

export default router;
