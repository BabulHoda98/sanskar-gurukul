import { Request, Response } from 'express';
import prisma from '../config/database';
import { generateUPIQRCode } from '../utils/qrGenerator';
import { generatePDFInvoice } from '../utils/pdfInvoice';

// 1. Initiate QR Code Payment
export const initiateQRPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, amount } = req.body;

    if (!studentId || !amount || parseFloat(amount) <= 0) {
      res.status(400).json({ message: 'Valid student ID and amount are required.' });
      return;
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      res.status(404).json({ message: 'Student not found.' });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (parsedAmount > student.pendingFees) {
      res.status(400).json({ 
        message: `Payment amount ₹${parsedAmount} exceeds outstanding balance of ₹${student.pendingFees}` 
      });
      return;
    }

    // Generate unique reference ID
    const transactionRef = `REF-${Date.now()}`;
    const payeeVpa = process.env.UPI_PAYEE_VPA || 'sanskar.gurukul@oksbi';
    const payeeName = process.env.UPI_PAYEE_NAME || 'Sanskar Gurukul Ashram School';

    // Generate UPI QR Code
    const { upiUri, qrBase64 } = await generateUPIQRCode({
      payeeVpa,
      payeeName,
      amount: parsedAmount,
      transactionNote: `Fee payment for ${student.name}`,
      transactionRef
    });

    res.status(200).json({
      message: 'QR Code generated successfully',
      studentId: student.id,
      studentName: student.name,
      amount: parsedAmount,
      transactionRef,
      upiUri,
      qrBase64
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error initiating QR Payment', error: error.message });
  }
};

// 2. Record Payment (for Cash, Card, or Completed QR payments)
export const recordPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, amount, paymentMethod, transactionId, status } = req.body;

    if (!studentId || !amount || !paymentMethod) {
      res.status(400).json({ message: 'Student ID, amount, and payment method are required.' });
      return;
    }

    if (!['QR', 'CASH', 'CARD'].includes(paymentMethod.toUpperCase())) {
      res.status(400).json({ message: 'Invalid payment method. Must be QR, CASH, or CARD.' });
      return;
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      res.status(404).json({ message: 'Student not found.' });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      res.status(400).json({ message: 'Amount must be greater than zero.' });
      return;
    }

    // Create unique receipt number
    const uniqueReceipt = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let paymentResult;

    if (status === 'PENDING') {
      // Just record a pending payment request
      paymentResult = await prisma.payment.create({
        data: {
          studentId,
          amount: parsedAmount,
          paymentMethod: paymentMethod.toUpperCase(),
          transactionId: transactionId || null,
          receiptNumber: uniqueReceipt,
          status: 'PENDING'
        }
      });
    } else {
      // Record a completed payment and update student balances
      const updatedPaidFees = student.paidFees + parsedAmount;
      const updatedPendingFees = Math.max(0, student.totalFees - updatedPaidFees);

      const [transactionPayment] = await prisma.$transaction([
        prisma.payment.create({
          data: {
            studentId,
            amount: parsedAmount,
            paymentMethod: paymentMethod.toUpperCase(),
            transactionId: transactionId || null,
            receiptNumber: uniqueReceipt,
            status: 'COMPLETED'
          }
        }),
        prisma.student.update({
          where: { id: studentId },
          data: {
            paidFees: updatedPaidFees,
            pendingFees: updatedPendingFees
          }
        })
      ]);
      paymentResult = transactionPayment;
    }

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: paymentResult,
      studentFees: {
        totalFees: student.totalFees,
        paidFees: status === 'PENDING' ? student.paidFees : (student.paidFees + parsedAmount),
        pendingFees: status === 'PENDING' ? student.pendingFees : Math.max(0, student.totalFees - (student.paidFees + parsedAmount))
      }
    });
  } catch (error: any) {
    console.error('Error recording payment:', error);
    res.status(500).json({ message: 'Error recording payment', error: error.message });
  }
};

// 3. Print Invoice PDF
export const printInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        student: true
      }
    });

    if (!payment) {
      res.status(404).json({ message: 'Payment record not found.' });
      return;
    }

    // Format invoice data
    const invoiceDetails = {
      receiptNumber: payment.receiptNumber,
      date: payment.createdAt.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      studentName: payment.student.name,
      studentMobile: payment.student.mobile,
      studentEmail: payment.student.email,
      studentAddress: payment.student.address,
      amountPaid: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      totalFees: payment.student.totalFees,
      paidFees: payment.student.paidFees,
      pendingFees: payment.student.pendingFees
    };

    // Streams PDF invoice into response
    generatePDFInvoice(res, invoiceDetails);
  } catch (error: any) {
    console.error('Invoice printing error:', error);
    res.status(500).json({ message: 'Error generating invoice PDF', error: error.message });
  }
};

// 4. Approve or Deny a Pending Cash Payment
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body; // 'COMPLETED' or 'FAILED'

    if (!paymentId || !status) {
      res.status(400).json({ message: 'Payment ID and status are required.' });
      return;
    }

    if (!['COMPLETED', 'FAILED'].includes(status.toUpperCase())) {
      res.status(400).json({ message: 'Invalid status. Must be COMPLETED or FAILED.' });
      return;
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { student: true }
    });

    if (!payment) {
      res.status(404).json({ message: 'Payment record not found.' });
      return;
    }

    if (payment.status !== 'PENDING') {
      res.status(400).json({ message: `Payment is already processed with status: ${payment.status}` });
      return;
    }

    let updatedPayment;

    if (status.toUpperCase() === 'COMPLETED') {
      // Approve: update student's fees
      const student = payment.student;
      const updatedPaidFees = student.paidFees + payment.amount;
      const updatedPendingFees = Math.max(0, student.totalFees - updatedPaidFees);

      const [paymentResult] = await prisma.$transaction([
        prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'COMPLETED' },
          include: { student: true }
        }),
        prisma.student.update({
          where: { id: student.id },
          data: {
            paidFees: updatedPaidFees,
            pendingFees: updatedPendingFees
          }
        })
      ]);
      updatedPayment = paymentResult;
    } else {
      // Deny: set status to FAILED
      updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'FAILED' },
        include: { student: true }
      });
    }

    res.status(200).json({
      message: `Payment request has been ${status.toUpperCase() === 'COMPLETED' ? 'APPROVED' : 'DENIED'}`,
      payment: updatedPayment
    });
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Error updating payment status', error: error.message });
  }
};
