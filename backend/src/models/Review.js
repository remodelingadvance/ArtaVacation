import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
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
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: String,
    content: String,
    categories: {
      cleanliness: Number,
      communication: Number,
      accuracy: Number,
      location: Number,
      value: Number,
    },
    photos: [
      {
        url: String,
        public_id: String,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    responses: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        content: String,
        createdAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Review', reviewSchema);