import User from '../models/User.js';
import Property from '../models/Property.js';
import mongoose from 'mongoose';

// @desc    Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');

    res.status(200).json({
      success: true,
      wishlist: user.savedProperties,
      count: user.savedProperties.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const user = await User.findById(req.user._id);

    if (user.savedProperties.includes(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Property already in wishlist',
      });
    }

    user.savedProperties.push(propertyId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Property added to wishlist',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.savedProperties.includes(propertyId)) {
      return res.status(404).json({
        success: false,
        message: 'Property not in wishlist',
      });
    }

    user.savedProperties.pull(propertyId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Property removed from wishlist',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Check if property is in wishlist
export const isInWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const user = await User.findById(req.user._id);

    const isInWishlist = user.savedProperties.includes(propertyId);

    res.status(200).json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};