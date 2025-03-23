
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, AlertCircle, ArrowUpDown } from 'lucide-react';
import { TaskPriority } from '@/stores/taskStore';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
  showLabel?: boolean;
}

export function PriorityBadge({ priority, className, showLabel = true }: PriorityBadgeProps) {
  const priorityConfig = {
    low: {
      color: 'bg-green-100 text-green-800 hover:bg-green-100',
      icon: ArrowDown,
      label: 'Low',
    },
    medium: {
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      icon: ArrowUpDown,
      label: 'Medium',
    },
    high: {
      color: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
      icon: ArrowUp,
      label: 'High',
    },
    urgent: {
      color: 'bg-red-100 text-red-800 hover:bg-red-100',
      icon: AlertCircle,
      label: 'Urgent',
    },
  };

  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline"
      className={cn(
        'gap-1 font-normal', 
        config.color,
        className
      )}
    >
      <Icon size={14} className="shrink-0" />
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}
