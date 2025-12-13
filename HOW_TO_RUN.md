# How to Run the Application

## The Problem You're Experiencing

Your application requires **TWO servers** to run:
1. **Backend API Server** (Express on port 3001) - handles database operations
2. **Frontend Dev Server** (Vite on port 5173) - serves the React app

The error `ERR_CONNECTION_REFUSED` means the backend server is **NOT running**.

## Solution: Start Both Servers

### Option 1: Run Both Servers Together (Recommended)
\`\`\`bash
npm start
\`\`\`
This command runs both the backend and frontend servers simultaneously.

### Option 2: Run Servers Separately (In Two Terminals)

**Terminal 1 - Backend Server:**
\`\`\`bash
npm run server
\`\`\`
You should see:
\`\`\`
✅ Connected to MongoDB successfully
📦 Using database: veda-ai
✅ Indexes created successfully
🚀 Server running on http://localhost:3001
📍 API endpoints available at http://localhost:3001/api
\`\`\`

**Terminal 2 - Frontend Dev Server:**
\`\`\`bash
npm run dev
\`\`\`
You should see:
\`\`\`
VITE v5.x.x ready in XXX ms
➜ Local: http://localhost:5173/
\`\`\`

## Verifying Everything Works

1. Open http://localhost:3001/api/health in your browser
   - Should show: `{"status":"ok","message":"Server is running"}`

2. Open http://localhost:5173 in your browser
   - Your app should load without errors

3. Try creating a task - it should save to MongoDB

## Troubleshooting

### If Backend Server Won't Start
- **Check MongoDB connection**: Ensure your MongoDB credentials in `server/index.js` are correct
- **Check port 3001**: Make sure nothing else is using port 3001
  \`\`\`bash
  # On Mac/Linux
  lsof -i :3001
  
  # On Windows
  netstat -ano | findstr :3001
  \`\`\`

### If Tasks Still Don't Save
1. Open browser DevTools Console (F12)
2. Check for error messages
3. Verify API calls are going to `http://localhost:3001/api/tasks`

### Database Issues
If you need to seed the database with sample data:
\`\`\`bash
npm run seed
\`\`\`

## Architecture Overview

\`\`\`
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│            localhost:5173               │
│                                         │
│  - UI Components                        │
│  - React Router                         │
│  - useTasks Hook                        │
└───────────────┬─────────────────────────┘
                │
                │ HTTP Requests
                │ (fetch API calls)
                │
┌───────────────▼─────────────────────────┐
│      Backend (Express Server)           │
│           localhost:3001                │
│                                         │
│  - REST API Endpoints                   │
│  - /api/tasks (GET, POST)               │
│  - /api/tasks/:id (PUT, DELETE)         │
└───────────────┬─────────────────────────┘
                │
                │ MongoDB Driver
                │
┌───────────────▼─────────────────────────┐
│         MongoDB Database                │
│      (Cloud: MongoDB Atlas)             │
│                                         │
│  - veda-ai database                     │
│  - tasks collection                     │
└─────────────────────────────────────────┘
\`\`\`

## Important Notes

- **Both servers must be running** for the app to work
- The frontend makes API calls to the backend
- The backend connects to MongoDB to store tasks
- If you see connection errors, the backend is not running
