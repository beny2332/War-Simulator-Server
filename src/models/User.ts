import { Schema, Types, Document, model } from "mongoose";
import { RegionsEnum } from "../types/enums/regionEnum"

// Define the User interface
export interface IUser extends Document {
  username: string;
  password: string;
  role: 'defense' | 'attack';
  organization: Types.ObjectId;
  region?: RegionsEnum;
  interceptedMissiles: Types.ObjectId[];
  resources: { name: string; amount: number }[];

}

// Define the User schema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['defense', 'attack'], required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  region: { type: String, RegionsEnum, required: function() { return this.role === 'defense'; } },
  interceptedMissiles: [{ type: Schema.Types.ObjectId, ref: 'Missile' }],
  resources: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ]
});

// Export the User model
export default model<IUser>('User', userSchema);