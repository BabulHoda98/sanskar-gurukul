import { Request, Response } from 'express';
import prisma from '../config/database';

export const submitPublicInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentName, parentName, mobile, email, address, inquiryDetails } = req.body;

    if (!studentName || !mobile) {
      res.status(400).json({ message: 'Student name and mobile number are required.' });
      return;
    }

    // Combine parentName, class details if present, and details into the database's inquiryDetails
    const formattedDetails = `Parent/Guardian: ${parentName || 'N/A'}\nMessage/Details: ${inquiryDetails || 'None'}`;

    const newInquiry = await prisma.admissionInquiry.create({
      data: {
        studentName,
        mobile,
        email: email || '',
        address: address || 'N/A',
        inquiryDetails: formattedDetails,
        feedbackStatus: 'PENDING'
      }
    });

    res.status(201).json({
      message: 'Inquiry submitted successfully!',
      inquiry: newInquiry
    });
  } catch (error: any) {
    console.error('Error submitting public inquiry:', error);
    res.status(500).json({ message: 'Error saving inquiry', error: error.message });
  }
};
