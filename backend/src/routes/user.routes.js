import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getNotifications,
  markNotificationAsRead,
  deleteAccount,
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', upload.single('profileImage'), updateProfile);
router.put('/change-password', changePassword);
router.get('/notifications', getNotifications);
router.put('/notifications/:notificationId', markNotificationAsRead);
router.delete('/account', deleteAccount);

export default router;