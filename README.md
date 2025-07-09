# MAESTRO V2 - Real-time EEG Monitoring

**Author**: Kyle Mathewson  
**Version**: 3.1.0

MAESTRO V2 is a web application for recording and analyzing real-time EEG data from Muse headbands. The application provides real-time visualization of brain activity, heart rate monitoring, and comprehensive data logging capabilities.

## Table of Contents
- [Features](#features)
- [CSV Data Structure](#csv-data-structure)
- [Installation](#installation)
- [Local Development](#local-development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Deployed Addresses](#deployed-addresses)
- [Contributing](#contributing)

## Features

- **Real-time EEG Visualization**: Live frequency band analysis (Delta, Theta, Alpha, Beta, Gamma)
- **Heart Rate Monitoring**: PPG-based heart rate calculation with live display
- **Event Logging**: Button-based event marking for research protocols
- **3-Minute Recording**: Automated 3-minute recording sessions with countdown timer
- **Data Export**: Comprehensive CSV data export with all sensor streams
- **Session Management**: Patient information tracking and session completion

## CSV Data Structure

The application exports data to CSV files with the following structure:

### File Naming Convention
```
patientID[ID]_age[AGE]_gender[GENDER]_weight[WEIGHT]_substance[SUBSTANCE]_dosage[DOSAGE]_dosageTime[TIME]_time[TIMESTAMP]_MAESTRORecording.csv
```

### Column Structure

#### Header Row
```csv
type,timestamp,gyroX,gyroY,gyroZ,accelerometerX,accelerometerY,accelerometerZ,ppg1_ambient,ppg2_infrared,ppg3_red,event,e1_0,e1_1,e1_2,...
```

#### Data Types and Fields

**1. Metadata Fields**
- `type`: Data stream type (`eeg`, `ppg`, `gyro`, `accelerometer`, `event`)
- `timestamp`: Unix timestamp in seconds (e.g., `1752090350.543`)

**2. Gyroscope Data** (`gyro` type)
- `gyroX`: X-axis rotation (radians/second)
- `gyroY`: Y-axis rotation (radians/second)  
- `gyroZ`: Z-axis rotation (radians/second)
- *Other columns empty for gyro data*

**3. Accelerometer Data** (`accelerometer` type)
- `accelerometerX`: X-axis acceleration (g-force)
- `accelerometerY`: Y-axis acceleration (g-force)
- `accelerometerZ`: Z-axis acceleration (g-force)
- *Other columns empty for accelerometer data*

**4. PPG Data** (`ppg` type)
- `ppg1_ambient`: Ambient light sensor reading
- `ppg2_infrared`: Infrared LED sensor reading
- `ppg3_red`: Red LED sensor reading (used for heart rate calculation)
- *Other columns empty for PPG data*

**5. Event Data** (`event` type)
- `event`: Event description/label
  - `3MIN_RECORDING_START`: 3-minute recording session started
  - `3MIN_RECORDING_END`: 3-minute recording completed naturally
  - `3MIN_RECORDING_END_MANUAL`: 3-minute recording stopped manually
  - `3MIN_TICK_N`: Second-by-second tick during 3-minute recording (N = 1-180)
  - `LOSS OF CONSCIOUSNESS`: Patient lost consciousness (button press)
  - `RE-GAIN CONSCIOUSNESS`: Patient regained consciousness (button press)
  - `EYES OPEN`: Patient opened eyes (button press)
  - `EYES CLOSED`: Patient closed eyes (button press)
  - Custom event text (entered by user)
- *Other columns empty for event data*

**6. EEG Data** (`eeg` type)
- `e1_0` through `e1_N`: Electrode 1 (TP9) frequency bins
- `e2_0` through `e2_N`: Electrode 2 (AF7) frequency bins
- `e3_0` through `e3_N`: Electrode 3 (AF8) frequency bins
- `e4_0` through `e4_N`: Electrode 4 (TP10) frequency bins
- `e5_0` through `e5_N`: Electrode 5 (AUX) frequency bins

#### EEG Frequency Binning
- **Low frequencies (≤30 Hz)**: Individual 1 Hz bins
- **High frequencies (>30 Hz)**: Groups of 4 bins averaged together
- **Total bins**: ~140 frequency bins per electrode (0-128 Hz range)
- **Sampling rate**: 256 Hz with 512-point FFT

### Sample Data Rows

```csv
type,timestamp,gyroX,gyroY,gyroZ,accelerometerX,accelerometerY,accelerometerZ,ppg1_ambient,ppg2_infrared,ppg3_red,event,e1_0,e1_1,e1_2,...
gyro,1752090350.475,0.628,2.243,-0.037,,,,,,,,,,,,...
accelerometer,1752090350.478,,,-0.989,-0.083,0.018,,,,,,,,,,...
ppg,1752090481.575,,,,,,,90163,119067,972,,,,,,...
event,1752090362.157,,,,,,,,,,3MIN_RECORDING_START,,,,...
eeg,1752090350.543,,,,,,,,,,,94.75,37.93,23.00,41.31,...
```

## Installation

### Prerequisites

#### Required Software
- **Node.js**: Version 10.x (required for Muse interaction)
- **Yarn**: Package manager
- **Python**: 3.7+ (for backend server)
- **Git**: For repository management

#### Installation Commands

**1. Install Homebrew (macOS)**
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

**2. Install Node.js 10.x**
```bash
# Install Node version manager
sudo npm install -g n

# Install Node.js 10.x
sudo n 10.16.0

# Verify installation
node --version  # Should show v10.16.0
```

**3. Install Yarn**
```bash
brew install yarn
```

**4. Clone Repository**
```bash
git clone https://github.com/kylemath/MAESTRO
cd MAESTRO
```

**5. Install Dependencies**
```bash
yarn install
```

## Local Development

### Frontend Development

**1. Start Development Server**
```bash
# Ensure correct Node.js version
export PATH="/usr/local/bin:$PATH"

# Start development server
yarn start
```

**2. Access Application**
- Open browser to: http://localhost:3000
- Application will auto-reload on code changes

### Backend Development

**1. Set Up Python Environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**2. Install Backend Dependencies**
```bash
pip install -r requirements.txt
```

**3. Start Backend Server**
```bash
python file_server.py
```

**4. Access Backend**
- API endpoint: http://localhost:8080
- Upload form: http://localhost:8080/upload_form

## Testing

### Local Testing Procedure

**1. Environment Setup**
```bash
# Terminal 1: Start frontend
export PATH="/usr/local/bin:$PATH"
yarn start

# Terminal 2: Start backend
cd backend
source venv/bin/activate
python file_server.py
```

**2. Application Testing**
1. **Navigation**: Verify all pages load correctly
2. **Muse Connection**: Test with mock data stream
3. **Data Visualization**: Check real-time EEG charts
4. **Event Logging**: Test all event buttons
5. **3-Minute Recording**: Test timer functionality
6. **Data Export**: Verify CSV file generation
7. **File Upload**: Test backend file upload (if enabled)

**3. Console Monitoring**
- **Frontend**: Check browser console for JavaScript errors
- **Backend**: Monitor Flask server logs for errors
- **Network**: Verify API communication in browser dev tools

**4. Test Scenarios**
```bash
# Test with mock data
1. Click "Connect" to start mock data stream
2. Verify EEG visualization updates
3. Test each event button
4. Start 3-minute recording
5. Verify countdown timer
6. Stop recording and download CSV
7. Verify CSV file structure
```

### Automated Testing
```bash
# Run Jest tests
yarn test

# Run tests in watch mode
yarn test --watch
```

## Deployment

### Prerequisites

**1. Install Firebase CLI (if not already installed)**
```bash
# Firebase CLI is included in package.json, use npx
npx firebase login
```

**2. Login to Firebase**
```bash
npx firebase login
```

**3. Verify Firebase Configuration**
The project is already configured with `firebase.json`. Current settings:
- **Public directory**: `build`
- **Single-page app**: `Yes` (rewrites to `/index.html`)
- **Current project**: `voyage-r4d3k2`

### Manual Deployment Steps

**1. Build the Application**
```bash
# Build for production (using legacy OpenSSL for Node.js compatibility)
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

**Note**: The `NODE_OPTIONS=--openssl-legacy-provider` flag is required due to Node.js compatibility issues with the older React Scripts version used in this project.

**2. Deploy to Firebase**
```bash
# Deploy to Firebase hosting
npx firebase deploy --only hosting
```

**3. Verify Deployment**
- **Live URL**: https://voyage-r4d3k2.firebaseapp.com
- **Firebase Console**: https://console.firebase.google.com/project/voyage-r4d3k2/overview

### Testing Production Build Locally (Optional)

**1. Install serve globally**
```bash
yarn global add serve
```

**2. Test production build**
```bash
serve -s build
```

**3. Access local production build**
- Open browser to: http://localhost:3000 (or displayed port)

### Complete Deployment Workflow

**Full deployment process from clean state:**
```bash
# 1. Clean environment (optional)
yarn cache clean
rm -rf build/
rm -rf node_modules/

# 2. Fresh install (optional)
yarn install

# 3. Build for production
NODE_OPTIONS=--openssl-legacy-provider npm run build

# 4. Deploy to Firebase
npx firebase deploy --only hosting

# 5. Verify deployment
# Visit: https://voyage-r4d3k2.firebaseapp.com
```

### Backend Deployment

The backend Flask server is intended for local development only. For production:

1. **Disable Remote Upload**: Ensure `ENABLE_REMOTE_UPLOAD` is `False`
2. **Local File Storage**: CSV files are downloaded directly to user's computer
3. **No Server Required**: Frontend operates independently in production

## Deployed Addresses

### Production Deployment
- **Frontend**: https://voyage-r4d3k2.firebaseapp.com (Firebase Hosting)
- **Firebase Console**: https://console.firebase.google.com/project/voyage-r4d3k2/overview
- **Backend**: Local development only (no production backend)

### Development Endpoints
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **API Upload**: http://localhost:8080/singleupload

### Legacy Addresses
- **Previous Remote Backend**: https://data.entheosense.com/api/singleupload (deprecated)
- **Previous Domain**: Voyage/Entheosense branding (replaced with MAESTRO)

## Device Compatibility

### Supported Muse Models

MAESTRO is designed to work with **PPG-capable Muse devices** but has **limited device model detection**:

#### Currently Supported
- **Muse S**: Primary target device (has PPG sensors for heart rate)
- **Muse 2**: Should work (has PPG sensors)
- **Modern Muse devices** with Bluetooth Low Energy (BLE) support

#### Limited/Unknown Support
- **Muse 2016**: May work but not explicitly tested
- **Muse 2014**: Likely incompatible (lacks PPG sensors)
- **Original Muse**: Likely incompatible (older BLE protocol)

### Device Configuration

The application uses **hardcoded device settings**:

```javascript
window.nchans = 4                    // Fixed to 4 EEG channels
window.source.enableAux = false;     // AUX channel disabled
window.source.enablePpg = true;      // PPG enabled for heart rate
```

#### EEG Electrodes
- **4 Main Channels**: TP9, AF7, AF8, TP10
- **1 AUX Channel**: Available but disabled by default
- **Total**: 5 electrodes assumed (`["e1", "e2", "e3", "e4", "e5_aux"]`)

#### Sensor Requirements
- **EEG**: 256 Hz sampling rate
- **PPG**: 64 Hz sampling rate (required for heart rate monitoring)
- **Accelerometer**: 3-axis motion data
- **Gyroscope**: 3-axis rotation data

### BLE Compatibility

#### Web Bluetooth Requirements
- **Browser Support**: Chrome, Edge (Web Bluetooth API)
- **BLE Version**: Uses generic Web Bluetooth API
- **No Version Detection**: Does not check specific BLE protocol versions

#### Custom muse-js Library
MAESTRO uses a **specialized fork** of muse-js:
```json
"muse-js": "https://github.com/caydenpierce/muse-js#ppg_build"
```
- **PPG Support**: Enhanced for heart rate monitoring
- **Device Specific**: May have optimizations for newer Muse models

### Known Limitations

#### Missing Features
- **No Device Model Detection**: Cannot identify specific Muse hardware
- **No BLE Version Checking**: Does not verify Bluetooth compatibility
- **Fixed Configuration**: Cannot adapt to different electrode layouts
- **No Capability Detection**: Assumes all sensors are available

#### Potential Issues
- **Older Devices**: May fail to connect or provide incomplete data
- **Different Electrode Counts**: Cannot handle non-standard configurations
- **Missing PPG**: Will not work properly without heart rate sensors
- **Browser Compatibility**: Limited to Web Bluetooth supporting browsers

### Future Enhancements Needed

For comprehensive device support, the following would be required:

#### Device Detection
1. **Model Identification**: Detect Muse 2014/2016/2/S at connection time
2. **Capability Checking**: Verify available sensors (EEG, PPG, accelerometer)
3. **Configuration Adaptation**: Adjust settings based on device capabilities

#### BLE Improvements
1. **Version Compatibility**: Check BLE protocol version support
2. **Service Discovery**: Enumerate available GATT services
3. **Fallback Handling**: Graceful degradation for older devices

#### Connection Management
1. **Reconnect Feature**: Implement automatic reconnection when device disconnects
   - Detect connection loss events
   - Attempt automatic reconnection with exponential backoff
   - Preserve session state during temporary disconnections
   - User notification for connection status changes
   - Manual reconnect button for failed auto-reconnection

#### Code Changes Required
```javascript
// Example of needed device detection
async function detectDeviceModel() {
  const deviceInfo = await window.source.getDeviceInfo();
  switch(deviceInfo.model) {
    case 'muse-s':
      return { channels: 4, hasPPG: true, sampleRate: 256 };
    case 'muse-2':
      return { channels: 4, hasPPG: true, sampleRate: 256 };
    case 'muse-2016':
      return { channels: 4, hasPPG: false, sampleRate: 256 };
    default:
      throw new Error('Unsupported device model');
  }
}
```

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test locally
4. Commit changes: `git commit -am 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Create Pull Request

### Code Style
- **JavaScript**: Follow existing React patterns
- **Python**: Follow PEP 8 guidelines
- **Components**: Use functional components with hooks
- **Testing**: Add tests for new features

### Issue Reporting
- Use GitHub Issues for bug reports
- Include reproduction steps
- Provide console logs and error messages
- Specify browser and system information

---

**Need Help?** Check the [PROGRESS.md](PROGRESS.md) file for detailed development notes and troubleshooting information.

