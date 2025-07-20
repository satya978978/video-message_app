import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';



import { Copy, Plus, Video, Clock, LogOut, Zap, Users, Calendar, ExternalLink, Sparkles, Activity } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useRef } from 'react';

export default function Dashboard() {
localStorage.clear()
  const socket = useRef()
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentInterviews] = useState([
    {
      id: '1',
      candidate: 'John Doe',
      date: '2024-01-15',
      role: 'Frontend Developer',
      status: 'completed',
      duration: '45 min'
    },
    {
      id: '2',
      candidate: 'Jane Smith',
      date: '2024-01-14',
      role: 'Backend Developer',
      status: 'in-progress',
      duration: '30 min'
    },
    {
      id: '3',
      candidate: 'Mike Johnson',
      date: '2024-01-13',
      role: 'Full Stack Developer',
      status: 'scheduled',
      duration: '60 min'
    },
  ]);



  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'in-progress': return 'text-blue-400 bg-blue-400/10';
      case 'scheduled': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const stats = [
    { label: 'Total Interviews', value: '24', icon: Users, change: '+12%' },
    { label: 'This Week', value: '8', icon: Calendar, change: '+25%' },
    { label: 'Success Rate', value: '94%', icon: Activity, change: '+5%' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <header className="relative  z-10 glass-panel border-0 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between  items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold gradient-text">TechInterview</h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-semibold text-white">{user?.name || 'User'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-ghost flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`glass-panel p-6 slide-in stagger-${index + 1}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change} from last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Create Interview Section */}
          <div className="xl:col-span-2">
            <div className="glass-panel p-8 slide-in stagger-1">
              <div className="flex items-center space-x-3 mb-8">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Create New Interview</h2>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <button
                    onClick={generateInterviewLink}
                    disabled={isGenerating}
                    className={`btn-primary flex items-center space-x-3 mx-auto text-lg px-10 py-5 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
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
                  <div className="space-y-6 slide-in">
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
                          className={`btn-secondary flex items-center space-x-2 ${copied ? 'bg-green-600 hover:bg-green-500' : ''
                            }`}
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

          {/* Recent Interviews */}
          <div>
            <div className="glass-panel p-6 slide-in stagger-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Interviews</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentInterviews.map((interview, index) => (
                  <div key={interview.id} className={`interview-card group slide-in stagger-${index + 1}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {interview.candidate}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                            {interview.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{interview.role}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{interview.date}</span>
                          </div>
                          <span className="text-gray-400">{interview.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 btn-secondary text-center">
                Schedule New Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}