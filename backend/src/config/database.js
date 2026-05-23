import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongooseConnection = async () => {
  try {
    const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export default mongooseConnection;