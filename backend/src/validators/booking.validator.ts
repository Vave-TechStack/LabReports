import { z } from 'zod';

export const createBookingSchema = z.object({
  testIds: z.array(z.string().uuid()).min(1),
  packageIds: z.array(z.string().uuid()).optional(),
  type: z.enum(['AT_CLINIC', 'HOME_COLLECTION']),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/),
  address: z.string().max(500).optional(),
  branchId: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'SAMPLE_COLLECTED', 'LAB_PROCESSING', 'DOCTOR_VERIFICATION', 'REPORT_READY', 'DELIVERED', 'CANCELLED']),
  cancellationReason: z.string().optional(),
});

export const bookingQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.string().optional(),
  type: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});
