import Review from '../models/Review.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Create review
export const createReview = async (req, res) => {
  try {
    const {
      propertyId,
      bookingId,
      rating,
      title,
      content,
      categories,
    } = req.body;

    if (!propertyId || !rating || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check if user has booking for this property
    const booking = await Booking.findOne({
      _id: bookingId,
      property: propertyId,
      user: req.user._id,
      status: 'completed',
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'You must have a completed booking to review this property',
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this property',
      });
    }

    // Create review
    const review = new Review({
      property: propertyId,
      user: req.user._id,
      booking: bookingId,
      rating,
      title,
      content,
      categories,
      isVerified: true,
    });

    await review.save();

    // Add review to property
    property.reviews.push(review._id);

    // Update property rating
    const allReviews = await Review.find({ property: propertyId });
    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    property.rating = Math.round(averageRating * 10) / 10;
    property.totalReviews = allReviews.length;

    await property.save();

    // Add review to user
    const user = await User.findById(req.user._id);
    user.reviews.push(review._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get property reviews
export const getPropertyReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const skip = (page - 1) * limit;
    const total = await Review.countDocuments({ property: id });

    const reviews = await Review.find({ property: id })
      .populate('user', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, content, categories } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check authorization
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.content = content || review.content;
    review.categories = categories || review.categories;

    await review.save();

    // Update property rating
    const allReviews = await Review.find({ property: review.property });
    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Property.findByIdAndUpdate(review.property, {
      rating: Math.round(averageRating * 10) / 10,
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check authorization
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const propertyId = review.property;

    await Review.findByIdAndDelete(id);

    // Update property
    await Property.findByIdAndUpdate(propertyId, {
      $pull: { reviews: id },
    });

    // Update property rating
    const allReviews = await Review.find({ property: propertyId });
    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    await Property.findByIdAndUpdate(propertyId, {
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};