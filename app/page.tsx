'use client'

import { useEffect } from 'react' // Import useEffect
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation' // Import useRouter

export default function LoginPage() {
  const router = useRouter() // Initialize router

  useEffect(() => {
    // This listens for any change in auth status (like signing in)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard') // Force navigation to dashboard
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      {/* Background Video */}
      <video autoPlay loop muted playsInline style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover', 
        zIndex: -1 
      }}>
        <source src="/fishing-river.mp4" type="video/mp4" />
      </video>

      {/* Glassmorphism Container */}
      <div style={{ 
        width: '400px', 
        padding: '40px', 
        backgroundColor: 'rgba(2, 21, 38, 0.6)', 
        backdropFilter: 'blur(15px)', 
        borderRadius: '24px',
        border: '1px solid rgba(56, 189, 248, 0.5)',
        color: '#f8fafc'
      }}>
        <h1 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#38bdf8' }}>THE HOOK</h1>
        
        <Auth 
          supabaseClient={supabase} 
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0ea5e9',
                  brandAccent: '#38bdf8',
                  inputBackground: 'rgba(255, 255, 255, 0.05)',
                  inputText: '#ffffff',
                  inputPlaceholder: '#94a3b8',
                }
              }
            }
          }} 
          providers={[]} 
        />
      </div>
    </div>
  )
}