import { useState, useEffect, useRef } from 'react';
import VideoArea from './interview/VideoArea';
import ControlBar from './interview/ControlBar';
import CodePanel from './interview/CodePanel';
import DocsPanel from './interview/DocsPanel';
import ChatPanel from './interview/ChatPanel';
import AIPanel from './interview/AIPanel';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import SimplePeer from 'simple-peer';
import { CloudHail } from 'lucide-react';




export default function InterviewRoom() {
  const [conecteduser_signal, setconecteduser_signal] = useState("")
  const { sessionId } = useParams();
  const [activePanel, setActivePanel] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [stream, setstream] = useState('')
  const [connectedUserId, setConnectedUserId] = useState("");
  const socket = useRef()
  const myvideo = useRef()
  const peerRef = useRef()
  const RemoteStream = useRef()
  const userSocketid= useRef()
  useEffect(() => {
    const getpermisions = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      setstream(stream)
      myvideo.current.srcObject = stream
    }
    getpermisions()

  }, [])
  useEffect(() => {
    if (!stream) return
    const backend_link = import.meta.env.VITE_BACKEND_LINK;
    socket.current = io(backend_link);

    socket.current.on('connect', () => {
console.log(`new user connected ${socket.current.id}`);
userSocketid.current=socket.current.id
      socket.current.emit("join-room", { sessionId })

    })
  socket.current.on('user-joined-4host', ({NewUserId}) => {
    const peer = new SimplePeer({ initiator: true, trickle: false, stream })
    peer.on('signal', signal => {
      socket.current.emit('send-signal', {
        signal,
        from:  socket.current.id,
        to: NewUserId
      });
    })
    peer.on("stream", remotestream => {
      RemoteStream.current.srcObject = remotestream
    })
    socket.current.on("end-handshake", ({ signal }) => {
      console.log("ok hai sab bro")
      peer.signal(signal);
    });

  })
socket.current.on("sendig-signal-4user", ({ from, signal }) => {
    const peer = new SimplePeer({ initiator: false, trickle: false, stream });
    peer.on('signal', answerSignal => {
      socket.current.emit('sending-recivied-signal', { signal: answerSignal, to: from })
    })
    peer.on("stream", remotestream => {
      RemoteStream.current.srcObject = remotestream
    })
    peer.signal(signal)
  })

  },[stream])

  

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
    <div className="h-screen bg-gray-50 flex flex-col">



      {/* Main Content */}
      <div className="flex-1 flex">
        <div className={`transition-all duration-300 ${activePanel ? 'w-1/2' : 'w-full'}`}>
          <VideoArea myvid={myvideo} remotvideo={RemoteStream} />
        </div>


        {activePanel && (
          <div className="w-1/2 border-l border-gray-200 bg-white">
            {renderPanel()}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <ControlBar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        sessionId={sessionId}
      />
    </div>
  );
}