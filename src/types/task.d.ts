
import { TaskStatus, TaskPriority } from '@/stores/typedTaskStore';

// This file serves as a bridge between different Task interfaces
// to ensure type compatibility across the application

export interface TaskBase {
  id: string;
  title: string;
  description?: string;  // Make description optional to match both interfaces
  status: TaskStatus | string;  // Accept both enum and string for flexibility
  priority: TaskPriority | string;
  assigneeId?: string | null;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  creatorId: string;
  creator?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  comments?: any[]; // Add comments to ensure compatibility between task types
}

// Add a utility type to help with conversions between task store types
export type TaskCompatible = {
  id: string;
  title: string;
  description: string; // Required for taskStore.Task compatibility
  status: TaskStatus | string;
  priority: TaskPriority | string;
  assigneeId?: string | null;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  creatorId: string;
  creator?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
  comments: any[];
};
