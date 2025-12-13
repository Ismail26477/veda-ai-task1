import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, BUSINESS_CATEGORIES } from '@/types/task';
import { AppLayout } from '@/components/layout/AppLayout';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from 'date-fns';
import { toast } from 'sonner';

const CalendarPage = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getTasksForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter((task) => task.dueDate === dateStr);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'real-estate':
        return 'bg-real-estate';
      case 'digital-marketing':
        return 'bg-digital-marketing';
      case 'software-dev':
        return 'bg-software-dev';
      case 'loan':
        return 'bg-loan';
      case 'ai-services':
        return 'bg-ai-services';
      default:
        return 'bg-primary';
    }
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(taskData);
    toast.success('Task created successfully!');
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    toast.success('Task updated!');
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success('Task deleted!');
  };

  const selectedDateTasks = selectedDate ? getTasksForDay(selectedDate) : [];

  return (
    <AppLayout
      onAddTask={() => setShowModal(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl lg:text-2xl text-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="flex items-center gap-1 lg:gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 lg:h-10 lg:w-10"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 lg:h-10 text-xs lg:text-sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 lg:h-10 lg:w-10"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <div className="glass-card overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div
                    key={i}
                    className="p-2 lg:p-3 text-center text-xs lg:text-sm font-medium text-muted-foreground"
                  >
                    <span className="lg:hidden">{day}</span>
                    <span className="hidden lg:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const dayTasks = getTasksForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);

                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[60px] lg:min-h-[100px] p-1 lg:p-2 border-b border-r border-border cursor-pointer transition-colors",
                        !isCurrentMonth && "bg-muted/30",
                        isSelected && "bg-primary/5",
                        isToday(day) && "bg-primary/10",
                        "hover:bg-accent"
                      )}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={cn(
                            "text-xs lg:text-sm font-medium w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center rounded-full",
                            !isCurrentMonth && "text-muted-foreground",
                            isToday(day) && "bg-primary text-primary-foreground"
                          )}
                        >
                          {format(day, 'd')}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="text-[10px] lg:text-xs text-muted-foreground">
                            {dayTasks.length}
                          </span>
                        )}
                      </div>

                      {/* Task Dots */}
                      <div className="flex flex-wrap gap-0.5 lg:gap-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              "h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full",
                              getCategoryColor(task.category)
                            )}
                            title={task.title}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{dayTasks.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 lg:gap-4 mt-3 lg:mt-4">
              {BUSINESS_CATEGORIES.map((cat) => (
                <div key={cat.value} className="flex items-center gap-1.5 lg:gap-2">
                  <div className={cn("h-2 w-2 lg:h-3 lg:w-3 rounded-full", getCategoryColor(cat.value))} />
                  <span className="text-[10px] lg:text-xs text-muted-foreground">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Date Panel */}
          <div className="glass-card p-4 lg:p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm lg:text-base text-foreground">
                {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
              </h3>
              {selectedDate && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setShowModal(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {selectedDate ? (
              selectedDateTasks.length > 0 ? (
                <div className="space-y-2 lg:space-y-3">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-2 lg:p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full mt-1.5 flex-shrink-0",
                            getCategoryColor(task.category)
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs lg:text-sm text-foreground truncate">
                            {task.title}
                          </p>
                          <p className="text-[10px] lg:text-xs text-muted-foreground mt-0.5">
                            {task.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs lg:text-sm text-muted-foreground text-center py-4">
                  No tasks scheduled
                </p>
              )
            ) : (
              <p className="text-xs lg:text-sm text-muted-foreground text-center py-4">
                Click on a date to view tasks
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        open={showModal || !!editTask}
        onClose={() => {
          setShowModal(false);
          setEditTask(null);
        }}
        onSave={(data) => {
          if (editTask) {
            handleUpdateTask(editTask.id, data);
            setEditTask(null);
          } else {
            handleAddTask({
              ...data,
              dueDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : data.dueDate,
            });
          }
        }}
        editTask={editTask}
      />

      {/* Task Detail Panel */}
      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onEdit={() => {
          setEditTask(selectedTask);
          setSelectedTask(null);
        }}
      />
    </AppLayout>
  );
};

export default CalendarPage;
