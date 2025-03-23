
import React from 'react';
import { cn } from '@/lib/utils';
import { TaskStatus, Task } from '@/stores/taskStore';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  className?: string;
}

export function Column({ title, status, tasks, onTaskClick, className }: ColumnProps) {
  const filteredTasks = tasks.filter((task) => task.status === status);
  
  return (
    <div 
      className={cn(
        "flex flex-col min-w-[280px] max-w-[280px] h-full border rounded-lg bg-muted/30",
        className
      )}
    >
      <div className="p-3 font-medium flex items-center justify-between border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {filteredTasks.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto space-y-2 min-h-[200px]">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
