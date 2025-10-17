import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

const isDev = process.env.NODE_ENV === "development";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error: ApiError;

    if (err instanceof ApiError) {
      error = err;
    } else {
      error = new ApiError(
        err.statusCode || 500,
        isDev ? err.message || "Internal Server Error" : "Internal Server Error",
        err.code || "INTERNAL_SERVER_ERROR",
        isDev
          ? {
              name: err.name,
              message: err.message,
              ...(err.stack && { stack: err.stack }),
            }
          : undefined
      );
    }

    logger.error({
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      path: req.originalUrl,
      method: req.method,
      ...(isDev && { details: error.details }),
      ...(isDev && { stack: error.stack }),
    });

    res.status(error.statusCode).json(error.toJSON());
  } catch (fatalErr) {
    logger.error({
      name: "FatalErrorHandlerFailure",
      message:
        fatalErr instanceof Error ? fatalErr.message : "Unknown fatal error",
      originalError: err,
    });

    res.status(500).json({
      success: false,
      message: "Critical server error",
      statusCode: 500,
    });
  }
};
