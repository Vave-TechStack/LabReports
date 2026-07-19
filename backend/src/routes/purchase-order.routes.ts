import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import prisma from '../config/prisma';

const router = Router();

router.use(authenticate, authorize('SUPER_ADMIN', 'ADMIN'));

/**
 * GET /purchase-orders
 * Summary: Get all purchase orders with filters
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status, supplierId, search } = req.query as any;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {};

    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          supplier: { select: { id: true, name: true } },
          branch: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      meta: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

/**
 * POST /purchase-orders
 * Summary: Create purchase order
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { supplierId, branchId, items, notes, expectedAt } = req.body;
    const orderNumber = `PO${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Calculate totals from items
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    const subtotal = parsedItems.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0);
    const taxAmount = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + taxAmount;

    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber,
        supplierId,
        branchId,
        status: 'PENDING',
        items: parsedItems,
        subtotal,
        taxAmount,
        totalAmount,
        notes,
        expectedAt: expectedAt ? new Date(expectedAt) : null,
      },
    });

    res.status(201).json({ success: true, message: 'Purchase order created', data: order });
  } catch (err) { next(err); }
});

/**
 * PATCH /purchase-orders/:id/status
 * Summary: Update purchase order status and handle stock receipt
 */
router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await prisma.purchaseOrder.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const updateData: any = { status };
    if (status === 'ORDERED') updateData.orderedAt = new Date();
    if (status === 'RECEIVED' || status === 'PARTIALLY_RECEIVED') updateData.receivedAt = new Date();
    if (status === 'CANCELLED') updateData.status = 'CANCELLED';

    // If received, update inventory quantities
    if (status === 'RECEIVED' && order.items) {
      const items = order.items as any[];
      for (const item of items) {
        const existing = await prisma.inventory.findFirst({
          where: {
            itemName: { equals: item.itemName, mode: 'insensitive' },
            branchId: order.branchId,
          },
        });
        if (existing) {
          await prisma.inventory.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + (item.quantity || 0) },
          });
        } else {
          await prisma.inventory.create({
            data: {
              branchId: order.branchId,
              itemName: item.itemName,
              itemType: item.itemType || 'OTHER',
              quantity: item.quantity || 0,
              unit: item.unit || 'units',
              minQuantity: 10,
              price: item.price || 0,
              supplierId: order.supplierId,
            },
          });
        }
      }
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ success: true, message: `Order ${status.toLowerCase()}`, data: updated });
  } catch (err) { next(err); }
});

/**
 * GET /purchase-orders/:id
 * Summary: Get single purchase order detail
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id },
      include: {
        supplier: { select: { id: true, name: true, phone: true, email: true, gstNumber: true } },
        branch: { select: { id: true, name: true } },
      },
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

export default router;
