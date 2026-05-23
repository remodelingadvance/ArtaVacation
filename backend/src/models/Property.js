import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    propertyType: {
      type: String,
      enum: ['apartment', 'villa', 'condo', 'flat', 'beachHouse', 'penthouse'],
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        default: 'Miami',
      },
      state: {
        type: String,
        default: 'Florida',
      },
      zipCode: String,
      country: {
        type: String,
        default: 'USA',
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    guests: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    beds: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    images: [
      {
        url: String,
        public_id: String,
        alt: String,
      },
    ],
    amenities: [
      {
        _id: false,
        name: String,
        icon: String,
        description: String,
      },
    ],
    pricing: {
      basePrice: {
        type: Number,
        required: true,
      },
      cleaningFee: {
        type: Number,
        default: 0,
      },
      serviceFee: {
        type: Number,
        default: 0,
      },
      seasonalPricing: [
        {
          _id: false,
          season: String,
          pricePerNight: Number,
          startDate: Date,
          endDate: Date,
        },
      ],
    },
    availability: {
      availableDates: [Date],
      blockedDates: [Date],
      minNightStay: {
        type: Number,
        default: 1,
      },
      maxNightStay: {
        type: Number,
        default: 365,
      },
    },
    houseRules: [String],
    checkInTime: {
      type: String,
      default: '15:00',
    },
    checkOutTime: {
      type: String,
      default: '11:00',
    },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate',
    },
    policies: [
      {
        _id: false,
        title: String,
        description: String,
      },
    ],
    transportation: {
      nearestAirport: {
        name: String,
        distance: String,
      },
      parking: String,
      publicTransit: String,
    },
    nearbyRestaurants: [
      {
        _id: false,
        name: String,
        distance: String,
        cuisine: String,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    waterfront: Boolean,
    luxuryLevel: {
      type: String,
      enum: ['standard', 'premium', 'luxury', 'ultra-luxury'],
      default: 'premium',
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ location: '2dsphere' });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Property', propertySchema);