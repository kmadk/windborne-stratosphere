# WindBorne Application Submission Template

Once your app is deployed, use this template for your application:

## Application JSON

```json
{
  "career_application": {
    "name": "YOUR_NAME",
    "email": "YOUR_EMAIL",
    "role": "Flight Team Web Developer",
    "notes": "Full-stack developer passionate about atmospheric science and real-time data visualization. I chose to integrate jet stream data because understanding atmospheric dynamics is crucial for optimizing balloon flight paths - jet streams can accelerate balloons to 200+ mph, dramatically affecting trajectory predictions and mission planning.",
    "submission_url": "YOUR_VERCEL_URL",
    "portfolio_url": "YOUR_VERCEL_URL",
    "resume_url": "YOUR_RESUME_URL"
  }
}
```

## Submit via cURL

Once you have all URLs ready:

```bash
curl -X POST https://windbornesystems.com/career_applications.json \
  -H "Content-Type: application/json" \
  -d '{
    "career_application": {
      "name": "YOUR_NAME",
      "email": "YOUR_EMAIL",
      "role": "Flight Team Web Developer",
      "notes": "Full-stack developer passionate about atmospheric science and real-time data visualization. I chose to integrate jet stream data because understanding atmospheric dynamics is crucial for optimizing balloon flight paths - jet streams can accelerate balloons to 200+ mph, dramatically affecting trajectory predictions and mission planning.",
      "submission_url": "YOUR_VERCEL_URL",
      "portfolio_url": "YOUR_VERCEL_URL",
      "resume_url": "YOUR_RESUME_URL"
    }
  }'
```

## What Your App Demonstrates

✅ **Technical Skills:**
- Real-time data fetching and error handling
- Serverless API design with Vercel functions
- Interactive map visualization with Leaflet
- Dynamic data updates (24-hour animation)
- CORS handling and API proxying

✅ **Scientific Understanding:**
- Jet stream visualization at correct latitudes
- Atmospheric layer representation
- Wind direction and speed indicators
- Balloon altitude distribution analysis

✅ **User Experience:**
- Clean, dark-themed UI
- Smooth animations
- Interactive balloon selection
- Real-time data updates
- Debug logging for transparency

## Before Submitting, Verify:

- [ ] App loads at your Vercel URL
- [ ] 1000+ balloons appear on map
- [ ] Jet streams are visible (purple and cyan lines)
- [ ] Time slider animates through 24 hours
- [ ] Click on balloons shows trajectory
- [ ] No console errors in browser
- [ ] Resume is uploaded somewhere public (Google Drive, Dropbox, etc.)

Good luck! 🚀
