import { Schema, Document, model } from "mongoose";

// Define the Organization interface
export interface IOrganization extends Document {
  name: string;
  resources: { name: string; amount: number }[];
  budget: number;
}

// Define the Organization schema
const organizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, unique: true },
  resources: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ],
  budget: { type: Number, required: true }
});

// Export the Organization model
export default model<IOrganization>('Organization', organizationSchema);