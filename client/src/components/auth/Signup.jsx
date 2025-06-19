import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
export default function Signup() {


   const [email,setemail]=useState("")
   const [password,setpassword]=useState("")
 const [username,setusername]=useState("")

const signup= async (e)=>{
  console.log("hoi")
  e.preventDefault()
    const res= await axios.post('/api/signup', { email, password, username });

  if(res.data.message==="ok"){
  console.log("pass agya")
  }
}


  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Left Section - Signup Form */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '3s'}}></div>
      </div>
      <div className="w-full sm:w-1/2 flex items-center justify-center px-8 min-h-screen">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-b from-gray-900 via-gray-600 to-blue-400 text-transparent bg-clip-text">
              Techinterview
            </h1>
            <p className="text-gray-400">Create your account</p>
          </div>

          <form    onSubmit={signup} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                value={username}
                onChange={(e)=>{setusername(e.target.value)}}
                  type="text"
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email address</label>
                <input
                 value={email}
                 onChange={(e)=>{setemail(e.target.value)}}
                  type="email"
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                 value={password}
                 onChange={(e)=>{setpassword(e.target.value)}}
                  type="password"
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter your password"
                />
              </div>

             
            </div>

            <div>
              <button
           
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition"
              >
                Sign up
              </button>
            </div>

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
