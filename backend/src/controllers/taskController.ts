
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import prisma from '../config/db';
import { io } from '../server';

// Get all tasks
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    });
    
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        history: {
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({ task });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create task
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { title, description, status, priority, assigneeId } = req.body;
    
    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        assigneeId: assigneeId || null,
        creatorId: req.user.id
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
    
    // Create initial task history entry
    await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        changeType: 'created',
        newValue: 'Task created'
      }
    });
    
    // Create notification for assignee if assigned
    if (task.assigneeId) {
      await prisma.notification.create({
        data: {
          message: `You were assigned to task: ${task.title}`,
          userId: task.assigneeId,
          taskId: task.id
        }
      });
      
      // Emit socket event for real-time notification
      io.to(task.assigneeId).emit('notification', {
        type: 'task_assigned',
        message: `You were assigned to task: ${task.title}`,
        taskId: task.id
      });
    }
    
    // Emit task created event to all clients
    io.emit('task_created', { task });
    
    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task
export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    const { title, description, status, priority, assigneeId } = req.body;
    
    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true
      }
    });
    
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Build update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null;
    
    // Create history entries for changes
    if (status !== undefined && status !== existingTask.status) {
      await prisma.taskHistory.create({
        data: {
          taskId: id,
          changeType: 'status_change',
          oldValue: existingTask.status,
          newValue: status
        }
      });
    }
    
    if (assigneeId !== undefined && assigneeId !== existingTask.assigneeId) {
      await prisma.taskHistory.create({
        data: {
          taskId: id,
          changeType: 'assignee_change',
          oldValue: existingTask.assigneeId || 'Unassigned',
          newValue: assigneeId || 'Unassigned'
        }
      });
      
      // Create notification for new assignee
      if (assigneeId) {
        await prisma.notification.create({
          data: {
            message: `You were assigned to task: ${existingTask.title}`,
            userId: assigneeId,
            taskId: id
          }
        });
        
        // Emit socket event for real-time notification
        io.to(assigneeId).emit('notification', {
          type: 'task_assigned',
          message: `You were assigned to task: ${existingTask.title}`,
          taskId: id
        });
      }
    }
    
    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
    
    // Emit task updated event to all clients
    io.emit('task_updated', { task: updatedTask });
    
    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete task
export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is task creator or admin
    if (task.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Not authorized to delete this task' });
    }
    
    // Delete task (all related records will be deleted due to cascading)
    await prisma.task.delete({
      where: { id }
    });
    
    // Emit task deleted event to all clients
    io.emit('task_deleted', { taskId: id });
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add comment to task
export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    const { content } = req.body;
    
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        taskId: id,
        authorId: req.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
    
    // Create task history entry
    await prisma.taskHistory.create({
      data: {
        taskId: id,
        changeType: 'comment_added',
        newValue: `Comment added by ${req.user.email}`
      }
    });
    
    // Create notification for task assignee if different from commenter
    if (task.assigneeId && task.assigneeId !== req.user.id) {
      await prisma.notification.create({
        data: {
          message: `New comment on task: ${task.title}`,
          userId: task.assigneeId,
          taskId: id
        }
      });
      
      // Emit socket event for real-time notification
      io.to(task.assigneeId).emit('notification', {
        type: 'new_comment',
        message: `New comment on task: ${task.title}`,
        taskId: id
      });
    }
    
    // Also notify task creator if different from commenter and assignee
    if (task.creatorId !== req.user.id && task.creatorId !== task.assigneeId) {
      await prisma.notification.create({
        data: {
          message: `New comment on task: ${task.title}`,
          userId: task.creatorId,
          taskId: id
        }
      });
      
      // Emit socket event for real-time notification
      io.to(task.creatorId).emit('notification', {
        type: 'new_comment',
        message: `New comment on task: ${task.title}`,
        taskId: id
      });
    }
    
    // Emit comment added event
    io.emit('comment_added', { taskId: id, comment });
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
