import { useState, useEffect, useRef } from 'react';
import VideoArea from './interview/VideoArea';
import ControlBar from './interview/ControlBar';
import CodePanel from './interview/CodePanel';
import DocsPanel from './interview/DocsPanel';
import ChatPanel from './interview/ChatPanel';
import AIPanel from './interview/AIPanel';
import { io } from 'socket.io-client';
import { useParams, Navigate } from 'react-router-dom';
import SimplePeer from 'simple-peer';

export default function InterviewRoom() {
  const { sessionId } = useParams();

  const [activePanel, setActivePanel] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);

  const socket = useRef();
  const peerRef = useRef({});
  const userSocketId = useRef();

  useEffect(() => {
    const getPermissions = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(localStream);
    };
    getPermissions();
  }, []);


  useEffect(() => {
    if (!stream) return;
    const backendLink = import.meta.env.VITE_BACKEND_LINK;
    socket.current = io(backendLink);


    socket.current.on('connect', () => {
      console.log("interview mounted")
      console.log(`Connected as ${socket.current.id}`);
      userSocketId.current = socket.current.id;
      socket.current.emit('join-room', { roomid: sessionId });
    });

    socket.current.on('room-full', () => {
      alert('Room is full. Cannot join.');
    });

    socket.current.on('user-joined-4host', ({ NewUserId }) => {
      console.log(`Starting call as initiator with ${NewUserId}`);
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (signal) => {
        socket.current.emit('send-signal', {
          to: NewUserId,
          from: userSocketId.current,
          signal,
        });
      });

      peer.on('stream', (remote) => {
        setRemoteStream(remote);
      });

      peerRef.current[NewUserId] = peer;
    });

    socket.current.on('sendig-signal-4user', ({ from, signal }) => {
      if (!stream) {
        console.error('No local stream yet! Waiting for media...');
        return;
      }
      console.log(`Received offer from ${from}`);
      const peer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (answerSignal) => {
        socket.current.emit('sending-recivied-signal', {
          to: from,
          from: userSocketId.current,
          signal: answerSignal,
        });
      });

      peer.on('stream', (remote) => {
        setRemoteStream(remote);
      });

      peer.signal(signal);
      peerRef.current[from] = peer;
    });

    socket.current.on('end-handshake', ({ from, signal }) => {
      console.log(`Received answer from ${from}`);
      const peer = peerRef.current[from];
      if (peer && !peer.destroyed) {
        peer.signal(signal);
      }
      console.log("handshake ok")
    });
    socket.current.on("peer-destroy", ({ id }) => {
      const peer = peerRef.current[id]
      if (peer) {
        peer.destroy()
      }
      delete peerRef.current[id]
      console.log(`Peer ${id} left, destroyed connection.`);
      socket.current.emit("leave_room", { roomid: sessionId })

      setMeetingEnded(true)

    })
    return () => {
      socket.current.disconnect();
      console.log("interview unmounted")

    };
  }, [stream]);



  const renderPanel = () => {
    switch (activePanel) {
      case 'code':
        return <CodePanel sessionId={sessionId} />;
      case 'docs':
        return <DocsPanel sessionId={sessionId} />;
      case 'chat':
        return <ChatPanel sessionId={sessionId} />;
      case 'ai':
        return <AIPanel sessionId={sessionId} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {meetingEnded && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="animate-slide-in bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <h2 className="text-2xl font-semibold text-white mb-3">You Ended Meet</h2>
            <p className="text-gray-200 mb-6">The call has been disconnected.</p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-white/20 text-white px-5 py-2 rounded-full border border-white/30 hover:bg-white/30 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}



      <div className="flex-1 flex">
        <div className={`transition-all duration-300 ${activePanel ? 'w-1/2' : 'w-full'}`}>
          <VideoArea localvideo={stream} remotvideo={remoteStream} socket={socket} />
        </div>
        {activePanel && (
          <div className="w-1/2 border-l border-gray-200 bg-white">
            {renderPanel()}
          </div>
        )}
      </div>

      <ControlBar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        sessionId={sessionId}
      />
    </div>
  );
}
