import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const signToken = (id: string, role: string, email: string): string => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'gurukul_secret_key',
    { expiresIn: '30d' }
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, mobile, address, aadhaarNumber, panCard, role } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // Check required fields
    if (!name || !email || !password || !mobile || !address || !aadhaarNumber) {
      res.status(400).json({ message: 'Missing required text fields.' });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
      return;
    }

    // Check required files
    if (!files || !files['profilePhoto'] || !files['aadhaarPhoto']) {
      res.status(400).json({ message: 'Both Profile Photo and Aadhaar Photo are required uploads.' });
      return;
    }

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists.' });
      return;
    }

    // Process file paths
    const profilePhoto = '/uploads/' + files['profilePhoto'][0].filename;
    const aadhaarPhoto = '/uploads/' + files['aadhaarPhoto'][0].filename;
    const panPhoto = files['panPhoto'] ? '/uploads/' + files['panPhoto'][0].filename : null;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
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
        role: role || 'EMPLOYEE' // Default to EMPLOYEE role
      }
    });

    // Generate JWT token
    const token = signToken(newUser.id, newUser.role, newUser.email);

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        mobile: newUser.mobile,
        profilePhoto: newUser.profilePhoto
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = signToken(user.id, user.role, user.email);

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        aadhaarNumber: true,
        aadhaarPhoto: true,
        profilePhoto: true,
        panCard: true,
        panPhoto: true,
        role: true,
        createdAt: true
      }
    });

    res.status(200).json({ user: userDetails });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error retrieving profile', error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, mobile, aadhaarNumber, newPassword } = req.body;

    if (!email || !mobile || !aadhaarNumber || !newPassword) {
      res.status(400).json({ message: 'All fields (email, mobile, Aadhaar number, new password) are required.' });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      res.status(400).json({ message: 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(404).json({ message: 'No account found with this email address.' });
      return;
    }

    if (user.mobile.trim() !== mobile.trim() || user.aadhaarNumber.trim() !== aadhaarNumber.trim()) {
      res.status(401).json({ message: 'Verification failed. Mobile number or Aadhaar number does not match our records.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset', error: error.message });
  }
};
