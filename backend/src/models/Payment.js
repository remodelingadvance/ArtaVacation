import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'bank_transfer'],
      default: 'stripe',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
    stripePaymentIntentId: String,
    stripeChargeId: String,
    receipt: {
      url: String,
      public_id: String,
    },
    refund: {
      amount: Number,
      reason: String,
      processedAt: Date,
      refundId: String,
    },
    invoiceNumber: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Payment', paymentSchema);