import express from 'express';
import { HealthCheck } from './controller';

const router = express.Router();

router.get('/',HealthCheck);

export default router;