import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ENV } from './env.js';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    if (ENV.MONGO_URI && ENV.MONGO_URI.trim() !== '') {
      console.log('Connecting to provided MongoDB URI...');
      await mongoose.connect(ENV.MONGO_URI);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } else {
      console.log('No MONGO_URI provided. Initializing embedded MongoMemoryServer for instant zero-config launch...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`Embedded MongoDB instance active at: ${uri}`);
    }
  } catch (error) {
    console.warn('Direct MongoDB connection failed. Falling back to embedded MongoMemoryServer...', error);
    try {
      if (!mongoMemoryServer) {
        mongoMemoryServer = await MongoMemoryServer.create();
      }
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`Fallback Embedded MongoDB Connected: ${uri}`);
    } catch (memError) {
      console.error('Failed to initialize database:', memError);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
