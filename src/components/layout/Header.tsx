import { Bell, Search, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  onAddTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuClick: () => void;
}

export function Header({ onAddTask, searchQuery, onSearchChange, onMenuClick }: HeaderProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between gap-3 lg:gap-4">
        {/* Mobile Menu & Welcome */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="font-display text-base lg:text-xl font-semibold text-foreground truncate">
              Welcome, Anubhav 👋
            </h1>
            <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">{formattedDate}</p>
          </div>
        </div>

        {/* Search - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          <Button
            onClick={onAddTask}
            size="sm"
            className="gap-1.5 lg:gap-2 shadow-md hover:shadow-lg transition-shadow h-9 px-3 lg:px-4"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>

          <Avatar className="h-8 w-8 lg:h-9 lg:w-9 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
              AG
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary h-9"
          />
        </div>
      </div>
    </header>
  );
}
