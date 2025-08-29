# Deployment Guide for WindBorne StratoSphere

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

### Step 3: Add Your Resume

**Option 1: Add to Repository (Recommended)**
```bash
# Add your resume.pdf to the root directory
cp ~/path/to/your/resume.pdf ./resume.pdf
git add resume.pdf
git commit -m "Add resume"
git push
# Your resume URL: https://your-app.vercel.app/resume.pdf
```

**Option 2: Google Drive**
1. Upload resume to Google Drive
2. Right-click → "Get link"
3. Set to "Anyone with the link can view"
4. Use that URL in your submission

**Option 3: Dropbox**
1. Upload to Dropbox
2. Create shared link
3. Change `?dl=0` to `?raw=1` in the URL
4. Use that URL in your submission

### Step 4: Test Your Deployment

Visit your deployed URL and verify:
- Map loads with balloons
- Jet streams are visible
- Time slider works
- Animation plays smoothly
- 24 hours of data loads

## Prepare Your Application

Once deployed, prepare these URLs for your WindBorne application:

```json
{
  "career_application": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "role": "Flight Team Web Developer",
    "notes": "Full-stack developer with expertise in real-time data visualization and atmospheric science applications. I integrated jet stream analysis to demonstrate how atmospheric dynamics affect balloon trajectories - understanding these patterns is critical for flight path optimization as jet streams can accelerate balloons to over 200 mph.",
    "submission_url": "https://your-app.vercel.app",
    "portfolio_url": "https://your-app.vercel.app",
    "resume_url": "https://your-app.vercel.app/resume.pdf"
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

## Final Checklist

Before submitting:
- [ ] App is publicly accessible
- [ ] All 24 hours of data load
- [ ] Jet streams are visible
- [ ] Map interactions work
- [ ] No console errors
- [ ] Resume is accessible

## Troubleshooting

**If deployment fails:**
- Check that all files are committed
- Verify API functions are in `/api` directory
- Ensure `vercel.json` is present

**If data doesn't load:**
- Check browser console for errors
- Verify API endpoints are accessible
- Test: `https://your-app.vercel.app/api/windborne/00`

Good luck with your application!