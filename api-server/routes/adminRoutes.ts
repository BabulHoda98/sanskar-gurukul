import { Router } from 'express';
import {
  assignRole,
  addStudent,
  getAllStudents,
  getStudentFees,
  getAllPayments,
  getAllAttendances,
  markEmployeeAttendance,
  getAllEmployees,
  getDashboardStats
} from '../controllers/adminController';
import { addEmployee } from '../controllers/employeeController';
import { recordPayment, initiateQRPayment, updatePaymentStatus } from '../controllers/paymentController';
import { updateFeesConfig } from '../controllers/feesController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { registrationUpload, studentUpload } from '../middleware/uploadMiddleware';

const router = Router();

// Protect all routes under admin
router.use(protect);
router.use(restrictTo('ADMIN'));

// Dashboard Analytics
router.get('/dashboard-stats', getDashboardStats);

// Role Assignment
router.put('/assign-role', assignRole);

// Student Management
router.post('/students', studentUpload, addStudent);
router.get('/students', getAllStudents);
router.get('/students/:id/fees', getStudentFees);

// Employee Management (Admin can add employee)
router.post('/employees', registrationUpload, addEmployee);
router.get('/employees', getAllEmployees);

// Payments management
router.get('/payments', getAllPayments);
router.post('/payments/record', recordPayment);
router.post('/payments/qr-initiate', initiateQRPayment);
router.put('/payments/:paymentId/status', updatePaymentStatus);

// Attendance logs for all employees
router.get('/attendance', getAllAttendances);
router.post('/attendance', markEmployeeAttendance);

// Fees Configuration
router.post('/fees-config', updateFeesConfig);

export default router;
