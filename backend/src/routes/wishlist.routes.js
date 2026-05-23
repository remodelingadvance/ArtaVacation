import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from '../controllers/wishlist.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.post('/remove', removeFromWishlist);
router.get('/check/:propertyId', isInWishlist);

export default router;