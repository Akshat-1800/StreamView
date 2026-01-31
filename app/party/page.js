"use client";
import React from 'react'
import { getSocket } from '@/lib/socketClient';
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';


const Party = () => {
    const socket = getSocket();
const router = useRouter();
    const [roomId, setRoomId] = useState("");
 useEffect(() => {
    socket.on("room-created", ({ roomId }) => {
      router.push(`/party/${roomId}`);
    });

    return () => {
      socket.off("room-created");
    };
  }, [router, socket]);
  const joinParty = () => {
    if(!roomId) return;
    router.push(`/party/${roomId.trim()}`);
  }
    const createParty = () => {
    
    socket.emit("create-room");
  };
  return (
    <div>
    <button
          onClick={createParty}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          Create Watch Party
        </button>
        <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="px-3 py-2 border rounded bg-gray-800 text-white"
      />

        <button onClick={joinParty} className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
          Join Party
        </button>
        </div>

  )
}

export default Party