import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import e from "express";

const connectDB = async () => { 
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.bgRed.white);
    process.exit(1);
  }
}

export default connectDB;