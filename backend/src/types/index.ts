
import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}
