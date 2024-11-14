import express from 'express';
import { interceptAttack } from '../controllers/defenseController';

const router = express.Router();
router.post('/intercept', interceptAttack);

export default router;
