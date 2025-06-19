import { useState, useRef, useEffect } from 'react';
import { Send, Smile, User, Bot } from 'lucide-react';

export default function ChatPanel({ sessionId }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the interview! Feel free to ask any questions or share your thoughts.",
      sender: 'interviewer',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'you',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50 glass-panel border-0 border-b border-gray-800/50">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === 'you' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              message.sender === 'you' 
                ? 'bg-blue-600' 
                : 'bg-gray-700'
            }`}>
              {message.sender === 'you' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className={`flex-1 max-w-xs ${
              message.sender === 'you' ? 'text-right' : 'text-left'
            }`}>
              <div className={`inline-block p-4 rounded-2xl ${
                message.sender === 'you'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-gray-800/50 text-gray-200 border border-gray-700/50 rounded-bl-md'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              <div className={`flex items-center space-x-2 mt-2 text-xs text-gray-500 ${
                message.sender === 'you' ? 'justify-end' : 'justify-start'
              }`}>
                <span className="font-medium">
                  {message.sender === 'you' ? 'You' : 'Interviewer'}
                </span>
                <span>•</span>
                <span>{message.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-800/50">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="input-field w-full resize-none pr-12"
              rows="1"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="btn-primary flex items-center justify-center w-12 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}