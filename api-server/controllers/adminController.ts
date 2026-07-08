import { Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// 1. Assign roles (e.g., Promote a user to EMPLOYEE or ADMIN)
export const assignRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      res.status(400).json({ message: 'User ID and Role are required.' });
      return;
    }

    if (!['ADMIN', 'EMPLOYEE', 'STUDENT'].includes(role)) {
      res.status(400).json({ message: 'Invalid role. Must be ADMIN, EMPLOYEE, or STUDENT.' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: 'Error assigning role', error: error.message });
  }
};

// 2. Add/Enroll a new student
export const addStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      email, 
      mobile, 
      address, 
      totalFees, 
      userId,
      dob,
      bloodGroup,
      gender,
      fatherAadhar,
      motherAadhar,
      parentAlternatePhone,
      paymentCycle
    } = req.body;

    if (!name || !mobile || !address || totalFees === undefined) {
      res.status(400).json({ message: 'Name, mobile, address, and total fees are required.' });
      return;
    }

    // Check if student with email already exists (only if email is provided)
    if (email && email.trim() !== '') {
      const existingStudent = await prisma.student.findFirst({
        where: { email }
      });

      if (existingStudent) {
        res.status(400).json({ message: 'Student with this email already enrolled.' });
        return;
      }
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const photo = files && files['photo'] ? `/uploads/${files['photo'][0].filename}` : null;

    const studentCount = await prisma.student.count();
    const friendlyId = `SG-${1000 + studentCount + 1}`;

    const newStudent = await prisma.student.create({
      data: {
        id: friendlyId,
        name,
        email,
        mobile,
        address,
        totalFees: parseFloat(totalFees),
        pendingFees: parseFloat(totalFees),
        paidFees: 0.0,
        userId: userId || null,
        dob: dob || null,
        bloodGroup: bloodGroup || null,
        gender: gender || null,
        fatherAadhar: fatherAadhar || null,
        motherAadhar: motherAadhar || null,
        parentAlternatePhone: parentAlternatePhone || null,
        photo: photo || null,
        paymentCycle: paymentCycle || 'ANNUAL'
      }
    });

    // Auto-resolve any matching inquiries
    try {
      await prisma.admissionInquiry.updateMany({
        where: {
          OR: [
            { mobile: mobile },
            { email: (email && email.trim() !== '') ? email : undefined },
            { studentName: { equals: name, mode: 'insensitive' } }
          ].filter(Boolean) as any
        },
        data: {
          feedbackStatus: 'DONE',
          feedbackNotes: `Student officially enrolled with ID: ${friendlyId}`
        }
      });
    } catch (inqErr) {
      console.error('Error auto-resolving inquiry:', inqErr);
    }

    res.status(201).json({ message: 'Student enrolled successfully', student: newStudent });
  } catch (error: any) {
    res.status(500).json({ message: 'Error enrolling student', error: error.message });
  }
};

// 3. Get all students (with their pending, paid fees, and payment details)
export const getAllStudents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { name: 'asc' },
      include: {
        user: {
          select: { id: true, profilePhoto: true }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.status(200).json({ students });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving students list', error: error.message });
  }
};

// 4. Get student-wise fee details (total, paid, pending)
export const getStudentFees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!student) {
      res.status(404).json({ message: 'Student not found.' });
      return;
    }

    res.status(200).json({
      studentId: student.id,
      name: student.name,
      totalFees: student.totalFees,
      paidFees: student.paidFees,
      pendingFees: student.pendingFees,
      paymentHistory: student.payments
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching student fees details', error: error.message });
  }
};

// 5. Get all payments details, with filter by paymentMethod (QR, CASH, CARD)
export const getAllPayments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { method } = req.query; // Optional filter: ?method=QR or ?method=CASH or ?method=CARD

    const filter: any = {};
    if (method && ['QR', 'CASH', 'CARD'].includes(method.toString().toUpperCase())) {
      filter.paymentMethod = method.toString().toUpperCase();
    }

    const payments = await prisma.payment.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: { id: true, name: true, email: true, mobile: true }
        }
      }
    });

    res.status(200).json({ payments });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving payments logs', error: error.message });
  }
};

