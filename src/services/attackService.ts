import User from '../models/User';
import { getUserAmmunition as getUserAmmunitionUtil } from '../utils/ammunitionUtils';


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

  // Implement the logic to launch an attack
  // For example, you can save the attack details to the database
  console.log(`User ${userId} launched a ${missileType} missile at ${target}`);
};

export const getUserAmmunition = async (userId: string): Promise<any> => {
    return await getUserAmmunitionUtil(userId);
  };
