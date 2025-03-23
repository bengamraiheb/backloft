
import { create } from 'zustand';
import { taskService } from '../services/api';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface TaskHistory {
  id: string;
  changeType: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User | null;
  assigneeId?: string | null;
  creator: User;
  creatorId: string;
  comments: Comment[];
  history?: TaskHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<Comment>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  
  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const { tasks } = await taskService.getAllTasks();
      
      // Convert to proper case for frontend
      const formattedTasks = tasks.map((task: any) => ({
        ...task,
        status: task.status.toLowerCase().replace('_', '-') as TaskStatus,
        priority: task.priority.toLowerCase() as TaskPriority,
      }));
      
      set({ tasks: formattedTasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },
  
  createTask: async (taskData: Partial<Task>) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert to backend format
      const formattedData = {
        ...taskData,
        status: taskData.status?.toUpperCase().replace('-', '_'),
        priority: taskData.priority?.toUpperCase(),
      };
      
      const { task } = await taskService.createTask(formattedData);
      
      // Convert back to frontend format
      const formattedTask = {
        ...task,
        status: task.status.toLowerCase().replace('_', '-') as TaskStatus,
        priority: task.priority.toLowerCase() as TaskPriority,
      };
      
      set((state) => ({
        tasks: [...state.tasks, formattedTask],
        isLoading: false
      }));
      
      return formattedTask;
    } catch (error) {
      console.error('Error creating task:', error);
      set({ error: 'Failed to create task', isLoading: false });
      throw error;
    }
  },
  
  updateTask: async (id: string, taskData: Partial<Task>) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert to backend format
      const formattedData = {
        ...taskData,
        status: taskData.status?.toUpperCase().replace('-', '_'),
        priority: taskData.priority?.toUpperCase(),
      };
      
      const { task } = await taskService.updateTask(id, formattedData);
      
      // Convert back to frontend format
      const formattedTask = {
        ...task,
        status: task.status.toLowerCase().replace('_', '-') as TaskStatus,
        priority: task.priority.toLowerCase() as TaskPriority,
      };
      
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? formattedTask : t)),
        isLoading: false
      }));
      
      return formattedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: 'Failed to update task', isLoading: false });
      throw error;
    }
  },
  
  deleteTask: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await taskService.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: 'Failed to delete task', isLoading: false });
      throw error;
    }
  },
  
  addComment: async (taskId: string, content: string) => {
    try {
      set({ isLoading: true, error: null });
      const { comment } = await taskService.addComment(taskId, content);
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? { ...task, comments: [...task.comments, comment] }
            : task
        ),
        isLoading: false
      }));
      
      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      set({ error: 'Failed to add comment', isLoading: false });
      throw error;
    }
  }
}));
