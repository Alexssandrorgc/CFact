import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../modules/auth/auth.service';

export interface AuthenticatedRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      message: 'Token de acceso requerido',
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    (req as AuthenticatedRequest).userId = decoded.userId;
    (req as AuthenticatedRequest).userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(403).json({
      message: 'Token inválido',
    });
    return;
  }
};
