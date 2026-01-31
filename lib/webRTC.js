export function createPeerConnection(socket, remoteSocketId, localStream, onTrack) {
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
    ],
  });

  // send local tracks
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // receive remote tracks
  pc.ontrack = (event) => {
    onTrack(event.streams[0]);
  };

  // ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("webrtc-ice", {
        to: remoteSocketId,
        candidate: event.candidate,
      });
    }
  };

  return pc;
}
