
import React, { useState } from 'react';
import { useTaskStore, Task, TaskStatus } from '@/stores/taskStore';
import { Link } from 'react-router-dom';
import { TaskDialog } from '@/components/dialogs/TaskDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskCard } from '@/components/ui/TaskCard';
import { 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  BarChart2, 
  ClipboardList 
} from 'lucide-react';
import { TaskBase, TaskCompatible } from '@/types/task';

export default function Index() {
  const tasks = useTaskStore((state) => state.tasks);
  const users = useTaskStore((state) => state.users);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };
  
  const getRecentTasks = () => {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  };

  // Convert taskStore Task to the format expected by TaskCard
  const adaptTaskForDisplay = (task: Task): TaskBase => {
    return {
      ...task,
      creatorId: task.assignee?.id || 'unknown', // Use assignee ID as a fallback for creatorId
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      comments: task.comments
    };
  };

  // Type adapter function to ensure compatibility with the task dialog
  const adaptTaskForDialog = (task: Task): TaskCompatible => {
    return {
      ...task,
      creatorId: task.assignee?.id || 'unknown',
      creator: task.assignee,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      comments: task.comments
    } as TaskCompatible;
  };
  
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link to="/board">
          <Button className="gap-1">
            <ClipboardList size={18} />
            <span>Go to Board</span>
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{tasks.length}</div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <ClipboardList size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">
                    {tasksByStatus['in-progress']?.length || 0}
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Clock size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">
                    {tasksByStatus['done']?.length || 0}
                  </div>
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{users.length}</div>
                  <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                    <BarChart2 size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Link to="/board">
                    <Button variant="link" className="text-sm p-0 h-auto">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecentTasks().map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={adaptTaskForDisplay(task)} 
                      onClick={() => handleTaskClick(task)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Task Overview</CardTitle>
                  <Link to="/backlog">
                    <Button variant="link" className="text-sm p-0 h-auto">
                      View Backlog
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Backlog</span>
                      <span className="text-sm text-muted-foreground">
                        {tasksByStatus['backlog']?.length || 0} tasks
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500" 
                        style={{ 
                          width: `${(tasksByStatus['backlog']?.length || 0) / tasks.length * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">To Do</span>
                      <span className="text-sm text-muted-foreground">
                        {tasksByStatus['todo']?.length || 0} tasks
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500" 
                        style={{ 
                          width: `${(tasksByStatus['todo']?.length || 0) / tasks.length * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">In Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {tasksByStatus['in-progress']?.length || 0} tasks
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ 
                          width: `${(tasksByStatus['in-progress']?.length || 0) / tasks.length * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Done</span>
                      <span className="text-sm text-muted-foreground">
                        {tasksByStatus['done']?.length || 0} tasks
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ 
                          width: `${(tasksByStatus['done']?.length || 0) / tasks.length * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask ? adaptTaskForDialog(selectedTask) : undefined}
        mode="view"
      />
    </div>
  );
}
