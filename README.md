# StatusSaver - WhatsApp Status Downloader

A premium, modern Android utility app built with React, Ionic, and Capacitor. StatusSaver allows users to view, download, and archive WhatsApp statuses automatically.

## ✨ Features

- **Dual WhatsApp Support**: Automatically detects and merges statuses from both WhatsApp and WhatsApp Business.
- **Swipeable Navigation**: Silky-smooth swipe gestures to switch between all tabs (Images, Videos, Direct Chat, etc.).
- **Direct Chat Utility**: Send WhatsApp messages to any number without saving it to your contacts.
- **Video Thumbnails**: High-quality, native-generated thumbnails for video statuses.
- **Bulk Save & Multi-Select**: Professional long-press to select and save multiple statuses in one go.
- **Native Sharing**: Share statuses directly to other apps without filling up your local gallery.
- **Premium Preview Mode**: Clean, glassmorphism-inspired full-screen preview with easy-to-reach controls.
- **7-Day Auto-Archiving**: Statuses you view are automatically cached and kept for up to 7 days, even after they disappear from WhatsApp.
- **High-Performance Media Handling**: Custom native Java plugin using Android's Storage Access Framework (SAF) for lightning-fast file access.
- **Smart Back-Button Navigation**: Intuitive navigation with exit confirmation on the home screen.
- **Premium Dark Mode**: Beautiful, system-integrated dark theme.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Framework**: Ionic Framework (React)
- **Native Bridge**: Capacitor
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Native Implementation**: Java (Custom SafPlugin for Storage Access Framework)

## 📁 Architecture

- `src/plugins/Saf.ts`: TypeScript wrapper for the custom native plugin.
- `android/app/src/main/java/org/surajorg/statussaver/SafPlugin.java`: Native Java implementation for secure storage access on Android 11+.
- `src/utils/mediaUtils.ts`: Core logic for caching, fetching, and gallery saving.
- `src/hooks/useStatuses.ts`: Custom React hook for managing status state.

## 🚀 Getting Started

1. Clone the repository: `git clone https://github.com/surajorg0/StatusSaver`
2. Install dependencies: `npm install`
3. Build the web assets: `npm run build`
4. Sync with Android: `npx cap sync android`
5. Open in Android Studio: `npx cap open android`
6. Build and run the `app` module on your device.

## ⚖️ License & Copyright

Developed by **surajorg**

Copyright © 2026 surajorg. All rights reserved.

---
*Note: This application is an independent tool and is not affiliated with WhatsApp Inc.*
