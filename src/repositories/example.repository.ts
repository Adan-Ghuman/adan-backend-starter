import { ExampleModel, IExample } from "../models/example.model";

export const ExampleRepository = {
  async findAll(): Promise<IExample[]> {
    return ExampleModel.find().lean<IExample[]>().exec();
  },
  async create(data: Partial<IExample>): Promise<IExample> {
    return ExampleModel.create(data);
  },
};
