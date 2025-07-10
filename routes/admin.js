import { Admin } from '@controllers';
import { Router } from 'express';
import { authenticate, authorize } from 'express-goodies/middleware';

const router = Router();
export default router;

router.all('/admin', authenticate, authorize('admin'));
router.all('/admin/*', authenticate, authorize('admin'));

router.get('/admin/users', Admin.listUsers);
router.patch('/admin/users/:id/toggle-status', Admin.toggleUserStatus);
router.get('/admin/jobs', Admin.listJobs);
router.patch('/admin/jobs/:id/toggle-status', Admin.toggleJobStatus);
