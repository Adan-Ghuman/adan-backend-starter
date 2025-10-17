import dotenv from "dotenv";
import { z } from "zod";

dotenv.config(); 

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),

  MONGO_URI: z.string().url(),

  ACCESS_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),

  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),

  CLIENT_URL: z.string().url(),
  API_PREFIX: z.string().default("/api/v1"),

  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("debug"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
  process.exit(1); 
}

export const ENV = {
  NODE_ENV: parsedEnv.data.NODE_ENV,
  PORT: Number(parsedEnv.data.PORT),
  URI: parsedEnv.data.MONGO_URI,
  clientUrl: parsedEnv.data.CLIENT_URL,
  apiPrefix: parsedEnv.data.API_PREFIX,
  logLevel: parsedEnv.data.LOG_LEVEL,

  jwt: {
    accessSecret: parsedEnv.data.ACCESS_TOKEN_SECRET,
    accessExpiry: parsedEnv.data.ACCESS_TOKEN_EXPIRES_IN,
    refreshSecret: parsedEnv.data.REFRESH_TOKEN_SECRET,
    refreshExpiry: parsedEnv.data.REFRESH_TOKEN_EXPIRES_IN,
  },

  aws: {
    region: parsedEnv.data.AWS_REGION,
    accessKey: parsedEnv.data.AWS_ACCESS_KEY_ID,
    secretKey: parsedEnv.data.AWS_SECRET_ACCESS_KEY,
    bucketName: parsedEnv.data.AWS_S3_BUCKET_NAME,
  },
};
