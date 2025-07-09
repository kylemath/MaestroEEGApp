# MAESTRO V2 Development Progress

## Project Overview
MAESTRO V2 is a web application for recording data from bluetooth wearable devices (EEG) and managing patient sessions.

## Current Status (Initial Assessment)
- **Frontend**: React app with Shopify Polaris UI
- **Backend**: Python Flask server
- **Data Storage**: CSV files in processing folder
- **Deployment**: Firebase configuration present

## Setup Progress

### Day 1 - Getting Started
**Date**: December 2024
**Goal**: Get the project running locally

#### Prerequisites Check
- [x] Node.js version 10.x (required for Muse interaction) - Installed 10.16.0 using n
- [x] Yarn package manager - Installed v1.22.22
- [ ] Python environment for backend
- [ ] Firebase CLI (for deployment)

#### Frontend Setup
- [x] Run `yarn install` to install dependencies - Completed with some peer dependency warnings
- [ ] Check for any dependency conflicts
- [x] Run `yarn start` to start development server - SUCCESS! Running on http://localhost:3000
- [x] Verify app opens at http://localhost:3000 - Server responding with HTTP 200

#### Backend Setup
- [x] Check Python requirements in `backend/requirements.txt` - Flask and Werkzeug
- [x] Set up virtual environment - Created in backend/venv
- [x] Install backend dependencies - Successfully installed Flask 3.1.1
- [x] Create missing template files - Added index.html and upload_form.html
- [x] Start Flask server - SUCCESS! Running on http://localhost:8080

#### Issues Encountered
- Node.js v23.10.0 was installed via Homebrew, had to use n to install v10.16.0
- Had to modify PATH to use n-managed Node version: `export PATH="/usr/local/bin:$PATH"`
- Some peer dependency warnings during yarn install (non-critical)
- Yarn initially detected wrong Node version (23.10.0) instead of 10.16.0
- PATH needs to be set in each new shell session
- Flask server was missing templates (index.html and upload_form.html)
- Server was returning JSON error messages instead of HTML pages

#### Solutions Applied
- Installed n (Node version manager) using npm
- Used n to install Node.js 10.16.0
- Modified PATH to prioritize n-managed Node version
- Installed yarn via Homebrew
- Set PATH before running yarn start: `export PATH="/usr/local/bin:$PATH" && yarn start`
- Created Python virtual environment in backend directory
- Created missing Flask templates: backend/templates/index.html and upload_form.html
- Restarted Flask server with templates in place
- **Added ENABLE_REMOTE_UPLOAD configuration flag to disable remote uploads temporarily**

#### Current Status
✅ **Frontend**: React app running on http://localhost:3000
✅ **Backend**: Flask server running on http://localhost:8080
✅ **File Upload**: Backend has working file upload functionality for CSV files
✅ **Data Storage**: Files are saved to backend/data/ directory
✅ **Remote Upload**: Disabled temporarily (configurable via ENABLE_REMOTE_UPLOAD flag)
✅ **Rebranding**: Application rebranded from "Entheosense/Voyage" to "MAESTRO"

## Recent Changes

### Rebranding to MAESTRO (Latest Session)
- **Updated subtitle**: Changed from "Voyage provides you with..." to "MAESTRO provides you with..."
- **Updated route**: Changed from `/voyage` to `/session`
- **Updated CSV filename**: Changed from `_VoyageRecording.csv` to `_MAESTRORecording.csv`
- **Updated logo alt text**: Changed from "EntheosenseLogo" to "MAESTROLogo"
- **Updated footer**: Changed from "Voyage - by" to "MAESTRO - Real-time EEG Monitoring"
- **Updated external link**: Removed link to entheosense.com (set to placeholder)
- **Updated session complete message**: Changed from "Entheosense Voyage" to "MAESTRO"
- **Updated page title**: Changed from "MAESTRO V2" to "MAESTRO - Real-time EEG Monitoring"

### Logo Files Ready for Update
- **Current logo files**: `src/components/App/logo_horizontal.png` and `logo_vertical.png`
- **Status**: Ready to be replaced with MAESTRO branded logos
- **Alt text**: Already updated to "MAESTROLogo"

## Backend Architecture Analysis

### Current Data Flow
```
[Muse Headband] → [React App] → [Local CSV Download] + [Remote Backend]
                                      ↓                        ↓
                                [User's Computer]      [data.entheosense.com]
```

### Backend Components
1. **Local Flask Server** (Development only)
   - URL: http://localhost:8080
   - Purpose: Local development/testing
   - Storage: backend/data/ directory
   - Status: ✅ Functional but not connected to frontend

2. **Remote Backend** (Production)
   - URL: https://data.entheosense.com/api/singleupload
   - Purpose: Production data storage
   - Status: ❓ Unknown (configured in frontend, not tested)

3. **Firebase Integration**
   - Current: Only hosting configuration (frontend deployment)
   - Backend services: ❌ None implemented
   - Database: ❌ Not using Firestore

### Data Storage
- **Local**: CSV files downloaded to user's computer
- **Remote**: Uploaded to data.entheosense.com endpoint (disabled)
- **Database**: ❌ No proper database integration

## Architecture Decisions Needed

### Option 1: Keep Current Remote Backend
- Continue using data.entheosense.com
- Test if remote endpoint is still functional
- Minimal changes needed

### Option 2: Replace with Local Backend
- Modify frontend to use local Flask server
- Keep CSV storage or upgrade to database
- Full local development control

### Option 3: Implement Firebase Backend
- Add Firebase Functions for data processing
- Use Firestore for data storage
- Integrate with existing Firebase hosting

### Option 4: Modern Database Integration
- Replace CSV with SQLite/PostgreSQL
- Add proper data modeling
- Implement RESTful API endpoints