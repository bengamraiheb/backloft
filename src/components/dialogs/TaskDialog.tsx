import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TaskStatus, TaskPriority, User, useTaskStore } from '@/stores/typedTaskStore';
import { 
  Calendar, 
  MessageSquare, 
  Paperclip, 
  Clock, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { format } from 'date-fns';
import { TaskCompatible } from '@/types/task';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskCompatible;
  mode: 'view' | 'edit' | 'create';
}

const statusOptions: { value: string; label: string }[] = [
  { value: TaskStatus.BACKLOG, label: 'Backlog' },
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' }
];

const priorityOptions: { value: string; label: string }[] = [
  { value: TaskPriority.LOW, label: 'Low' },
  { value: TaskPriority.MEDIUM, label: 'Medium' },
  { value: TaskPriority.HIGH, label: 'High' },
  { value: TaskPriority.URGENT, label: 'Urgent' }
];

export function TaskDialog({ open, onOpenChange, task, mode }: TaskDialogProps) {
  const users = useTaskStore((state) => state.users);
  const { addTask, updateTask, deleteTask, addComment } = useTaskStore();
  const [isEditing, setIsEditing] = useState(mode !== 'view');
  const [commentText, setCommentText] = useState('');
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: string;
    priority: string;
    assigneeId: string | null;
  }>({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || TaskStatus.TODO,
    priority: task?.priority || TaskPriority.MEDIUM,
    assigneeId: task?.assignee?.id || null,
  });
  
  const currentUser = users[0]; // For demo
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    const assignee = formData.assigneeId 
      ? users.find((user) => user.id === formData.assigneeId) || null 
      : null;
    
    if (mode === 'create' || !task) {
      addTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignee
      });
    } else {
      updateTask(task.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignee
      });
    }
    
    setIsEditing(false);
    if (mode === 'create') {
      onOpenChange(false);
    }
  };
  
  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      onOpenChange(false);
    }
  };
  
  const handleAddComment = () => {
    if (task && commentText.trim()) {
      addComment(task.id, commentText, currentUser);
      setCommentText('');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        {isEditing ? (
          <>
            <DialogHeader>
              <DialogTitle>{mode === 'create' ? 'Create Task' : 'Edit Task'}</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Task title"
                  className="w-full"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Task description"
                  className="w-full min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => 
                      handleSelectChange('priority', value)
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <PriorityBadge 
                              priority={option.value} 
                              showLabel={false} 
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="assignee" className="text-sm font-medium">
                  Assignee
                </label>
                <Select
                  value={formData.assigneeId || 'unassigned'}
                  onValueChange={(value) => handleSelectChange('assigneeId', value === 'unassigned' ? null : value)}
                >
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              {mode !== 'create' && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="mr-auto"
                >
                  Delete
                </Button>
              )}
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>
                {mode === 'create' ? 'Create' : 'Save'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">{task?.title}</DialogTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleDelete}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <PriorityBadge priority={task?.priority || 'medium'} />
                <Badge 
                  variant="outline" 
                  className="bg-muted/50 text-muted-foreground"
                >
                  {statusOptions.find(s => s.value === task?.status)?.label}
                </Badge>
              </div>
            </DialogHeader>
            
            <Tabs defaultValue="details">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="comments" className="flex-1">
                  Comments ({task?.comments.length || 0})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {task?.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Assignee</h4>
                      {task?.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback>
                              {task.assignee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Created</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>
                          {task && format(new Date(task.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Last Updated</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      <span>
                        {task && format(new Date(task.updatedAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="comments" className="mt-0">
                <div className="space-y-4">
                  {task?.comments && task.comments.length > 0 ? (
                    <div className="space-y-4">
                      {task.comments.map((comment) => (
                        <div key={comment.id} className="p-3 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={comment.author.avatar} />
                              <AvatarFallback>
                                {comment.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-line">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="gap-1"
                    >
                      <Paperclip size={14} />
                      <span>Attach</span>
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="gap-1"
                    >
                      <MessageSquare size={14} />
                      <span>Comment</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Badge({ variant, className, children }: { 
  variant: string; 
  className: string; 
  children: React.ReactNode; 
}) {
  return (
    <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${className}`}>
      {children}
    </div>
  );
}
