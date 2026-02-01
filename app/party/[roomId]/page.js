"use client";

import { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LocalVideoTile from "@/components/localVideoTile";
import RemoteVideoTile from "@/components/remoteVideoTile";
import { getSocket } from "@/lib/socketClient";
import { createPeerConnection } from "@/lib/webRTC";
import {useRouter} from "next/navigation"

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
      alert("Someone is already presenting")
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
        alert("Permissions denied. Please allow camera and microphone access.");
      } else if (err && err.name === "NotFoundError") {
        alert("No camera or microphone found.");
      } else {
        alert("Failed to access camera/microphone.");
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
  // window.location.href = "/party"; // or /dashboard
  const router=useRouter();
  router.replace("/dashboard");
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
    return <div className="p-10 text-gray-400">Loading…</div>;

  /* ======================
     RENDER
     ====================== */
  return (
    <div className="h-screen p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">🎉 Watch Party</h1>
      <h1 className="text-lg">Room ID: {roomId}</h1>

      {/* 🎯 MAIN STAGE */}
      {presenterId && (
        <div className="flex justify-center">
          <div className="w-full max-w-5xl aspect-video">
            {isPresenter ? (
              <LocalVideoTile stream={localStream} pinned />
            ) : (
              <RemoteVideoTile
                stream={remoteStreams[presenterId]}
                pinned
              />
            )}
          </div>
        </div>
      )}

      {/* 👥 PARTICIPANTS (ALWAYS VISIBLE) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 grow">
        {/* Local tile always visible */}
        <LocalVideoTile stream={localStream} />

        {Object.entries(remoteStreams).map(
          ([id, stream]) =>
            id !== presenterId && (
              <RemoteVideoTile key={id} stream={stream} />
            )
        )}
      </div>

      {/* 🎛 CONTROLS */}
      <div className="flex justify-center gap-4">
        <button onClick={toggleMic}>
          🎤 {micOn ? "Mute" : "Unmute"}
        </button>
        <button onClick={toggleCam}>
          🎥 {camOn ? "Cam Off" : "Cam On"}
        </button>
        <button
          disabled={presenterId && !isPresenter}
          onClick={startScreenShare}
        >
          🖥 Share Screen
        </button>
        {isPresenter && (
          <button onClick={stopScreenShare}>⛔ Stop</button>
        )}
        <button onClick={leaveRoom}>
          ❌ Leave Room
        </button>
      </div>
    </div>
  );
}
