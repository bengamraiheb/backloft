
import React from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/stores/taskStore';
import { PriorityBadge } from './PriorityBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
}

export function TaskCard({ task, onClick, className }: TaskCardProps) {
  return (
    <div 
      className={cn(
        "p-4 rounded-lg bg-card border shadow-sm hover:shadow-md transition-all duration-200",
        "cursor-pointer group animate-fade-in",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm text-balance group-hover:text-primary transition-colors">
          {task.title}
        </h3>
        <PriorityBadge priority={task.priority} showLabel={false} />
      </div>
      
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback className="text-[10px]">
                {task.assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground">?</span>
            </div>
          )}
          
          {task.comments.length > 0 && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MessageSquare size={14} className="mr-1" />
              {task.comments.length}
            </div>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
