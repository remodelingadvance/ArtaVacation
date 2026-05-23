import express from 'express';
import {
  getActiveTheme,
  getAllThemes,
  createTheme,
  updateTheme,
  activateTheme,
  deleteTheme,
} from '../controllers/theme.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getActiveTheme);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllThemes);
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'logoImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  createTheme
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'logoImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  updateTheme
);
router.put('/:id/activate', protect, authorize('admin'), activateTheme);
router.delete('/:id', protect, authorize('admin'), deleteTheme);

export default router;