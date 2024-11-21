import User from '../models/User';
import MissileAttack from '../models/MissleAttack';
import { getUserAmmunition as getUserAmmunitionUtil } from '../utils/ammunitionUtils';
import Missile from '../models/Missile'
import { io } from '../app'
import { Status } from '../types/enums/attackStatusEnum'
import missiles from '../data/missiles.json';

interface AttackData {
  userId: string;
  target: string;
  missileType: string;
}

export const canIntercept = (defenderMissileType: string, attackerMissileType: string): boolean => {
  const missile = missiles.find(m => m.name === defenderMissileType);
  return missile?.intercepts.includes(attackerMissileType) || false;
};

export const launchAttack = async ({ userId, target, missileType }: AttackData): Promise<any> => {
  const [user, missile] = await Promise.all([
    User.findById(userId),
    Missile.findOne({ name: missileType })
  ]);

  if (!user) throw new Error('User not found');
  if (!missile) throw new Error('Missile not found');

  const resource = user.resources.find(r => r.name === missileType);
  if (!resource || resource.amount <= 0) throw new Error('Insufficient resources');

  const missileAttack = new MissileAttack({
    user: user._id,
    missileType,
    target,
    launchTime: new Date(),
    timeToHit: missile.speed,
    status: Status.Launched
  });

  await Promise.all([
    missileAttack.save(),
    User.updateOne(
      { _id: userId, 'resources.name': missileType },
      { $inc: { 'resources.$.amount': -1 } }
    )
  ]);

  io.emit("attackLaunched", {
    ...missileAttack.toObject(),
    timeLeft: missile.speed * 60 // Time in seconds
  });

  setTimeout(async () => {
    const attack = await MissileAttack.findOneAndUpdate(
      { _id: missileAttack._id, status: Status.Launched },
      { $set: { status: Status.Hit } },
      { new: true }
    );
    
    if (attack) {
      io.emit('attackHit', attack);
    }
  }, missile.speed * 60 * 1000);
  return missileAttack
};

// Combined user-related queries
export const getUserData = async (userId: string) => {
  const [ammunition, attacks] = await Promise.all([
    getUserAmmunitionUtil(userId),
    MissileAttack.find({ user: userId })
  ]);
  
  return { ammunition, attacks };
};

// Combined attack-related calculations
export const getAttackMetrics = (missileType: string) => {
  return {
    interceptionWindow: 30, // Example: 30 seconds window
    // Add other attack-related calculations here
  };
};