# MAESTRO Android App - Quick Start Guide

## ⚡ Quick Steps to Build Android App

### Prerequisites
- Node.js 10.x (already installed)
- Android Studio
- Java JDK 11+ (Java 21 supported with AGP 7.4.2)

### Current Configuration
- **Gradle**: 7.6 (Java 21 compatible)
- **Android Gradle Plugin**: 7.4.2 (Java 21 compatible)
- **Capacitor**: 2.x (Node 10 compatible)

### 1. Install Dependencies
```bash
# Use Node 10.x
export PATH="/usr/local/bin:$PATH"

# Install packages (including Capacitor 2.x dependencies)
yarn install
```

### 2. Build the Web App
```bash
# Build without legacy OpenSSL (Node 10 doesn't need it)
npm run build
```

### 3. Sync to Android
```bash
# Copy web assets to Android project
npx cap sync android
```

### 4. Open in Android Studio
```bash
# Open Android project
npx cap open android
```

### 5. Build APK in Android Studio
In Android Studio:
1. Wait for Gradle sync (will download Gradle 7.6 automatically)
2. Build → Build Bundle(s)/APK(s) → Build APK(s)
3. Find APK in `android/app/build/outputs/apk/debug/`

## 🔧 One-Command Sync
After initial setup, use:
```bash
npx cap sync android && npx cap open android
```

## ⚠️ Java Configuration Note
Command line builds require Java to be properly configured:
- Android Studio handles Java automatically
- For command line builds, ensure JAVA_HOME is set to Java 11+
- Recommended: Use Android Studio for building

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

### Namespace Issues (Fixed)
- Using AGP 7.4.2 (compatible with Capacitor 2.x)
- No namespace declarations required
- Compatible with Java 21

### Bluetooth Issues
- Enable Location Services
- Grant all permissions when prompted
- For Android 12+: Grant Bluetooth permissions explicitly

### Build Issues
```bash
cd android && rm -rf .gradle build app/build
cd .. && npx cap sync android
```

### Testing Offline
1. Install APK on device
2. Open app once with internet (to cache resources)
3. Turn on Airplane Mode
4. App should work completely offline!

## 📄 Full Documentation
See [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md) for detailed instructions. 