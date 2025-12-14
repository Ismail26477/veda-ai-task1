import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"

const app = express()
const PORT = process.env.PORT || 3001

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ismail:ismail123@cluster0.t63ghmf.mongodb.net/veda-ai?retryWrites=true&w=majority&appName=Cluster0"
const DATABASE_NAME = "veda-ai"
const COLLECTION_NAME = "tasks"

let db
let tasksCollection

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("✅ Connected to MongoDB successfully")
    console.log(`📦 Using database: ${DATABASE_NAME}`)

    db = client.db(DATABASE_NAME)
    tasksCollection = db.collection(COLLECTION_NAME)

    // Create indexes for better performance
    await tasksCollection.createIndex({ dueDate: 1 })
    await tasksCollection.createIndex({ category: 1 })
    await tasksCollection.createIndex({ status: 1 })

    console.log("✅ Indexes created successfully")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)

      const allowedOrigins = [
        process.env.FRONTEND_URL || "https://veda-ai-task1-kgkf.vercel.app",
        "http://localhost:5173", // Vite dev server
        "http://localhost:3000", // Next.js dev server
      ]

      // Remove trailing slashes for comparison
      const normalizedOrigin = origin.replace(/\/$/, "")
      const normalizedAllowed = allowedOrigins.map((o) => o.replace(/\/$/, ""))

      if (normalizedAllowed.includes(normalizedOrigin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }),
)
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "Veda AI Task Manager API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      tasks: "/api/tasks",
    },
  })
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await tasksCollection.find({}).toArray()
    // Convert _id to id for frontend compatibility
    const formattedTasks = tasks.map((task) => ({
      ...task,
      id: task._id.toString(),
      _id: undefined,
    }))
    res.json(formattedTasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    res.status(500).json({ error: "Failed to fetch tasks" })
  }
})

app.post("/api/tasks", async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdAt: new Date().toISOString(),
    }

    const result = await tasksCollection.insertOne(taskData)
    const newTask = {
      ...taskData,
      id: result.insertedId.toString(),
    }

    res.status(201).json(newTask)
  } catch (error) {
    console.error("Error creating task:", error)
    res.status(500).json({ error: "Failed to create task" })
  }
})

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Remove id from updates to prevent overwriting
    delete updates.id
    delete updates._id

    const result = await tasksCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates })

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json({ success: true })
  } catch (error) {
    console.error("Error updating task:", error)
    res.status(500).json({ error: "Failed to update task" })
  }
})

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params

    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    res.status(500).json({ error: "Failed to delete task" })
  }
})

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📍 API endpoints available at http://localhost:${PORT}/api`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  })
})
