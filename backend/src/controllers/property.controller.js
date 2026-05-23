import Property from '../models/Property.js';
import Review from '../models/Review.js';
import { uploadImage, deleteImage } from '../services/upload.service.js';
import mongoose from 'mongoose';

// @desc    Get all properties with filters and search
export const getAllProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      guests,
      amenities,
      location,
      waterfront,
      luxuryLevel,
    } = req.query;

    const skip = (page - 1) * limit;
    const filter = { isActive: true };

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by property type
    if (propertyType) {
      filter.propertyType = { $in: propertyType.split(',') };
    }

    // Filter by price
    if (minPrice || maxPrice) {
      filter['pricing.basePrice'] = {};
      if (minPrice) filter['pricing.basePrice'].$gte = Number(minPrice);
      if (maxPrice) filter['pricing.basePrice'].$lte = Number(maxPrice);
    }

    // Filter by bedrooms
    if (bedrooms) {
      filter.bedrooms = { $gte: Number(bedrooms) };
    }

    // Filter by bathrooms
    if (bathrooms) {
      filter.bathrooms = { $gte: Number(bathrooms) };
    }

    // Filter by guests
    if (guests) {
      filter.guests = { $gte: Number(guests) };
    }

    // Filter by amenities
    if (amenities) {
      filter['amenities.name'] = { $in: amenities.split(',') };
    }

    // Filter by location
    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }

    // Filter by waterfront
    if (waterfront === 'true') {
      filter.waterfront = true;
    }

    // Filter by luxury level
    if (luxuryLevel) {
      filter.luxuryLevel = { $in: luxuryLevel.split(',') };
    }

    // Get total count
    const total = await Property.countDocuments(filter);

    // Get properties
    const properties = await Property.find(filter)
      .populate('owner', 'firstName lastName profileImage')
      .populate('reviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get featured properties
export const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true, isActive: true })
      .populate('owner', 'firstName lastName profileImage')
      .populate('reviews')
      .limit(6);

    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single property
export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const property = await Property.findById(id)
      .populate('owner', 'firstName lastName email phone profileImage')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'firstName lastName profileImage' },
      });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get properties by type (Condos, Villas, etc.)
export const getPropertiesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (page - 1) * limit;

    const total = await Property.countDocuments({
      propertyType: type,
      isActive: true,
    });

    const properties = await Property.find({
      propertyType: type,
      isActive: true,
    })
      .populate('owner', 'firstName lastName profileImage')
      .populate('reviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create property (Admin/Owner)
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      location,
      guests,
      bedrooms,
      beds,
      bathrooms,
      amenities,
      pricing,
      houseRules,
      checkInTime,
      checkOutTime,
      cancellationPolicy,
      policies,
      transportation,
      nearbyRestaurants,
      waterfront,
      luxuryLevel,
      tags,
    } = req.body;

    // Validation
    if (!title || !description || !propertyType || !location || !guests || !bedrooms) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create property
    const property = new Property({
      title,
      description,
      propertyType,
      location,
      guests,
      bedrooms,
      beds,
      bathrooms,
      amenities,
      pricing,
      houseRules,
      checkInTime,
      checkOutTime,
      cancellationPolicy,
      policies,
      transportation,
      nearbyRestaurants,
      waterfront,
      luxuryLevel,
      tags,
      owner: req.user._id,
    });

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await uploadImage(file, 'luxury-rental/properties');
        property.images.push({
          url: uploadedImage.url,
          public_id: uploadedImage.public_id,
          alt: title,
        });
      }
    }

    await property.save();

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update property
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      propertyType,
      location,
      guests,
      bedrooms,
      beds,
      bathrooms,
      amenities,
      pricing,
      houseRules,
      checkInTime,
      checkOutTime,
      cancellationPolicy,
      policies,
      transportation,
      nearbyRestaurants,
      waterfront,
      luxuryLevel,
      tags,
      isFeatured,
      isActive,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    let property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check authorization
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property',
      });
    }

    // Update fields
    property.title = title || property.title;
    property.description = description || property.description;
    property.propertyType = propertyType || property.propertyType;
    property.location = location || property.location;
    property.guests = guests || property.guests;
    property.bedrooms = bedrooms || property.bedrooms;
    property.beds = beds || property.beds;
    property.bathrooms = bathrooms || property.bathrooms;
    property.amenities = amenities || property.amenities;
    property.pricing = pricing || property.pricing;
    property.houseRules = houseRules || property.houseRules;
    property.checkInTime = checkInTime || property.checkInTime;
    property.checkOutTime = checkOutTime || property.checkOutTime;
    property.cancellationPolicy = cancellationPolicy || property.cancellationPolicy;
    property.policies = policies || property.policies;
    property.transportation = transportation || property.transportation;
    property.nearbyRestaurants = nearbyRestaurants || property.nearbyRestaurants;
    property.waterfront = waterfront !== undefined ? waterfront : property.waterfront;
    property.luxuryLevel = luxuryLevel || property.luxuryLevel;
    property.tags = tags || property.tags;

    if (req.user.role === 'admin') {
      property.isFeatured = isFeatured !== undefined ? isFeatured : property.isFeatured;
      property.isActive = isActive !== undefined ? isActive : property.isActive;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await uploadImage(file, 'luxury-rental/properties');
        property.images.push({
          url: uploadedImage.url,
          public_id: uploadedImage.public_id,
          alt: title || property.title,
        });
      }
    }

    property = await property.save();

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete property image
export const deletePropertyImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check authorization
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Find and remove image
    const image = property.images.id(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Delete from Cloudinary
    await deleteImage(image.public_id);

    // Remove from property
    property.images.pull(imageId);
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check authorization
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property',
      });
    }

    // Delete images from Cloudinary
    for (const image of property.images) {
      await deleteImage(image.public_id);
    }

    await Property.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get owner properties
export const getOwnerProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Property.countDocuments({ owner: req.user._id });

    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get similar properties
export const getSimilarProperties = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const similar = await Property.find({
      _id: { $ne: id },
      propertyType: property.propertyType,
      isActive: true,
    })
      .populate('owner', 'firstName lastName profileImage')
      .limit(6);

    res.status(200).json({
      success: true,
      properties: similar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};