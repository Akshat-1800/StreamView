import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io({
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}
