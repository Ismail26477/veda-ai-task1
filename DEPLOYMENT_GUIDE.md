# Deployment Guide for Veda AI Task Manager

This guide will walk you through deploying your full-stack task management application.

## Architecture Overview

Your app has two parts that need to be deployed:
1. **Frontend** (React + Vite) → Deploy to Vercel
2. **Backend** (Express + MongoDB) → Deploy to Render
3. **Database** → Already using MongoDB Atlas (cloud) ✅

---

## 🔒 IMPORTANT SECURITY NOTE

**Your MongoDB password has been exposed publicly. Please change it immediately:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to Database Access
3. Edit user `ismail` and change the password
4. Update the connection string below with the new password

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
   - **Root Directory**: Leave blank (or `.` if prompted)
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: Free

### 1.3 Add Environment Variables
In the Render dashboard, add these environment variables:
\`\`\`
MONGODB_URI=mongodb+srv://ismail:YOUR_NEW_PASSWORD@cluster0.t63ghmf.mongodb.net/veda-ai?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
\`\`\`

**Note**: You'll update `FRONTEND_URL` after deploying the frontend in Step 3.

### 1.4 Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment to complete
3. **Copy your backend URL**: `https://veda-ai-backend-xxxx.onrender.com`

### 1.5 Test Backend
Visit: `https://veda-ai-backend-xxxx.onrender.com/api/health`

You should see: `{"status":"ok","message":"Server is running"}`

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
In the Vercel project settings, add this environment variable:
\`\`\`
VITE_API_URL=https://veda-ai-backend-xxxx.onrender.com/api
\`\`\`
**Replace `xxxx` with your actual Render backend URL from Step 1.4**

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment to complete
3. **Your app will be live at**: `https://your-app-name.vercel.app`

---

## Step 3: Update Backend CORS

Now that you have your Vercel URL, go back to your Render dashboard:

1. Navigate to your `veda-ai-backend` service
2. Go to **"Environment"** section
3. Update the `FRONTEND_URL` variable with your actual Vercel URL:
   \`\`\`
   FRONTEND_URL=https://your-app-name.vercel.app
   \`\`\`
4. Click **"Save Changes"**
5. The backend will automatically redeploy (takes 1-2 minutes)

---

## Step 4: Test Your Deployment

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Sign up for a new account
3. Try creating a new task
4. Verify tasks are saved and appear when you refresh the page

**If tasks don't save**: Check the browser console (F12) for errors

---

## Alternative: Deploy Backend to Railway

If you prefer Railway over Render:

### Railway Deployment
1. Go to [railway.app](https://railway.app)
2. Sign up and click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Add environment variables in the **"Variables"** tab:
   \`\`\`
   MONGODB_URI=mongodb+srv://ismail:YOUR_PASSWORD@cluster0.t63ghmf.mongodb.net/veda-ai?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   \`\`\`
6. In **"Settings"** → **"Deploy"**:
   - **Start Command**: `node server/index.js`
7. Click **"Deploy"**
8. Copy your Railway URL (looks like: `https://veda-ai-backend.up.railway.app`)

Then follow Step 2 (Vercel) and use your Railway URL as the `VITE_API_URL`.

---

## Troubleshooting

### Tasks not saving or loading
**Symptoms**: Tasks disappear after refresh, or you see "Failed to fetch" errors

**Solutions**:
1. Open browser console (F12) and check for errors
2. Verify `VITE_API_URL` in Vercel matches your backend URL exactly
3. Check that `FRONTEND_URL` in Render/Railway matches your Vercel URL exactly
4. Make sure there are NO trailing slashes in the URLs
5. Test backend health: `https://your-backend-url.onrender.com/api/health`

### Backend not responding (504 errors)
**Symptoms**: First request takes 30-60 seconds, then works fine

**Cause**: Render free tier spins down after 15 minutes of inactivity

**Solutions**:
- This is normal for free tier - first request "wakes up" the server
- Consider upgrading to paid tier ($7/month) for always-on service
- Or use Railway which doesn't spin down (uses credit-based pricing)

### CORS errors
**Symptoms**: Browser console shows "CORS policy" errors

**Solutions**:
- Verify `FRONTEND_URL` environment variable is set correctly on backend
- Make sure the URL has NO trailing slash
- Check that the backend redeployed after changing the variable
- Clear browser cache and try again

### MongoDB connection errors
**Symptoms**: Backend logs show "MongoNetworkError" or "Authentication failed"

**Solutions**:
- Verify your MongoDB Atlas cluster is running
- Check that the password in `MONGODB_URI` is correct (you may need to change it after public exposure)
- Ensure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0) in Network Access

### Build failures on Vercel
**Symptoms**: Deployment fails during build

**Solutions**:
- Check that all dependencies are in `package.json`
- Verify `VITE_API_URL` is set before building
- Look at the build logs for specific error messages

---

## Free Tier Limitations

### Render Free Tier
- ✅ Unlimited hours
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ✅ 750 hours/month (more than enough)

### Vercel Free Tier
- ✅ Unlimited personal projects
- ✅ 100 GB bandwidth/month
- ✅ No sleep mode
- ✅ Automatic HTTPS

### Railway Free Tier
- ⚠️ $5 free credit per month (~500 hours)
- ✅ No sleep mode
- ✅ Credit resets monthly

### MongoDB Atlas Free Tier (M0)
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ No credit card required

---

## Production Checklist

Before going live, verify:

- [ ] Changed MongoDB password after public exposure
- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel
- [ ] `MONGODB_URI` set on backend (Render/Railway)
- [ ] `NODE_ENV=production` set on backend
- [ ] `FRONTEND_URL` set on backend with correct Vercel URL
- [ ] `VITE_API_URL` set on frontend (Vercel) with correct backend URL
- [ ] Backend health check working: `/api/health`
- [ ] Can sign up and login
- [ ] Tasks can be created, edited, and deleted
- [ ] Tasks persist after page refresh
- [ ] No CORS errors in browser console

---

## URLs Summary

After deployment, you'll have these URLs:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `https://your-app.vercel.app` | User-facing app |
| Backend | `https://veda-ai-backend-xxxx.onrender.com` | API server |
| Backend Health | `https://veda-ai-backend-xxxx.onrender.com/api/health` | Check if backend is running |
| MongoDB | `cluster0.t63ghmf.mongodb.net` | Database |

---

## Next Steps After Deployment

1. **Custom Domain** (Optional): Add a custom domain in Vercel settings
2. **Monitoring**: Set up error tracking with Sentry or LogRocket
3. **Analytics**: Add Google Analytics or Plausible
4. **Email Notifications**: Add email verification using SendGrid or Resend
5. **Backups**: Set up MongoDB Atlas automated backups

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Railway Docs**: https://docs.railway.app

If you encounter issues not covered here, check:
1. Browser console (F12) for frontend errors
2. Render/Railway logs for backend errors  
3. MongoDB Atlas monitoring for database issues

---

## Cost Estimates (If You Upgrade)

| Service | Free Tier | Paid Tier | Best For |
|---------|-----------|-----------|----------|
| Render | Free (with spin-down) | $7/month (always-on) | Production apps |
| Railway | $5 credit/month | Pay-as-you-go (~$5-10/month) | Active apps |
| Vercel | Free forever | $20/month (team features) | Hobby/personal projects |
| MongoDB Atlas | 512 MB free | $9/month (2 GB, dedicated) | Growing databases |

**Total for production**: $0-$20/month depending on needs
</automated_v0_instructions_reminder>
