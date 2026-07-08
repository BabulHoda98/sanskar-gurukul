import PDFDocument from 'pdfkit';
import { Response } from 'express';

interface InvoiceData {
  receiptNumber: string;
  date: string;
  studentName: string;
  studentMobile: string;
  studentEmail: string;
  studentAddress: string;
  amountPaid: number;
  paymentMethod: string;
  transactionId?: string | null;
  totalFees: number;
  paidFees: number;
  pendingFees: number;
}

/**
 * Generates a PDF invoice and pipes it directly into the Express Response stream.
 */
export const generatePDFInvoice = (res: Response, data: InvoiceData): void => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Stream PDF to the response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${data.receiptNumber}.pdf`);
  doc.pipe(res);

  // Header / School Details
  doc
    .fillColor('#1e293b')
    .fontSize(22)
    .font('Helvetica-Bold')
    .text('SANSKAR GURUKUL ASHRAM SCHOOL', { align: 'center' });
  
  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor('#64748b')
    .text('Education, Discipline, Culture & Values', { align: 'center' })
    .moveDown(1);

  doc
    .strokeColor('#cbd5e1')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke()
    .moveDown(2);

  // Invoice / Receipt Metadata
  const metadataTop = doc.y;
  doc
    .fontSize(16)
    .fillColor('#1e293b')
    .font('Helvetica-Bold')
    .text('FEE PAYMENT RECEIPT', 50, metadataTop);

  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor('#475569')
    .text(`Receipt No: ${data.receiptNumber}`, 50, metadataTop + 25)
    .text(`Date: ${data.date}`, 50, metadataTop + 40);

  // Student details on the right
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Billed To:', 350, metadataTop)
    .font('Helvetica')
    .text(data.studentName, 350, metadataTop + 15)
    .text(`Mobile: ${data.studentMobile}`, 350, metadataTop + 30)
    .text(`Email: ${data.studentEmail}`, 350, metadataTop + 45)
    .text(`Address: ${data.studentAddress}`, 350, metadataTop + 60);

  doc.moveDown(5);

  // Table of Payment Details
  const tableTop = doc.y + 40;
  doc
    .rect(50, tableTop, 495, 20)
    .fill('#f1f5f9');

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor('#1e293b')
    .text('Description', 60, tableTop + 5)
    .text('Payment Method', 250, tableTop + 5)
    .text('Reference No.', 360, tableTop + 5)
    .text('Amount (INR)', 470, tableTop + 5);

  // Table row content
  const rowTop = tableTop + 25;
  doc
    .font('Helvetica')
    .fillColor('#475569')
    .text('Academic & Ashram Tuition Fee Payment', 60, rowTop)
    .text(data.paymentMethod, 250, rowTop)
    .text(data.transactionId || 'N/A', 360, rowTop)
    .text(`₹${data.amountPaid.toFixed(2)}`, 470, rowTop);

  doc
    .strokeColor('#e2e8f0')
    .lineWidth(1)
    .moveTo(50, rowTop + 20)
    .lineTo(545, rowTop + 20)
    .stroke();

  // Summary section
  const summaryTop = rowTop + 40;

  doc
    .font('Helvetica')
    .text('Total Academic Fees:', 320, summaryTop)
    .text(`₹${data.totalFees.toFixed(2)}`, 470, summaryTop)
    
    .text('Total Paid to Date:', 320, summaryTop + 20)
    .text(`₹${data.paidFees.toFixed(2)}`, 470, summaryTop + 20)
    
    .font('Helvetica-Bold')
    .fillColor('#0f172a')
    .text('Outstanding Balance:', 320, summaryTop + 40)
    .text(`₹${data.pendingFees.toFixed(2)}`, 470, summaryTop + 40);

  // Bottom Notice
  doc
    .strokeColor('#cbd5e1')
    .lineWidth(1)
    .moveTo(50, 700)
    .lineTo(545, 700)
    .stroke();

  doc
    .fontSize(9)
    .font('Helvetica-Oblique')
    .fillColor('#94a3b8')
    .text('This is a computer-generated invoice and requires no physical signature.', 50, 715, { align: 'center' })
    .text('Thank you for supporting Sanskar Gurukul!', 50, 730, { align: 'center' });

  // Finalize PDF file
  doc.end();
};
