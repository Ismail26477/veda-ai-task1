"use client"

import { useState, useEffect } from "react"
import type { Task, BusinessCategory } from "@/types/task"
import { api, checkServerConnection } from "@/lib/api"

const STORAGE_KEY = "veda-ai-tasks"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
    checkConnection()
  }, [])

  const checkConnection = async () => {
    const isConnected = await checkServerConnection()
    if (!isConnected) {
      console.error("[v0] ⚠️ Backend server is not running! Please start it with: npm run server")
    } else {
      console.log("[v0] ✅ Backend server is running")
    }
  }

  const fetchTasks = async () => {
    try {
      console.log("[v0] Fetching tasks...")
      setIsLoading(true)
      const fetchedTasks = await api.getTasks()
      console.log("[v0] Tasks fetched successfully:", fetchedTasks.length)
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("[v0] Error fetching tasks:", error)
      console.error("[v0] 🔴 Make sure the backend server is running on http://localhost:3001")
      console.error("[v0] Run: npm run server (or npm start to run both servers)")
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    try {
      console.log("[v0] Adding new task...")
      const newTask = await api.createTask(task)
      console.log("[v0] Task added successfully:", newTask)
      setTasks([...tasks, newTask])
      return newTask
    } catch (error) {
      console.error("[v0] Error adding task:", error)
      console.error("[v0] 🔴 Make sure the backend server is running on http://localhost:3001")
      throw error
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      console.log("[v0] Updating task:", id)
      await api.updateTask(id, updates)
      const updated = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
      setTasks(updated)
      console.log("[v0] Task updated in state")
    } catch (error) {
      console.error("[v0] Error updating task:", error)
      console.error("[v0] 🔴 Make sure the backend server is running on http://localhost:3001")
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      console.log("[v0] Deleting task:", id)
      await api.deleteTask(id)
      setTasks(tasks.filter((task) => task.id !== id))
      console.log("[v0] Task deleted from state")
    } catch (error) {
      console.error("[v0] Error deleting task:", error)
      console.error("[v0] 🔴 Make sure the backend server is running on http://localhost:3001")
      throw error
    }
  }

  const getTasksByDate = (date: string) => {
    return tasks.filter((task) => task.dueDate === date)
  }

  const getTasksByCategory = (category: BusinessCategory) => {
    return tasks.filter((task) => task.category === category)
  }

  const getTodayTasks = () => {
    const today = new Date().toISOString().split("T")[0]
    return tasks.filter((task) => task.dueDate === today)
  }

  const getOverdueTasks = () => {
    const today = new Date().toISOString().split("T")[0]
    return tasks.filter((task) => task.dueDate < today && task.status !== "completed")
  }

  const getUpcomingTasks = () => {
    const today = new Date().toISOString().split("T")[0]
    return tasks.filter((task) => task.dueDate > today).sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }

  const getStats = () => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "completed").length
    const pending = tasks.filter((t) => t.status === "pending").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length

    const byCategory = {
      "real-estate": tasks.filter((t) => t.category === "real-estate").length,
      "digital-marketing": tasks.filter((t) => t.category === "digital-marketing").length,
      "software-dev": tasks.filter((t) => t.category === "software-dev").length,
      loan: tasks.filter((t) => t.category === "loan").length,
    }

    return { total, completed, pending, inProgress, byCategory }
  }

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    getTasksByDate,
    getTasksByCategory,
    getTodayTasks,
    getOverdueTasks,
    getUpcomingTasks,
    getStats,
  }
}
