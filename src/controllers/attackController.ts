import { NextFunction, Request, Response } from "express";
import { launchAttack as launchAttackService, getUserAmmunition as getUserAmmunitionService, getUserAttacks as getUserAttacksService } from "../services/attackService";

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

export const getUserAmmunition = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const ammunition = await getUserAmmunitionService(userId);
    res.status(200).json(ammunition);
  } catch (error) {
    next(error);
  }
};

export const getUserAttacks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const attacks = await getUserAttacksService(userId);
    res.status(200).json(attacks);
  } catch (error) {
    next(error);
  }
};