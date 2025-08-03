import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(`You have error in mongo db connection -- ${err}`);
  }
};

export default db;
