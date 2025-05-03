import { Identity } from '@controllers';
import { loginSchema } from '@schemas';
import signupSchema from '@schemas/signup-schema';
import { Router } from 'express';
import { authenticate, recaptcha, validate } from 'express-goodies/middleware';

const router = Router();
export default router;

router.post('/confirm/:hash', recaptcha, Identity.confirm);
router.post('/forgot', recaptcha, Identity.forgot);
router.post('/login', recaptcha, validate(loginSchema), Identity.login);
router.post('/signup', recaptcha, validate(signupSchema), Identity.signup);
router.post('/reset/:hash', recaptcha, Identity.reset);

router.post('/logout', Identity.logout);
router.post('/refresh-token', Identity.refreshToken);

router.post('/admin/change-password', Identity.changePassword);
router.get('/profile', authenticate, Identity.profile);

router.put('/update-avatar', authenticate, Identity.updateAvatar);
router.delete('/delete-avatar', authenticate, Identity.deleteAvatar);

router.get('/interview/:applicationId', authenticate, Identity.interviewDetails);
