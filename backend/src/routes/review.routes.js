import express from 'express';
import {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/property/:id', getPropertyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;