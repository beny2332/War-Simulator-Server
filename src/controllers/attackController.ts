import { Request, Response } from 'express';
import { launchAttack } from '../services/attackService';

export const handleAttack = async (req: Request, res: Response) => {
  const userId = (req as any).user.id; // Getting userId from the verified token
  const { target, missileType } = req.body;

  try {
    const resp = await launchAttack({
      userId,
      target,
      missileType
    });
    
    res.json({ success: true, data: resp });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};