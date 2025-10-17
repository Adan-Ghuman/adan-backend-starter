export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public name: string;
  public details?: any;

  constructor(statusCode: number, message: string, code: string, details?: any) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    if (process.env.NODE_ENV !== "production") {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    const json: any = {
      success: false,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };

    if (this.details) json.details = this.details;

    if (process.env.NODE_ENV === "development") {
      json.name = this.name;
      json.stack = this.stack;
    }

    return json;
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad Request", details?: any) {
    super(400, message, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", details?: any) {
    super(401, message, "UNAUTHORIZED", details);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden", details?: any) {
    super(403, message, "FORBIDDEN", details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not Found", details?: any) {
    super(404, message, "NOT_FOUND", details);
  }
}
