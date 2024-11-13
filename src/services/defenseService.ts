import User from '../models/User';
import { RegionsEnum } from '../types/enums/regionEnum'
import { getUserAmmunition as getUserAmmunitionUtil } from '../utils/ammunitionUtils';
import MissileAttack from '../models/MissleAttack';

export const getAttacksForRegion = async (region: RegionsEnum): Promise<any> => {
    const attacks = await MissileAttack.find({ target: region });
    return attacks;
}

export const interceptMissile = async (userId: string, missileId: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const resource = user.resources.find(r => r.name === missileId);
  if (!resource || resource.amount <= 0) {
    throw new Error('Insufficient resources');
  }

  resource.amount -= 1;
  await user.save();

  // Implement the logic to intercept a missile
  // For example, you can update the missile status in the database
  console.log(`User ${userId} intercepted missile ${missileId}`);
};

export const getUserAmmunition = async (userId: string): Promise<any> => {
    return await getUserAmmunitionUtil(userId);
  };

