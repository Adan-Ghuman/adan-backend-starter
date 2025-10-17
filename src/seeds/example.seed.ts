import { ExampleModel } from "../models/example.model";

export const seedExample = async () => {
  await ExampleModel.deleteMany({});
  await ExampleModel.create([{ name: "Sample", description: "This is a seeded example" }]);
};
