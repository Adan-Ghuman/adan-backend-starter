import { Response } from "express";

export class ApiResponse<T> {
  constructor(
    private success: boolean,
    private message: string,
    private data?: T,
    private statusCode = 200,
    private details?: any
  ) {}

  toJSON() {
    const json: Record<string, any> = {
      success: this.success,
      message: this.message,
      data: this.data,
      statusCode: this.statusCode,
    };

    if (process.env.NODE_ENV === "development" && this.details) {
      json.details = this.details;
    }

    return json;
  }

  send(res: Response) {
    return res.status(this.statusCode).json(this.toJSON());
  }

  static success<T>(
    res: Response,
    message = "Success",
    data?: T,
    details?: any
  ) {
    return new ApiResponse(true, message, data, 200, details).send(res);
  }

  static created<T>(
    res: Response,
    message = "Created",
    data?: T,
    details?: any
  ) {
    return new ApiResponse(true, message, data, 201, details).send(res);
  }

  static updated<T>(
    res: Response,
    message = "Updated",
    data?: T,
    details?: any
  ) {
    return new ApiResponse(true, message, data, 200, details).send(res);
  }

  static deleted<T>(
    res: Response,
    message = "Deleted",
    data?: T,
    details?: any
  ) {
    return new ApiResponse(true, message, data, 200, details).send(res);
  }
}
