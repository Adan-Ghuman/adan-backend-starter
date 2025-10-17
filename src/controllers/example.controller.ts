import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ExampleService } from "../services/example.service";

export const ExampleController = {
  getExample: AsyncHandler(async (req: Request, res: Response) => {
    const data = await ExampleService.getExampleData();
    ApiResponse.success(res, "Fetched example data", data);
  }),
};
