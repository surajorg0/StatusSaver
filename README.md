# StatusSaver - WhatsApp Status Downloader

A premium, modern Android utility app built with React, Ionic, and Capacitor. StatusSaver allows users to view, download, and archive WhatsApp statuses automatically.

## ✨ Features

- **7-Day Auto-Archiving**: Statuses you view are automatically cached and kept for up to 7 days, even after they disappear from WhatsApp.
- **High-Performance Media Handling**: Custom native Java plugin using Android's Storage Access Framework (SAF) for lightning-fast file access without excessive memory usage.
- **Smart Back-Button Navigation**: Intuitive navigation with exit confirmation on the home screen to prevent accidental app closure.
- **Premium Dark Mode**: Beautiful, system-integrated dark theme for a comfortable viewing experience at night.
- **Instant Gallery Save**: One-tap saving for both images and videos directly to the `DCIM/StatusSaver` folder.
- **Built-in Media Player**: Full-screen preview for images and high-definition video playback.
- **Bilingual Support**: Permission explanations provided in both English and Hindi.

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
