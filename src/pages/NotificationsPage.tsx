import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bell, BellOff, Clock, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTasks } from '@/hooks/useTasks';
import { format, parseISO, isToday, isTomorrow, addHours } from 'date-fns';
import { cn } from '@/lib/utils';
import { CategoryBadge } from '@/components/tasks/CategoryBadge';

const NotificationsPage = () => {
  const { tasks, getTodayTasks, getUpcomingTasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const todayTasks = getTodayTasks().filter((t) => t.status !== 'completed');
  const upcomingTasks = getUpcomingTasks().filter((t) => t.status !== 'completed').slice(0, 5);

  const formatReminder = (task: { dueDate: string; time: string }) => {
    const date = parseISO(task.dueDate);
    if (isToday(date)) return `Today at ${task.time}`;
    if (isTomorrow(date)) return `Tomorrow at ${task.time}`;
    return `${format(date, 'MMM d')} at ${task.time}`;
  };

  return (
    <AppLayout
      onAddTask={() => {}}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Reminders & Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your task reminders and notification preferences
          </p>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Desktop Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive browser notifications for upcoming tasks
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Sound Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Play a sound when a reminder is triggered
                </p>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </div>
        </div>

        {/* Today's Reminders */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-digital-marketing" />
            Today's Reminders
            <span className="text-sm font-normal text-muted-foreground">
              ({todayTasks.length})
            </span>
          </h2>

          {todayTasks.length === 0 ? (
            <div className="text-center py-6">
              <Check className="h-10 w-10 text-real-estate mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No pending reminders for today
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      task.priority === 'high'
                        ? 'bg-destructive/10'
                        : 'bg-primary/10'
                    )}
                  >
                    {task.priority === 'high' ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Bell className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryBadge category={task.category} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {formatReminder(task)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Reminders */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-software-dev" />
            Upcoming Reminders
          </h2>

          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming reminders
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <div className="p-2 rounded-lg bg-muted">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryBadge category={task.category} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {formatReminder(task)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
