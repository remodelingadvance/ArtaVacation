import express from 'express';
import {
  checkAvailability,
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
} from '../controllers/booking.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/check-availability', checkAvailability);
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

export default router;