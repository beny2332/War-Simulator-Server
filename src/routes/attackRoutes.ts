import express from "express";
import { launchAttack, getUserAmmunition, getUserAttacks } from "../controllers/attackController";
import verifyUser from "../middlewares/verifyUser";
import { verifyRole } from "../middlewares/verifyRole";

const router = express.Router();

router.post("/launch", verifyUser, verifyRole('attack') as any, launchAttack);
router.get("/ammunition", verifyUser, verifyRole('attack') as any, getUserAmmunition);
router.get("/attacks", verifyUser, verifyRole('attack') as any, getUserAttacks);

export default router;