import { z } from 'zod';

export const createTestSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().min(2).max(20),
  categoryId: z.string().uuid(),
  description: z.string().min(10),
  shortDescription: z.string().max(200).optional(),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  preparationInstructions: z.string().optional(),
  reportTime: z.string().optional(),
  sampleType: z.enum(['BLOOD', 'URINE', 'STOOL', 'SPUTUM', 'SWAB', 'TISSUE', 'OTHER']).optional(),
  isPopular: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  parameters: z.array(z.object({
    name: z.string().min(1),
    unit: z.string().min(1),
    referenceRange: z.string().min(1),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
  })).optional(),
});

export const updateTestSchema = createTestSchema.partial();

export const testQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  isPopular: z.coerce.boolean().optional(),
  sampleType: z.string().optional(),
});
