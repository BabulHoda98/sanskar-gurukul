import QRCode from 'qrcode';

interface UPIPaymentParams {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
  transactionRef: string;
}

/**
 * Generates a standard UPI deep-link URI and returns its base64 QR Code representation.
 */
export const generateUPIQRCode = async (params: UPIPaymentParams): Promise<{ upiUri: string; qrBase64: string }> => {
  const { payeeVpa, payeeName, amount, transactionNote, transactionRef } = params;

  // Format parameters for UPI URL
  // upi://pay?pa=merchant@upi&pn=MerchantName&am=10.00&cu=INR&tn=Note&tr=RefId
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(transactionNote);
  
  const upiUri = `upi://pay?pa=${payeeVpa}&pn=${encodedName}&am=${amount.toFixed(2)}&cu=INR&tn=${encodedNote}&tr=${transactionRef}`;

  try {
    // Generate QR code as Base64 Image string
    const qrBase64 = await QRCode.toDataURL(upiUri);
    return { upiUri, qrBase64 };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate UPI QR code');
  }
};
