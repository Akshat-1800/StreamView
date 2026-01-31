import { Server } from "socket.io";
import crypto from "crypto";

let io;

// helper to generate short room IDs
function generateRoomId() {
  return crypto.randomBytes(4).toString("hex");
}

// 🔑 presenter per room
const presenters = new Map(); // roomId -> socketId

export function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 Connected:", socket.id);

      /* ======================
         CREATE ROOM
         ====================== */
      socket.on("create-room", () => {
        const roomId = generateRoomId();
        socket.join(roomId);
        socket.emit("room-created", { roomId });
        console.log(`🎬 Room created: ${roomId}`);
      });

      /* ======================
         JOIN ROOM
         ====================== */
      socket.on("join-room", ({ roomId }) => {
        const room = io.sockets.adapter.rooms.get(roomId);

        if (!room) {
          socket.emit("room-error", { message: "Room does not exist" });
          return;
        }

        if (room.size >= 6) {
          socket.emit("room-error", { message: "Room is full" });
          return;
        }

        socket.join(roomId);
        socket.data.roomId = roomId;

        const users = Array.from(io.sockets.adapter.rooms.get(roomId));

        socket.emit("room-state", {
          roomId,
          users,
          hostId: users[0],
        });

        socket.to(roomId).emit("user-joined", { socketId: socket.id });

        console.log(`👤 ${socket.id} joined ${roomId}`);
      });

      /* ======================
         SCREEN SHARE (LOCKED)
         ====================== */
      socket.on("start-screen-share", () => {
        const roomId = socket.data.roomId;
        if (!roomId) return;

        const current = presenters.get(roomId);
        if (current && current !== socket.id) {
          socket.emit("screen-share-denied");
          return;
        }

        presenters.set(roomId, socket.id);
        io.to(roomId).emit("presenter-changed", {
          presenterId: socket.id,
        });
      });

      socket.on("stop-screen-share", () => {
        const roomId = socket.data.roomId;
        if (!roomId) return;

        if (presenters.get(roomId) === socket.id) {
          presenters.delete(roomId);
          io.to(roomId).emit("presenter-changed", {
            presenterId: null,
          });
        }
      });

      /* ======================
         WEBRTC SIGNALING
         ====================== */
      socket.on("webrtc-offer", ({ to, offer }) => {
        socket.to(to).emit("webrtc-offer", {
          from: socket.id,
          offer,
        });
      });

      socket.on("webrtc-answer", ({ to, answer }) => {
        socket.to(to).emit("webrtc-answer", {
          from: socket.id,
          answer,
        });
      });

      socket.on("webrtc-ice", ({ to, candidate }) => {
        socket.to(to).emit("webrtc-ice", {
          from: socket.id,
          candidate,
        });
      });

      /* ======================
         DISCONNECT (SINGLE)
         ====================== */
      socket.on("disconnect", () => {
        const roomId = socket.data.roomId;
        console.log("🔴 Disconnected:", socket.id);

        if (!roomId) return;

        socket.to(roomId).emit("user-left", {
          socketId: socket.id,
        });

        // release presenter lock
        if (presenters.get(roomId) === socket.id) {
          presenters.delete(roomId);
          io.to(roomId).emit("presenter-changed", {
            presenterId: null,
          });
        }
      });
    });
  }

  return io;
}
