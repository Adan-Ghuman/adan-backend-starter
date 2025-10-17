import { Schema, Document, model } from "mongoose";

export interface IExample extends Document {
  name: string;
  description: string;
  createdAt: Date;
}

const exampleSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const ExampleModel = model<IExample>("Example", exampleSchema);
