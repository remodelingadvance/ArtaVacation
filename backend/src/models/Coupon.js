import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    maxDiscount: Number,
    minBookingAmount: Number,
    usageLimit: Number,
    usageCount: {
      type: Number,
      default: 0,
    },
    expiryDate: Date,
    applicablePropertyTypes: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Coupon', couponSchema);