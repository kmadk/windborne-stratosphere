# 🚀 Deployment Guide for WindBorne StratoSphere

## Quick Deploy to Vercel

### Step 1: Push to GitHub

1. **Create a new repository on GitHub:**

   - Go to https://github.com/new
   - Name it: `windborne-stratosphere`
   - Keep it public
   - Don't initialize with README (we already have one)

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/windborne-stratosphere.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel:**

   - Visit https://vercel.com
   - Sign up/login with GitHub

2. **Import your project:**

   - Click "Add New Project"
   - Import your `windborne-stratosphere` repository
   - Click "Deploy"
   - No configuration needed - everything is set up!

3. **Wait for deployment (1-2 minutes)**
   - Vercel will build and deploy automatically
   - You'll get a URL like: `windborne-stratosphere.vercel.app`

### Step 3: Test Your Deployment

Visit your deployed URL and verify:

- ✅ Map loads with balloons
- ✅ Jet streams are visible
- ✅ Time slider works
- ✅ Animation plays smoothly
- ✅ 24 hours of data loads

## 📝 Prepare Your Application

Once deployed, prepare these URLs for your WindBorne application:

```json
{
  "career_application": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "role": "Flight Team Web Developer",
    "notes": "Full-stack developer passionate about atmospheric science. I chose jet stream data integration to demonstrate how WindBorne's balloon constellation interacts with global atmospheric dynamics, providing insights into optimal flight paths and weather pattern analysis.",
    "submission_url": "https://your-app.vercel.app",
    "portfolio_url": "https://your-app.vercel.app",
    "resume_url": "https://your-resume-url.com"
  }
}
```

## Alternative: Deploy with Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: windborne-stratosphere
# - Directory: ./
# - Override settings: No
```

## 🎯 Final Checklist

Before submitting:

- [ ] App is publicly accessible
- [ ] All 24 hours of data load
- [ ] Jet streams are visible
- [ ] Map interactions work
- [ ] No console errors
- [ ] Mobile responsive (bonus!)

## Need Help?

Common issues:

- **CORS errors**: Should be fixed with Vercel functions
- **Data not loading**: Check browser console
- **Deploy failed**: Check Vercel logs

Good luck with your application! 🚀
