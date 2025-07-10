# MAESTRO Android App - Quick Start Guide

## ⚡ Quick Steps to Build Android App

### Prerequisites
- Node.js 10.x (already installed)
- Android Studio
- **Java 17** (automatically configured via brew install)

### ✅ Java 21 Compatibility RESOLVED
- **Problem**: Java 21 incompatible with Gradle 7.6 
- **Solution**: Use Java 17 (installed and configured below)
- **Status**: ✅ **RESOLVED** - Gradle now uses Java 17.0.15

### Current Configuration
- **Gradle**: 7.6 (Java 17 compatible)
- **Android Gradle Plugin**: 7.4.2 (Java 17 compatible)
- **Capacitor**: 2.x (Node 10 compatible)
- **Java**: 17.0.15 (forced via gradle.properties)

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
1. Wait for Gradle sync (uses Java 17 automatically)
2. Build → Build Bundle(s)/APK(s) → Build APK(s)
3. Find APK in `android/app/build/outputs/apk/debug/`

## 🔧 One-Command Sync
After initial setup, use:
```bash
npx cap sync android && npx cap open android
```

## ✅ Java Configuration (Auto-Configured)
The project is now configured to automatically use Java 17:
- **Java 17**: Installed via `brew install openjdk@17`
- **gradle.properties**: Forces Java 17 usage
- **System Integration**: Java 17 symlinked for system recognition
- **Gradle Detection**: Confirms Java 17 in `./gradlew --version`

### Manual Java Check
```bash
cd android && ./gradlew --version
# Should show: JVM: 17.0.15 (Homebrew 17.0.15+0)
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

### ✅ Java 21 Issues (RESOLVED)
- **Fixed**: Java 21 compatibility with Gradle 7.6
- **Solution**: Java 17 auto-configured via gradle.properties
- **Verification**: `./gradlew --version` shows Java 17.0.15

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

## 📋 Current Status
- ✅ **Java Compatibility**: RESOLVED (using Java 17)
- ✅ **Project Setup**: Complete
- ✅ **Offline Features**: Ready
- ⚠️ **Build Status**: Minor dependency version issues remain
- 🎯 **Ready For**: Android Studio builds

## 📄 Full Documentation
See [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md) for detailed instructions. 