import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import PDFDocument from 'pdfkit';

const router = Router();

router.get('/:id/pdf', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const report = await prisma.report.findFirst({
      where: { id: req.params.id },
      include: {
        booking: {
          include: {
            bookingTests: { include: { test: true } },
            patient: true,
          },
        },
        verifiedBy: true,
      },
    });

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    // Check ownership
    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient || report.patientId !== patient.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report.reportNumber}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('MediLab Diagnostics', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('NABL Accredited Diagnostic Laboratory', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).font('Helvetica-Bold').text(`Report: ${report.reportNumber}`, { align: 'center' });
    doc.moveDown();

    // Patient info
    doc.fontSize(10).font('Helvetica');
    doc.text(`Patient: ${report.booking.patient.firstName} ${report.booking.patient.lastName}`);
    doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString('en-IN')}`);
    if (report.verifiedBy) {
      doc.text(`Verified By: Dr. ${report.verifiedBy.firstName} ${report.verifiedBy.lastName}`);
    }
    doc.moveDown();

    // Parameters
    const params = report.parameters as any[];
    if (params?.length) {
      doc.fontSize(12).font('Helvetica-Bold').text('Test Results');
      doc.moveDown(0.5);

      const tableTop = doc.y;
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('Parameter', 50, tableTop);
      doc.text('Result', 250, tableTop);
      doc.text('Unit', 350, tableTop);
      doc.text('Range', 420, tableTop);

      doc.moveDown(0.5);
      doc.fontSize(9).font('Helvetica');

      params.forEach((param: any) => {
        const y = doc.y;
        doc.text(param.parameterName || param.name, 50, y);
        doc.text(String(param.value), 250, y);
        doc.text(param.unit || '', 350, y);
        doc.text(param.referenceRange || '', 420, y);
        doc.moveDown(0.3);
      });
    }

    doc.moveDown();
    doc.fontSize(8).font('Helvetica').text('This is a computer-generated report. No signature is required.', { align: 'center' });

    doc.end();
  } catch (err) { next(err); }
});

router.get('/invoices/:id/pdf', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { default: prisma } = await import('../config/prisma');
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id },
      include: {
        booking: {
          include: {
            bookingTests: { include: { test: { select: { name: true } } } },
            patient: true,
          },
        },
      },
    });

    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient || invoice.patientId !== patient.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).font('Helvetica-Bold').text('MediLab Diagnostics', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('GST Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').text(`Invoice: ${invoice.invoiceNumber}`);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}`);
    doc.text(`Patient: ${invoice.booking.patient.firstName} ${invoice.booking.patient.lastName}`);
    doc.moveDown();
    doc.text(`Subtotal: \u20B9${invoice.subtotal}`);
    doc.text(`GST (18%): \u20B9${invoice.gstAmount}`);
    if (invoice.discountAmount > 0) doc.text(`Discount: \u20B9${invoice.discountAmount}`);
    doc.fontSize(14).font('Helvetica-Bold').text(`Total: \u20B9${invoice.totalAmount}`);
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Status: ${invoice.isPaid ? 'Paid' : 'Pending'}`);

    doc.end();
  } catch (err) { next(err); }
});

export default router;
