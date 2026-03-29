# 🚀 Mooka File: Seamless P2P Flow, Professional Grade

Mooka File is a professional-grade, browser-based P2P file transfer solution designed to break hardware ecosystem barriers. It empowers modern offices with secure, high-speed, and registration-free data sharing directly between devices.

## 💎 Core Features

### 📂 Multi-Format & Batch Support
- **Universal Compatibility:** Support for PDF, Office Documents, High-Definition Videos (.mp4/mov), Archives (.zip/7z), and Source Code (.js/json).
- **Smart Tagging:** Integrated MIME-type detection system that automatically assigns professional iconography via [Phosphor Icons](https://phosphoricons.com/).
- **Serial Batch Queue:** Support for dragging multiple files simultaneously. The system manages a serial transmission queue to ensure stability without overwhelming browser memory.

### ⚡ Extreme Performance & Reliability
- **64KB Chunking:** Large files are automatically fragmented into 64KB data blocks using `RTCDataChannel`.
- **Backpressure Management:** Real-time monitoring of `bufferedAmount` ensures synchronized data flow, preventing browser crashes during multi-gigabyte transfers.
- **Pure WebRTC P2P:** Data travels directly between devices. No intermediate servers, ensuring privacy and LAN-speed performance.

### 🛡️ Enterprise-Grade Security
- **Handshake Protocol:** 6-digit "Flash Code" signaling ensures secure room entry.
- **Local-Only Flow:** Files are never stored on a server. Your data stays in your hardware's memory buffer until reassembled at the destination.
- **Zero-Footprint:** Use it directly in the browser—no installation, no registration, no tracking.

---

## 🛠️ Technology Stack
- **Frontend:** React (Vite) + Neu-Minimalist Design System.
- **Icons:** `@phosphor-icons/react` for professional line-art aesthetics.
- **P2P Engine:** WebRTC (`RTCPeerConnection` & `RTCDataChannel`).
- **Signaling:** Node.js + Socket.io (hosted on Render).
- **Handshake Logic:** `node-cache` with 5-minute TTL for secure code management.

---

## 🚀 Quick Start
1. Visit [Mooka File Live](https://mooka-file.onrender.com)
2. **Sender:** Click "Send Files" to generate a 6-digit Flash Code.
3. **Receiver:** Click "Receive Files" and enter the code.
4. **Transfer:** Drag and drop files into the professional transfer zone.

---

## 📬 Contact & Support
Developed by Mooka Technologies. For enterprise inquiries or feature requests, please contact our team.

---
© 2026 Mooka Technologies. All rights reserved.
