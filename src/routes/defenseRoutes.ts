import express from "express";
import { interceptMissile } from "../controllers/defenseController";
import verifyUser from "../middlewares/verifyUser";
import { verifyRole } from "../middlewares/verifyRole";

const router = express.Router();

router.post("/intercept", verifyUser, verifyRole('defense') as any, interceptMissile);

export default router;