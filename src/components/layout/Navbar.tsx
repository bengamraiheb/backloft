
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Settings, 
  PlusCircle, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTaskStore } from '@/stores/taskStore';
import { cn } from '@/lib/utils';

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Navbar({ sidebarOpen, toggleSidebar }: NavbarProps) {
  const users = useTaskStore((state) => state.users);
  const currentUser = users[0]; // For demo purposes

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="mr-2 md:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">JC</span>
            </div>
            <span className="font-semibold text-lg hidden md:inline-block">Jira Clone</span>
          </Link>
        </div>
        
        <div className={cn(
          "ml-auto flex items-center gap-4",
          "transition-all duration-200"
        )}>
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8 bg-muted/50 border-none"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings size={20} />
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hidden md:flex">
            <PlusCircle size={18} />
            <span>Create</span>
          </Button>
          
          <div className="relative">
            <Avatar className="h-8 w-8 transition-transform hover:scale-105">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
