# MAESTRO Android App - Quick Start Guide

## ⚡ Quick Steps to Build Android App

### Prerequisites
- Node.js 10.x (already installed)
- Android Studio
- Java JDK 11+

### 1. Install Dependencies
```bash
# Use Node 10.x
export PATH="/usr/local/bin:$PATH"

# Install packages (including new Capacitor dependencies)
yarn install
```

### 2. Build the Web App
```bash
# Build with legacy OpenSSL support
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

### 3. Add Android Platform
```bash
# Add Android platform to Capacitor
npx cap add android
```

### 4. Sync to Android
```bash
# Copy web assets to Android project
npx cap sync android
```

### 5. Open in Android Studio
```bash
# Open Android project
npx cap open android
```

### 6. Build APK
In Android Studio:
1. Wait for Gradle sync
2. Build → Build Bundle(s)/APK(s) → Build APK(s)
3. Find APK in `android/app/build/outputs/apk/debug/`

## 🔧 One-Command Build
After initial setup, use:
```bash
npm run build:android && npx cap open android
```

## 📱 Key Features Working Offline
- ✅ All pages and navigation
- ✅ Muse Bluetooth connection
- ✅ Real-time EEG visualization
- ✅ Heart rate monitoring
- ✅ Event logging
- ✅ 3-minute recording
- ✅ CSV export to device storage
- ❌ Remote upload (disabled for offline use)

## 🐛 Troubleshooting

### Bluetooth Issues
- Enable Location Services
- Grant all permissions when prompted
- For Android 12+: Grant Bluetooth permissions explicitly

### Build Issues
```bash
cd android && ./gradlew clean
cd .. && npx cap sync android
```

### Testing Offline
1. Install APK on device
2. Open app once with internet (to cache resources)
3. Turn on Airplane Mode
4. App should work completely offline!

## 📄 Full Documentation
See [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md) for detailed instructions. 