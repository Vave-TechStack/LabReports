import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

// Demo data for offline mode
const DEMO_CATEGORIES = [
  { id: 'cat-1', name: 'Complete Blood Count', slug: 'complete-blood-count', _count: { tests: 4 } },
  { id: 'cat-2', name: 'Diabetes', slug: 'diabetes', _count: { tests: 3 } },
  { id: 'cat-3', name: 'Thyroid', slug: 'thyroid', _count: { tests: 3 } },
  { id: 'cat-4', name: 'Lipid Profile', slug: 'lipid-profile', _count: { tests: 4 } },
  { id: 'cat-5', name: 'Liver Function', slug: 'liver-function', _count: { tests: 3 } },
  { id: 'cat-6', name: 'Kidney Function', slug: 'kidney-function', _count: { tests: 3 } },
  { id: 'cat-7', name: 'Vitamin & Minerals', slug: 'vitamin-minerals', _count: { tests: 4 } },
];

const DEMO_TESTS = [
  { id: 't1', name: 'Complete Blood Count (CBC)', code: 'CBC', categoryId: 'cat-1', description: 'Measures different components of blood including RBC, WBC, hemoglobin, and platelets.', price: 500, discountPrice: 350, reportTime: '6 hours', sampleType: 'BLOOD', isPopular: true, category: { id: 'cat-1', name: 'Complete Blood Count', slug: 'complete-blood-count' } },
  { id: 't2', name: 'Thyroid Profile (T3, T4, TSH)', code: 'THYROID', categoryId: 'cat-3', description: 'Complete thyroid function assessment.', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true, category: { id: 'cat-3', name: 'Thyroid', slug: 'thyroid' } },
  { id: 't3', name: 'Fasting Blood Sugar (FBS)', code: 'FBS', categoryId: 'cat-2', description: 'Measures blood glucose after fasting.', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'BLOOD', isPopular: true, category: { id: 'cat-2', name: 'Diabetes', slug: 'diabetes' } },
  { id: 't4', name: 'HbA1c', code: 'HBA1C', categoryId: 'cat-2', description: 'Average blood sugar over 2-3 months.', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true, category: { id: 'cat-2', name: 'Diabetes', slug: 'diabetes' } },
  { id: 't5', name: 'Lipid Profile', code: 'LIPID', categoryId: 'cat-4', description: 'Cholesterol and triglyceride assessment.', price: 550, discountPrice: 399, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true, category: { id: 'cat-4', name: 'Lipid Profile', slug: 'lipid-profile' } },
  { id: 't6', name: 'Liver Function Test (LFT)', code: 'LFT', categoryId: 'cat-5', description: 'Assesses liver health by measuring enzymes.', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true, category: { id: 'cat-5', name: 'Liver Function', slug: 'liver-function' } },
  { id: 't7', name: 'Kidney Function Test (KFT)', code: 'KFT', categoryId: 'cat-6', description: 'Evaluates kidney function.', price: 500, discountPrice: 380, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true, category: { id: 'cat-6', name: 'Kidney Function', slug: 'kidney-function' } },
  { id: 't8', name: 'Vitamin D Test', code: 'VITD', categoryId: 'cat-7', description: 'Vitamin D level measurement.', price: 1200, discountPrice: 899, reportTime: '24 hours', sampleType: 'BLOOD', isPopular: true, category: { id: 'cat-7', name: 'Vitamin & Minerals', slug: 'vitamin-minerals' } },
  { id: 't9', name: 'Vitamin B12 Test', code: 'VITB12', categoryId: 'cat-7', description: 'Vitamin B12 level measurement.', price: 1000, discountPrice: 750, reportTime: '24 hours', sampleType: 'BLOOD', isPopular: true, category: { id: 'cat-7', name: 'Vitamin & Minerals', slug: 'vitamin-minerals' } },
  { id: 't10', name: 'Dengue Test (NS1)', code: 'DENGUE', categoryId: 'cat-7', description: 'Early dengue detection.', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: false, category: { id: 'cat-7', name: 'Vitamin & Minerals', slug: 'vitamin-minerals' } },
  { id: 't11', name: 'Urine Routine Analysis', code: 'URINE', categoryId: 'cat-1', description: 'Complete urine analysis.', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'URINE', isPopular: false, category: { id: 'cat-1', name: 'Complete Blood Count', slug: 'complete-blood-count' } },
  { id: 't12', name: 'Malaria Test', code: 'MALARIA', categoryId: 'cat-7', description: 'Malaria parasite detection.', price: 350, discountPrice: 250, reportTime: '6 hours', sampleType: 'BLOOD', isPopular: false, category: { id: 'cat-7', name: 'Vitamin & Minerals', slug: 'vitamin-minerals' } },
];

