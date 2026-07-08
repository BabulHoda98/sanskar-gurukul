import { Router } from 'express';
import { initiateQRPayment, recordPayment, printInvoice, updatePaymentStatus } from '../controllers/paymentController';
import { getAllPayments } from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public route for invoice PDF retrieval (allows parents to download/view receipts from WhatsApp shared links)
router.get('/invoice/:paymentId', printInvoice);

// Protect other payment endpoints
router.use(protect);

router.post('/qr-initiate', initiateQRPayment);
router.post('/record', recordPayment);
router.put('/:paymentId/status', updatePaymentStatus);
router.get('/', getAllPayments);

export default router;
