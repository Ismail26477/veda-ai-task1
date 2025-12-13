import { Task, BUSINESS_CATEGORIES, PRIORITIES, STATUSES } from '@/types/task';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from './CategoryBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { 
  X, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  FileText,
  Trash2,
  Pencil,
  CheckCircle2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export function TaskDetailPanel({ task, onClose, onUpdate, onDelete, onEdit }: TaskDetailPanelProps) {
  if (!task) return null;

  const statusInfo = STATUSES.find((s) => s.value === task.status);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-screen w-full sm:max-w-md bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
          <h2 className="font-display font-semibold text-lg">Task Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 overflow-y-auto h-[calc(100vh-140px)] lg:h-[calc(100vh-160px)]">
          {/* Title & Status */}
          <div className="space-y-4">
            <div>
              <h3 className="font-display font-semibold text-lg lg:text-xl text-foreground">
                {task.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <CategoryBadge category={task.category} size="sm" />
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    task.status === 'completed' && "bg-primary/10 text-primary",
                    task.status === 'in-progress' && "bg-digital-marketing/10 text-digital-marketing",
                    task.status === 'pending' && "bg-muted text-muted-foreground"
                  )}
                >
                  {statusInfo?.label}
                </span>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-20">Priority</span>
              <PriorityIndicator priority={task.priority} showLabel />
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-20">Due</span>
              <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{task.time}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            {task.location && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-20">Location</span>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="break-words">{task.location}</span>
                </div>
              </div>
            )}

            {/* Client */}
            {task.clientName && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-20">Client</span>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{task.clientName}</span>
                </div>
              </div>
            )}

            {/* Description */}
            {task.description && (
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Description</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            {/* Notes */}
            {task.notes && (
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Notes</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {task.notes}
                </p>
              </div>
            )}

            {/* Quick Status Buttons */}
            <div className="pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground block mb-3">Quick Actions</span>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <Button
                    key={status.value}
                    variant={task.status === status.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate(task.id, { status: status.value })}
                  >
                    {status.value === 'completed' && <CheckCircle2 className="h-4 w-4 mr-1" />}
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
