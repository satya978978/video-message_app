import { useState } from 'react';
import { FileText, Download, Edit3, Palette } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import DrawingCanvas from './DrawingCanvas';

export default function DocsPanel({ sessionId ,Question}) {
  const [content, setContent] = useState('');
  const [currentMode, setCurrentMode] = useState('writing');

  const exportToPDF = () => {
    console.log('Exporting to PDF...the ');
  };

  const toggleMode = () => {
    setCurrentMode(currentMode === 'writing' ? 'drawing' : 'writing');
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800/50 glass-panel border-0 border-b border-gray-800/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold gradient-text">Collaborative Documents</h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMode}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentMode === 'writing'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-700/50'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Writing Mode</span>
            </button>
            
            <button
              onClick={toggleMode}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentMode === 'drawing'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-700/50'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Drawing Mode</span>
            </button>
          </div>
        </div>

       
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {currentMode === 'writing' ? (
          <div className="flex-1 glass-panel rounded-xl m-6">
<RichTextEditor content={content} Question={Question} onChange={setContent} />
          </div>
        ) : (
          <div className="flex-1">
            <DrawingCanvas sessionId={sessionId} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-800/50 glass-panel border-0 border-t border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Auto-saved</span>
            </div>
            <div className="text-sm text-gray-500">
              Last saved: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Mode: {currentMode === 'writing' ? 'Writing' : 'Drawing'}
            </span>
            {currentMode === 'writing' && (
              <>
                <span className="text-sm text-gray-500">
                  {content.replace(/<[^>]*>/g, '').length} characters
                </span>
               
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}