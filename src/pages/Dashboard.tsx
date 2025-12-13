"use client"

import { useState } from "react"
import { useTasks } from "@/hooks/useTasks"
import type { Task } from "@/types/task"
import { AppLayout } from "@/components/layout/AppLayout"
import { StatCard } from "@/components/dashboard/StatCard"
import { BusinessChart } from "@/components/dashboard/BusinessChart"
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks"
import { TaskCard } from "@/components/tasks/TaskCard"
import { TaskModal } from "@/components/tasks/TaskModal"
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel"
import { CheckCircle2, AlertTriangle, TrendingUp, Sparkles } from "lucide-react"
import { toast } from "sonner"

const Dashboard = () => {
  const { tasks, addTask, updateTask, deleteTask, getTodayTasks, getOverdueTasks, getUpcomingTasks, getStats } =
    useTasks()

  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const stats = getStats()
  const todayTasks = getTodayTasks()
  const overdueTasks = getOverdueTasks()
  const upcomingTasks = getUpcomingTasks()

  const handleAddTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      console.log("[v0] Attempting to add task:", taskData)
      await addTask(taskData)
      toast.success("Task created successfully!")
    } catch (error) {
      console.error("[v0] Failed to add task:", error)
      toast.error("Failed to create task. Please check if the server is running.")
    }
  }

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      console.log("[v0] Attempting to update task:", id, updates)
      await updateTask(id, updates)
      toast.success("Task updated!")
    } catch (error) {
      console.error("[v0] Failed to update task:", error)
      toast.error("Failed to update task. Please check if the server is running.")
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      console.log("[v0] Attempting to delete task:", id)
      await deleteTask(id)
      toast.success("Task deleted!")
    } catch (error) {
      console.error("[v0] Failed to delete task:", error)
      toast.error("Failed to delete task. Please check if the server is running.")
    }
  }

  const handleStatusToggle = (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed"
    handleUpdateTask(task.id, { status: newStatus })
    toast.success(newStatus === "completed" ? "Task completed!" : "Task reopened")
  }

  return (
    <AppLayout onAddTask={() => setShowModal(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatCard title="Total Tasks" value={stats.total} icon={Sparkles} trend="+12% this week" />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            iconClassName="bg-real-estate/10 text-real-estate"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={TrendingUp}
            iconClassName="bg-digital-marketing/10 text-digital-marketing"
          />
          <StatCard
            title="Overdue"
            value={overdueTasks.length}
            icon={AlertTriangle}
            iconClassName="bg-destructive/10 text-destructive"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Today's Tasks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-base lg:text-lg text-foreground">
                Today's Tasks
                <span className="ml-2 text-xs lg:text-sm font-normal text-muted-foreground">
                  ({todayTasks.length} tasks)
                </span>
              </h2>
            </div>

            {todayTasks.length === 0 ? (
              <div className="glass-card p-6 lg:p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 lg:p-4 rounded-full bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">All caught up!</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  No tasks scheduled for today. Enjoy your day!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task, index) => (
                  <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                    <TaskCard
                      task={task}
                      onClick={() => setSelectedTask(task)}
                      onStatusToggle={() => handleStatusToggle(task)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Overdue Section */}
            {overdueTasks.length > 0 && (
              <div className="mt-4 lg:mt-6 space-y-4">
                <h2 className="font-display font-semibold text-base lg:text-lg text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5" />
                  Overdue
                  <span className="text-xs lg:text-sm font-normal">({overdueTasks.length} tasks)</span>
                </h2>
                <div className="space-y-3">
                  {overdueTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                      onStatusToggle={() => handleStatusToggle(task)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            <BusinessChart data={stats.byCategory} />
            <UpcomingTasks tasks={upcomingTasks} onTaskClick={setSelectedTask} />
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        open={showModal || !!editTask}
        onClose={() => {
          setShowModal(false)
          setEditTask(null)
        }}
        onSave={(data) => {
          if (editTask) {
            handleUpdateTask(editTask.id, data)
            setEditTask(null)
          } else {
            handleAddTask(data)
          }
          setShowModal(false)
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
          setEditTask(selectedTask)
          setSelectedTask(null)
        }}
      />
    </AppLayout>
  )
}

export default Dashboard
