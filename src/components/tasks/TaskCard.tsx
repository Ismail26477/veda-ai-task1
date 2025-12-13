import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { CategoryBadge } from './CategoryBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { Clock, MapPin, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusToggle: () => void;
}

export function TaskCard({ task, onClick, onStatusToggle }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  return (
    <div
      className={cn(
        "group glass-card p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
        isCompleted && "opacity-60"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusToggle();
          }}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-medium text-foreground line-clamp-1",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            <PriorityIndicator priority={task.priority} />
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <CategoryBadge category={task.category} size="sm" />

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{task.time}</span>
            </div>

            {task.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate max-w-[120px]">{task.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
