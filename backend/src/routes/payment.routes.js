import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPayment,
  getUserPayments,
  handleWebhook,
} from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/:id', protect, getPayment);
router.get('/', protect, getUserPayments);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;