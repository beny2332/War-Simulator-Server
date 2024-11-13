import { NextFunction, Request, Response } from "express";
import { interceptMissile as interceptMissileService, getAttacksForRegion as getAttacksForRegionService } from "../services/defenseService";

export const interceptMissile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { missileId } = req.body;

    await interceptMissileService(userId, missileId);

    res.status(200).send("Missile intercepted successfully");
  } catch (error) {
    next(error);
  }
};

export const getAttacksForRegion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const region = (req as any).user.region
        const attacks = await getAttacksForRegionService(region)
        res.status(200).json(attacks)
    } catch (error) {
      next(error);
    }
  };