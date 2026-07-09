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

// 7. Get dashboard statistics
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

    const payments = await prisma.payment.findMany({
      where: { status: 'COMPLETED' },
      select: { amount: true, createdAt: true }
    });

    let revenueDaily = 0, revenueMonthly = 0, revenueYearly = 0;
    const monthlyRevenueMap = new Array(12).fill(0);

    payments.forEach(p => {
      const pDate = new Date(p.createdAt);
      const amt = p.amount;
      if (pDate >= today) revenueDaily += amt;
      if (pDate >= firstDayOfMonth) revenueMonthly += amt;
      if (pDate >= firstDayOfYear) {
        revenueYearly += amt;
        monthlyRevenueMap[pDate.getMonth()] += amt;
      }
    });

    const graphData = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ].map((name, index) => ({
      name,
      revenue: monthlyRevenueMap[index]
    }));

    const students = await prisma.student.findMany({
      select: { createdAt: true }
    });

    let studentsDaily = 0, studentsMonthly = 0, studentsYearly = 0;
    students.forEach(s => {
      const sDate = new Date(s.createdAt);
      if (sDate >= today) studentsDaily++;
      if (sDate >= firstDayOfMonth) studentsMonthly++;
      if (sDate >= firstDayOfYear) studentsYearly++;
    });

    const presentToday = await prisma.attendance.count({
      where: { date: { gte: today }, status: 'PRESENT' }
    });

    const presentThisMonth = await prisma.attendance.count({
      where: { date: { gte: firstDayOfMonth }, status: 'PRESENT' }
    });

    const presentThisYear = await prisma.attendance.count({
      where: { date: { gte: firstDayOfYear }, status: 'PRESENT' }
    });

    res.status(200).json({
      revenue: { daily: revenueDaily, monthly: revenueMonthly, yearly: revenueYearly },
      students: { daily: studentsDaily, monthly: studentsMonthly, yearly: studentsYearly },
      attendance: { daily: presentToday, monthly: presentThisMonth, yearly: presentThisYear },
      graphData
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// 8. Get all employees
export const getAllEmployees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const employees = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'EMPLOYEE'] } },
      select: { id: true, name: true, email: true, role: true, mobile: true },
      orderBy: { name: 'asc' }
    });

    res.status(200).json({ employees });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving employees', error: error.message });
  }
};
