import { createRateLimiter } from "./limiter";

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
