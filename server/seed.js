import { MongoClient } from "mongodb"

const MONGODB_URI = "mongodb+srv://ismail:ismail123@cluster0.t63ghmf.mongodb.net/?appName=Cluster0"
const DATABASE_NAME = "veda-ai"
const COLLECTION_NAME = "tasks"

const seedTasks = [
  {
    title: "Property viewing at Green Valley",
    description: "Meet with client to show 3BHK apartment",
    priority: "high",
    dueDate: new Date().toISOString().split("T")[0],
    time: "10:00",
    location: "Green Valley Township, Sector 45",
    category: "real-estate",
    status: "pending",
    createdAt: new Date().toISOString(),
    clientName: "Rajesh Kumar",
  },
  {
    title: "Facebook Ads Campaign Review",
    description: "Analyze Q4 campaign performance and prepare report",
    priority: "medium",
    dueDate: new Date().toISOString().split("T")[0],
    time: "14:00",
    category: "digital-marketing",
    status: "in-progress",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Sprint Planning Meeting",
    description: "Plan next sprint with development team",
    priority: "high",
    dueDate: new Date().toISOString().split("T")[0],
    time: "11:00",
    category: "software-dev",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Loan Application Follow-up",
    description: "Follow up on pending home loan application",
    priority: "medium",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "15:00",
    category: "loan",
    status: "pending",
    createdAt: new Date().toISOString(),
    clientName: "Priya Sharma",
    followUpDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
  },
  {
    title: "Website SEO Audit",
    description: "Complete SEO audit for client website",
    priority: "low",
    dueDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    time: "09:00",
    category: "digital-marketing",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Client Property Documentation",
    description: "Prepare and verify all property documents for new client",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "16:00",
    location: "Office",
    category: "real-estate",
    status: "pending",
    createdAt: new Date().toISOString(),
    clientName: "Amit Verma",
  },
  {
    title: "AI Chatbot Development Review",
    description: "Review progress on customer service AI chatbot",
    priority: "medium",
    dueDate: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    time: "13:00",
    category: "software-dev",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(DATABASE_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Clear existing data
    await collection.deleteMany({})
    console.log("Cleared existing tasks")

    // Insert seed data
    const result = await collection.insertMany(seedTasks)
    console.log(`${result.insertedCount} tasks inserted successfully`)
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
    console.log("Database connection closed")
  }
}

seedDatabase()
