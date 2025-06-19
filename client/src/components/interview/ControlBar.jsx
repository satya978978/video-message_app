import { Code, FileText, MessageCircle, Sparkles } from 'lucide-react';

export default function ControlBar({ activePanel, setActivePanel, sessionId }) {
  const controls = [
    { id: 'code', icon: Code, label: 'Live Code', tooltip: 'Collaborative coding environment' },
    { id: 'docs', icon: FileText, label: 'Documents', tooltip: 'Shared documents & whiteboard' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', tooltip: 'Real-time messaging' },
    { id: 'ai', icon: Sparkles, label: 'AI Questions', tooltip: 'AI-powered question generation' },
  ];

  const handlePanelToggle = (panelId) => {
    setActivePanel(activePanel === panelId ? null : panelId);
  };

  return (
    <div className="bg-black border-t border-gray-800/50 px-6 py-6">
      <div className="flex justify-center">
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex space-x-3">
            {controls.map(({ id, icon: Icon, label, tooltip }) => (
              <button
                key={id}
                onClick={() => handlePanelToggle(id)}
                className={`group relative flex flex-col items-center space-y-2 px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                  activePanel === id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                title={tooltip}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{label}</span>
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-700/50">
                  {tooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}