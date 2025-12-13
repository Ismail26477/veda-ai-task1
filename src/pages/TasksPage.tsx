import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, BusinessCategory, Priority, TaskStatus, BUSINESS_CATEGORIES, PRIORITIES, STATUSES } from '@/types/task';
import { AppLayout } from '@/components/layout/AppLayout';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { toast } from 'sonner';

const TasksPage = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<BusinessCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !task.title.toLowerCase().includes(query) &&
          !task.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && task.category !== categoryFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, categoryFilter, priorityFilter, statusFilter]);

  const clearFilters = () => {
    setCategoryFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
  };

  const hasFilters = categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all';

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

  return (
    <AppLayout
      onAddTask={() => setShowModal(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="max-w-5xl mx-auto space-y-4 lg:space-y-6">
        {/* Header & Filters */}
        <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
          <div>
            <h1 className="font-display font-bold text-xl lg:text-2xl text-foreground">All Tasks</h1>
            <p className="text-xs lg:text-sm text-muted-foreground mt-1">
              {filteredTasks.length} of {tasks.length} tasks
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
                <SelectTrigger className="w-[110px] lg:w-[140px] h-8 lg:h-9 text-xs lg:text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
              <SelectTrigger className="w-[90px] lg:w-[120px] h-8 lg:h-9 text-xs lg:text-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {PRIORITIES.map((pri) => (
                  <SelectItem key={pri.value} value={pri.value}>
                    {pri.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[100px] lg:w-[130px] h-8 lg:h-9 text-xs lg:text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 lg:h-9">
                <X className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="glass-card p-6 lg:p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {hasFilters || searchQuery
                  ? 'No tasks match your filters'
                  : 'No tasks yet. Create your first task!'}
              </p>
            </div>
          ) : (
            filteredTasks
              .sort((a, b) => {
                if (a.status === 'completed' && b.status !== 'completed') return 1;
                if (a.status !== 'completed' && b.status === 'completed') return -1;
                return a.dueDate.localeCompare(b.dueDate);
              })
              .map((task, index) => (
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
              ))
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

export default TasksPage;
