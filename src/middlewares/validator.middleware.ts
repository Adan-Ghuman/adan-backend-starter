// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { ApiError } from "../utils/ApiError";

export const zodValidator = (schema: ZodType<any>) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body); 
    next();
  } catch (err: any) {
    next(new ApiError(400, err.errors?.[0]?.message || "Validation failed", "VALIDATION_ERROR"));
  }
};
