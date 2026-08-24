import { Request, Response, NextFunction, RequestHandler } from 'express';
import { User, IUser } from '../models/User.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect: RequestHandler = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: { message: 'Authentication required. No token provided.', code: 'UNAUTHORIZED' },
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: 'User belonging to this token no longer exists.', code: 'USER_NOT_FOUND' },
      });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired authentication token.', code: 'TOKEN_INVALID' },
    });
  }
};

export const requireAuth = protect;

export const optionalAuth: RequestHandler = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
    next();
  } catch {
    next();
  }
};

export const authorize = (...roles: string[]): RequestHandler => {
  return (req: any, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: 'Not authorized.', code: 'UNAUTHORIZED' },
      });
      return;
    }

    const userRole = req.user.role;
    const isAllowed = roles.includes(userRole) || userRole === 'admin';

    if (!isAllowed) {
      res.status(403).json({
        success: false,
        error: {
          message: `Forbidden: User role '${userRole}' is not authorized to access this resource.`,
          code: 'FORBIDDEN',
        },
      });
      return;
    }
    next();
  };
};

export const requireRole = (role: string | string[]) => {
  const roles = Array.isArray(role) ? role : [role];
  return authorize(...roles);
};

export const requireOwnership = (resourceLoader: (req: Request) => Promise<any>, ownerKey = 'seller') => {
  return async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.', errorCode: 'UNAUTHORIZED' });
        return;
      }

      if (req.user.role === 'admin') {
        return next();
      }

      const resource = await resourceLoader(req);
      if (!resource) {
        res.status(404).json({ success: false, message: 'Resource not found.', errorCode: 'NOT_FOUND' });
        return;
      }

      const ownerId = resource[ownerKey]?.toString() || resource.sellerId?.toString() || resource.buyerId?.toString() || resource.userId?.toString();
      if (ownerId && ownerId !== req.user._id.toString()) {
        res.status(403).json({ success: false, message: 'You do not have permission to modify this resource.', errorCode: 'FORBIDDEN' });
        return;
      }

      req.resource = resource;
      next();
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
    }
  };
};

