import User from '../models/User';
import MissileAttack from '../models/MissleAttack';
import { getUserAmmunition as getUserAmmunitionUtil } from '../utils/ammunitionUtils';
import Missile from '../models/Missile'

export const launchAttack = async (userId: string, target: string, missileType: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const resource = user.resources.find(r => r.name === missileType);
  if (!resource || resource.amount <= 0) {
    throw new Error('Insufficient resources');
  }

  resource.amount -= 1;
  await user.save();

  const missile = await Missile.findOne({ name: missileType });
  if (!missile) {
    throw new Error('Missile not found');
  }

  const timeToHit = missile.speed;

  const missileAttack = new MissileAttack({
    user: user._id,
    missileType,
    target,
    launchTime: new Date(),
    timeToHit,
    status: 'launched'
  });

  await missileAttack.save();

  console.log(`User ${userId} launched a ${missileType} missile at ${target}`);
};

export const getUserAmmunition = async (userId: string): Promise<any> => {
  return await getUserAmmunitionUtil(userId);
};

export const getUserAttacks = async (userId: string): Promise<any> => {
  return await MissileAttack.find({ user: userId });
};