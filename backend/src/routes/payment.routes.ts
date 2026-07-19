import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

/**
 * @openapi
 * /payments/create-order:
 *   post:
 *     tags: [Payments]
 *     summary: Create a payment order
 *     security:
 *       - bearerAuth: []
 */
router.post('/create-order', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { bookingId, gateway } = req.body;

    const booking = await prisma.booking.findFirst({ where: { id: bookingId, isDeleted: false } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        orderId,
        gateway: gateway || 'CASH',
        amount: booking.finalAmount,
        status: 'PENDING',
      },
    });

    res.json({
      success: true,
      message: 'Payment order created',
      data: {
        orderId: payment.orderId,
        amount: payment.amount,
        currency: 'INR',
        gateway,
        paymentId: payment.id,
      },
    });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /payments/verify:
 *   post:
 *     tags: [Payments]
 *     summary: Verify a payment
 *     security:
 *       - bearerAuth: []
 */
router.post('/verify', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const { orderId, paymentId, gatewayResponse } = req.body;

    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'SUCCESS',
        paymentId,
        gatewayResponse: gatewayResponse || undefined,
      },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' },
    });

    // Generate invoice
    const booking = await prisma.booking.findUnique({
      where: { id: payment.bookingId },
      include: { patient: true },
    });

    if (booking) {
      const invoiceNumber = `INV${Date.now()}`;
      const gstRate = 0.18;
      const gstAmount = Math.round(booking.finalAmount * gstRate * 100) / 100;

      await prisma.invoice.create({
        data: {
          invoiceNumber,
          bookingId: booking.id,
          patientId: booking.patientId,
          subtotal: booking.finalAmount - gstAmount,
          gstAmount,
          discountAmount: booking.discountAmount,
          totalAmount: booking.finalAmount + gstAmount,
          isPaid: true,
          paidAt: new Date(),
        },
      });
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) { next(err); }
});

router.get('/history', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const payments = await prisma.payment.findMany({
      where: { booking: { patient: { userId: req.user!.userId } } },
      include: { booking: { select: { bookingNumber: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ success: true, data: payments });
  } catch (err) { next(err); }
});

export default router;
