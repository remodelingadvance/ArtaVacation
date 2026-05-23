import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import AvailabilityCalendar from '../models/AvailabilityCalendar.js';
import { sendEmail } from '../services/email.service.js';
import mongoose from 'mongoose';

// @desc    Check availability
export const checkAvailability = async (req, res) => {
  try {
    const { propertyId, checkInDate, checkOutDate, guests } = req.body;

    if (!propertyId || !checkInDate || !checkOutDate || !guests) {
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

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    if (checkIn < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past',
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (guests > property.guests) {
      return res.status(400).json({
        success: false,
        message: `Maximum guests allowed: ${property.guests}`,
      });
    }

    // Check for bookings in date range
    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ['confirmed', 'checkedIn'] },
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for selected dates',
        isAvailable: false,
      });
    }

    // Calculate number of nights
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights < property.availability.minNightStay) {
      return res.status(400).json({
        success: false,
        message: `Minimum stay: ${property.availability.minNightStay} nights`,
      });
    }

    if (nights > property.availability.maxNightStay) {
      return res.status(400).json({
        success: false,
        message: `Maximum stay: ${property.availability.maxNightStay} nights`,
      });
    }

    // Calculate pricing
    let basePrice = property.pricing.basePrice * nights;

    // Apply seasonal pricing if available
    if (property.pricing.seasonalPricing && property.pricing.seasonalPricing.length > 0) {
      for (const season of property.pricing.seasonalPricing) {
        const seasonStart = new Date(season.startDate);
        const seasonEnd = new Date(season.endDate);

        if (checkIn >= seasonStart && checkOut <= seasonEnd) {
          basePrice = season.pricePerNight * nights;
          break;
        }
      }
    }

    const cleaningFee = property.pricing.cleaningFee || 0;
    const serviceFee = Math.round((basePrice * 0.1) * 100) / 100; // 10% service fee
    const totalPrice = basePrice + cleaningFee + serviceFee;

    res.status(200).json({
      success: true,
      isAvailable: true,
      numberOfNights: nights,
      pricing: {
        basePrice: Math.round(basePrice * 100) / 100,
        cleaningFee,
        serviceFee,
        totalPrice: Math.round(totalPrice * 100) / 100,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create booking
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      contactInfo,
      notes,
      specialRequests,
    } = req.body;

    if (!propertyId || !checkInDate || !checkOutDate || !numberOfGuests || !contactInfo) {
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

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check availability again
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ['confirmed', 'checkedIn'] },
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for selected dates',
      });
    }

    // Calculate pricing
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    let basePrice = property.pricing.basePrice * nights;

    if (property.pricing.seasonalPricing && property.pricing.seasonalPricing.length > 0) {
      for (const season of property.pricing.seasonalPricing) {
        const seasonStart = new Date(season.startDate);
        const seasonEnd = new Date(season.endDate);

        if (checkIn >= seasonStart && checkOut <= seasonEnd) {
          basePrice = season.pricePerNight * nights;
          break;
        }
      }
    }

    const cleaningFee = property.pricing.cleaningFee || 0;
    const serviceFee = Math.round((basePrice * 0.1) * 100) / 100;
    const totalPrice = basePrice + cleaningFee + serviceFee;

    // Create booking
    const booking = new Booking({
      property: propertyId,
      user: req.user._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      numberOfNights: nights,
      contactInfo: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email || req.user.email,
        phone: contactInfo.phone,
      },
      notes,
      specialRequests,
      pricing: {
        basePrice: Math.round(basePrice * 100) / 100,
        cleaningFee,
        serviceFee,
        totalPrice: Math.round(totalPrice * 100) / 100,
      },
      status: 'pending',
    });

    await booking.save();

    // Add to user bookings
    req.user.bookings.push(booking._id);
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
      .populate('property')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get booking details
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await Booking.findById(id)
      .populate('property')
      .populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await Booking.findById(id).populate('property').populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
    }

    // Calculate refund based on cancellation policy
    let refundAmount = booking.pricing.totalPrice;

    const checkInDate = new Date(booking.checkInDate);
    const daysUntilCheckIn = Math.ceil((checkInDate - new Date()) / (1000 * 60 * 60 * 24));

    if (booking.property.cancellationPolicy === 'strict' && daysUntilCheckIn < 14) {
      refundAmount = 0;
    } else if (booking.property.cancellationPolicy === 'moderate' && daysUntilCheckIn < 7) {
      refundAmount = booking.pricing.totalPrice * 0.5;
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancellationRequestedAt = new Date();
    booking.refundAmount = refundAmount;
    await booking.save();

    // Send cancellation email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Cancelled</h2>
        <p>Hi ${booking.user.firstName},</p>
        <p>Your booking has been cancelled.</p>
        <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
        <p><strong>Property:</strong> ${booking.property.title}</p>
        <p><strong>Check-in Date:</strong> ${booking.checkInDate.toLocaleDateString()}</p>
        <p><strong>Refund Amount:</strong> $${refundAmount.toFixed(2)}</p>
        <p>The refund will be processed to your original payment method within 5-7 business days.</p>
      </div>
    `;

    await sendEmail(booking.user.email, 'Booking Cancelled - LuxeStay', emailHtml);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      refundAmount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};