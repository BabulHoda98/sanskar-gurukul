import { Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// 1. Get all admission inquiries
export const getInquiries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const inquiries = await prisma.admissionInquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assignedEmployee: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(200).json({ inquiries });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving inquiries', error: error.message });
  }
};

// 2. Add a new admission inquiry
export const createInquiry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { studentName, mobile, email, address, inquiryDetails } = req.body;

    if (!studentName || !mobile || !email || !address || !inquiryDetails) {
      res.status(400).json({ message: 'All inquiry fields are required.' });
      return;
    }

    const newInquiry = await prisma.admissionInquiry.create({
      data: {
        studentName,
        mobile,
        email,
        address,
        inquiryDetails,
        assignedEmployeeId: req.user?.id || null
      }
    });

    res.status(201).json({ message: 'Inquiry registered successfully', inquiry: newInquiry });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating inquiry', error: error.message });
  }
};

// 3. Update feedback for admission inquiry (done / not done)
export const updateInquiryFeedback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { feedbackStatus, feedbackNotes } = req.body;

    if (!['DONE', 'NOT_DONE', 'PENDING'].includes(feedbackStatus)) {
      res.status(400).json({ message: 'Feedback status must be DONE, NOT_DONE, or PENDING.' });
      return;
    }

    const updatedInquiry = await prisma.admissionInquiry.update({
      where: { id },
      data: {
        feedbackStatus,
        feedbackNotes: feedbackNotes || null,
        assignedEmployeeId: req.user?.id // assign to the employee who updated it
      }
    });

    res.status(200).json({ message: 'Feedback updated successfully', inquiry: updatedInquiry });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating inquiry feedback', error: error.message });
  }
};

// 4. Mark Employee Attendance (Clock-In / Clock-Out)
export const markAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.id;
    if (!employeeId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { status, notes } = req.body; // status: PRESENT, ABSENT, LEAVE, LATE

    if (!status || !['PRESENT', 'ABSENT', 'LEAVE', 'LATE'].includes(status)) {
      res.status(400).json({ message: 'Valid attendance status is required.' });
      return;
    }

    // Get date string (YYYY-MM-DD)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if attendance record exists for today
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    if (existingAttendance) {
      // Clock out
      const updatedAttendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkOutTime: new Date(),
          notes: notes || existingAttendance.notes
        }
      });
      res.status(200).json({ message: 'Clocked out successfully', attendance: updatedAttendance });
      return;
    }

    // Clock in
    const newAttendance = await prisma.attendance.create({
      data: {
        employeeId,
        status,
        checkInTime: new Date(),
        notes: notes || null,
        date: today
      }
    });

    res.status(201).json({ message: 'Clocked in successfully', attendance: newAttendance });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging attendance', error: error.message });
  }
};

// 5. Get logged-in employee's own attendance history
export const getOwnAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.id;
    if (!employeeId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const history = await prisma.attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' }
    });

    res.status(200).json({ attendance: history });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving attendance', error: error.message });
  }
};

// 6. Add another Employee (e.g. registered by an Admin or existing Employee)
export const addEmployee = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, mobile, address, aadhaarNumber, panCard } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    if (!name || !email || !password || !mobile || !address || !aadhaarNumber) {
      res.status(400).json({ message: 'Missing required employee text fields.' });
      return;
    }

    if (!files || !files['profilePhoto'] || !files['aadhaarPhoto']) {
      res.status(400).json({ message: 'Both Profile Photo and Aadhaar Photo are required uploads.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'A user with this email already exists.' });
      return;
    }

    const profilePhoto = '/uploads/' + files['profilePhoto'][0].filename;
    const aadhaarPhoto = '/uploads/' + files['aadhaarPhoto'][0].filename;
    const panPhoto = files['panPhoto'] ? '/uploads/' + files['panPhoto'][0].filename : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobile,
        address,
        aadhaarNumber,
        aadhaarPhoto,
        profilePhoto,
        panCard: panCard || null,
        panPhoto: panPhoto,
        role: 'EMPLOYEE'
      }
    });

    res.status(201).json({
      message: 'New Employee added successfully!',
      employee: {
        id: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        mobile: newEmployee.mobile
      }
    });
  } catch (error: any) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Server error while adding employee', error: error.message });
  }
};
