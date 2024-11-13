import { NextFunction, Request, Response } from "express";


export const launchAttack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        // your code here

        res.status(200).send("Launched a missle");

    } catch (error) {

        next(error);

    }

};