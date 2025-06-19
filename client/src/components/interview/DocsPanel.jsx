import { useState } from 'react';
import { Pen, Square, Circle, Eraser, Download, FileText, Palette } from 'lucide-react';

const drawingTools = [
  { id: 'pen', icon: Pen, label: 'Pen' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

export default function DocsPanel({ sessionId }) {
  const [content, setContent] = useState('');
  const [activeDrawingTool, setActiveDrawingTool] = useState('pen');
  const [showDrawing, setShowDrawing] = useState(false);

  const exportToPDF = () => {
    console.log('Exporting to PDF...');
    // Implementation for PDF export
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
              onClick={() => setShowDrawing(!showDrawing)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showDrawing 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-700/50'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Drawing Mode</span>
            </button>
          </div>
        </div>

        <button
          onClick={exportToPDF}
          className="btn-primary flex items-center space-x-2 text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>

      {showDrawing && (
        <div className="flex items-center space-x-4 p-6 border-b border-gray-800/50 glass-panel border-0 border-b border-gray-800/50">
          <span className="text-sm font-semibold text-gray-300">Drawing Tools:</span>
          <div className="flex space-x-2">
            {drawingTools.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveDrawingTool(id)}
                className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                  activeDrawingTool === id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-white hover:bg-gray-700/50'
                }`}
                title={label}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex p-6 space-x-6">
        {showDrawing ? (
          <>
            <div className="w-1/2">
              <div className="h-full glass-panel rounded-xl p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Document Editor</h4>
                  <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start typing your document content..."
                  className="w-full h-full bg-transparent text-gray-200 resize-none focus:outline-none leading-relaxed"
                  style={{ minHeight: '400px' }}
                />
              </div>
            </div>
            <div className="w-1/2">
              <div className="h-full glass-panel rounded-xl p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Drawing Canvas</h4>
                  <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                </div>
                <div className="h-full flex items-center justify-center bg-gray-900/30 rounded-lg border-2 border-dashed border-gray-700/50">
                  <div className="text-center text-gray-500">
                    <Square className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-lg font-medium mb-2">Drawing Canvas</p>
                    <p className="text-sm">Draw diagrams, sketches, and visual explanations</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full">
            <div className="h-full glass-panel rounded-xl p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Document Editor</h4>
                <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your document content..."
                className="w-full h-full bg-transparent text-gray-200 resize-none focus:outline-none leading-relaxed"
                style={{ minHeight: '500px' }}
              />
            </div>
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
              {content.length} characters
            </span>
            <span className="text-sm text-gray-500">
              {content.split('\n').length} lines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}