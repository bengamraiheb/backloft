
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'done';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: User | null;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
}

interface TaskState {
  tasks: Task[];
  users: User[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  addComment: (taskId: string, content: string, author: User) => void;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
  {
    id: '3',
    name: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement authentication',
    description: 'Create login and registration flows',
    status: 'todo',
    priority: 'high',
    assignee: mockUsers[0],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    comments: [
      {
        id: 'c1',
        content: 'Should we use JWT or session-based auth?',
        author: mockUsers[1],
        createdAt: new Date('2023-01-16'),
      },
    ],
  },
  {
    id: '2',
    title: 'Design UI components',
    description: 'Create shared components using Tailwind CSS',
    status: 'in-progress',
    priority: 'medium',
    assignee: mockUsers[1],
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-14'),
    comments: [],
  },
  {
    id: '3',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated deployment',
    status: 'done',
    priority: 'medium',
    assignee: mockUsers[2],
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-12'),
    comments: [],
  },
  {
    id: '4',
    title: 'Add dark mode support',
    description: 'Implement theme switching functionality',
    status: 'todo',
    priority: 'low',
    assignee: mockUsers[1],
    createdAt: new Date('2023-01-18'),
    updatedAt: new Date('2023-01-18'),
    comments: [],
  },
  {
    id: '5',
    title: 'Fix responsive layout bugs',
    description: 'Address issues with mobile navigation',
    status: 'backlog',
    priority: 'urgent',
    assignee: null,
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20'),
    comments: [],
  },
  {
    id: '6',
    title: 'Optimize API calls',
    description: 'Implement caching and lazy loading for better performance',
    status: 'backlog',
    priority: 'medium',
    assignee: null,
    createdAt: new Date('2023-01-22'),
    updatedAt: new Date('2023-01-22'),
    comments: [],
  },
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: mockTasks,
      users: mockUsers,
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substring(2, 11),
              createdAt: new Date(),
              updatedAt: new Date(),
              comments: [],
            },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status, updatedAt: new Date() } : task
          ),
        })),
      addComment: (taskId, content, author) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  comments: [
                    ...task.comments,
                    {
                      id: Math.random().toString(36).substring(2, 11),
                      content,
                      author,
                      createdAt: new Date(),
                    },
                  ],
                  updatedAt: new Date(),
                }
              : task
          ),
        })),
    }),
    {
      name: 'task-storage',
    }
  )
);
