import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { uploadSingle } from '../middleware/upload';

const router = Router();

router.post('/image', authenticate, uploadSingle('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({
      success: true,
      message: 'File uploaded',
      data: {
        url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) { next(err); }
});

router.post('/report', authenticate, uploadSingle('report'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({
      success: true,
      message: 'Report uploaded',
      data: { url: `/uploads/${req.file.filename}`, filename: req.file.filename },
    });
  } catch (err) { next(err); }
});

export default router;
