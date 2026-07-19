import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});

export const createBlogSchema = z.object({
  title: z.string().min(5).max(200),
  excerpt: z.string().min(10).max(300),
  content: z.string().min(50),
  author: z.string().min(2),
  image: z.string().optional(),
  tags: z.array(z.string()).min(1),
  published: z.boolean().optional(),
});

export const createTestimonialSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().optional(),
  content: z.string().min(10).max(500),
  rating: z.number().int().min(1).max(5).optional(),
  image: z.string().optional(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});
