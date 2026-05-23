import express from 'express';
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  verifyEmail,
  getCurrentUser,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshToken);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', protect, getCurrentUser);

export default router;