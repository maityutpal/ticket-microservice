import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT token not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo db string for auth service not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('auth service connected to mongo db');
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log('auth service listening on port 3000 !');
  });
};

start();
