import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Users, Settings } from 'lucide-react';

export default function VideoArea({ participants = [] }) {
  const [localStream, setLocalStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    initializeLocalStream();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      setIsConnected(true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setIsConnected(false);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setIsConnected(false);
    }
  };

  const hasRemoteParticipant = participants.length > 1;

  return (
    <div className="h-full bg-black  text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-800/10 rounded-full blur-3xl floating-animation" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      <div className="relative  z-10 p-6 border-b border-gray-800/50 glass-panel border-0 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold gradient-text">Video Interview</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{participants.length || 1} participant{participants.length !== 1 ? 's' : ''}</span>
            </div>
            <button className="btn-secondary flex items-center space-x-2 text-sm">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="relative z-10 flex-1 p-6">
        {hasRemoteParticipant ? (
          // Two-participant layout
          <div className="grid grid-cols-2 gap-6 h-full">
            {/* Local Video */}
            <div className="relative glass-panel rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">You</span>
                  </div>
                </div>
              )}
              
              {/* Local Video Label */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
                <span className="text-white text-sm font-medium">You</span>
              </div>

              {/* Local Video Status */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {!isVideoEnabled && (
                  <div className="w-8 h-8 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30 flex items-center justify-center">
                    <VideoOff className="w-4 h-4 text-red-400" />
                  </div>
                )}
                {!isAudioEnabled && (
                  <div className="w-8 h-8 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30 flex items-center justify-center">
                    <MicOff className="w-4 h-4 text-red-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Remote Video */}
            <div className="relative glass-panel rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl font-bold">G</span>
                  </div>
                  <p className="text-white font-semibold mb-2">Waiting for participant...</p>
                  <p className="text-gray-400 text-sm">Share the interview link to get started</p>
                </div>
              </div>
              
              {/* Remote Video Label */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
                <span className="text-white text-sm font-medium">Guest</span>
              </div>
            </div>
          </div>
        ) : (
          // Single participant layout
          <div className="h-full flex items-center justify-center">
            <div className="relative glass-panel rounded-2xl overflow-hidden max-w-4xl w-full aspect-video group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-white text-3xl font-bold">You</span>
                  </div>
                </div>
              )}
              
              {/* Single Video Label */}
              <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                <span className="text-white font-medium">You</span>
              </div>

              {/* Single Video Status */}
              <div className="absolute top-6 right-6 flex space-x-3">
                {!isVideoEnabled && (
                  <div className="w-10 h-10 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 flex items-center justify-center">
                    <VideoOff className="w-5 h-5 text-red-400" />
                  </div>
                )}
                {!isAudioEnabled && (
                  <div className="w-10 h-10 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 flex items-center justify-center">
                    <MicOff className="w-5 h-5 text-red-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="relative z-10 p-6 border-t border-gray-800/50">
        <div className="flex justify-center">
          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-center space-x-4">
              {/* Audio Control */}
              <button
                onClick={toggleAudio}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                  isAudioEnabled 
                    ? 'bg-gray-800/50 text-white border border-gray-700/50 hover:bg-gray-700/50' 
                    : 'bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-400'
                }`}
                title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>

              {/* Video Control */}
              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                  isVideoEnabled 
                    ? 'bg-gray-800/50 text-white border border-gray-700/50 hover:bg-gray-700/50' 
                    : 'bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-400'
                }`}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>

              {/* End Call */}
              <button
                onClick={endCall}
                className="w-14 h-14 rounded-xl bg-red-500 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-red-400 shadow-lg shadow-red-500/25"
                title="End call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Call Info */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Interview session • {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}