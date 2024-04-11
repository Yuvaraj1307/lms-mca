import express from 'express';
import { getAll, create, update, del } from './controller';

const router = express.Router();

router.get('/', getAll);
router.post('/', create);
router.put('/', update);
router.delete('/', del);

export default router;