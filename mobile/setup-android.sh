#!/bin/bash
# ZIYOKOR NONLARI — Android Setup Script
# Requires: Node.js 18+, Android Studio (with SDK 35)
# 
# Usage: ./setup-android.sh
# Then open android/ in Android Studio and build

set -e

echo ""
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║   ZIYOKOR NONLARI — Android Setup          ║"
echo "  ╚═══════════════════════════════════════════╝"
echo ""

echo "  📦 Installing dependencies..."
npm install

echo "  🏗  Building web assets..."
node build.js

echo "  ⚡ Initializing Capacitor..."
npx cap init ZIYOKOR-NONLARI uz.ziyokor.nonlari --web-dir www 2>/dev/null || true

echo "  📱 Adding Android platform..."
npx cap add android 2>/dev/null || echo "  ⚠️  Android platform already exists, syncing..."

echo "  📋 Syncing web assets..."
npx cap sync android

echo ""
echo "  ✅ Setup complete!"
echo ""
echo "  Next steps:"
echo "  ───────────────────────────────────────"
echo "  📱 Open in Android Studio:"
echo "     cd mobile && npx cap open android"
echo ""
echo "  🔨 Build APK:"
echo "     cd android && ./gradlew assembleDebug"
echo "     APK: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "  🚀 Or run directly:"
echo "     npx cap run android"
echo "  ───────────────────────────────────────"
echo ""
