import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoArea from './interview/VideoArea';
import ControlBar from './interview/ControlBar';
import CodePanel from './interview/CodePanel';
import DocsPanel from './interview/DocsPanel';
import ChatPanel from './interview/ChatPanel';
import AIPanel from './interview/AIPanel';

export default function InterviewRoom() {
  const { sessionId } = useParams();
  const [activePanel, setActivePanel] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Initialize WebRTC and Socket connections
    console.log('Interview room initialized:', sessionId);
  }, [sessionId]);

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
        {/* Video Area */}
        <div className={`transition-all duration-300 ${activePanel ? 'w-1/2' : 'w-full'}`}>
          <VideoArea participants={participants} />
        </div>

        {/* Side Panel */}
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