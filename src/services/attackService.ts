import User from '../models/User';
import MissileAttack from '../models/MissleAttack';
import { getUserAmmunition as getUserAmmunitionUtil } from '../utils/ammunitionUtils';
import Missile from '../models/Missile'
import { io } from '../app'
import { Status } from '../types/enums/attackStatusEnum'

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

  io.emit("attackLaunched", missileAttack )

  console.log(`User ${userId} launched a ${missileType} missile at ${target}`);

  setTimeout(async () => {
    const attack = await MissileAttack.findById(missileAttack._id);
    if (attack && attack.status === Status.Launched) {
      attack.status = Status.Hit;
      await attack.save();
      io.emit('attacHit', attack);
      console.log(`Missile attack ${missileAttack._id} hit the target`);
    }
  }, timeToHit * 60 * 1000); // Convert minutes to milliseconds

};

export const getUserAmmunition = async (userId: string): Promise<any> => {
  return await getUserAmmunitionUtil(userId);
};

export const getUserAttacks = async (userId: string): Promise<any> => {
  return await MissileAttack.find({ user: userId });
};