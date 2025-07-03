import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [username, setusername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 const navigate= useNavigate()
  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/signup', { email, password, username });
      if (res.data.message === 'ok') {
        console.log('Signup successful');
        navigate('/dashboard')
       
      }
    } catch (err) {
      setError('Signup failed');
      console.log("err in reg",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl floating-animation"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl floating-animation"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      {/* Left Section - Signup Form */}
      <div className="w-full sm:w-1/2 flex items-center justify-center px-8 min-h-screen">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-b from-gray-900 via-gray-600 to-blue-400 text-transparent bg-clip-text">
              Techinterview
            </h1>
            <p className="text-gray-400">Create your account</p>
          </div>

          <form onSubmit={signup} className="space-y-6">
            {error && (
              <div className="bg-red-600 text-white px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur-sm transition-opacity duration-300 ${
                      usernameFocused ? 'opacity-100' : 'opacity-0'
                    }`}
                  ></div>
                  <div className="relative">
                    <User
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                        usernameFocused ? 'text-blue-400' : 'text-gray-500'
                      }`}
                    />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setusername(e.target.value)}
                      onFocus={() => setUsernameFocused(true)}
                      onBlur={() => setUsernameFocused(false)}
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800 text-white border transition-all duration-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        usernameFocused
                          ? 'border-blue-500/50 bg-gray-900/70'
                          : 'border-gray-700/50 hover:border-gray-600/50'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Email address</label>
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur-sm transition-opacity duration-300 ${
                      emailFocused ? 'opacity-100' : 'opacity-0'
                    }`}
                  ></div>
                  <div className="relative">
                    <Mail
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                        emailFocused ? 'text-blue-400' : 'text-gray-500'
                      }`}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800 text-white border transition-all duration-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        emailFocused
                          ? 'border-blue-500/50 bg-gray-900/70'
                          : 'border-gray-700/50 hover:border-gray-600/50'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur-sm transition-opacity duration-300 ${
                      passwordFocused ? 'opacity-100' : 'opacity-0'
                    }`}
                  ></div>
                  <div className="relative">
                    <Lock
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                        passwordFocused ? 'text-blue-400' : 'text-gray-500'
                      }`}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-4 rounded-xl bg-gray-800 text-white border transition-all duration-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        passwordFocused
                          ? 'border-blue-500/50 bg-gray-900/70'
                          : 'border-gray-700/50 hover:border-gray-600/50'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{loading ? 'Signing up...' : 'Sign up'}</span>
                {!loading && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </div>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>

            {/* Footer Link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden mr-11 sm:block w-1/2 flex items-center justify-center p-8 h-screen">
        <div className="w-full h-full object-cover border-white rounded-xl overflow-hidden shadow-xl">
          <img
            src="https://i.pinimg.com/736x/24/89/6a/24896aa0bffd8b06ed42e8d522dc674b.jpg"
            alt="Signup visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
