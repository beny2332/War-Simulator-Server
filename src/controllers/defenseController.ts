import { Request, Response } from 'express';
import { validateInterception, processInterception } from '../services/defenseService';
import { io } from '../app';

export const interceptAttack = async (req: Request, res: Response) => {
  const { attackId, missileType } = req.body;
  try {
    const canIntercept = await validateInterception(attackId, missileType);
    if (canIntercept) {
      const result = await processInterception(attackId, missileType);
      io.emit('interceptResult', result);
      res.json(result);
    } else {
      res.status(400).json({ error: 'Invalid interception attempt' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Interception failed' });
  }
};
