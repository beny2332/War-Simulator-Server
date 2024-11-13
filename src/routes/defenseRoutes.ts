import express from "express";
import { interceptMissile } from "../controllers/defenseController";
import verifyUser from "../middlewares/verifyUser";
import { verifyRole } from "../middlewares/verifyRole";
import { getUserAttacks, getUserAmmunition } from "../controllers/attackController"

const router = express.Router();

router.post("/intercept", verifyUser, verifyRole('defense') as any, interceptMissile);
router.get("/ammunition", verifyUser, verifyRole('defense') as any, getUserAmmunition);
router.get("/attacks", verifyUser, verifyRole('defense') as any, getUserAttacks);

export default router;