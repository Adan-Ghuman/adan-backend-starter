import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { ENV } from "./env";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.URI);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("❌ Error connecting to MongoDB", error);
    process.exit(1); 
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) return; 
  try {
    await mongoose.connection.close();
    logger.info("🧹 MongoDB disconnected successfully");
  } catch (error) {
    logger.error("❌ Error disconnecting from MongoDB", error);
  }
};
