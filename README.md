<div align="center">

# peek. mobile

### Your home in your pocket.

**The mobile companion app for Peek. Chat with your home from anywhere in the house.**

![Status](https://img.shields.io/badge/status-v1.0-6EE7B7?style=flat-square)
![Expo](https://img.shields.io/badge/Expo-54-000?style=flat-square)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

</div>

---

## What is this

This is the mobile companion to the [Peek desktop hub](https://github.com/tommasobby/peek_prototype). The desktop hub runs the computer vision and the conversational AI on your PC. This app is the window into that hub from your phone. You can chat with Peek, see what the camera sees, browse snapshots, and manage your watchlist without touching the computer.

The app talks to the desktop via a local REST API on port 5000. Nothing is sent to the cloud. Everything stays inside your home network.

<div align="center">

*Chat with Peek from the kitchen. Never leave the sofa.*

</div>

---

## Key features

**Live camera feed** streamed from the desktop hub via MJPEG. You see what the camera sees, with bounding boxes and confidence scores rendered in real time on the server.

**Conversational chat** with the same rule-based NLU engine that runs on the desktop. Ask *"where are my keys"* or *"what can you see"* from anywhere. Responses arrive instantly because no cloud round trip is involved.

**Last Found view** that shows the most recent object located by Peek. Includes the annotated snapshot, the position in the frame, the confidence score, and the time of detection.

**Watchlist management** to add and remove objects you want the desktop to keep an eye on. Peek notifies you the moment they enter the frame.

**Snapshot gallery** with all the moments Peek has captured during the session, browsable and viewable in full screen.

**Settings** where you configure the IP address of the desktop hub. This is the only setup step needed. The rest is automatic.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81.5 |
| Runtime | Expo 54 |
| Language | TypeScript 5.9 |
| Navigation | React Navigation 7 (bottom tabs plus native stack) |
| Icons | Expo Vector Icons |
| Media | React Native WebView (for MJPEG stream), Safe Area Context, Screens |
| Backend | Flask REST API on the desktop hub |

---

## App structure

The app has five main tabs on the bottom navigation.

**Home**. Landing screen with the current desktop hub status and quick actions.

**Chat**. Full conversational interface. Type a message, get a natural language reply from Peek.

**Last Found**. The most recent object located, with snapshot and metadata.

**Watchlist**. Add, remove, and monitor the objects you frequently lose.

**Gallery**. All snapshots captured during the current session.

There is also a **Settings** screen accessible from the header, where you configure the IP address of the desktop hub on your local network.

---

## Getting started

### Requirements

Node.js 20 or newer. A phone or emulator with Expo Go installed for development, or a built APK for production use. The Peek desktop hub running on the same local network.

### Install

Clone the repository and enter the folder.

```bash
git clone https://github.com/tommasobby/Peek-app.git
cd Peek-app
```

Install the dependencies.

```bash
npm install
```

### Run in development

Start the Expo development server.

```bash
npm start
```

A QR code appears in the terminal. Scan it with the Expo Go app on your phone. The app opens and hot-reloads automatically as you edit the code.

### Build for production

To create a standalone APK for Android without depending on Expo Go, use EAS Build.

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

The build runs on Expo's cloud servers. After 10 to 20 minutes you receive a download link for the APK. Install it on any Android phone by enabling installation from unknown sources in the system settings.

### Configure the connection

On first launch, go to Settings and enter the IP address of the desktop hub. You can find it in the terminal where the desktop app is running. If you are using a phone hotspot, the IP will be something like `192.168.43.x` on port 5000.

Save. From this point, the app talks to the hub over WiFi. If the hub is running, everything works.

---

## Architecture

The mobile app is a thin client. All heavy work happens on the desktop hub. The app sends REST requests, receives JSON responses or MJPEG streams, and renders the result. This keeps the phone battery use low and the interaction snappy.

```
┌──────────────┐        HTTP           ┌──────────────────┐
│              │──── GET /status ─────▶│                  │
│  Mobile app  │──── POST /query ─────▶│  Desktop hub     │
│  (React      │──── GET /snapshots ──▶│  (Python, Flask) │
│  Native)     │◀─── MJPEG /stream ────│                  │
│              │                       │                  │
└──────────────┘                       └──────────────────┘
    Your phone                            Your computer
    
                All inside your home WiFi.
                Nothing goes to the cloud.
```

The desktop hub exposes nine REST endpoints. See the [desktop repository](https://github.com/tommasobby/peek_prototype) for the full API documentation.

---

## Roadmap

The mobile app v1.0 covers the essential remote interaction with Peek. Planned evolution follows the desktop roadmap.

Voice input to send chat messages by speaking, so the interaction becomes fully hands-free.

Native iOS distribution via TestFlight and the App Store, once the Apple Developer account is active.

Push notifications for watchlist matches, so Peek can alert you even when the app is closed.

Multi-hub support for households with more than one Peek station, letting the app switch between kitchen, living room, and bedroom hubs.

---

## Design system

The mobile app follows the same visual language as the desktop hub. Dark background, mint accent, generous whitespace, no decoration.

**Palette**

| Role | Hex |
|------|-----|
| Background | `#0E0E10` |
| Surface | `#1A1A1E` |
| Accent (Mint) | `#6EE7B7` |
| Text | `#FFFFFF` |
| Subtext | `#8B8B9A` |

Typography is the system default on each platform, sized in a scale coordinated with the desktop.

---

## About

Peek mobile is part of the final thesis project of **Tommaso Quintiliani**, developed in the Master's program in Human Interactions and Artificial Intelligence at **Elisava, Barcelona School of Design and Engineering** (2025-2026). Supervised by professor Regina.

The full Peek ecosystem, desktop and mobile, was presented at the Elisava graduation show on June 19, 2026, and defended on June 25, 2026.

---

## Related repositories

The mobile app is one half of the Peek ecosystem. The other half is the desktop hub that does the actual computer vision and conversation.

**[peek_prototype](https://github.com/tommasobby/peek_prototype)**. The desktop hub. Python, PyQt6, YOLOv8, YOLO-World, Flask API. This is where the AI lives.

---

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**peek. mobile**

*Your home in your pocket.*

</div>
