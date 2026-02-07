"use client";
import React from 'react'
import { getSocket } from '@/lib/socketClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


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
    if(!roomId) {
      toast.error("Please enter a valid Room ID");
      return;}
    router.push(`/party/${roomId.trim()}`);
  }
  
  const createParty = () => {
    socket.emit("create-room");
    toast.info("Creating room...");
  };
  
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4 md:p-6">
      <div className="max-w-md w-full animate-fade-in">
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="btn btn-ghost text-sm px-0 mb-4 hover:bg-transparent hover:text-red-400"
        >
          ← Back
        </button>
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="text-5xl md:text-6xl mb-3 md:mb-4">🎉</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Watch Party
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Create a room or join an existing one to watch together
          </p>
        </div>

        {/* Create Party Card */}
        <div className="card p-5 md:p-6 mb-5 md:mb-6">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
            <span>✨</span>
            Create New Party
          </h2>
          <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
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
        <div className="flex items-center gap-4 mb-5 md:mb-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-xs md:text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* Join Party Card */}
        <div className="card p-5 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
            <span>🔗</span>
            Join Existing Party
          </h2>
          <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
            Enter a room ID to join an existing party
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
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