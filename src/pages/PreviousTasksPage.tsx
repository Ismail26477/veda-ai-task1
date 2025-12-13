import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { AppLayout } from '@/components/layout/AppLayout';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { toast } from 'sonner';

const PreviousTasksPage = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const groupedTasks = useMemo(() => {
    const groups: Record<string, { tasks: Task[]; label: string; sortDate: string }> = {};

    const filteredTasks = tasks.filter((task) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    });

    filteredTasks.forEach((task) => {
      const dateKey = task.dueDate;

      if (!groups[dateKey]) {
        const taskDate = parseISO(task.dueDate);
        let label: string;

        if (isToday(taskDate)) {
          label = 'Today';
        } else if (isYesterday(taskDate)) {
          label = 'Yesterday';
        } else {
          label = format(taskDate, 'EEEE, MMMM d, yyyy');
        }

        groups[dateKey] = {
          tasks: [],
          label,
          sortDate: dateKey,
        };
      }

      groups[dateKey].tasks.push(task);
    });

    Object.keys(groups).forEach((dateKey) => {
      groups[dateKey].tasks.sort((a, b) => b.time.localeCompare(a.time));
    });

    const sortedGroups = Object.entries(groups).sort(([dateA], [dateB]) =>
      dateB.localeCompare(dateA)
    );

    const today = format(new Date(), 'yyyy-MM-dd');
    if (sortedGroups.length > 0 && sortedGroups[0][0] === today) {
      setExpandedGroups((prev) => new Set([...prev, today]));
    }

    return sortedGroups;
  }, [tasks, searchQuery]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
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

  const handleStatusToggle = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id, { status: newStatus });
  };

  const totalTasks = tasks.length;

  return (
    <AppLayout
      onAddTask={() => setShowModal(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="max-w-5xl mx-auto space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl lg:text-2xl text-foreground">
              All Tasks Timeline
            </h1>
            <p className="text-xs lg:text-sm text-muted-foreground mt-1">
              {totalTasks} total tasks organized by date
            </p>
          </div>
        </div>

        {/* Grouped Tasks */}
        <div className="space-y-4">
          {groupedTasks.map(([dateKey, group]) => {
            const isExpanded = expandedGroups.has(dateKey);

            return (
              <div key={dateKey} className="glass-card overflow-hidden">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(dateKey)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h2 className="font-display font-semibold text-base lg:text-lg text-foreground">
                      {group.label}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {group.tasks.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {/* Group Content */}
                {isExpanded && (
                  <div className="p-4 pt-0 space-y-3">
                    {group.tasks.map((task, index) => (
                      <div
                        key={task.id}
                        style={{ animationDelay: `${index * 30}ms` }}
                        className="animate-fade-in"
                      >
                        <TaskCard
                          task={task}
                          onClick={() => setSelectedTask(task)}
                          onStatusToggle={() => handleStatusToggle(task)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {totalTasks === 0 && (
            <div className="glass-card p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'No tasks match your search'
                  : 'No tasks yet. Create your first task!'}
              </p>
            </div>
          )}
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
            handleAddTask(data);
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

export default PreviousTasksPage;
