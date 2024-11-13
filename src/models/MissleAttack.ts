import { Schema, Types, Document, model } from "mongoose";

// Define the Missile Attack interface
export interface IMissileAttack extends Document {
  targetOrganization: Types.ObjectId;
  missileType: Types.ObjectId;
  status: 'launched' | 'intercepted' | 'hit';
}

// Define the Missile Attack schema
const missileAttackSchema = new Schema<IMissileAttack>({
  targetOrganization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  missileType: { type: Schema.Types.ObjectId, ref: 'Missile', required: true },
  status: { type: String, enum: ['launched', 'intercepted', 'hit'], required: true }
});

// Export the Missile Attack model
export default model<IMissileAttack>('MissileAttack', missileAttackSchema);