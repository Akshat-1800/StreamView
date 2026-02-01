"use client";
import React from 'react'
import { getSocket } from '@/lib/socketClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


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
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Watch Party
          </h1>
          <p className="text-gray-400">
            Create a room or join an existing one to watch together
          </p>
        </div>

        {/* Create Party Card */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span>✨</span>
            Create New Party
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Start a new watch party and invite your friends
          </p>
          <button
            onClick={createParty}
            className="btn btn-primary w-full"
          >
            Create Watch Party
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* Join Party Card */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span>🔗</span>
            Join Existing Party
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Enter a room ID to join an existing party
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinParty()}
              className="input flex-1"
            />
            <button 
              onClick={joinParty} 
              className="btn btn-secondary"
              disabled={!roomId.trim()}
            >
              Join
            </button>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

export default Party