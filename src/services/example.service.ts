import { ExampleRepository } from "../repositories/example.repository";

export const ExampleService = {
  async getExampleData() {
    return ExampleRepository.findAll();
  },
  async createExample(data: any) {
    return ExampleRepository.create(data);
  },
};
