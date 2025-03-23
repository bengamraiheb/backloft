import React, { useState, useEffect } from 'react';
import { useTaskStore, TaskStatus, TaskPriority } from '@/stores/typedTaskStore';
import { TaskDialog } from '@/components/dialogs/TaskDialog';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/stores/typedTaskStore';
import { TaskCompatible } from '@/types/task';

export default function Backlog() {
  const { toast } = useToast();
  const tasks = useTaskStore((state) => state.tasks);
  const moveTask = useTaskStore((state) => state.updateTask);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const backlogTasks = tasks.filter((task) => task.status === TaskStatus.BACKLOG);
  
  const filteredTasks = backlogTasks.filter((task) => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogMode('view');
    setDialogOpen(true);
  };
  
  const handleCreateTask = () => {
    setSelectedTask(undefined);
    setDialogMode('create');
    setDialogOpen(true);
  };
  
  const handleMoveToBoard = (task: Task) => {
    moveTask(task.id, { status: TaskStatus.TODO });
    toast({
      title: "Task Moved",
      description: `Task "${task.title}" moved to To Do column.`
    });
  };

  const adaptTaskForDialog = (task: Task): TaskCompatible => {
    return {
      ...task,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      comments: task.comments || [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-2xl font-semibold">Backlog</h1>
        <Button onClick={handleCreateTask} className="gap-1">
          <Plus size={18} />
          <span>New Task</span>
        </Button>
      </div>
      
      <div className="border-b px-6 py-3">
        <div className="flex gap-4 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {filteredTasks.length > 0 ? (
            <div className="border rounded-lg divide-y">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted/30 text-sm font-medium text-muted-foreground">
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Priority</div>
                <div className="col-span-2">Assignee</div>
                <div className="col-span-2">Updated</div>
              </div>
              
              {filteredTasks.map((task) => (
                <div 
                  key={task.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="col-span-5 font-medium">
                    {task.title}
                  </div>
                  <div className="col-span-3">
                    <PriorityBadge priority={task.priority.toLowerCase()} />
                  </div>
                  <div className="col-span-2">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar} />
                          <AvatarFallback>
                            {task.assignee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs hidden lg:inline">
                          {task.assignee.name.split(' ')[0]}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                  <div className="col-span-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToBoard(task);
                        }}>
                          Move to Board
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                          setDialogMode('edit');
                          setDialogOpen(true);
                        }}>
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No tasks in backlog</p>
              <Button onClick={handleCreateTask} variant="outline" className="gap-1">
                <Plus size={16} />
                <span>Add Task</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask ? adaptTaskForDialog(selectedTask) : undefined}
        mode={dialogMode}
      />
    </div>
  );
}
