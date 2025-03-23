
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  CheckSquare, 
  Calendar, 
  Users, 
  Settings,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  exact?: boolean;
  collapsed?: boolean;
}

const NavItem = ({ icon: Icon, label, to, exact = false, collapsed = false }: NavItemProps) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  return (
    <TooltipProvider delayDuration={700}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to}>
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              className={cn(
                "w-full justify-start gap-3 mb-1 font-medium",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary",
                collapsed && "justify-center"
              )}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  return (
    <div 
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 ease-in-out",
        "overflow-y-auto bg-background border-r",
        collapsed ? "w-[60px]" : "w-64",
        !open && "transform -translate-x-full md:translate-x-0"
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h3 className="font-semibold">Main Navigation</h3>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
        
        <div className="space-y-1">
          <NavItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            to="/" 
            exact 
            collapsed={collapsed} 
          />
          <NavItem 
            icon={ListTodo} 
            label="Backlog" 
            to="/backlog" 
            collapsed={collapsed} 
          />
          <NavItem 
            icon={CheckSquare} 
            label="Board" 
            to="/board" 
            collapsed={collapsed} 
          />
          <NavItem 
            icon={Calendar} 
            label="Calendar" 
            to="/calendar" 
            collapsed={collapsed} 
          />
          <NavItem 
            icon={Users} 
            label="Team" 
            to="/team" 
            collapsed={collapsed} 
          />
          <NavItem 
            icon={Settings} 
            label="Settings" 
            to="/settings" 
            collapsed={collapsed} 
          />
        </div>

        {!collapsed && (
          <>
            <div className="mt-8 mb-2">
              <div className="flex items-center justify-between">
                <button
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                  onClick={() => setProjectsExpanded(!projectsExpanded)}
                >
                  {projectsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span>Projects</span>
                </button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {projectsExpanded && (
              <div className="mt-2 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:bg-secondary pl-8"
                >
                  Website Redesign
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:bg-secondary pl-8"
                >
                  Mobile App
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:bg-secondary pl-8"
                >
                  API Integration
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
