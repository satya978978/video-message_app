import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Users, Settings } from 'lucide-react';
import { useParams } from 'react-router-dom';
import e from 'cors';

export default function VideoArea({remotvideo,localvideo,socket}) {
    const { sessionId } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
 const remotestream= useRef()

const myvid= useRef()
  
   useEffect(() => {
    if (myvid.current && localvideo) {
       myvid.current.srcObject= localvideo
      
    }
   }, [localvideo])
   
  useEffect(() => {
    if (remotestream.current && remotvideo) {
      remotestream.current.srcObject = remotvideo; // works now!
    }

  }, [remotvideo]);

  
  const toggleVideo = () => {
   if (localvideo) {
    const video_tracks= localvideo.getVideoTracks()[0]
    if (video_tracks) {
      video_tracks.enable=!video_tracks.enable
      setIsVideoEnabled(!video_tracks.enable)
      
    }
    
   }
  };

  const toggleAudio = () => {
   if (localvideo) {
    const audio_track= localvideo.getAudioTracks()[0]
    audio_track.enable= !audio_track.enable
    setIsAudioEnabled(!audio_track.enable)
   }
  };

  const endCall = () => {
    if (localvideo) {
      localvideo.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setIsConnected(false);
     
    }
    if (socket) {
          socket.current.emit("peer_broke",{roomid:sessionId})
    console.log("ok hai cut") 
    setIsVideoEnabled(false)
    }else{
      console.log("socket nhi hai")
    }


  };

  return (
    <div className="h-full bg-black  text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-800/10 rounded-full blur-3xl floating-animation" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-gray-800/50 glass-panel border-0 border-b border-gray-800/50">
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
          
          
        </div>
      </div>


      {/* Video Area */}
      <div className="relative  z-10 flex-1  p-6">
        {remotestream ? (
          // Two-participant layout
          <div className="grid grid-cols-2 gap-6 h-full">
            {/* Local Video */}
            <div className="relative glass-panel rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <video
                ref={myvid}
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

              {/* Hover Controls for Local Video - Bottom positioned */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                <div className="flex items-center justify-center space-x-3">
                  {/* Audio Control */}
                  <button
                    onClick={toggleAudio}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                      isAudioEnabled 
                        ? 'bg-gray-800/70 text-white border border-gray-600/50 hover:bg-gray-700/70' 
                        : 'bg-red-500/90 text-white shadow-lg shadow-red-500/25 hover:bg-red-400/90'
                    }`}
                    title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  {/* Video Control */}
                  <button
                    onClick={toggleVideo}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                      isVideoEnabled 
                        ? 'bg-gray-800/70 text-white border border-gray-600/50 hover:bg-gray-700/70' 
                        : 'bg-red-500/90 text-white shadow-lg shadow-red-500/25 hover:bg-red-400/90'
                    }`}
                    title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  {/* End Call */}
                  <button
                    onClick={endCall}
                    className="w-12 h-12 rounded-xl bg-red-500/90 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-red-400/90 shadow-lg shadow-red-500/25 backdrop-blur-sm"
                    title="End call"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status indicators (always visible when disabled) */}
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
                ref={remotestream}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
             {!remotvideo &&( <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl font-bold">G</span>
                  </div>
                  <p className="text-white font-semibold mb-2">Waiting for participant...</p>
                  <p className="text-gray-400 text-sm">Share the interview link to get started</p>
                </div>
              </div>)}
              
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
                ref={myvid}
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

              {/* Hover Controls for Single Video - Bottom positioned */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                <div className="flex items-center justify-center space-x-4">
                  {/* Audio Control */}
                  <button
                    onClick={toggleAudio}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                      isAudioEnabled 
                        ? 'bg-gray-800/70 text-white border border-gray-600/50 hover:bg-gray-700/70' 
                        : 'bg-red-500/90 text-white shadow-lg shadow-red-500/25 hover:bg-red-400/90'
                    }`}
                    title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>

                  {/* Video Control */}
                  <button
                    onClick={toggleVideo}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                      isVideoEnabled 
                        ? 'bg-gray-800/70 text-white border border-gray-600/50 hover:bg-gray-700/70' 
                        : 'bg-red-500/90 text-white shadow-lg shadow-red-500/25 hover:bg-red-400/90'
                    }`}
                    title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  </button>

                  {/* End Call */}
                  <button
                    onClick={endCall}
                    className="w-16 h-16 rounded-xl bg-red-500/90 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-red-400/90 shadow-lg shadow-red-500/25 backdrop-blur-sm"
                    title="End call"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Status indicators (always visible when disabled) */}
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

     
    </div>
  );
}