// 6. Get all employees attendance details
export const getAllAttendances = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const attendances = await prisma.attendance.findMany({
      orderBy: { date: 'desc' },
      include: {
        employee: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    res.status(200).json({ attendances });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving employee attendance logs', error: error.message });
  }
};

// 7. Mark Employee Attendance (Admin)
export const markEmployeeAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, status, notes } = req.body;

    if (!employeeId || !status || !['PRESENT', 'ABSENT', 'LEAVE', 'LATE'].includes(status)) {
      res.status(400).json({ message: 'Employee ID and valid status are required.' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date: { gte: today, lt: tomorrow }
      }
    });

    if (existingAttendance) {
      const updatedAttendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { status, notes: notes || existingAttendance.notes }
      });
      res.status(200).json({ message: 'Attendance updated successfully', attendance: updatedAttendance });
      return;
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        employeeId,
        status,
        checkInTime: status === 'PRESENT' || status === 'LATE' ? new Date() : null,
        notes: notes || null,
        date: today
      }
    });

    res.status(201).json({ message: 'Attendance marked successfully', attendance: newAttendance });
  } catch (error: any) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

// 8. Get all employees list
export const getAllEmployees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: { id: true, name: true, email: true }
    });
    res.status(200).json({ employees });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving employees', error: error.message });
  }
};

// 9. Get Dashboard Analytics Stats
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    // Enrollments
    const dailyStudents = await prisma.student.count({ where: { createdAt: { gte: today } } });
    const monthlyStudents = await prisma.student.count({ where: { createdAt: { gte: firstDayOfMonth } } });
    const yearlyStudents = await prisma.student.count({ where: { createdAt: { gte: firstDayOfYear } } });

    // Revenue
    const dailyPayments = await prisma.payment.findMany({
      where: { status: 'COMPLETED', createdAt: { gte: today } }
    });
    const monthlyPayments = await prisma.payment.findMany({
      where: { status: 'COMPLETED', createdAt: { gte: firstDayOfMonth } }
    });
    const yearlyPayments = await prisma.payment.findMany({
      where: { status: 'COMPLETED', createdAt: { gte: firstDayOfYear } }
    });

    const sumDaily = dailyPayments.reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);
    const sumMonthly = monthlyPayments.reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);
    const sumYearly = yearlyPayments.reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);

    // Attendance
    const dailyAttendance = await prisma.attendance.count({ where: { status: 'PRESENT', date: { gte: today } } });
    const monthlyAttendance = await prisma.attendance.count({ where: { status: 'PRESENT', date: { gte: firstDayOfMonth } } });
    const yearlyAttendance = await prisma.attendance.count({ where: { status: 'PRESENT', date: { gte: firstDayOfYear } } });

    // Graph Data
    const monthlyRevenue = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
      const startOfMonth = new Date(today.getFullYear(), i, 1);
      const endOfMonth = new Date(today.getFullYear(), i + 1, 1);
      
      const paymentsInMonth = await prisma.payment.findMany({
        where: { status: 'COMPLETED', createdAt: { gte: startOfMonth, lt: endOfMonth } }
      });
      const monthSum = paymentsInMonth.reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);
      monthlyRevenue.push({ name: months[i], revenue: monthSum });
    }

    res.status(200).json({
      students: { daily: dailyStudents, monthly: monthlyStudents, yearly: yearlyStudents },
      revenue: { daily: sumDaily, monthly: sumMonthly, yearly: sumYearly },
      attendance: { daily: dailyAttendance, monthly: monthlyAttendance, yearly: yearlyAttendance },
      graphData: monthlyRevenue
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
