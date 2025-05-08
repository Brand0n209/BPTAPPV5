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
- Docker installed
- Access to Google Cloud project with appropriate permissions

### Steps

1. Build and push the Docker image:

```bash
# Authenticate with Google Cloud
gcloud auth login

# Configure Docker to use gcloud as a credential helper
gcloud auth configure-docker

# Build and push the image
gcloud builds submit --config=cloudbuild.yaml
```

2. Deploy to Cloud Run:

```bash
gcloud run deploy --image gcr.io/YOUR_PROJECT_ID/bptappv5:latest --platform managed
```

Alternatively, you can use the automated CI/CD pipeline by pushing to your repository and letting Cloud Build handle the deployment.

## Environment Variables for Google Cloud Run

When deploying to Google Cloud Run, set the following environment variables:

- `NODE_ENV=production`
- `PORT=8080`

For Google API authentication, you have two options:
1. Use a service account linked to your Cloud Run service
2. Store your credentials in Secret Manager and mount them as a volume

## License

All rights reserved. This codebase is proprietary to SSC LLC doing business as Bright Prodigy.
