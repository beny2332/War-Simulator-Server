import { NextFunction, Request, Response } from "express";
import { interceptMissile as interceptMissileService } from "../services/defenseService";

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