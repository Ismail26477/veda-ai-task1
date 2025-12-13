import { cn } from '@/lib/utils';
import { Priority } from '@/types/task';
import { Flag } from 'lucide-react';

interface PriorityIndicatorProps {
  priority: Priority;
  showLabel?: boolean;
}

export function PriorityIndicator({ priority, showLabel = false }: PriorityIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        priority === 'high' && "text-priority-high",
        priority === 'medium' && "text-priority-medium",
        priority === 'low' && "text-priority-low"
      )}
    >
      <Flag className="h-4 w-4" />
      {showLabel && (
        <span className="text-xs font-medium capitalize">{priority}</span>
      )}
    </span>
  );
}
