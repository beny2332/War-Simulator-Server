import { Request, Response, NextFunction } from "express";

export const verifyRole = (role: 'defense' | 'attack') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user.role !== role) {
      return res.status(403).json({ error: `Access denied for ${role} role` });
    }
    next();
  };
};