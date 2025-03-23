
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const schemas = {
  registerSchema: Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(100)
  }),

  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  resetPasswordSchema: Joi.object({
    email: Joi.string().email().required()
  }),

  newPasswordSchema: Joi.object({
    password: Joi.string().required().min(6).max(100),
    token: Joi.string().required()
  }),

  updateUserSchema: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    role: Joi.string().valid('ADMIN', 'TEAM_MEMBER', 'USER')
  }),

  taskSchema: Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
    assigneeId: Joi.string().allow(null, '')
  }),

  commentSchema: Joi.object({
    content: Joi.string().required().min(1).max(1000)
  })
};

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errorMessage 
      });
    }
    
    next();
  };
};
