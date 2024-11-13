import { NextFunction, Request, Response } from "express";
import { launchAttack as launchAttackService } from "../services/attackService";

export const launchAttack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { target, missileType } = req.body;

    await launchAttackService(userId, target, missileType);

    res.status(200).send("Launched a missile");
  } catch (error) {
    next(error);
  }
};