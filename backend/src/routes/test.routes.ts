import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/authenticate';
import { testService } from '../services/test.service';
import { createTestSchema, updateTestSchema, testQuerySchema } from '../validators/test.validator';

const router = Router();

/**
 * @openapi
 * /tests:
 *   get:
 *     tags: [Tests]
 *     summary: Get all tests with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: isPopular
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of tests
 */
router.get('/', validate(testQuerySchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await testService.getAll(req.query as any);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /tests/popular:
 *   get:
 *     tags: [Tests]
 *     summary: Get popular tests
 */
router.get('/popular', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tests = await testService.getPopular();
    res.json({ success: true, data: tests });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /tests/categories:
 *   get:
 *     tags: [Tests]
 *     summary: Get all test categories
 */
router.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await testService.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /tests/{code}:
 *   get:
 *     tags: [Tests]
 *     summary: Get test by code
 */
router.get('/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = await testService.getByCode(req.params.code);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, data: test });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /tests:
 *   post:
 *     tags: [Tests]
 *     summary: Create a new test (Admin only)
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(createTestSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = await testService.create(req.body);
    res.status(201).json({ success: true, message: 'Test created', data: test });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /tests/{id}:
 *   put:
 *     tags: [Tests]
 *     summary: Update a test (Admin only)
 */
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(updateTestSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const test = await testService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Test updated', data: test });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /tests/{id}:
 *   delete:
 *     tags: [Tests]
 *     summary: Delete a test (Admin only)
 */
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await testService.delete(req.params.id);
    res.json({ success: true, message: 'Test deleted' });
  } catch (err) { next(err); }
});

export default router;