async function safeDB<T>(dbQuery: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await dbQuery(); }
  catch (err: any) {
    if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Can\'t reach database') || err?.name === 'PrismaClientInitializationError') return fallback();
    throw err;
  }
}

export const testService = {
  async getAll(params: {
    page: number; limit: number; search?: string; categoryId?: string; isPopular?: boolean; sampleType?: string;
  }) {
    return safeDB(
      async () => {
        const { page, limit, search, categoryId, isPopular, sampleType } = params;
        const skip = (page - 1) * limit;
        const where: any = { isDeleted: false };
        if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }];
        if (categoryId) where.categoryId = categoryId;
        if (isPopular !== undefined) where.isPopular = isPopular;
        if (sampleType) where.sampleType = sampleType;
        const [tests, total] = await Promise.all([
          prisma.test.findMany({ where, include: { category: { select: { id: true, name: true, slug: true } } }, orderBy: { name: 'asc' }, skip, take: limit }),
          prisma.test.count({ where }),
        ]);
        return { data: tests, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
      },
      () => {
        const { page, limit, search, categoryId, isPopular } = params;
        let filtered = [...DEMO_TESTS];
        if (search) filtered = filtered.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase()));
        if (categoryId) filtered = filtered.filter(t => t.categoryId === categoryId);
        if (isPopular !== undefined) filtered = filtered.filter(t => t.isPopular === isPopular);
        const total = filtered.length;
        const skip = (page - 1) * limit;
        const data = filtered.slice(skip, skip + limit);
        return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
      }
    );
  },

  async getById(id: string) {
    return safeDB(
      async () => {
        const test = await prisma.test.findFirst({ where: { id, isDeleted: false }, include: { category: { select: { id: true, name: true, slug: true } } } });
        if (!test) throw new AppError('Test not found', 404); return test;
      },
      () => { const test = DEMO_TESTS.find(t => t.id === id); if (!test) throw new AppError('Test not found', 404); return test; }
    );
  },

  async getByCode(code: string) {
    return safeDB(
      async () => prisma.test.findFirst({ where: { code, isDeleted: false }, include: { category: { select: { id: true, name: true, slug: true } } } }),
      () => DEMO_TESTS.find(t => t.code === code) || null
    );
  },

  async getPopular(limit = 8) {
    return safeDB(
      async () => {
        const tests = await prisma.test.findMany({ where: { isPopular: true, isDeleted: false }, include: { category: { select: { id: true, name: true, slug: true } } }, take: limit, orderBy: { name: 'asc' } });
        return tests;
      },
      () => DEMO_TESTS.filter(t => t.isPopular).slice(0, limit)
    );
  },

  async getCategories() {
    return safeDB(
      async () => {
        return prisma.testCategory.findMany({ where: { isDeleted: false }, orderBy: { sortOrder: 'asc' }, include: { _count: { select: { tests: true } } } });
      },
      () => DEMO_CATEGORIES
    );
  },

  async create(data: any) {
    return safeDB(
      async () => {
        const existing = await prisma.test.findUnique({ where: { code: data.code } });
        if (existing) throw new AppError('Test code already exists', 409);
        return prisma.test.create({ data: { ...data, parameters: data.parameters || undefined }, include: { category: { select: { id: true, name: true } } } });
      },
      () => {
        const newId = `demo-t${Date.now()}`;
        const test = { id: newId, ...data, discountPrice: data.discountPrice || null, category: DEMO_CATEGORIES.find(c => c.id === data.categoryId) || DEMO_CATEGORIES[0] };
        return test;
      }
    );
  },

  async update(id: string, data: any) {
    await this.getById(id);
    return safeDB(
      async () => prisma.test.update({ where: { id }, data: { ...data, parameters: data.parameters || undefined }, include: { category: { select: { id: true, name: true } } } }),
      () => ({ id, ...data, category: DEMO_CATEGORIES[0] })
    );
  },

  async delete(id: string) {
    await this.getById(id);
    await safeDB(
      async () => prisma.test.update({ where: { id }, data: { isDeleted: true } }),
      () => { /* no-op in demo */ }
    );
  },
};
