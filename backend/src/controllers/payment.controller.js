import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import stripe from '../config/stripe.js';
import { sendEmail } from '../services/email.service.js';
import mongoose from 'mongoose';

// @desc    Create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking ID and amount',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking',
      });
    }

    // Verify amount
    if (Math.round(amount * 100) !== Math.round(booking.pricing.totalPrice * 100)) {
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch',
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        bookingId: bookingId,
        userId: req.user._id.toString(),
        propertyId: booking.property._id.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Confirm payment
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    if (!paymentIntentId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide payment intent ID and booking ID',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment was not successful',
      });
    }

    // Get booking
    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Create payment record
    const payment = new Payment({
      transactionId: paymentIntent.id,
      booking: bookingId,
      user: req.user._id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      paymentMethod: 'stripe',
      paymentStatus: 'succeeded',
      stripePaymentIntentId: paymentIntent.id,
      stripeChargeId: paymentIntent.charges.data[0]?.id || null,
    });

    // Generate invoice number
    payment.invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    await payment.save();

    // Update booking
    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    booking.payment = payment._id;
    await booking.save();

    // Send confirmation emails
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1a1a2e; margin-bottom: 20px;">New Booking Confirmed</h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #0088ff; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
            <p><strong>Invoice Number:</strong> ${payment.invoiceNumber}</p>
            <p><strong>Property:</strong> ${booking.property.title}</p>
            <p><strong>Guest:</strong> ${booking.contactInfo.firstName} ${booking.contactInfo.lastName}</p>
            <p><strong>Guest Email:</strong> ${booking.contactInfo.email}</p>
            <p><strong>Guest Phone:</strong> ${booking.contactInfo.phone}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #0088ff; margin-top: 0;">Stay Details</h3>
            <p><strong>Check-in:</strong> ${booking.checkInDate.toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOutDate.toLocaleDateString()}</p>
            <p><strong>Number of Nights:</strong> ${booking.numberOfNights}</p>
            <p><strong>Number of Guests:</strong> ${booking.numberOfGuests}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #0088ff; margin-top: 0;">Payment Summary</h3>
            <p><strong>Base Price:</strong> $${booking.pricing.basePrice.toFixed(2)}</p>
            <p><strong>Cleaning Fee:</strong> $${booking.pricing.cleaningFee.toFixed(2)}</p>
            <p><strong>Service Fee:</strong> $${booking.pricing.serviceFee.toFixed(2)}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;">
            <p style="font-size: 18px;"><strong>Total Amount:</strong> $${booking.pricing.totalPrice.toFixed(2)}</p>
            <p><strong>Payment Status:</strong> <span style="color: #51cf66; font-weight: bold;">✓ Paid</span></p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1a1a2e; margin-bottom: 20px;">Booking Confirmed!</h2>
          <p>Hi ${booking.contactInfo.firstName},</p>
          <p>Your booking has been confirmed and payment received. We're excited to host you!</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0088ff; margin-top: 0;">Your Booking Reference</h3>
            <p style="font-size: 20px; font-weight: bold; color: #0088ff; margin: 10px 0;">${booking.bookingReference}</p>
            <p style="color: #666; font-size: 12px;">Save this for your records</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #0088ff; margin-top: 0;">Your Stay</h3>
            <p><strong>${booking.property.title}</strong></p>
            <p><strong>Check-in:</strong> ${booking.checkInDate.toLocaleDateString()} - ${booking.property.checkInTime}</p>
            <p><strong>Check-out:</strong> ${booking.checkOutDate.toLocaleDateString()} - ${booking.property.checkOutTime}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #0088ff; margin-top: 0;">Payment Confirmed</h3>
            <p><strong>Total Amount Paid:</strong> $${booking.pricing.totalPrice.toFixed(2)}</p>
            <p><strong>Invoice Number:</strong> ${payment.invoiceNumber}</p>
          </div>

          <h3 style="color: #0088ff; margin-bottom: 10px;">What's Next?</h3>
          <ul style="color: #666;">
            <li>You'll receive check-in instructions 24 hours before your arrival</li>
            <li>Review house rules and amenities</li>
            <li>Contact us if you have any questions</li>
          </ul>

          <p style="color: #666; margin-top: 20px;">
            Questions? Contact us at support@luxuryvacationrental.com
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 Luxury Vacation Rental. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendEmail(
      process.env.ADMIN_EMAIL,
      `New Booking Confirmed - ${booking.bookingReference}`,
      adminEmailHtml
    );

    await sendEmail(
      booking.contactInfo.email,
      'Booking Confirmed - Your Luxury Vacation Awaits!',
      userEmailHtml
    );

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and booking completed',
      payment,
      booking,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get payment details
export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID',
      });
    }

    const payment = await Payment.findById(id)
      .populate('booking')
      .populate('user', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Check authorization
    if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment',
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user payments
export const getUserPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Payment.countDocuments({ user: req.user._id });

    const payments = await Payment.find({ user: req.user._id })
      .populate('booking', 'bookingReference property checkInDate checkOutDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Webhook for Stripe events
export const handleWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};