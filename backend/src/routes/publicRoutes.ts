import { Router } from 'express';
import { submitPublicInquiry } from '../controllers/publicController';
import { getFeesConfig } from '../controllers/feesController';

const router = Router();

router.post('/inquiry', submitPublicInquiry);
router.get('/fees-config', getFeesConfig);

export default router;
