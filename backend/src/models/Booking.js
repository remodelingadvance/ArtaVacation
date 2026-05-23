import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      uppercase: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    numberOfNights: {
      type: Number,
      required: true,
    },
    contactInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
    notes: String,
    pricing: {
      basePrice: Number,
      cleaningFee: Number,
      serviceFee: Number,
      seasonalSurge: Number,
      discount: Number,
      totalPrice: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'checkedIn', 'checkedOut'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    cancellationReason: String,
    cancellationRequestedAt: Date,
    refundAmount: Number,
    specialRequests: String,
    guestNotes: String,
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);