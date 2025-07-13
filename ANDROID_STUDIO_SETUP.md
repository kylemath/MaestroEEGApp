# Android Studio Setup Guide - Prevent Gradle Auto-Upgrade

## 🚨 CRITICAL: Prevent Android Studio from Breaking Our Setup

Android Studio automatically "upgrades" Gradle which breaks our carefully configured compatibility stack. **Follow these steps exactly** to prevent this:

### ✅ Required Android Studio Configuration

#### 1. Force Gradle JDK Setting
**In Android Studio:**
- Go to **Preferences** (Mac) or **File → Settings** (Windows/Linux)
- Navigate to **Build, Execution, Deployment → Build Tools → Gradle**
- Set **Gradle JDK** to: **"Use Embedded JDK (recommended)"**
- **DO NOT** select any other Java version

#### 2. Disable Gradle Auto-Upgrade
**In the same Gradle settings:**
- **Uncheck** "Use Gradle from 'gradle-wrapper.properties'"
- **Check** "Use Gradle from specified location" 
- **OR** keep "Use Gradle from 'gradle-wrapper.properties'" but ensure it's our locked version

#### 3. Verify Gradle Version Lock
**Our gradle-wrapper.properties is now read-only:**
```bash
cd android
ls -la gradle/wrapper/gradle-wrapper.properties
# Should show: r--r--r-- (read-only for all)
```

### 🔧 If Android Studio Shows Gradle Upgrade Prompts

**When Android Studio prompts to upgrade Gradle:**
- ❌ **NEVER click "Upgrade"**
- ✅ **Always click "Cancel" or "Keep Current Version"**
- ✅ **Check "Don't ask again for this project"**

### ⚠️ If Gradle Gets Changed Again

**If you see Gradle 9.x errors again:**

1. **Restore Gradle 7.6:**
   ```bash
   cd android
   chmod 644 gradle/wrapper/gradle-wrapper.properties
   echo "distributionUrl=https\\://services.gradle.org/distributions/gradle-7.6-all.zip" > gradle/wrapper/gradle-wrapper.properties
   chmod 444 gradle/wrapper/gradle-wrapper.properties
   ```

2. **Clean everything:**
   ```bash
   ./gradlew --stop
   rm -rf .gradle build app/build ~/.gradle/caches
   ```

3. **Verify version:**
   ```bash
   ./gradlew --version
   # Should show: Gradle 7.6 + JVM: 17.0.15
   ```

## 🎯 Our Working Configuration

| Component | Version | Status |
|-----------|---------|--------|
| **Gradle** | 7.6 | ✅ **LOCKED** |
| **Java** | 17.0.15 | ✅ Auto-configured |
| **Android Gradle Plugin** | 7.4.2 | ✅ Compatible |
| **Capacitor** | 2.x | ✅ Node 10 compatible |

### ✅ Success Indicators

**When opening in Android Studio, you should see:**
- ✅ Gradle sync completes without errors
- ✅ No "Gradle JDK" warnings
- ✅ No "incompatible Java" messages
- ✅ Build progresses past manifest processing

### 🆘 Emergency Reset

**If everything breaks:**
```bash
cd android
# Stop everything
./gradlew --stop
pkill -f gradle

# Reset Gradle wrapper (if permissions allow)
chmod 644 gradle/wrapper/gradle-wrapper.properties
echo "distributionBase=GRADLE_USER_HOME" > gradle/wrapper/gradle-wrapper.properties
echo "distributionPath=wrapper/dists" >> gradle/wrapper/gradle-wrapper.properties  
echo "distributionUrl=https\\://services.gradle.org/distributions/gradle-7.6-all.zip" >> gradle/wrapper/gradle-wrapper.properties
echo "zipStoreBase=GRADLE_USER_HOME" >> gradle/wrapper/gradle-wrapper.properties
echo "zipStorePath=wrapper/dists" >> gradle/wrapper/gradle-wrapper.properties
chmod 444 gradle/wrapper/gradle-wrapper.properties

# Nuclear clean
rm -rf .gradle build app/build ~/.gradle/caches

# Verify
./gradlew --version
```

## 🎉 When Everything Works

**You'll know our setup is working when:**
- Android Studio opens the project without Gradle version warnings
- Gradle sync completes successfully  
- Build progresses to actual compilation errors (not Gradle/Java errors)
- You can build APKs in Android Studio

**Ready to build your offline Android app!** 🚀 