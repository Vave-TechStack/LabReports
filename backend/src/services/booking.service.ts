import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

export const bookingService = {
  async create(data: {
    patientId: string; testIds: string[]; packageIds?: string[];
    type: string; appointmentDate: string; appointmentTime: string;
    address?: string; branchId?: string; notes?: string;
  }) {
    const bookingNumber = `BLB${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const tests = await prisma.test.findMany({ where: { id: { in: data.testIds }, isDeleted: false } });
    if (tests.length !== data.testIds.length) throw new AppError('One or more tests not found', 404);

    let totalAmount = tests.reduce((s, t) => s + (t.discountPrice || t.price), 0);

    if (data.packageIds?.length) {
      const packages = await prisma.healthPackage.findMany({ where: { id: { in: data.packageIds }, isDeleted: false } });
      totalAmount += packages.reduce((s, p) => s + (p.discountPrice || p.price), 0);
    }

    return prisma.booking.create({
      data: {
        bookingNumber, patientId: data.patientId,
        type: data.type as any, status: 'PENDING',
        totalAmount, discountAmount: 0, finalAmount: totalAmount,
        appointmentDate: new Date(data.appointmentDate), appointmentTime: data.appointmentTime,
        address: data.address, branchId: data.branchId, notes: data.notes,
        bookingTests: { create: tests.map(t => ({ testId: t.id, price: t.discountPrice || t.price })) },
        ...(data.packageIds?.length && {
          bookingPackages: { create: data.packageIds.map(p => ({ packageId: p, price: 0 })) },
        }),
      },
      include: {
        bookingTests: { include: { test: true } },
        bookingPackages: { include: { package: true } },
        patient: { select: { firstName: true, lastName: true } },
      },
    });
  },

  async getById(id: string) {
    const booking = await prisma.booking.findFirst({
      where: { id, isDeleted: false },
      include: {
        bookingTests: { include: { test: { include: { category: true } } } },
        bookingPackages: { include: { package: true } },
        patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
        branch: true, payments: true, report: true, invoice: true,
      },
    });
    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
  },

  async getByPatient(patientId: string, params: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = params;
    const where: any = { patientId, isDeleted: false };
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          bookingTests: { include: { test: { select: { id: true, name: true } } } },
          payments: { select: { status: true, amount: true } },
          report: { select: { id: true, reportNumber: true, pdfUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);
    return { data: bookings, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async updateStatus(id: string, status: string, cancellationReason?: string) {
    const booking = await prisma.booking.findFirst({ where: { id, isDeleted: false } });
    if (!booking) throw new AppError('Booking not found', 404);

    const updateData: any = { status };
    if (status === 'CANCELLED') { updateData.cancelledAt = new Date(); updateData.cancellationReason = cancellationReason; }
    if (status === 'SAMPLE_COLLECTED') updateData.sampleCollectedAt = new Date();
    if (status === 'LAB_PROCESSING') updateData.labProcessingAt = new Date();
    if (status === 'REPORT_READY') updateData.reportReadyAt = new Date();
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();

    return prisma.booking.update({
      where: { id },
      data: updateData,
      include: { bookingTests: { include: { test: true } }, patient: { select: { firstName: true, lastName: true, phone: true } } },
    });
  },

  async getAll(params: any) {
    const { page, limit, status, type, fromDate, toDate, branchId, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const where: any = { isDeleted: false };
    if (status) where.status = status;
    if (type) where.type = type;
    if (fromDate) where.appointmentDate = { gte: new Date(fromDate) };
    if (toDate) where.appointmentDate = { lte: new Date(toDate) };
    if (branchId) where.branchId = branchId;
    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: 'insensitive' } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
          bookingTests: { include: { test: { select: { id: true, name: true } } } },
          payments: { select: { status: true, amount: true } },
          branch: { select: { id: true, name: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);
    return { data: bookings, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },
};
