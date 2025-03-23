
import React, { useState } from 'react';
import { useTaskStore, Task } from '@/stores/taskStore';
import { Column } from '@/components/ui/Column';
import { TaskDialog } from '@/components/dialogs/TaskDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Board() {
  const tasks = useTaskStore((state) => state.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
  
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-2xl font-semibold">Kanban Board</h1>
        <Button onClick={handleCreateTask} className="gap-1">
          <Plus size={18} />
          <span>New Task</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full">
          <Column
            title="To Do"
            status="todo"
            tasks={tasks}
            onTaskClick={handleTaskClick}
          />
          <Column
            title="In Progress"
            status="in-progress"
            tasks={tasks}
            onTaskClick={handleTaskClick}
          />
          <Column
            title="Done"
            status="done"
            tasks={tasks}
            onTaskClick={handleTaskClick}
          />
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
