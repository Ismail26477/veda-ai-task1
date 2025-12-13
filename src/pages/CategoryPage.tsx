import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTasks } from '@/hooks/useTasks';
import { Task, BusinessCategory, BUSINESS_CATEGORIES } from '@/types/task';
import { AppLayout } from '@/components/layout/AppLayout';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { StatCard } from '@/components/dashboard/StatCard';
import { Building2, Megaphone, Code2, Landmark, BrainCircuit, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const iconMap = {
  'real-estate': Building2,
  'digital-marketing': Megaphone,
  'software-dev': Code2,
  'loan': Landmark,
  'ai-services': BrainCircuit,
};

const CategoryPage = () => {
  const { category } = useParams<{ category: BusinessCategory }>();
  const { tasks, addTask, updateTask, deleteTask, getTasksByCategory } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categoryInfo = BUSINESS_CATEGORIES.find((c) => c.value === category);
  const categoryTasks = category ? getTasksByCategory(category) : [];
  const Icon = category ? iconMap[category] : Building2;

  const stats = {
    total: categoryTasks.length,
    completed: categoryTasks.filter((t) => t.status === 'completed').length,
    pending: categoryTasks.filter((t) => t.status === 'pending').length,
    inProgress: categoryTasks.filter((t) => t.status === 'in-progress').length,
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    addTask({ ...taskData, category: category as BusinessCategory });
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

  if (!categoryInfo) {
    return (
      <AppLayout
        onAddTask={() => setShowModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">Category not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      onAddTask={() => setShowModal(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-2xl ${
              category === 'real-estate'
                ? 'bg-real-estate/10'
                : category === 'digital-marketing'
                ? 'bg-digital-marketing/10'
                : category === 'software-dev'
                ? 'bg-software-dev/10'
                : category === 'loan'
                ? 'bg-loan/10'
                : 'bg-ai-services/10'
            }`}
          >
            <Icon
              className={`h-8 w-8 ${
                category === 'real-estate'
                  ? 'text-real-estate'
                  : category === 'digital-marketing'
                  ? 'text-digital-marketing'
                  : category === 'software-dev'
                  ? 'text-software-dev'
                  : category === 'loan'
                  ? 'text-loan'
                  : 'text-ai-services'
              }`}
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              {categoryInfo.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              {stats.total} total tasks
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            iconClassName="bg-real-estate/10 text-real-estate"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            iconClassName="bg-digital-marketing/10 text-digital-marketing"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={AlertTriangle}
            iconClassName="bg-muted text-muted-foreground"
          />
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {categoryTasks.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground">
                No tasks in this category yet
              </p>
            </div>
          ) : (
            categoryTasks
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

export default CategoryPage;
