import { createLogger, format, transports, addColors } from "winston";
import { ENV } from "../config/env";

const { combine, timestamp, printf, colorize, errors } = format;

const levelColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
};
addColors(levelColors);

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

export const logger = createLogger({
  level: ENV.logLevel || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

if (ENV.NODE_ENV === "development") {
  logger.add(
    new transports.Console({
      format: combine(
        colorize({ all: true }), 
        logFormat
      ),
    })
  );
}
