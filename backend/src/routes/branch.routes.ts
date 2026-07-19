import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const branches = await prisma.branch.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: branches });
  } catch (err) { next(err); }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const branch = await prisma.branch.findFirst({
      where: { id: req.params.id, isDeleted: false },
      include: { _count: { select: { employees: true, labAssistants: true } } },
    });
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });
    res.json({ success: true, data: branch });
  } catch (err) { next(err); }
});

export default router;
