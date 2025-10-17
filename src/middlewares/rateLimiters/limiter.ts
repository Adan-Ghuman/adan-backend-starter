import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/ApiError";

interface LimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string; 
}

export const createRateLimiter = ({
  windowMs,
  max,
  message = "Too many requests, please try again later.",
  keyGenerator,
}: LimiterOptions): RateLimitRequestHandler => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req: Request) => {
      if (keyGenerator) return keyGenerator(req); 
      return req.cookies?.sessionId || req.ip;     
    },
    handler: (_req: Request, _res: Response, next: NextFunction) => {
      return next(new ApiError(429, message, "TOO_MANY_REQUESTS"));
    },
    standardHeaders: true, 
    legacyHeaders: false,  
  });
};
