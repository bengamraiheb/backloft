
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, AlertCircle, ArrowUpDown } from 'lucide-react';

// Accept both uppercase and lowercase priority values
type PriorityType = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'low' | 'medium' | 'high' | 'urgent' | string;

interface PriorityBadgeProps {
  priority: PriorityType;
  className?: string;
  showLabel?: boolean;
}

export function PriorityBadge({ priority, className, showLabel = true }: PriorityBadgeProps) {
  // Normalize priority to lowercase for consistent handling
  const normalizedPriority = priority.toLowerCase();
  
  const priorityConfig: Record<string, {
    color: string;
    icon: React.ElementType;
    label: string;
  }> = {
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

  // Default to medium if priority is not recognized
  const config = priorityConfig[normalizedPriority] || priorityConfig.medium;
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
