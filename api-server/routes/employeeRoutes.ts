import { Router } from 'express';
import { 
  getInquiries, 
  createInquiry, 
  updateInquiryFeedback, 
  markAttendance, 
  getOwnAttendance, 
  addEmployee 
} from '../controllers/employeeController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { registrationUpload } from '../middleware/uploadMiddleware';

const router = Router();

// Protect all routes under employee
router.use(protect);
router.use(restrictTo('ADMIN', 'EMPLOYEE'));

// Inquiry routes
router.get('/inquiries', getInquiries);
router.post('/inquiries', createInquiry);
router.put('/inquiries/:id/feedback', updateInquiryFeedback);

// Attendance routes
router.post('/attendance', markAttendance);
router.get('/attendance', getOwnAttendance);

// Add employee route
router.post('/add-employee', registrationUpload, addEmployee);

export default router;
