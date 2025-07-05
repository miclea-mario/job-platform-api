import { Webhook } from '@controllers';
import { Router } from 'express';

const router = Router();
export default router;

router.post('/hms-webhook', Webhook.hmsWebhook);
