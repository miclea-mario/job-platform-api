import { User } from '@controllers';
import { Router } from 'express';
import { authenticate, authorize } from 'express-goodies/middleware';

const router = Router();
export default router;

router.all('/user', authenticate, authorize('user'));
router.all('/user/*', authenticate, authorize('user'));

// Update user profile
router.put('/user/profile', User.updateProfile);

// Upload resume
router.put('/user/resume', User.updateResume);

// Apply for job
router.post('/user/apply/:jobId', User.applyJob);

// Get job match report
router.get('/user/job-match-report/:jobId', User.getJobMatchReport);

router.get('/user/applications', User.listApplications);
