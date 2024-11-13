import { Schema, Document, model } from "mongoose";

// Define the Missile interface
export interface IMissile extends Document {
  name: string;
  description: string;
  speed: number;
  intercepts: string[];
  price: number;
}

// Define the Missile schema
const missileSchema = new Schema<IMissile>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  speed: { type: Number, required: true },
  intercepts: [{ type: String }],
  price: { type: Number, required: true }
});

// Export the Missile model
export default model<IMissile>('Missile', missileSchema);