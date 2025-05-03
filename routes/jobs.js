import { Jobs } from '@controllers';
import { Router } from 'express';
const { authenticateOptional } = require('../middleware');

const router = Router();
export default router;

router.all('/jobs', authenticateOptional);
router.all('/jobs/*', authenticateOptional);

router.get('/jobs', Jobs.listJobs);
router.get('/cities', Jobs.getCities);
router.get('/jobs/:id', Jobs.getJob);
