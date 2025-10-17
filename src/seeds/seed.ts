import { connectDB, disconnectDB } from "../config/db";
import { seedExample } from "./example.seed";
import { logger } from "../utils/logger";

const runSeeds = async () => {
  try {
    logger.info("Starting database seeding...");
    
    await connectDB();
    
    await seedExample();
    logger.info("Example data seeded");
    
    logger.info("All seeds completed successfully");
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error("Seeding failed:", error);
    await disconnectDB();
    process.exit(1);
  }
};

runSeeds();
