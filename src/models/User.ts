import { Schema, Types, Document, model } from "mongoose";

// Define the User interface
export interface IUser extends Document {
  username: string;
  password: string;
  role: 'defense' | 'attack';
  organization: Types.ObjectId;
  region?: 'North' | 'South' | 'Center' | 'West Bank';
  interceptedMissiles: Types.ObjectId[];
}

// Define the User schema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['defense', 'attack'], required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  region: { type: String, enum: ['North', 'South', 'Center', 'West Bank'], required: function() { return this.role === 'defense'; } },
  interceptedMissiles: [{ type: Schema.Types.ObjectId, ref: 'Missile' }]
});

// Export the User model
export default model<IUser>('User', userSchema);