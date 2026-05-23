import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'Miami Summer',
        'FIFA World Cup',
        'Autumn',
        'Christmas',
        'Halloween',
        'Luxury Dark',
        'Beach Sunset',
      ],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    colors: {
      primary: String,
      secondary: String,
      accent: String,
      background: String,
      text: String,
      success: String,
      error: String,
      warning: String,
      info: String,
    },
    typography: {
      primaryFont: String,
      secondaryFont: String,
      headingSize: String,
      bodySize: String,
    },
    backgroundImage: {
      url: String,
      public_id: String,
      opacity: { type: Number, default: 0.7 },
    },
    animations: {
      enabled: { type: Boolean, default: true },
      speed: { type: String, enum: ['slow', 'normal', 'fast'], default: 'normal' },
      type: String,
      particleEffect: Boolean,
      floatingElements: Boolean,
    },
    loader: {
      type: String,
      animation: String,
      backgroundColor: String,
      primaryColor: String,
      customSvg: String,
    },
    navbar: {
      backgroundColor: String,
      textColor: String,
      logoUrl: { url: String, public_id: String },
      style: { type: String, enum: ['transparent', 'solid', 'glass'], default: 'glass' },
    },
    banners: {
      homeHero: {
        imageUrl: { url: String, public_id: String },
        videoUrl: String,
        overlayColor: String,
        overlayOpacity: Number,
        heading: String,
        subheading: String,
        ctaText: String,
        ctaLink: String,
      },
      seasonal: {
        enabled: Boolean,
        imageUrl: { url: String, public_id: String },
        backgroundColor: String,
        content: String,
      },
    },
    icons: {
      propertyType: {
        apartment: String,
        villa: String,
        condo: String,
        flat: String,
        beachHouse: String,
        penthouse: String,
      },
      amenities: Object,
    },
    seasonalDecorations: {
      enabled: Boolean,
      elements: [String],
      particleColor: String,
      particleType: String,
    },
    pageTransitions: {
      type: String,
      duration: Number,
      effect: String,
    },
    neonEffects: {
      enabled: Boolean,
      color: String,
      intensity: Number,
    },
    overlay: {
      color: String,
      opacity: Number,
      blendMode: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Theme', themeSchema);