import { Task } from '@/types/task';
import { CategoryBadge } from '@/components/tasks/CategoryBadge';
import { PriorityIndicator } from '@/components/tasks/PriorityIndicator';
import { Clock, ArrowRight } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UpcomingTasksProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function UpcomingTasks({ tasks, onTaskClick }: UpcomingTasksProps) {
  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground">Upcoming Tasks</h3>
        <Link to="/tasks">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming tasks
          </p>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              onClick={() => onTaskClick(task)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <CategoryBadge category={task.category} size="sm" />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.time}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {formatDate(task.dueDate)}
                </span>
                <PriorityIndicator priority={task.priority} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
