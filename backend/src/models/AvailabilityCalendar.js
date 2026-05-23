import mongoose from 'mongoose';

const availabilityCalendarSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    priceOverride: Number,
    reason: String, // blocked, booked, maintenance
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },
  {
    timestamps: true,
  }
);

availabilityCalendarSchema.index({ property: 1, date: 1 });

export default mongoose.model('AvailabilityCalendar', availabilityCalendarSchema);