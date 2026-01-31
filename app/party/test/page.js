"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function TestSocketPage() {
  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">
        Socket Test Page
      </h1>
      <p>Open console to see connection logs.</p>
    </div>
  );
}
