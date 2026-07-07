import bcrypt from 'bcryptjs';
import prisma from './config/database';

async function seedDatabase() {
  const adminEmail = 'admin@gurukul.com';
  const adminPassword = 'AdminPassword123';
  const employeeEmail = 'employee@gurukul.com';
  const employeePassword = 'EmployeePassword123';

  try {
    // 1. Seed Admin
    let admin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = await prisma.user.create({
        data: {
          name: 'System Administrator',
          email: adminEmail,
          password: hashedPassword,
          mobile: '9999999999',
          address: 'Sanskar Gurukul School Campus',
          aadhaarNumber: '123456789012',
          aadhaarPhoto: '/uploads/dummy-aadhaar.jpg',
          profilePhoto: '/uploads/dummy-profile.jpg',
          role: 'ADMIN'
        }
      });
      console.log(`Admin User Seeded: ${admin.email}`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    // 2. Seed Employee
    let employee = await prisma.user.findUnique({
      where: { email: employeeEmail }
    });

    if (!employee) {
      const hashedPassword = await bcrypt.hash(employeePassword, 10);
      employee = await prisma.user.create({
        data: {
          name: 'Default Employee',
          email: employeeEmail,
          password: hashedPassword,
          mobile: '8888888888',
          address: 'Sanskar Gurukul Campus',
          aadhaarNumber: '987654321098',
          aadhaarPhoto: '/uploads/dummy-aadhaar.jpg',
          profilePhoto: '/uploads/dummy-profile.jpg',
          role: 'EMPLOYEE'
        }
      });
      console.log(`Employee User Seeded: ${employee.email}`);
    } else {
      console.log(`Employee user already exists: ${employeeEmail}`);
    }

    // 3. Clear existing students, payments, inquiries, and attendances to start fresh
    await prisma.payment.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.admissionInquiry.deleteMany({});
    await prisma.attendance.deleteMany({});
    console.log('Cleared existing transactions, students, inquiries, and attendances.');

    // 4. Seed Students
    const student1 = await prisma.student.create({
      data: {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        mobile: '9876543210',
        address: 'Flat 402, Shiv Mandir Road, Mumbai\n[Parent Address]: Flat 402, Shiv Mandir Road, Mumbai\n[Parent Business]: Businessman\n[Aadhaar]: 543216789012\n[Services]: Transport: Yes, Uniform Dress: Yes, Books/Kit: Yes',
        totalFees: 45000,
        paidFees: 45000,
        pendingFees: 0,
        paymentCycle: 'MONTHLY',
        dob: '2015-05-15',
        gender: 'MALE',
        bloodGroup: 'O+',
        fatherAadhar: '111122223333',
        motherAadhar: '444455556666',
        parentAlternatePhone: '9876543211',
        photo: '/uploads/dummy-profile.jpg'
      }
    });

    const student2 = await prisma.student.create({
      data: {
        name: 'Ishaan Patel',
        email: 'ishaan.patel@gmail.com',
        mobile: '9765432109',
        address: 'B-12, Green Glen Layout, Bangalore\n[Parent Address]: B-12, Green Glen Layout, Bangalore\n[Parent Business]: Software Engineer\n[Aadhaar]: 654321789012\n[Services]: Transport: Yes, Uniform Dress: No, Books/Kit: Yes',
        totalFees: 60000,
        paidFees: 15000,
        pendingFees: 45000,
        paymentCycle: 'MONTHLY',
        dob: '2010-09-20',
        gender: 'MALE',
        bloodGroup: 'A+',
        fatherAadhar: '222233334444',
        motherAadhar: '555566667777',
        parentAlternatePhone: '9765432100',
        photo: '/uploads/dummy-profile.jpg'
      }
    });

    const student3 = await prisma.student.create({
      data: {
        name: 'Diya Mehta',
        email: 'diya.mehta@gmail.com',
        mobile: '9654321098',
        address: '22, Rosewood Enclave, Pune\n[Parent Address]: 22, Rosewood Enclave, Pune\n[Parent Business]: Architect\n[Aadhaar]: 765432189012\n[Services]: Transport: No, Uniform Dress: Yes, Books/Kit: Yes',
        totalFees: 50000,
        paidFees: 0,
        pendingFees: 50000,
        paymentCycle: 'ANNUAL',
        dob: '2012-12-05',
        gender: 'FEMALE',
        bloodGroup: 'B+',
        fatherAadhar: '333344445555',
        motherAadhar: '666677778888',
        parentAlternatePhone: '9654321090',
        photo: '/uploads/dummy-profile.jpg'
      }
    });

    const student4 = await prisma.student.create({
      data: {
        name: 'Rohan Gupta',
        email: 'rohan.gupta@gmail.com',
        mobile: '9543210987',
        address: 'House 55, Sector 15, Gurgaon\n[Parent Address]: House 55, Sector 15, Gurgaon\n[Parent Business]: Doctor\n[Aadhaar]: 876543219012\n[Services]: Transport: Yes, Uniform Dress: Yes, Books/Kit: Yes',
        totalFees: 80000,
        paidFees: 80000,
        pendingFees: 0,
        paymentCycle: 'ANNUAL',
        dob: '2008-03-30',
        gender: 'MALE',
        bloodGroup: 'AB+',
        fatherAadhar: '444455556666',
        motherAadhar: '777788889999',
        parentAlternatePhone: '9543210980',
        photo: '/uploads/dummy-profile.jpg'
      }
    });
    console.log('Seeded 4 demo students.');

    // 5. Seed Payments
    // Aarav Sharma: Monthly cycle, full 12 payments of ₹3,750
    const aaravInstallment = 3750;
    for (let i = 1; i <= 12; i++) {
      await prisma.payment.create({
        data: {
          studentId: student1.id,
          amount: aaravInstallment,
          paymentMethod: 'QR',
          status: 'COMPLETED',
          transactionId: `TXN_AARAV_${i}_${Date.now()}`,
          receiptNumber: `REC-AARAV-2026-M${i.toString().padStart(2, '0')}`,
          createdAt: new Date(2026, 3 + i - 1, 10, 10, 30, 0) // Starting from April 10, 2026
        }
      });
    }

    // Ishaan Patel: Monthly cycle, 3 payments of ₹5,000 (Months 1, 2, 3 paid)
    const ishaanInstallment = 5000;
    for (let i = 1; i <= 3; i++) {
      await prisma.payment.create({
        data: {
          studentId: student2.id,
          amount: ishaanInstallment,
          paymentMethod: 'CASH',
          status: 'COMPLETED',
          transactionId: null,
          receiptNumber: `REC-ISHAAN-2026-M${i.toString().padStart(2, '0')}`,
          createdAt: new Date(2026, 3 + i - 1, 12, 11, 45, 0)
        }
      });
    }

    // Rohan Gupta: Annual cycle, single payment of ₹80,000
    await prisma.payment.create({
      data: {
        studentId: student4.id,
        amount: 80000,
        paymentMethod: 'QR',
        status: 'COMPLETED',
        transactionId: `TXN_ROHAN_ANNUAL_${Date.now()}`,
        receiptNumber: `REC-ROHAN-2026-ANNUAL`,
        createdAt: new Date(2026, 3, 5, 9, 15, 0) // April 5, 2026
      }
    });
    console.log('Seeded completed payment records.');

    // 6. Seed Admission Inquiries
    await prisma.admissionInquiry.create({
      data: {
        studentName: 'Kabir Singh',
        mobile: '9988776655',
        email: 'kabir.singh@yahoo.com',
        address: 'Sector 4, Rohini, New Delhi',
        inquiryDetails: 'Seeking admission for Grade 9 CBSE. Interested in science streams and sports activities.',
        feedbackStatus: 'PENDING',
        assignedEmployeeId: employee.id
      }
    });

    await prisma.admissionInquiry.create({
      data: {
        studentName: 'Sneha Reddy',
        mobile: '9887766554',
        email: 'sneha.reddy@gmail.com',
        address: 'HSR Layout, Bangalore',
        inquiryDetails: 'Enquired about 6th grade hostel accommodation and school bus service routes.',
        feedbackStatus: 'DONE',
        feedbackNotes: 'Parent visited campus, highly satisfied with security, registration planned next week.',
        assignedEmployeeId: employee.id
      }
    });
    console.log('Seeded 2 admission inquiries.');

    // 7. Seed Attendance Logs
    const statuses = ['PRESENT', 'PRESENT', 'LATE', 'PRESENT', 'PRESENT'];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (5 - i));
      await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date,
          status: statuses[i],
          checkInTime: new Date(date.setHours(9, statuses[i] === 'LATE' ? 45 : 0, 0)),
          checkOutTime: new Date(date.setHours(17, 30, 0)),
          notes: statuses[i] === 'LATE' ? 'Delayed due to traffic' : 'Regular work shift'
        }
      });
    }
    console.log('Seeded employee attendance logs.');

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
