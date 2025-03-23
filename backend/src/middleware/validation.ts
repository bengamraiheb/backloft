
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    next();
  };
};

export const schemas = {
  registerSchema: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  
  taskSchema: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
    assigneeId: Joi.string().uuid().allow(null),
  }),
  
  commentSchema: Joi.object({
    content: Joi.string().min(1).required(),
  }),
  
  updateUserSchema: Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    role: Joi.string().valid('ADMIN', 'TEAM_MEMBER', 'USER'),
  }),
  
  resetPasswordSchema: Joi.object({
    email: Joi.string().email().required(),
  }),
  
  newPasswordSchema: Joi.object({
    password: Joi.string().min(6).required(),
    token: Joi.string().required(),
  }),
};
