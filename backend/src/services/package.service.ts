import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

const DEMO_TESTS_FOR_PKG = [
  { id: 't1', name: 'Complete Blood Count (CBC)', code: 'CBC', price: 350 },
  { id: 't2', name: 'Thyroid Profile', code: 'THYROID', price: 599 },
  { id: 't3', name: 'Fasting Blood Sugar', code: 'FBS', price: 100 },
  { id: 't4', name: 'HbA1c', code: 'HBA1C', price: 450 },
  { id: 't5', name: 'Lipid Profile', code: 'LIPID', price: 399 },
  { id: 't6', name: 'Liver Function Test', code: 'LFT', price: 450 },
  { id: 't7', name: 'Kidney Function Test', code: 'KFT', price: 380 },
  { id: 't8', name: 'Vitamin D', code: 'VITD', price: 899 },
  { id: 't9', name: 'Vitamin B12', code: 'VITB12', price: 750 },
];

const DEMO_PACKAGES = [
  { id: 'p1', name: 'Basic Health Checkup', slug: 'basic-health-checkup', description: 'Essential health screening covering CBC, blood sugar, and urine analysis.', shortDescription: 'Essential health screening', price: 1500, discountPrice: 999, reportTime: '24 hours', isPopular: true, tests: [{ test: DEMO_TESTS_FOR_PKG[0] }, { test: DEMO_TESTS_FOR_PKG[2] }] },
  { id: 'p2', name: 'Comprehensive Full Body Checkup', slug: 'full-body-checkup', description: 'Complete health assessment with 40+ parameters.', shortDescription: 'Complete health assessment', price: 4000, discountPrice: 2499, reportTime: '36 hours', isPopular: true, tests: [{ test: DEMO_TESTS_FOR_PKG[0] }, { test: DEMO_TESTS_FOR_PKG[1] }, { test: DEMO_TESTS_FOR_PKG[3] }, { test: DEMO_TESTS_FOR_PKG[4] }, { test: DEMO_TESTS_FOR_PKG[5] }, { test: DEMO_TESTS_FOR_PKG[6] }] },
  { id: 'p3', name: 'Diabetes Care Package', slug: 'diabetes-care', description: 'Complete diabetes monitoring.', shortDescription: 'Diabetes monitoring', price: 2500, discountPrice: 1799, reportTime: '24 hours', isPopular: true, tests: [{ test: DEMO_TESTS_FOR_PKG[2] }, { test: DEMO_TESTS_FOR_PKG[3] }, { test: DEMO_TESTS_FOR_PKG[4] }, { test: DEMO_TESTS_FOR_PKG[6] }] },
  { id: 'p4', name: 'Heart Health Package', slug: 'heart-health', description: 'Cardiac risk assessment.', shortDescription: 'Cardiac risk assessment', price: 3000, discountPrice: 1999, reportTime: '24 hours', isPopular: true, tests: [{ test: DEMO_TESTS_FOR_PKG[4] }, { test: DEMO_TESTS_FOR_PKG[5] }, { test: DEMO_TESTS_FOR_PKG[6] }] },
  { id: 'p5', name: 'Women Wellness Package', slug: 'women-wellness', description: 'Women health checkup.', shortDescription: 'Women health checkup', price: 3500, discountPrice: 2499, reportTime: '36 hours', isPopular: false, tests: [{ test: DEMO_TESTS_FOR_PKG[0] }, { test: DEMO_TESTS_FOR_PKG[1] }, { test: DEMO_TESTS_FOR_PKG[7] }, { test: DEMO_TESTS_FOR_PKG[8] }] },
  { id: 'p6', name: 'Senior Citizen Checkup', slug: 'senior-citizen', description: 'Senior health assessment.', shortDescription: 'Senior health assessment', price: 5000, discountPrice: 3499, reportTime: '48 hours', isPopular: true, tests: [{ test: DEMO_TESTS_FOR_PKG[0] }, { test: DEMO_TESTS_FOR_PKG[1] }, { test: DEMO_TESTS_FOR_PKG[3] }, { test: DEMO_TESTS_FOR_PKG[4] }, { test: DEMO_TESTS_FOR_PKG[5] }, { test: DEMO_TESTS_FOR_PKG[6] }, { test: DEMO_TESTS_FOR_PKG[7] }, { test: DEMO_TESTS_FOR_PKG[8] }] },
];

