import express from "express";
import { launchAttack } from "../controllers/attackController";
import verifyUser from "../middlewares/verifyUser";
import { verifyRole } from "../middlewares/verifyRole";

const router = express.Router();


router.post("/launch", verifyUser, (verifyRole('attack')) as any, launchAttack);

export default router;