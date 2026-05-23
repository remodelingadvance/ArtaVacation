import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllBookings,
  updateBookingStatus,
  getAllReviews,
  approveReview,
  createAmenity,
  getAllAmenities,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getRevenueAnalytics,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/analytics/revenue', getRevenueAnalytics);

// Users
router.get('/users', getAllUsers);

// Bookings
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Reviews
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/approve', approveReview);

// Amenities
router.post('/amenities', createAmenity);
router.get('/amenities', getAllAmenities);

// Coupons
router.post('/coupons', createCoupon);
router.get('/coupons', getAllCoupons);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

export default router;