import mongoose from 'mongoose';

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: String,
    category: {
      type: String,
      enum: ['bedroom', 'bathroom', 'kitchen', 'entertainment', 'outdoor', 'safety', 'services'],
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Amenity', amenitySchema);