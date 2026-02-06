
# 🎬 StreamView – Real-Time Watch Party Platform

StreamView is a full-stack video streaming and real-time watch-party platform built using **Next.js**, **Socket.IO**, and **WebRTC**.  
Users can watch videos together, create private watch parties, join via room codes, communicate using live audio/video, and share screens in real time.

This project focuses on **real-time systems, peer-to-peer communication, and scalable architecture**.

---

## 🚀 Features

### 🔐 Authentication
- Secure authentication using **Clerk**
- Protected dashboard and routes
- Seamless sign-in / sign-up flow
- Client-side and server-side auth handling

### 🎥 Video Streaming
- HLS-based video playback
- Adaptive quality selection (demo-limited)
- Optimized client-side playback

### 🎉 Watch Party
- Create or join watch parties using room codes
- Real-time participant synchronization
- Automatic join / leave handling
- Live party state updates

### 📡 Real-Time Communication
- **WebRTC Mesh architecture** (up to 5 users)
- Peer-to-peer video & audio calling
- ICE candidate exchange via Socket.IO
- Automatic cleanup on disconnect

### 🖥 Screen Sharing
- Only **one presenter allowed at a time**
- Presenter video is **pinned and centered**
- Screen-share lock enforced server-side
- Automatic fallback when presenter stops or disconnects

### 🧠 Smart UI Behavior
- Presenter view pinned at center
- Other participants shown in grid layout
- Local and remote streams managed independently
- Graceful reconnection handling

---

## 🧱 Architecture Overview

### Frontend – Next.js (Port 3000)
- App Router
- Clerk authentication
- Video player and party UI
- Socket client connection

### Realtime Server – Node.js + Socket.IO (Port 8080)
- Room creation and joining
- WebRTC signaling (offer / answer / ICE)
- Screen-share locking
- User presence tracking

> ⚠️ Socket.IO server is **fully decoupled** from Next.js to avoid middleware and authentication conflicts.

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **Node.js**
- **Socket.IO**
- **WebRTC**
- **Clerk Authentication**
- **MongoDB**
- **Tailwind CSS**

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/streamview.git
cd streamview
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

---

## ▶️ Running the Project

### Start Next.js frontend (Port 3000)

```bash
npm run dev
```

### Start Socket.IO server (Port 8080)

```bash
node index.js
```

> Make sure both ports **3000** and **8080** are available.

---

## 🧪 Demo Limitations (Intentional)

This project is a **functional demo**, not a production OTT platform.
The following limitations are intentional:

* 🎞 Only **1 demo video** available
* 🎚 Only **2 video quality options**
* 👥 Maximum **5 users per watch party**
* 🖥 Only **one screen presenter** at a time
* 📡 No TURN server (local / STUN only)
* 🔄 Room state is stored **in-memory** (resets on server restart)

These constraints were chosen to:

* Keep the demo lightweight
* Avoid unnecessary infrastructure cost
* Focus on real-time system design

---

## 🧠 Key Learnings

* WebRTC mesh scaling limitations
* Real-time state synchronization
* Socket lifecycle management
* Media track replacement (camera ↔ screen)
* Auth + realtime server separation
* Cleanup and disconnect edge cases

---

## 📌 Future Improvements

* TURN server for production WebRTC
* Persistent room state (Redis)
* In-room chat system
* Host moderation controls


---

## 🧑‍💻 Author

Built  by **Akshat Jaiswal**

If you’re exploring real-time systems, WebRTC, or Next.js architecture — feel free to fork, experiment, and improve!

---

## 📄 License

MIT License

```

---


```
