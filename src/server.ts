import http from "http";
import app from "./app";
import { logger } from "./utils/logger";
import { connectDB, disconnectDB } from "./config/db";
import { ENV } from "./config/env"; 

const PORT = ENV.PORT;
const server = http.createServer(app);

(async () => {
  try {
    await connectDB();
    logger.info("✅ Database connected successfully");

      server.listen(PORT, () => {
        logger.info(`🚀 Server running on port ${PORT}`);
      });

      process.on("SIGINT", () => gracefulShutdown("SIGINT"));
      process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    logger.error("❌ Failed to initialize server", error);
    process.exit(1);
  }
})();

async function gracefulShutdown(signal: NodeJS.Signals) {
  logger.info(`🛑 Received ${signal}. Starting graceful shutdown...`);

  try {
    await disconnectDB();
    logger.info("🧹 Database disconnected. Shutdown complete.");
  } catch (dbError) {
    logger.error("Error while disconnecting from DB", dbError);
  } finally {
    process.exit(0);
  }
}

export default app;
