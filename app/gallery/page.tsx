'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PublicGallery() {
  const [catches, setCatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/'
      } else {
        setUser(data.user)
        fetchPublicCatches()
      }
    })
  }, [])

  const fetchPublicCatches = async () => {
    const { data } = await supabase
      .from('catches')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
    
    if (data) setCatches(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return <div style={{ padding: '40px', color: '#fff' }}>Loading Community Gallery...</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#021526', color: '#f8fafc', paddingBottom: '40px' }}>
      {/* Header consistent with Dashboard */}
      <header style={{ 
        background: 'linear-gradient(90deg, #032939 0%, #021526 100%)', 
        borderBottom: '2px solid #0ea5e9', 
        padding: '16px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#38bdf8' }}>THE HOOK</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="/dashboard" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
            Back to Dashboard
          </a>
          
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px' }}>
              <span>👤 {user.email}</span>
              <button 
                onClick={handleLogout} 
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: '850px', margin: '40px auto', padding: '20px' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>Community Catch Gallery</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {catches.length > 0 ? (
            catches.map((c) => (
            <div key={c.id} style={{ backgroundColor: 'rgba(3, 41, 57, 0.6)', padding: '15px', borderRadius: '16px', border: '1px solid #334155' }}>
            {c.photo_url && <img src={c.photo_url} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
    
            {/* Display Species and Email */}
            <h3 style={{ margin: '0 0 5px 0' }}>{c.species}</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#38bdf8' }}>Posted by: {c.user_email || 'Unknown'}</p>
    
            <p style={{ margin: '2px 0', color: '#94a3b8' }}>Size: {c.length_cm}cm / {c.weight_kg}kg</p>
            <p style={{ margin: '2px 0', color: '#94a3b8' }}>Bait: {c.bait}</p>
              </div>
            ))
          ) : (
            <p>No public catches shared yet.</p>
          )}
        </div>
      </main>
    </div>
  )
}