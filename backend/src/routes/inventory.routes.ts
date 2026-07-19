import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import prisma from '../config/prisma';

const router = Router();

router.use(authenticate, authorize('SUPER_ADMIN', 'ADMIN'));

/**
 * GET /inventory
 * Summary: Get all inventory items with search, filter, stock alerts
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search, itemType, branchId, lowStock, expiryBefore } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {};

    if (branchId) where.branchId = branchId;
    if (itemType) where.itemType = itemType;
    if (search) {
      where.OR = [
        { itemName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (lowStock === 'true') {
      where.quantity = { lte: prisma.inventory.fields.minQuantity };
    }
    if (expiryBefore) {
      where.expiryDate = { lte: new Date(expiryBefore) };
    }

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        include: {
          branch: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.inventory.count({ where }),
    ]);

    // Add lowStock flag to each item
    const data = items.map(item => ({
      ...item,
      isLowStock: item.quantity <= item.minQuantity,
    }));

    // Get low stock count
    const lowStockCount = await prisma.inventory.count({
      where: { ...where, quantity: { lte: prisma.inventory.fields.minQuantity } },
    });

    res.json({
      success: true,
      data,
      lowStockCount,
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
 * GET /inventory/low-stock
 * Summary: Get all low stock items (quantity <= minQuantity)
 */
router.get('/low-stock', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.inventory.findMany({
      where: { quantity: { lte: prisma.inventory.fields.minQuantity } },
      include: {
        branch: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
      orderBy: { quantity: 'asc' },
    });

    const data = items.map(item => ({
      ...item,
      isLowStock: true,
    }));

    res.json({ success: true, data, count: data.length });
  } catch (err) { next(err); }
});

/**
 * GET /inventory/stats
 * Summary: Get inventory statistics
 */
router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalItems, totalValue, lowStockItems, expiringItems, typeCounts] = await Promise.all([
      prisma.inventory.count(),
      prisma.inventory.aggregate({ _sum: { price: true } }),
      prisma.inventory.count({ where: { quantity: { lte: prisma.inventory.fields.minQuantity } } }),
      prisma.inventory.count({
        where: { expiryDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.inventory.groupBy({
        by: ['itemType'],
        _count: { id: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalItems,
        totalValue: totalValue._sum.price || 0,
        lowStockItems,
        expiringItems,
        typeCounts,
      },
    });
  } catch (err) { next(err); }
});

/**
 * POST /inventory
 * Summary: Create inventory item
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.inventory.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Item added', data: item });
  } catch (err) { next(err); }
});

/**
 * PUT /inventory/:id
 * Summary: Update inventory item
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.inventory.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, message: 'Item updated', data: item });
  } catch (err) { next(err); }
});

/**
 * PATCH /inventory/:id/quantity
 * Summary: Adjust quantity (add or subtract)
 */
router.patch('/:id/quantity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adjustment } = req.body;
    const item = await prisma.inventory.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const newQuantity = item.quantity + adjustment;
    if (newQuantity < 0) return res.status(400).json({ success: false, message: 'Insufficient quantity' });

    const updated = await prisma.inventory.update({
      where: { id: req.params.id },
      data: { quantity: newQuantity },
    });
    res.json({ success: true, message: 'Quantity updated', data: updated });
  } catch (err) { next(err); }
});

/**
 * DELETE /inventory/:id
 * Summary: Delete inventory item
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.inventory.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) { next(err); }
});

export default router;
