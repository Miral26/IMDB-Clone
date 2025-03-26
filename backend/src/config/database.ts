import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/imdb';

export const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority',
      authSource: 'admin',
      ssl: true,
    } as mongoose.ConnectOptions;

    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error(`MongoDB connection error: ${error.message}`);
      console.error('Error details:', error);
    } else {
      console.error('An unknown error occurred while connecting to MongoDB');
    }
    process.exit(1);
  }
};

export default connectDB; 