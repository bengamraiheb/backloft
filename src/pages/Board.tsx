
import React, { useState, useEffect, useCallback } from 'react';
import { useTaskStore } from '@/stores/typedTaskStore';
import { useSocket } from '@/hooks/useSocket';
import { Column } from '@/components/ui/Column';
import { TaskDialog } from '@/components/dialogs/TaskDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Task, TaskStatus } from '@/stores/typedTaskStore';

export default function Board() {
  const { toast } = useToast();
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { socket } = useSocket();
  
  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks().catch(err => {
      console.error('Error fetching tasks:', err);
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again.',
        variant: 'destructive',
      });
    });
  }, [fetchTasks, toast]);
  
  // Handle socket events
  useEffect(() => {
    if (!socket) return;
    
    const handleTaskCreated = (data: any) => {
      fetchTasks();
      toast({
        title: 'New Task Created',
        description: `A new task "${data.task.title}" has been created.`,
      });
    };
    
    const handleTaskUpdated = (data: any) => {
      fetchTasks();
      toast({
        title: 'Task Updated',
        description: `Task "${data.task.title}" has been updated.`,
      });
    };
    
    const handleTaskDeleted = (data: any) => {
      fetchTasks();
      toast({
        title: 'Task Deleted',
        description: 'A task has been deleted.',
      });
    };
    
    socket.on('task_created', handleTaskCreated);
    socket.on('task_updated', handleTaskUpdated);
    socket.on('task_deleted', handleTaskDeleted);
    
    return () => {
      socket.off('task_created', handleTaskCreated);
      socket.off('task_updated', handleTaskUpdated);
      socket.off('task_deleted', handleTaskDeleted);
    };
  }, [socket, fetchTasks, toast]);
  
  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setDialogMode('view');
    setDialogOpen(true);
  }, []);
  
  const handleCreateTask = useCallback(() => {
    setSelectedTask(undefined);
    setDialogMode('create');
    setDialogOpen(true);
  }, []);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('taskId');
      
      if (!taskId) return;
      
      const task = tasks.find((t) => t.id === taskId);
      
      if (task && task.status !== status) {
        try {
          await useTaskStore.getState().updateTask(taskId, { status });
          
          if (socket) {
            socket.emit('task_status_change', {
              taskId,
              oldStatus: task.status,
              newStatus: status,
            });
          }
        } catch (err) {
          console.error('Error updating task status:', err);
          toast({
            title: 'Error',
            description: 'Failed to update task status.',
            variant: 'destructive',
          });
        }
      }
    },
    [tasks, socket, toast]
  );
  
  const handleRefresh = () => {
    fetchTasks();
    toast({
      title: 'Refreshed',
      description: 'Task board has been refreshed.',
    });
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <p className="text-destructive mb-4">Failed to load tasks</p>
        <Button onClick={() => fetchTasks()}>Try Again</Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-2xl font-semibold">Kanban Board</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={handleCreateTask} className="gap-1">
            <Plus size={18} />
            <span>New Task</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full">
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'backlog')}
            className="h-full"
          >
            <Column
              title="Backlog"
              status="backlog"
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onDragStart={handleDragStart}
            />
          </div>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
            className="h-full"
          >
            <Column
              title="To Do"
              status="todo"
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onDragStart={handleDragStart}
            />
          </div>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in-progress')}
            className="h-full"
          >
            <Column
              title="In Progress"
              status="in-progress"
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onDragStart={handleDragStart}
            />
          </div>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'done')}
            className="h-full"
          >
            <Column
              title="Done"
              status="done"
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onDragStart={handleDragStart}
            />
          </div>
        </div>
      </div>
      
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        mode={dialogMode}
      />
    </div>
  );
}
