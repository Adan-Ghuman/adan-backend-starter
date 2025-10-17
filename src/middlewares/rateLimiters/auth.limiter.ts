import { createRateLimiter } from "./limiter";

export const authLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts, please try again later.",
});