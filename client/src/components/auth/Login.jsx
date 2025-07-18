
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';

export default function LoginUI() {
  const navigate = useNavigate()
  const [password, setpassword] = useState("")
  const [email, setemail] = useState("")
  
  const submit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/login', { password, email })
    if (res.data.message == "ok") {
      console.log("logged in ")
      navigate('/dashboard')
    }
  }
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Floating Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }}></div>
        <div className="absolute -bottom-40 left-10 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full sm:w-1/2 flex items-center justify-center px-8 min-h-screen">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-b from-gray-900 via-gray-600 to-blue-400 text-transparent bg-clip-text">
              Techinterview
            </h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form
          onSubmit={submit}
              type="submit"
          className="space-y-6">
            <div className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur-sm opacity-0"></div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      onChange={(e) => { setemail(e.target.value) }}
                      value={email}
                      id="email"
                      name="email"
                      type="email"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800 text-white border border-gray-700/50 hover:border-gray-600/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur-sm opacity-0"></div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      onChange={(e) => { setpassword(e.target.value) }}
                      value={password}
                      id="password"
                      name="password"
                      type="password"
                      className="w-full pl-12 pr-12 py-4 rounded-xl bg-gray-800 text-white border border-gray-700/50 hover:border-gray-600/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign In Button */}
            <button 
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Sign in</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden sm:block w-1/2 flex items-center mr-11 justify-center p-8 h-screen">
        <div className="w-full h-full object-cover border-white rounded-xl overflow-hidden shadow-xl">
          <img
            src="https://i.pinimg.com/736x/24/89/6a/24896aa0bffd8b06ed42e8d522dc674b.jpg"
            alt="Login visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
