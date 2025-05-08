# Bright Prodigy Tools (BPTAPPV5)

A complete React-based web application for managing customer submissions, scheduling, and quote tools for Bright Prodigy lighting installation services.

## Project Overview

This application is a modernized version of the BPT webapp, rebuilt with React for the frontend and Express for the backend. It's designed to be deployed to Google Cloud Run and offers the following features:

- Customer submission management
- Scheduling and calendar integration with Google Calendar
- Quote tool functionality
- Dashboard with overview statistics
- Technician management
- Mobile-responsive design

## Tech Stack

- **Frontend**: React 18, Material-UI, React Router
- **Backend**: Node.js, Express
- **APIs**: Google Sheets API, Google Calendar API
- **Deployment**: Docker, Google Cloud Run

## Project Structure

```
BPTAPPV5/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/                # Source files
│       ├── components/     # React components
│       ├── App.js          # Main application component
│       └── index.js        # Entry point
├── server/                 # Express backend
│   ├── server.js           # Main server file
│   ├── routes/             # API routes
│   └── services/           # Service integrations (Google APIs)
├── Dockerfile              # Docker configuration
├── cloudbuild.yaml         # Google Cloud Build configuration
├── service.yaml            # Google Cloud Run service configuration
└── README.md               # Documentation
```

## Local Development Setup

### Prerequisites

- Node.js 16+ and npm
- Google Cloud SDK (for deployment)

### Installation

1. Clone the repository
2. Install dependencies for both client and server:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add the required environment variables (see Configuration section)

4. Start the development servers:

```bash
# Start backend server
cd server
npm run dev

# In another terminal, start frontend development server
cd client
npm start
```

The application will be available at http://localhost:3000 with the API server running on http://localhost:8080.

## Configuration

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```
# Server Configuration
PORT=8080
NODE_ENV=development

# Google API Configuration
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
GOOGLE_SHEETS_ID=your-google-sheets-id
GOOGLE_CALENDAR_ID=your-google-calendar-id
```

### Google API Setup

1. Create a Google Cloud project
2. Enable the Google Sheets API and Google Calendar API
3. Create a service account with appropriate permissions
4. Download the service account key JSON file
5. Set the path to this file in your `.env` file

## Deployment to Google Cloud Run

### Prerequisites

- Google Cloud SDK installed and configured
- Docker installed (for local testing)
- Access to Google Cloud project with appropriate permissions
- Artifact Registry repository created

### Automatic Deployment with Cloud Build

1. Set up your Google Cloud project and enable required APIs:

```bash
# Set your project ID
export PROJECT_ID=your-project-id

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# Create Artifact Registry repository - THIS STEP IS REQUIRED BEFORE DEPLOYMENT
gcloud artifacts repositories create prod-images --repository-format=docker --location=us-west2 --description="Production images repository"
```

2. Update the substitution variables in `cloudbuild.yaml` if needed:

```yaml
substitutions:
  _REGION: us-west2               # Change to your preferred region
  _REPOSITORY: bpt-app-repo       # Change if you used a different repository name
```

3. Trigger a build and deployment:

```bash
# From the repository root
gcloud builds submit --config=cloudbuild.yaml
```

The Cloud Build configuration will automatically:
- Build the Docker container
- Push the image to Artifact Registry
- Deploy the container to Cloud Run

### Manual Deployment

If you prefer to deploy manually:

1. Build and tag the Docker image locally (requires Docker installed):

```bash
docker build -t us-west2-docker.pkg.dev/brightprodigyapp/prod-images/bright-prodigy-app:latest .
```

2. Push the image to Artifact Registry:

```bash
docker push us-west2-docker.pkg.dev/brightprodigyapp/prod-images/bright-prodigy-app:latest
```

3. Deploy to Cloud Run:

```bash
gcloud run deploy bright-prodigy-app \
  --image us-west2-docker.pkg.dev/brightprodigyapp/prod-images/bright-prodigy-app:latest \
  --platform managed \
  --region us-west2 \
  --allow-unauthenticated \
  --memory 512Mi \
  --set-env-vars NODE_ENV=production
```

### Monitoring and Logs

After deployment, you can monitor your service and view logs:

```bash
# View service status
gcloud run services describe bright-prodigy-app --region us-west2

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=bright-prodigy-app" --limit=50
```

### Troubleshooting Deployment Issues

If you encounter deployment issues:

1. Check build logs in Cloud Build:
   - Go to Google Cloud Console → Cloud Build → History
   - Click on the latest build to view detailed logs

2. Common issues and solutions:
   - **Permission issues**: Ensure your Cloud Build service account has the correct permissions
   - **Missing APIs**: Ensure all required APIs are enabled
   - **Build failures**: Check the Dockerfile for errors or incompatibilities
   - **Deployment failures**: Verify service account permissions for Cloud Run

## Environment Variables for Google Cloud Run

When deploying to Google Cloud Run, set the following environment variables:

- `NODE_ENV=production`
- `PORT=8080`

For Google API authentication, you have two options:
1. Use a service account linked to your Cloud Run service
2. Store your credentials in Secret Manager and mount them as a volume

## License

All rights reserved. This codebase is proprietary to SSC LLC doing business as Bright Prodigy.
