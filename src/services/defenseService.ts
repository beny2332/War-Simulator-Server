import User from '../models/User';
import { RegionsEnum } from '../types/enums/regionEnum'
import { getUserAmmunition as getUserAmmunitionUtil } from '../utils/ammunitionUtils';
import MissileAttack from '../models/MissleAttack';
import { Status } from '../types/enums/attackStatusEnum'
import { io } from '../app'

export const getAttacksForRegion = async (region: RegionsEnum): Promise<any> => {
    const attacks = await MissileAttack.find({ target: region });
    return attacks;
}

export const interceptMissile = async (userId: string, missileType: string, attackId: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const resource = user.resources.find(r => r.name === missileType);
  if (!resource || resource.amount <= 0) {
    throw new Error('Insufficient resources');
  }

  const attack = await MissileAttack.findById(attackId)
  if(!attack){
    throw new Error('Attack not found');
  }
  attack.status = Status.Intercepted
  await attack.save()

  resource.amount -= 1;
  await user.save();

  io.emit('missileIntercepted', attack)

  console.log(`User ${userId} intercepted missile ${missileType}`);
};

export const getUserAmmunition = async (userId: string): Promise<any> => {
    return await getUserAmmunitionUtil(userId);
  };

