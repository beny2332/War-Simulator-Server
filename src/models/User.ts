import { Schema, Types, Document, model } from "mongoose";
import { RegionsEnum } from "../types/enums/regionEnum"

// Define the User interface
export interface IUser extends Document {
  username: string;
  password: string;
  role: 'defense' | 'attack';
  organization: Types.ObjectId;
  region?: RegionsEnum;
  attackes: {
    attackType: string;
    targetRegion: string;
    status: string;
    date: Date;
  }[];
  resources: { name: string; amount: number }[];

}

// Define the User schema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['defense', 'attack'], required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  region: { type: String, enum: Object.values(RegionsEnum), required: function() { return this.role === 'defense'; } },
  attackes: [
    {
      attackType: { type: String, required: true },
      targetRegion: { type: String, required: true },
      status: { type: String, required: true },
      date: { type: Date, required: true }
    }
  ],
  resources: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ]
});

// Export the User model
export default model<IUser>('User', userSchema);