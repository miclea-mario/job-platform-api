import { Company } from '@controllers';
import { Router } from 'express';
import { authenticate, authorize } from 'express-goodies/middleware';
import { formDataToJson } from '../middleware';

const router = Router();
export default router;

router.all('/company', authenticate, authorize('company'));
router.all('/company/*', authenticate, authorize('company'));

router.put('/company/:id', formDataToJson, Company.update);

router.get('/company/jobs', Company.listJobs);
router.post('/company/jobs', Company.createJob);
router.get('/company/jobs/:id', Company.getJob);
router.put('/company/jobs/:id', Company.updateJob);
router.put('/company/jobs/:id/visibility', Company.updateJobVisibility);
router.delete('/company/jobs/:id', Company.deleteJob);

router.get('/company/applications', Company.listApplications);
router.get('/company/applications/count', Company.countApplications);
router.put('/company/applications/:id/update-status', Company.updateApplicationStatus);

router.get('/company/interviews', Company.listInterviews);
