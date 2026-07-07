import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gurukul_secret_key') as { id: string; role: string; email: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true }
    });

    if (!user) {
      res.status(401).json({ message: 'User no longer exists' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
    return;
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: `Access denied. Role '${req.user?.role || 'Guest'}' is not authorized.` });
      return;
    }
    next();
  };
};
