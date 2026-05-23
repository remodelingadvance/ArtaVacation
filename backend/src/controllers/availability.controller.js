import AvailabilityCalendar from '../models/AvailabilityCalendar.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

// @desc    Get availability calendar for property
export const getAvailabilityCalendar = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { month, year } = req.query;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
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

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const calendar = await AvailabilityCalendar.find({
      property: propertyId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    res.status(200).json({
      success: true,
      calendar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Block dates for property
export const blockDates = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { startDate, endDate, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start and end dates',
      });
    }

    const property = await Property.findById(propertyId);

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

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date',
      });
    }

    // Create availability entries for each day
    const current = new Date(start);
    const entries = [];

    while (current <= end) {
      entries.push({
        property: propertyId,
        date: new Date(current),
        isAvailable: false,
        reason: reason || 'blocked',
      });
      current.setDate(current.getDate() + 1);
    }

    await AvailabilityCalendar.insertMany(entries);

    res.status(201).json({
      success: true,
      message: 'Dates blocked successfully',
      entriesCreated: entries.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Unblock dates
export const unblockDates = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { startDate, endDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
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

    // Check authorization
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const result = await AvailabilityCalendar.deleteMany({
      property: propertyId,
      date: {
        $gte: start,
        $lte: end,
      },
      reason: 'blocked',
    });

    res.status(200).json({
      success: true,
      message: 'Dates unblocked successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Sync availability with bookings
export const syncAvailability = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
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

    // Get all confirmed bookings
    const bookings = await Booking.find({
      property: propertyId,
      status: { $in: ['confirmed', 'checkedIn'] },
    });

    // Delete old booking entries
    await AvailabilityCalendar.deleteMany({
      property: propertyId,
      reason: 'booked',
    });

    // Create availability entries for each booking
    const entries = [];
    for (const booking of bookings) {
      const current = new Date(booking.checkInDate);
      while (current < booking.checkOutDate) {
        entries.push({
          property: propertyId,
          date: new Date(current),
          isAvailable: false,
          reason: 'booked',
          booking: booking._id,
        });
        current.setDate(current.getDate() + 1);
      }
    }

    if (entries.length > 0) {
      await AvailabilityCalendar.insertMany(entries);
    }

    res.status(200).json({
      success: true,
      message: 'Availability synced successfully',
      entriesCreated: entries.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};