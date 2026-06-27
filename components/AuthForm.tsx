'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthFormProps {
  onAuthSuccess: () => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  // Navigation tabs: 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [isSignUp, setIsSignUp] = useState(false)
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  // Feedback states
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // 1. Handle Email & Password Authentication
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: 'https://the-hook-angler-log.netlify.app'
        }
      })
      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccessMsg('🎣 Tight lines! Check your email for the confirmation link.')
        setEmail('')
        setPassword('')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setErrorMsg(error.message)
      else onAuthSuccess()
    }
    setLoading(false)
  }

  // 2. Handle Phone Sign In (SMS OTP)
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    if (!otpSent) {
      const { error } = await supabase.auth.signInWithOtp({ phone })
      if (error) {
        setErrorMsg(error.message)
      } else {
        setOtpSent(true)
        setSuccessMsg('📱 SMS code sent! Check your device messages.')
      }
    } else {
      const { error } = await supabase.auth.verifyOtp({ phone, token: otpToken, type: 'sms' })
      if (error) setErrorMsg(error.message)
      else onAuthSuccess()
    }
    setLoading(false)
  }

  // 3. Handle Google Authentication
  const handleGoogleSignIn = async () => {
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://the-hook-angler-log.netlify.app',
      }
    })
    if (error) setErrorMsg(error.message)
  }

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999,
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000'
      }}
    >
      <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}>
        <source src="/fishing-river.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 2 }} />

      <div 
        style={{
          position: 'relative', zIndex: 3, width: '100%', maxWidth: '420px', margin: '0 20px', padding: '40px 32px',
          backgroundColor: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 800, color: '#14b8a6', letterSpacing: '-0.05em', textShadow: '0 4px 12px rgba(20, 184, 166, 0.25)' }}>
            The Hook
          </h1>
          <p style={{ marginTop: '6px', fontSize: '15px', fontWeight: 500, color: '#cbd5e1' }}>
            Angler Log • Track Every Catch
          </p>
        </div>

        {errorMsg && (
          <div style={{ width: '100%', marginBottom: '20px', padding: '14px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', fontSize: '14px', borderRadius: '12px', fontWeight: 500, boxSizing: 'border-box' }}>
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ width: '100%', marginBottom: '20px', padding: '14px', backgroundColor: 'rgba(20, 184, 166, 0.15)', border: '1px solid rgba(20, 184, 166, 0.4)', color: '#99f6e4', fontSize: '14px', borderRadius: '12px', fontWeight: 500, boxSizing: 'border-box', lineHeight: '1.4' }}>
            {successMsg}
          </div>
        )}

        <div style={{ display: 'flex', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '4px', marginBottom: '24px', boxSizing: 'border-box' }}>
          <button 
            onClick={() => { setAuthMethod('email'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{ flex: 1, padding: '10px', background: authMethod === 'email' ? '#14b8a6' : 'transparent', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Email
          </button>
          <button 
            onClick={() => { setAuthMethod('phone'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{ flex: 1, padding: '10px', background: authMethod === 'phone' ? '#14b8a6' : 'transparent', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Cell Phone
          </button>
        </div>

        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#94a3b8', textTransform: 'uppercase' }}>Email Address</label>
              <input type="email" required placeholder="angler@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', outline: 'none', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#94a3b8', textTransform: 'uppercase' }}>Password</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', outline: 'none', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '4px', padding: '14px', backgroundColor: '#14b8a6', color: '#ffffff', fontWeight: 700, fontSize: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)' }}>
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Log In'}
            </button>
          </form>
        )}

        {authMethod === 'phone' && (
          <form onSubmit={handlePhoneSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#94a3b8', textTransform: 'uppercase' }}>Cell Phone Number</label>
              <input type="tel" required placeholder="+11234567890" disabled={otpSent} value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', outline: 'none', fontSize: '16px', boxSizing: 'border-box', opacity: otpSent ? 0.5 : 1 }} />
            </div>
            {otpSent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#94a3b8', textTransform: 'uppercase' }}>Enter 6-Digit SMS Code</label>
                <input type="text" required placeholder="123456" value={otpToken} onChange={(e) => setOtpToken(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', outline: 'none', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
            )}
            <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '4px', padding: '14px', backgroundColor: '#14b8a6', color: '#ffffff', fontWeight: 700, fontSize: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)' }}>
              {loading ? 'Processing...' : otpSent ? 'Verify Code & Log In' : 'Send Text Code'}
            </button>
          </form>
        )}

        <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '24px 0 16px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ padding: '0 10px', fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or Continue With</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        <button 
          onClick={handleGoogleSignIn}
          type="button"
          style={{
            width: '100%', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px', color: '#ffffff', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Google Account
        </button>

        {authMethod === 'email' && (
          <div style={{ width: '100%', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}