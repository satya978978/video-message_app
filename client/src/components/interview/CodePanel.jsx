import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Play, Copy, Code2, Lock, Unlock } from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import axios from '../auth/axios.js';
import { MonacoBinding } from 'y-monaco'
import { WebsocketProvider } from 'y-websocket';
import { useParams } from 'react-router-dom';
import * as Y from 'yjs';


const languages = [
  { id: 'nodejs', name: 'JavaScript', defaultCode: '// Write your JavaScript code here\nfunction solution() {\n    // Your code here\n    return "Hello World!";\n}\n\nconsole.log(solution());' },
  { id: 'python3', name: 'Python', defaultCode: '# Write your Python code here\ndef solution():\n    # Your code here\n    return "Hello World!"\n\nprint(solution())' },
  { id: 'java', name: 'Java', defaultCode: '// Write your Java code here\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}' },
  { id: 'cpp', name: 'C++', defaultCode: '// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!" << endl;\n    return 0;\n}' },
];

export default function CodePanel({ }) {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState(selectedLanguage.defaultCode);
  const [isLocked, setIsLocked] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setoutput] = useState("")
  const [backlanguage, setbacklanguage] = useState("")
  const editorRef = useRef(null)
  const [isMounted, setisMounted] = useState(false)
  const { sessionId } = useParams()

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    console.log(setSelectedLanguage.id)
    setCode(language.defaultCode);
    setbacklanguage(language.id)
  };
  const handleCodeChange = (e) => {
    if (!isLocked) {
      setCode(e.target.value);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const runCode = async () => {
    try {
      setIsRunning(true);
      const res = await axios.post("/api/runcode", { code, backlanguage }
      )
      console.log(res.data.output)
      setoutput(res.data.output)
      setIsRunning(false)
    } catch (err) {
      console.log("err hai idhar")
      console.log(err)
      setIsRunning(false)
    }

  };
  useEffect(() => {
    if (isMounted) {
      const ydoc = new Y.Doc()
      const provider = new WebsocketProvider('ws://localhost:5000/yjs', sessionId, ydoc)
      const ytext = ydoc.getText('monaco')
                console.log("Model: ", editorRef.current?.getModel());

      if (editorRef.current) { // extra check lga diya 
        new MonacoBinding(
          ytext,
          editorRef.current.getModel(),
          new Set([editorRef.current]),
          provider.awareness
        )

      } else {
        console.log("err")
      }


    }
  },[isMounted])
  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800/50 glass-panel border-0 border-b border-gray-800/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold gradient-text">Live Code Editor</h3>
          </div>

          <div className="relative">
            <select
              value={selectedLanguage.id}
              onChange={(e) => {
                const lang = languages.find(lang => lang.id === e.target.value);
                handleLanguageChange(lang);
              }}
              className="appearance-none bg-gray-800/50 border border-gray-700/50 text-white rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-gray-800">
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={copyCode}
            className="btn-secondary flex items-center space-x-2 text-sm"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="btn-primary1 flex items-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      {/* Editor + Output Panel Side by Side */}
      <div className="flex-1 p-2">
        <div className="h-full flex gap-1">
          {/* Monaco Editor */}
          <div className="flex-1 glass-panel rounded-xl overflow-hidden">
            <Editor
              theme="vs-dark"
              defaultLanguage={selectedLanguage.id}
              language={selectedLanguage.id}
              onChange={(value) => setCode(value)}
              defaultValue={selectedLanguage.defaultCode}
              value={code}
              onMount={(editor) => {
                editorRef.current = editor
                setisMounted(true)

              }}
            />
          </div>

          {/* Output Panel */}
          <div className="w-[33%] glass-panel rounded-xl overflow-hidden bg-gray-1000 border border-gray-800 flex flex-col">
            <div className="p-2 border-b border-gray-700 text-sm font-semibold text-white bg-gray-900">
              Output
            </div>
            <div className="flex-1 p-4 text-sm text-green-400 overflow-y-auto whitespace-pre-wrap font-mono">
              {/* Replace this with your dynamic output */}
              {`// Output will appear here...\n\n${output}`}

            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <div className="p-6 border-t border-gray-800/50 glass-panel border-0 border-t border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Connected</span>
            </div>
            <div className="text-sm text-gray-500">
              {code.split('\n').length} lines • {code.length} characters
            </div>
          </div>
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isLocked
              ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
              }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Locked</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlocked</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}