async function safeDB<T>(dbQuery: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await dbQuery(); }
  catch (err: any) {
    if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Can\'t reach database') || err?.name === 'PrismaClientInitializationError') return fallback();
    throw err;
  }
}

export const packageService = {
  async getAll(params: { page: number; limit: number; search?: string; isPopular?: boolean }) {
    return safeDB(
      async () => {
        const { page, limit, search, isPopular } = params;
        const skip = (page - 1) * limit;
        const where: any = { isDeleted: false };
        if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { shortDescription: { contains: search, mode: 'insensitive' } }];
        if (isPopular !== undefined) where.isPopular = isPopular;
        const [packages, total] = await Promise.all([
          prisma.healthPackage.findMany({ where, include: { tests: { include: { test: { select: { id: true, name: true, code: true, price: true } } } } }, orderBy: { name: 'asc' }, skip, take: limit }),
          prisma.healthPackage.count({ where }),
        ]);
        return { data: packages, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
      },
      () => {
        const { page, limit, search, isPopular } = params;
        let filtered = [...DEMO_PACKAGES];
        if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        if (isPopular !== undefined) filtered = filtered.filter(p => p.isPopular === isPopular);
        const total = filtered.length;
        const skip = (page - 1) * limit;
        return { data: filtered.slice(skip, skip + limit), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
      }
    );
  },

  async getById(id: string) {
    return safeDB(
      async () => {
        const pkg = await prisma.healthPackage.findFirst({ where: { id, isDeleted: false }, include: { tests: { include: { test: { include: { category: { select: { id: true, name: true } } } } } } } });
        if (!pkg) throw new AppError('Package not found', 404); return pkg;
      },
      () => { const pkg = DEMO_PACKAGES.find(p => p.id === id); if (!pkg) throw new AppError('Package not found', 404); return pkg; }
    );
  },

  async getBySlug(slug: string) {
    return safeDB(
      async () => prisma.healthPackage.findFirst({ where: { slug, isDeleted: false }, include: { tests: { include: { test: true } } } }),
      () => DEMO_PACKAGES.find(p => p.slug === slug) || null
    );
  },

  async getPopular(limit = 6) {
    return safeDB(
      async () => prisma.healthPackage.findMany({ where: { isPopular: true, isDeleted: false }, include: { tests: { include: { test: { select: { id: true, name: true } } } } }, take: limit, orderBy: { name: 'asc' } }),
      () => DEMO_PACKAGES.filter(p => p.isPopular).slice(0, limit)
    );
  },

  async create(data: any) {
    return safeDB(
      async () => {
        const existing = await prisma.healthPackage.findUnique({ where: { slug: data.slug } });
        if (existing) throw new AppError('Slug already exists', 409);
        return prisma.healthPackage.create({
          data: { name: data.name, slug: data.slug, description: data.description, shortDescription: data.shortDescription, price: data.price, discountPrice: data.discountPrice, reportTime: data.reportTime || '48 hours', isPopular: data.isPopular || false, image: data.image, tests: { create: data.testIds.map((id: string) => ({ testId: id })) } },
          include: { tests: { include: { test: true } } },
        });
      },
      () => ({ id: `demo-p${Date.now()}`, ...data, tests: [] })
    );
  },

  async update(id: string, data: any) {
    const pkg = await this.getById(id);
    return safeDB(
      async () => {
        const { testIds, ...updateData } = data;
        return prisma.healthPackage.update({
          where: { id }, data: { ...updateData, ...(testIds && { tests: { deleteMany: {}, create: testIds.map((id: string) => ({ testId: id })) } }) },
          include: { tests: { include: { test: true } } },
        });
      },
      () => ({ id, ...data, tests: (data.testIds || []).map((tid: string) => ({ test: DEMO_TESTS_FOR_PKG.find(t => t.id === tid) || tid })) })
    );
  },

  async delete(id: string) {
    await this.getById(id);
    await safeDB(
      async () => prisma.healthPackage.update({ where: { id }, data: { isDeleted: true } }),
      () => { /* no-op */ }
    );
  },
};
