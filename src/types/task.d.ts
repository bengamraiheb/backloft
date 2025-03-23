
import { TaskStatus, TaskPriority } from '@/stores/typedTaskStore';

// This file serves as a bridge between different Task interfaces
// to ensure type compatibility across the application

export interface TaskBase {
  id: string;
  title: string;
  description?: string;  // Make description optional to match both interfaces
  status: TaskStatus;
  priority: TaskPriority;
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
}
