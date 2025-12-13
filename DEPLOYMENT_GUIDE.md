# Deployment Guide for Veda AI Task Manager

This guide will walk you through deploying your full-stack task management application.

## Architecture Overview

Your app has two parts that need to be deployed:
1. **Frontend** (React + Vite) → Deploy to Vercel
2. **Backend** (Express + MongoDB) → Deploy to Render
3. **Database** → Already using MongoDB Atlas (cloud)

---

## Step 1: Deploy Backend to Render

### 1.1 Create a Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### 1.2 Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `veda-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: Free

### 1.3 Add Environment Variables
In the Render dashboard, add these environment variables:
\`\`\`
MONGODB_URI=mongodb+srv://ismail:ismail123@cluster0.t63ghmf.mongodb.net/veda-ai?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
\`\`\`

### 1.4 Deploy
Click **"Create Web Service"** and wait for deployment to complete.

**Copy your backend URL**: `https://veda-ai-backend-xxxx.onrender.com`

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create a Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### 2.2 Deploy Frontend
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.3 Add Environment Variables
In the Vercel dashboard, add this environment variable:
\`\`\`
VITE_API_URL=https://veda-ai-backend-xxxx.onrender.com/api
\`\`\`
(Replace with your actual Render backend URL)

### 2.4 Deploy
Click **"Deploy"** and wait for deployment to complete.

**Your app will be live at**: `https://your-app.vercel.app`

---

## Step 3: Update Backend CORS

Go back to your Render dashboard and update the `FRONTEND_URL` environment variable with your actual Vercel URL:
\`\`\`
FRONTEND_URL=https://your-app.vercel.app
\`\`\`

Then manually redeploy the backend service.

---

## Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Try creating a new task
3. Verify tasks are saved and fetched from the database

---

## Alternative: Deploy Backend to Railway

If you prefer Railway over Render:

1. Go to [railway.app](https://railway.app)
2. Sign up and create a new project
3. Click **"Deploy from GitHub repo"**
4. Select your repository
5. Add the same environment variables
6. Set the start command: `node server/index.js`
7. Deploy and copy your Railway URL

---

## Troubleshooting

### Tasks not saving
- Check that `VITE_API_URL` in Vercel matches your backend URL
- Check that `FRONTEND_URL` in Render/Railway matches your Vercel URL
- Look at the browser console for errors

### Backend not responding
- Verify MongoDB connection string is correct
- Check Render/Railway logs for errors
- Ensure the backend service is running

### CORS errors
- Make sure `FRONTEND_URL` environment variable is set correctly on the backend
- Verify the URL has no trailing slash

---

## Free Tier Limitations

**Render Free Tier:**
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds

**Vercel Free Tier:**
- Unlimited bandwidth for personal projects
- No sleep mode

**Railway Free Tier:**
- $5 free credit per month
- No sleep mode

---

## Production Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set on both platforms
- [ ] MongoDB connection working
- [ ] Tasks can be created and fetched
- [ ] CORS configured correctly
- [ ] Backend URL updated in frontend
- [ ] Frontend URL updated in backend

---

## Support

If you encounter issues:
1. Check the browser console for frontend errors
2. Check Render/Railway logs for backend errors
3. Verify all environment variables are set correctly
4. Test the backend health endpoint: `https://your-backend-url.onrender.com/api/health`
