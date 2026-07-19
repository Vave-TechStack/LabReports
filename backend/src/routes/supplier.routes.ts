import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import prisma from '../config/prisma';

const router = Router();

router.use(authenticate, authorize('SUPER_ADMIN', 'ADMIN'));

/**
 * GET /suppliers
 * Summary: Get all suppliers with search
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search, isActive } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {};

    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        include: {
          _count: { select: { inventory: true, purchaseOrders: true } },
        },
        orderBy: { name: 'asc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.supplier.count({ where }),
    ]);

    res.json({
      success: true,
      data: suppliers,
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
 * POST /suppliers
 * Summary: Create supplier
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supplier = await prisma.supplier.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Supplier added', data: supplier });
  } catch (err) { next(err); }
});

/**
 * PUT /suppliers/:id
 * Summary: Update supplier
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supplier = await prisma.supplier.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, message: 'Supplier updated', data: supplier });
  } catch (err) { next(err); }
});

/**
 * DELETE /suppliers/:id
 * Summary: Soft delete (deactivate) supplier
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.supplier.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ success: true, message: 'Supplier deactivated' });
  } catch (err) { next(err); }
});

export default router;
