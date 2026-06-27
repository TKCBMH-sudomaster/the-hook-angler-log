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
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
      }}
    >
      {/* 1. Fullscreen Looping Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1
        }}
      >
        <source src="/fishing-river.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. Background Darkening Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2
        }}
      />

      {/* 3. Fully Transparent/Glassmorphism Centered Card */}
      <div 
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '400px',
          margin: '0 20px',
          padding: '40px 32px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)', 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Header branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 800, color: '#22c55e', letterSpacing: '-0.05em', textShadow: '0 2px 10px rgba(34, 197, 94, 0.3)' }}>
            The Hook
          </h1>
          <p style={{ marginTop: '6px', fontSize: '15px', fontWeight: 500, color: '#e2e8f0' }}>
            Angler Log • Track Every Catch
          </p>
        </div>

        {errorMsg && (
          <div style={{ width: '100%', marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '14px', borderRadius: '8px', fontWeight: 500 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Clean Centered Input Block */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* FIXED: Removed uppercase flag, used valid textTransform instead */}
            <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#94a3b8', textTransform: 'uppercase' }}>
              Email Address
            </label>
            {/* FIXED: Removed raw px token, using regular padding string values */}
            <input
              type="email"
              required
              placeholder="angler@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', outline: 'none', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* FIXED: Removed uppercase flag, used valid textTransform instead */}
            <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#94a3b8', textTransform: 'uppercase' }}>
              Password
            </label>
            {/* FIXED: Removed raw px token, using regular padding string values */}
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', outline: 'none', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', padding: '14px', backgroundColor: '#22c55e', color: '#ffffff', fontWeight: 700, fontSize: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)' }}
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Log In'}
          </button>
        </form>

        {/* Bottom Toggle Button */}
        <div style={{ width: '100%', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setErrorMsg('')
            }}
            style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>

      </div>
    </div>
  )
}