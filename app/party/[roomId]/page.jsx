"use client";

import { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LocalVideoTile from "@/components/localVideoTile";
import RemoteVideoTile from "@/components/remoteVideoTile";
import { getSocket } from "@/lib/socketClient";
import { createPeerConnection } from "@/lib/webRTC";
import {useRouter} from "next/navigation"
import { toast } from "react-toastify";

export default function PartyPage() {
  const { roomId } = useParams();
  const socket = getSocket();

  const [roomState, setRoomState] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [presenterId, setPresenterId] = useState(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const peersRef = useRef({});
  const cameraTrackRef = useRef(null);
  const screenStreamRef = useRef(null);

  const isPresenter = presenterId === socket.id;

  /* ======================
     JOIN ROOM
     ====================== */
  useEffect(() => {
    socket.emit("join-room", { roomId });
    
    socket.on("room-state", setRoomState);
    socket.on("presenter-changed", ({ presenterId }) =>
      setPresenterId(presenterId)
    );

    socket.on("screen-share-denied", () =>
      toast.error("Someone is already presenting")
    );

    socket.on("user-left", ({ socketId }) => {
      peersRef.current[socketId]?.close();
      delete peersRef.current[socketId];

      setRemoteStreams((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
    });

    return () => {
      socket.off("room-state");
      socket.off("presenter-changed");
      socket.off("screen-share-denied");
      socket.off("user-left");
    };
  }, [roomId]);

  /* ======================
     MEDIA
     ====================== */
 useEffect(() => {
  let active = true;

  async function init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (!active) return;

      setLocalStream(stream);
      cameraTrackRef.current = stream.getVideoTracks()[0];
    } catch (err) {
      if (!active) return;

      if (err && err.name === "NotAllowedError") {
        toast.error("Permissions denied. Please allow camera and microphone access.");
      } else if (err && err.name === "NotFoundError") {
        toast.error("No camera or microphone found.");
      } else {
        toast.error("Failed to access camera/microphone.");
      }

      setLocalStream(null);
    }
  }

  init();

  // ✅ cleanup
  return () => {
    active = false;
    if (cameraTrackRef.current) {
      cameraTrackRef.current.stop();
    }
  };
}, []);


  /* ======================
     CREATE OFFERS
     ====================== */
  useEffect(() => {
    if (!roomState || !localStream) return;

    roomState.users.forEach(async (id) => {
      if (id === socket.id) return;
      if (peersRef.current[id]) return;

      const pc = createPeerConnection(
        socket,
        id,
        localStream,
        (stream) =>
          setRemoteStreams((p) => ({ ...p, [id]: stream }))
      );

      peersRef.current[id] = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtc-offer", { to: id, offer });
    });
  }, [roomState, localStream]);

  /* ======================
     SIGNALING
     ====================== */
  useEffect(() => {
    if (!localStream) return;

    socket.on("webrtc-offer", async ({ from, offer }) => {
      const pc = createPeerConnection(
        socket,
        from,
        localStream,
        (stream) =>
          setRemoteStreams((p) => ({ ...p, [from]: stream }))
      );

      peersRef.current[from] = pc;
      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc-answer", { to: from, answer });
    });

    socket.on("webrtc-answer", async ({ from, answer }) => {
      await peersRef.current[from]?.setRemoteDescription(answer);
    });

    socket.on("webrtc-ice", async ({ from, candidate }) => {
      await peersRef.current[from]?.addIceCandidate(candidate);
    });

    return () => {
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice");
    };
  }, [localStream]);

  /* ======================
     SCREEN SHARE
     ====================== */
const startScreenShare = async () => {
  try {
    socket.emit("start-screen-share");
    toast.info("You have started presenting");

    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const screenTrack = screenStream.getVideoTracks()[0];
    screenStreamRef.current = screenStream;

    // Save camera track once
    if (!cameraTrackRef.current) {
      cameraTrackRef.current =
        localStream?.getVideoTracks()?.[0] ?? null;
    }

    Object.values(peersRef.current).forEach((pc) => {
      const sender = pc
        .getSenders()
        .find((s) => s.track?.kind === "video");

      sender?.replaceTrack(screenTrack);
    });

    setLocalStream(
      new MediaStream([
        screenTrack,
        ...(localStream?.getAudioTracks() ?? []),
      ])
    );

    screenTrack.onended = stopScreenShare;
  } catch (err) {
    if (err.name === "NotAllowedError") {
      console.log("Screen sharing cancelled by user");
    } else {
      console.error("Screen share failed", err);
    }
  }
};


 const stopScreenShare = () => {
  socket.emit("stop-screen-share");
  toast.info("You have stopped presenting");

  const cameraTrack = cameraTrackRef.current;
  if (!cameraTrack) return;

  Object.values(peersRef.current).forEach((pc) => {
    const sender = pc
      .getSenders()
      .find((s) => s.track?.kind === "video");

    sender?.replaceTrack(cameraTrack);
  });

  setLocalStream(
    new MediaStream([
      cameraTrack,
      ...(localStream?.getAudioTracks() ?? []),
    ])
  );

  screenStreamRef.current?.getTracks().forEach((t) => t.stop());
  screenStreamRef.current = null;
};


  const leaveRoom = () => {
    toast.info("Leaving the party...");
  // 1️⃣ Close all peer connections
  Object.values(peersRef.current).forEach((pc) => pc.close());
  peersRef.current = {};

  // 2️⃣ Stop local media
  localStream?.getTracks().forEach((t) => t.stop());

  // 3️⃣ Stop screen share if active
  screenStreamRef.current?.getTracks().forEach((t) => t.stop());
  screenStreamRef.current = null;

  // 4️⃣ Disconnect socket → triggers server cleanup
  socket.disconnect();

  // 5️⃣ Redirect user
   window.location.href = "/dashboard"; // or /dashboard
  // const router=useRouter();
  // router.replace("/dashboard");
};


  /* ======================
     MIC / CAM
     ====================== */
  const toggleMic = () =>
    localStream.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
      setMicOn(t.enabled);
    });

  const toggleCam = () =>
    localStream.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
      setCamOn(t.enabled);
    });

  if (!roomState || !localStream)
    return (
      <div className="h-screen flex items-center justify-center gradient-mesh">
        <div className="text-center animate-fade-in">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Joining party...</p>
        </div>
      </div>
    );

  /* ======================
     RENDER
     ====================== */
  const participantCount = Object.keys(remoteStreams).length + 1;

  return (
    <div className="party-container">
      {/* HEADER */}
      <header className="party-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Watch Party
              </span>
            </h1>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full">
              <span className="text-sm text-gray-400">Room:</span>
              <code className="text-sm font-mono text-white">{roomId}</code>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">{participantCount} {participantCount === 1 ? 'person' : 'people'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="party-main">
        {/* MAIN STAGE - Presenter View */}
        <div className="party-stage">
          {presenterId ? (
            <div className="presenter-view">
              {isPresenter ? (
                <LocalVideoTile stream={localStream} pinned isPresenting />
              ) : (
                <RemoteVideoTile
                  stream={remoteStreams[presenterId]}
                  pinned
                  isPresenting
                  label="Presenter"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 glass rounded-2xl max-w-md">
              <div className="text-6xl mb-4">🖥️</div>
              <h3 className="text-xl font-semibold mb-2">No one is presenting</h3>
              <p className="text-gray-400 mb-4">Click "Share Screen" to start presenting to everyone</p>
            </div>
          )}
        </div>

        {/* SIDEBAR - Participants */}
        <aside className="party-sidebar">
          <div className="text-sm text-gray-400 font-medium mb-2 px-1">Participants</div>
          
          {/* Local user tile - always show unless presenting */}
          {(!presenterId || !isPresenter) && (
            <LocalVideoTile stream={localStream} />
          )}

          {/* Remote participants - exclude presenter */}
          {Object.entries(remoteStreams).map(
            ([id, stream], index) =>
              id !== presenterId && (
                <RemoteVideoTile 
                  key={id} 
                  stream={stream} 
                  label={`Guest ${index + 1}`}
                />
              )
          )}

          {/* Show presenter in sidebar too if it's a remote user */}
          {presenterId && !isPresenter && (
            <div className="mt-2 pt-2 border-t border-gray-800">
              <div className="text-xs text-gray-500 mb-2 px-1">Presenter (Large View)</div>
            </div>
          )}
        </aside>
      </main>

      {/* CONTROLS */}
      <footer className="party-controls">
        <div className="control-bar">
          <button 
            onClick={toggleMic} 
            className={`control-btn ${micOn ? '' : 'active'}`}
            title={micOn ? 'Mute' : 'Unmute'}
          >
            {micOn ? '🎤' : '🔇'}
          </button>
          
          <button 
            onClick={toggleCam} 
            className={`control-btn ${camOn ? '' : 'active'}`}
            title={camOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {camOn ? '📹' : '📷'}
          </button>

          <button
            disabled={presenterId && !isPresenter}
            onClick={startScreenShare}
            className={`control-btn ${isPresenter ? 'active' : ''}`}
            title={presenterId && !isPresenter ? 'Someone is already presenting' : 'Share screen'}
          >
            🖥️
          </button>

          {isPresenter && (
            <button 
              onClick={stopScreenShare} 
              className="control-btn"
              title="Stop presenting"
            >
              ⏹️
            </button>
          )}

          <div className="w-px h-8 bg-gray-700 mx-2"></div>

          <button 
            onClick={leaveRoom} 
            className="control-btn danger"
            title="Leave party"
          >
            📞
          </button>
        </div>
      </footer>
    </div>
  );
}
