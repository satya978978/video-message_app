import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

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

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-600 text-white px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
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
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800 text-white border transition-all duration-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        emailFocused
                          ? 'border-blue-500/50 bg-gray-900/70'
                          : 'border-gray-700/50 hover:border-gray-600/50'
                      }`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
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
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`w-full pl-12 pr-12 py-4 rounded-xl bg-gray-800 text-white border transition-all duration-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        passwordFocused
                          ? 'border-blue-500/50 bg-gray-900/70'
                          : 'border-gray-700/50 hover:border-gray-600/50'
                      }`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
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

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
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
