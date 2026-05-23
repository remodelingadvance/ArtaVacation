import express from 'express';
import {
  getAllProperties,
  getFeaturedProperties,
  getProperty,
  getPropertiesByType,
  createProperty,
  updateProperty,
  deletePropertyImage,
  deleteProperty,
  getOwnerProperties,
  getSimilarProperties,
} from '../controllers/property.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/type/:type', getPropertiesByType);
router.get('/similar/:id', getSimilarProperties);
router.get('/:id', getProperty);

// Protected routes
router.post('/', protect, upload.array('images', 20), createProperty);
router.put('/:id', protect, upload.array('images', 20), updateProperty);
router.delete('/image/:id/:imageId', protect, deletePropertyImage);
router.delete('/:id', protect, deleteProperty);
router.get('/owner/properties', protect, getOwnerProperties);

export default router;