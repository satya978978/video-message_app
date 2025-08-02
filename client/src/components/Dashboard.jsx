import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Plus, Video, LogOut, ExternalLink, Sparkles, Zap, Clock, Calendar } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import axios from '../components/auth/axios.js';

export default function Dashboard() {
  localStorage.clear();
  const socket = useRef();
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const [userName,setuserName]= useState(null)

  // Live time and date state
  const [currentTime, setCurrentTime] = useState(new Date());

 useEffect( () => {
  const dasinfo= async ()=>{
    const res = await axios.post('/api/dashboard')
     setuserName(res.data)
  }
    dasinfo()  

 }, [])
 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateInterviewLink = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const id = uuidv4();
      const link = `${window.location.origin}/interview/${id}`;
      setGeneratedLink(link);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const joinInterview = () => {
    if (generatedLink) {
      const sessionId = generatedLink.split('/').pop();
      navigate(`/interview/${sessionId}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass-panel border-0 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">TechInterview</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-semibold text-white"> {userName|| "unknow got in"} </p>
              </div>
              <button onClick={handleLogout} className="btn-ghost flex items-center space-x-2">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-start px-4 pt-8 space-y-10 w-full max-w-3xl mx-auto">
       
  <div className="w-full px-10 text-left">
    <h2  className="text-5xl  font-bold text-white">Hello {userName|| "unknow got in"}</h2>
    <h3 className="text-lg text-gray-400 mt-1">Enjoy meetings</h3>
  </div>
       
        {/* Time & Date Cards */}

        <div className="flex flex-col md:flex-row  justify-center  gap-20 w-full">
          {/* Time Card */}
          <div className="glass-panel flex  items-center px-10 gap-5 py-8 w-full md:w-72 text-center shadow-xl">
            <div className="flex justify-center mb-2">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white font-mono tracking-widest mt-2 transition-all duration-500 ease-in-out">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          </div>

          {/* Date Card */}
          <div className="glass-panel flex  items-center p-9 gap-4 w-full md:w-72 text-center shadow-xl">
            <div className="flex justify-center mb-2">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-white font-mono mt-2 transition-all duration-500 ease-in-out">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Create Interview Section */}
        <div className="w-full px-10  ">
          <div className="glass-panel p-8">
            <div className="flex items-center space-x-3 mb-8">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Create New Interview</h2>
            </div>

            <div className="space-y-8">
              <div className="text-center">
                <button
                  onClick={generateInterviewLink}
                  disabled={isGenerating}
                  className={`btn-primary flex items-center space-x-3 mx-auto text-lg px-10 py-5 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-md animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      <span>Generate Interview Link</span>
                    </>
                  )}
                </button>
                <p className="text-gray-400 mt-4 text-sm">
                  Create a secure interview session with one click
                </p>
              </div>

              {generatedLink && (
                <div className="space-y-6">
                  <div className="glass-panel p-6 border border-blue-500/20">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Interview Link
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="input-field flex-1 font-mono text-sm"
                      />
                      <button
                        onClick={copyToClipboard}
                        className={`btn-secondary flex items-center space-x-2 ${copied ? 'bg-green-600 hover:bg-green-500' : ''}`}
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={joinInterview}
                      className="btn-primary flex items-center justify-center space-x-2 flex-1"
                    >
                      <Video className="w-5 h-5" />
                      <span>Join Interview</span>
                    </button>
                    <button className="btn-secondary flex items-center justify-center space-x-2 flex-1">
                      <ExternalLink className="w-5 h-5" />
                      <span>Share Link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
