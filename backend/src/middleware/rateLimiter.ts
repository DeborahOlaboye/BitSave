import { Request, Response, NextFunction } from 'express';
import { redisService } from '../services/redisService.js';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
}

export const createRateLimiter = (options: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = req.ip || 'unknown';
      const key = `ratelimit:${identifier}`;

      const current = await redisService.get<number>(key);
      const count = current ? current + 1 : 1;

      if (count === 1) {
        // First request in window
        await redisService.set(key, count, Math.floor(options.windowMs / 1000));
      } else if (count > options.max) {
        // Rate limit exceeded
        return res.status(429).json({
          error: 'Too many requests, please try again later',
        });
      } else {
        // Increment counter
        await redisService.set(key, count, Math.floor(options.windowMs / 1000));
      }

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Allow request to proceed if rate limiter fails
      next();
    }
  };
};

// Pre-configured rate limiters
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
});
