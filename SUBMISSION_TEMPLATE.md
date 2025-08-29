# WindBorne Application Submission Template

## Application JSON Format

```json
{
  "career_application": {
    "name": "YOUR_NAME",
    "email": "YOUR_EMAIL",
    "role": "Flight Team Web Developer",
    "notes": "Full-stack developer with expertise in real-time data visualization and atmospheric science applications. I integrated jet stream analysis to demonstrate how atmospheric dynamics affect balloon trajectories - understanding these patterns is critical for flight path optimization as jet streams can accelerate balloons to over 200 mph.",
    "submission_url": "YOUR_VERCEL_URL",
    "portfolio_url": "YOUR_VERCEL_URL",
    "resume_url": "YOUR_RESUME_URL"
  }
}
```

## Submission Command

```bash
curl -X POST https://windbornesystems.com/career_applications.json \
  -H "Content-Type: application/json" \
  -d '{
    "career_application": {
      "name": "YOUR_NAME",
      "email": "YOUR_EMAIL",
      "role": "Flight Team Web Developer",
      "notes": "Full-stack developer with expertise in real-time data visualization and atmospheric science applications. I integrated jet stream analysis to demonstrate how atmospheric dynamics affect balloon trajectories - understanding these patterns is critical for flight path optimization as jet streams can accelerate balloons to over 200 mph.",
      "submission_url": "YOUR_VERCEL_URL",
      "portfolio_url": "YOUR_VERCEL_URL",
      "resume_url": "YOUR_RESUME_URL"
    }
  }'
```

## Technical Capabilities Demonstrated

### Core Requirements
- Real-time data fetching from WindBorne API
- Robust error handling for corrupted data
- Dynamic updates with 24-hour data history
- Interactive web application with live data

### Additional Features
- Serverless API architecture with Vercel
- CORS handling through proxy functions
- Interactive map visualization with Leaflet
- Data validation and quality metrics
- Time-series animation controls
- Atmospheric jet stream integration

### Engineering Practices
- Clean, maintainable code structure
- Error resilience and data validation
- Performance optimization for 1000+ data points
- Responsive design and smooth animations

## Pre-Submission Checklist

- [ ] Application loads at Vercel URL
- [ ] 1000+ balloons display on map
- [ ] Jet streams render correctly
- [ ] Time slider functions properly
- [ ] Animation plays smoothly
- [ ] Balloon selection shows trajectory
- [ ] No console errors present
- [ ] Resume uploaded to public URL
- [ ] All form fields completed

## Expected Response

Status 200 indicates successful submission.
Any other status code means the submission was not accepted - check response body for details.