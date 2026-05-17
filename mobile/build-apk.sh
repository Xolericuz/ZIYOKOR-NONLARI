#!/bin/bash
# ZIYOKOR NONLARI — APK Builder
# Build: ./build-apk.sh

set -e

echo ""
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║   ZIYOKOR NONLARI — APK Builder           ║"
echo "  ╚═══════════════════════════════════════════╝"
echo ""

# 1. Install dependencies
echo "  📦 Installing npm dependencies..."
npm install

# 2. Build web assets
echo "  🏗  Building web app..."
node build.js

# 3. Copy to android
echo "  📋 Syncing to Android..."
npx cap sync android

# 4. Build APK
echo "  🔨 Building APK..."
cd android

if [ "$1" == "release" ]; then
    echo "  📦 Release build..."
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
    echo "  🔧 Debug build..."
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

cd ..

# Copy APK to root
if [ -f "android/$APK_PATH" ]; then
    cp "android/$APK_PATH" "./ziyokor-nonlari.apk"
    echo ""
    echo "  ✅ APK ready: mobile/ziyokor-nonlari.apk"
    ls -lh ./ziyokor-nonlari.apk
else
    echo ""
    echo "  ⚠️  APK not found at expected path."
    echo "     Check android/app/build/outputs/apk/"
fi

echo ""
echo "  Done!"
