import { Send, Smile, User, Bot, ScatterChart } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useFetcher } from 'react-router-dom';
import { io } from 'socket.io-client';
import { WebsocketProvider } from 'y-websocket';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


import * as Y from 'yjs';

export default function ChatPanel() {
  console.log("render")

  const SettingUid = () => {
    const id = localStorage.getItem('SenderID')
    if (!id) {
      const uid = uuidv4()
      localStorage.setItem('SenderID', uid)

    }
    return id
  }
  const [message, setmessage] = useState(null)
  const [chat, setchat] = useState([])
  const { sessionId } = useParams()
  const docArrayRef = useRef(null)
  const SenderId = useRef(SettingUid())
  console.log(`this is sender id${SenderId.current}`)
  useEffect(() => {


    console.log('useeffct')
    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider('ws://localhost:5000/yjs', sessionId, ydoc)
    docArrayRef.current = ydoc.getArray('chat')

    const setaray = () => {

      setchat(docArrayRef.current.toArray())

    }

    docArrayRef.current.observe(setaray)
    setaray()

  }, [])


  const messageSend = (e) => {
    e.preventDefault(); 


    const mymessageis = { message: message, senderid: SenderId.current, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    docArrayRef.current.push([mymessageis])

  }





return (
  <div className="h-[748px] flex flex-col bg-black text-white">
    {/* Header */}
    <div className="p-6 border-b border-gray-800/50 flex-shrink-0">
      <h3 className="text-xl font-bold text-white flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
          <Send className="w-5 h-5 text-white" />
        </div>
        <span className="gradient-text">Live Chat</span>
      </h3>
      <div className="flex items-center space-x-2 mt-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-400">Connected</span>
      </div>
    </div>

    {/* Chat messages area */}
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
      {chat && chat.map((m, i) => (
        m.senderid === SenderId.current ? (
          <div key={i} className="flex items-start space-x-3 flex-row-reverse space-x-reverse">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-600">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 max-w-xs text-right">
              <div className="inline-block p-4 rounded-2xl bg-blue-600 text-white rounded-br-md">
                <p className="text-sm leading-relaxed">{m.message}</p>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 justify-end">
                <span className="font-medium">You</span>
                <span>•</span>
                <span>{m.time}</span>
              </div>
            </div>
          </div>
        ) : (
          <div key={i} className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 max-w-xs text-left">
              <div className="inline-block p-4 rounded-2xl bg-gray-800/50 text-gray-200 border border-gray-700/50 rounded-bl-md">
                <p className="text-sm leading-relaxed">{m.message}</p>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 justify-start">
                <span className="font-medium">Interviewer</span>
                <span>•</span>
                <span>{m.time}</span>
              </div>
            </div>
          </div>
        )
      ))}
    </div>

    {/* Input Area */}
    <div className="p-6 border-t border-gray-800/50 flex-shrink-0">
      <form onSubmit={messageSend}>
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              placeholder="Type your message..."
              className="input-field w-full pr-12"
              value={message || ""}
              onChange={(e) => setmessage(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button type="submit" className="btn-primary flex items-center justify-center w-12 h-12">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
    </div>
  </div>
);

}
