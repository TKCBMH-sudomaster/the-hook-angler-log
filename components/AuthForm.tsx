'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthFormProps {
  onAuthSuccess: () => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setErrorMsg(error.message)
      else alert('Check your email for the confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setErrorMsg(error.message)
      else onAuthSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      
      {/* 1. Fullscreen Looping Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/fishing-river.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. Dark Tint Overlay (Ensures text contrast remains perfectly readable) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

      {/* 3. Centered Glassmorphism Login Card Container */}
      <div className="relative z-20 w-full max-w-md mx-4 p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 transition-all duration-300">
        
        {/* Header branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight drop-shadow-sm">
            The Hook
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Angler Log • Track Every Catch
          </p>
        </div>

        {/* Dynamic Error Messaging Alert box */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Input Interactive Form Elements */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="angler@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-900 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Log In'}
          </button>
        </form>

        {/* Toggle between register or login views */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setErrorMsg('')
            }}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>

      </div>
    </div>
  )
}