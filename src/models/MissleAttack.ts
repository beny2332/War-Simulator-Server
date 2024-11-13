import { Schema, Document, model, Types } from "mongoose";
import { Status } from "../types/enums/attackStatusEnum"

// Define the Missile Attack interface
export interface IMissileAttack extends Document {
  user: Types.ObjectId;
  missileType: string;
  target: string;
  launchTime: Date;
  timeToHit: number; // in seconds
  status: Status;
}

// Define the Missile Attack schema
const missileAttackSchema = new Schema<IMissileAttack>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  missileType: { type: String, required: true },
  target: { type: String, required: true },
  launchTime: { type: Date, required: true, default: Date.now },
  timeToHit: { type: Number, required: true },
  status: { type: String, Status, required: true, default: Status.Launched }
});

// Export the Missile Attack model
export default model<IMissileAttack>('MissileAttack', missileAttackSchema);