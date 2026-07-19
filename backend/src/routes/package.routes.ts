import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/authenticate';
import { packageService } from '../services/package.service';
import { testQuerySchema } from '../validators/test.validator';

const router = Router();

router.get('/', validate(testQuerySchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.getAll(req.query as any);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
});

router.get('/popular', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const packages = await packageService.getPopular();
    res.json({ success: true, data: packages });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pkg = await packageService.getBySlug(req.params.slug);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (err) { next(err); }
});

router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pkg = await packageService.create(req.body);
    res.status(201).json({ success: true, message: 'Package created', data: pkg });
  } catch (err) { next(err); }
});

router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pkg = await packageService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Package updated', data: pkg });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await packageService.delete(req.params.id);
    res.json({ success: true, message: 'Package deleted' });
  } catch (err) { next(err); }
});

export default router;
