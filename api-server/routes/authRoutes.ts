import { Router } from 'express';
import { register, login, getMe, forgotPassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { registrationUpload } from '../middleware/uploadMiddleware';

const router = Router();

// Public routes
router.post('/register', registrationUpload, register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.get('/me', protect, getMe);

export default router;
