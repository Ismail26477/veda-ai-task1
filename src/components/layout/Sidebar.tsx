import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Bell,
  Settings,
  Building2,
  Megaphone,
  Code2,
  Landmark,
  BrainCircuit,
  Sparkles,
  X,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const mainNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'All Tasks' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/previous-tasks', icon: History, label: 'Previous Tasks' },
  { to: '/notifications', icon: Bell, label: 'Reminders' },
];

const businessItems = [
  { to: '/category/real-estate', icon: Building2, label: 'Real Estate', color: 'text-real-estate' },
  { to: '/category/digital-marketing', icon: Megaphone, label: 'Digital Marketing', color: 'text-digital-marketing' },
  { to: '/category/software-dev', icon: Code2, label: 'Software Dev', color: 'text-software-dev' },
  { to: '/category/loan', icon: Landmark, label: 'Loan Consulting', color: 'text-loan' },
  { to: '/category/ai-services', icon: BrainCircuit, label: 'AI Services', color: 'text-ai-services' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-transform duration-300 flex flex-col w-64",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg">Veda AI</span>
              <span className="text-xs text-muted-foreground">Productivity Suite</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 lg:py-6 px-3">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Business Categories */}
          <div className="mt-6 lg:mt-8">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Businesses
            </h3>
          </div>
          <div className="space-y-1">
            {businessItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", item.color)} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Settings */}
        <div className="p-3 border-t border-border">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
