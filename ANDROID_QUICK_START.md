# MAESTRO Android App - Quick Start Guide

## ⚡ Quick Steps to Build Android App

### Prerequisites
- Node.js 10.x (already installed)
- Android Studio
- **Java 17** (automatically configured)

### ✅ All Compatibility Issues RESOLVED
- **Java 21 → Java 17**: ✅ **RESOLVED**
- **Gradle Cache Corruption**: ✅ **RESOLVED**  
- **Gradle Auto-Upgrade**: ✅ **LOCKED** (read-only wrapper)
- **Status**: Ready for stable Android Studio builds

### Current Configuration (LOCKED)
- **Gradle**: 7.6 🔒 **LOCKED** (read-only wrapper)
- **Android Gradle Plugin**: 7.4.2 (compatible)
- **Capacitor**: 2.x (Node 10 compatible)
- **Java**: 17.0.15 (forced via gradle.properties)

### 🚨 BEFORE Opening Android Studio
**READ THIS FIRST:** [ANDROID_STUDIO_SETUP.md](ANDROID_STUDIO_SETUP.md)

**Critical Android Studio Settings:**
- Set **Gradle JDK** to **"Use Embedded JDK (recommended)"**
- **NEVER** click "Upgrade Gradle" prompts
- **ALWAYS** click "Cancel" or "Keep Current Version"

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

### 4. Open in Android Studio (CAREFULLY)
```bash
# Open Android project
npx cap open android
```

**THEN in Android Studio:**
1. **Set Gradle JDK** to "Use Embedded JDK (recommended)"
2. **Decline any Gradle upgrade prompts**
3. Wait for sync (should complete without errors)

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

### ✅ All Major Issues RESOLVED
- **Java 21 Issues**: ✅ **RESOLVED** (using Java 17)
- **Gradle Cache**: ✅ **RESOLVED** (cleaned completely)
- **Auto-Upgrade**: ✅ **PREVENTED** (locked wrapper)

### If Android Studio Changes Gradle Version
**See:** [ANDROID_STUDIO_SETUP.md](ANDROID_STUDIO_SETUP.md) for emergency reset

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
- ✅ **Java Compatibility**: RESOLVED (Java 17)
- ✅ **Gradle Configuration**: LOCKED (7.6, read-only)
- ✅ **Cache Issues**: RESOLVED (clean environment)  
- ✅ **Auto-Upgrade Prevention**: ACTIVE (locked wrapper)
- ✅ **Project Setup**: Complete and protected
- 🎯 **Ready For**: Stable Android Studio builds

## 📄 Documentation
- **[ANDROID_STUDIO_SETUP.md](ANDROID_STUDIO_SETUP.md)** - CRITICAL setup guide
- **[JAVA_21_SOLUTION.md](JAVA_21_SOLUTION.md)** - Java compatibility solution  
- **[ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md)** - Detailed build instructions 