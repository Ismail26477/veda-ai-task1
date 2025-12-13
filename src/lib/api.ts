const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

export interface Task {
  id?: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
  time: string
  location?: string
  category: "real-estate" | "digital-marketing" | "software-dev" | "loan" | "ai-services"
  status: "pending" | "in-progress" | "completed"
  createdAt?: string
  clientName?: string
  followUpDate?: string
  notes?: string
}

export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace("/api", "")}/api/health`, {
      method: "GET",
    })
    return response.ok
  } catch (error) {
    console.error("[v0] Backend server is not reachable:", error)
    return false
  }
}

export const api = {
  getTasks: async (): Promise<Task[]> => {
    console.log("[v0] Fetching tasks from:", `${API_BASE_URL}/tasks`)
    const response = await fetch(`${API_BASE_URL}/tasks`)
    if (!response.ok) {
      throw new Error("Failed to fetch tasks")
    }
    const tasks = await response.json()
    console.log("[v0] Fetched tasks:", tasks)
    return tasks
  },

  createTask: async (task: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    console.log("[v0] Creating task:", task)
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Failed to create task:", error)
      throw new Error("Failed to create task")
    }
    const newTask = await response.json()
    console.log("[v0] Task created successfully:", newTask)
    return newTask
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<void> => {
    console.log("[v0] Updating task:", id, updates)
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Failed to update task:", error)
      throw new Error("Failed to update task")
    }
    console.log("[v0] Task updated successfully")
  },

  deleteTask: async (id: string): Promise<void> => {
    console.log("[v0] Deleting task:", id)
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Failed to delete task:", error)
      throw new Error("Failed to delete task")
    }
    console.log("[v0] Task deleted successfully")
  },
}
