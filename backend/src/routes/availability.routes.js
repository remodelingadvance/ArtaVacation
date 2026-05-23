import express from 'express';
import {
  getAvailabilityCalendar,
  blockDates,
  unblockDates,
  syncAvailability,
} from '../controllers/availability.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/:propertyId', getAvailabilityCalendar);
router.post('/:propertyId/block', protect, blockDates);
router.delete('/:propertyId/unblock', protect, unblockDates);
router.post('/:propertyId/sync', protect, syncAvailability);

export default router;