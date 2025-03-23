
import { Request } from 'express';
import { User, Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
}

export interface CommentInput {
  content: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export interface SocketUser {
  id: string;
  socketId: string;
}
