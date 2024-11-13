import { NextFunction, Request, Response } from "express";


export const interceptMissile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        // your code here

        res.status(200).send("Missile intercepted successfully");

    } catch (error) {

        next(error);

    }

};