'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [catches, setCatches] = useState<any[]>([])
  const [formData, setFormData] = useState({ date: '', species: '', location: '', length_cm: '', weight_kg: '', notes: '', bait: '', weather: '' })
  const [status, setStatus] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  // HOOK 1: Fetch user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        fetchCatches(data.user.id)
      } else window.location.href = '/'
    })
  }, [])

  // HOOK 2: Auto-clear status message
  useEffect(() => {
    if (status === 'Catch logged successfully!') {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const fetchCatches = async (userId: string) => {
    const { data } = await supabase.from('catches').select('*').eq('user_id', userId)
    if (data) setCatches(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleDelete = async (id: string) => {
    await supabase.from('catches').delete().eq('id', id)
    fetchCatches(user.id)
  }

  const handleTogglePublic = async (id: string, currentStatus: boolean) => {
    await supabase.from('catches').update({ is_public: !currentStatus }).eq('id', id)
    fetchCatches(user.id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Saving...')
    
    let photo_url = ''
    if (file) {
      const { data } = await supabase.storage.from('catch-photos').upload(`${Date.now()}_${file.name}`, file)
      if (data) {
        const { data: publicData } = supabase.storage.from('catch-photos').getPublicUrl(data.path)
        photo_url = publicData.publicUrl
      }
    }
    
    const { error } = await supabase.from('catches').insert([{
      ...formData,
      photo_url,
      user_id: user.id,
      user_email: user.email, // ADD THIS LINE
      is_public: false
    }])
    
    if (error) {
      setStatus('Error: ' + error.message)
      setTimeout(() => setStatus(null), 5000)
    } else {
      setStatus('Catch logged successfully!')
      setFormData({ date: '', species: '', location: '', length_cm: '', weight_kg: '', notes: '', bait: '', weather: '' })
      setFile(null)
      fetchCatches(user.id)
    }
  }

  if (!user) return <div style={{ padding: '40px', color: '#fff' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#021526', color: '#f8fafc', paddingBottom: '40px' }}>
      <header style={{ 
         background: 'linear-gradient(90deg, #032939 0%, #021526 100%)', 
        borderBottom: '2px solid #0ea5e9', 
        padding: '16px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
        }}>
    <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#38bdf8' }}>THE HOOK</h1>
  
     {/* Unified Navigation Container */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <a href="/gallery" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
        View Community Gallery
        </a>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px' }}>
      <span>👤 {user.email}</span>
      <button 
        onClick={handleLogout} 
        style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  </div>
</header>

      <main style={{ maxWidth: '850px', margin: '40px auto', padding: '20px' }}>
        <div style={{ backgroundColor: 'rgba(3, 41, 57, 0.6)', backdropFilter: 'blur(10px)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(14, 165, 233, 0.3)', marginBottom: '40px' }}>
          <h2 style={{ color: '#38bdf8', marginTop: 0 }}>Log New Catch</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <input type="date" onChange={(e) => setFormData({...formData, date: e.target.value})} style={{ padding: '12px', borderRadius: '12px', background: '#021526', border: '1px solid #334155', color: '#fff' }} />
            <select onChange={(e) => setFormData({...formData, species: e.target.value})} style={{ padding: '12px', borderRadius: '12px', background: '#021526', border: '1px solid #334155', color: '#fff' }}>
              <option value="">Select Species</option>
              {['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Bluegill', 'Crappie', 'Channel Catfish', 'Northern Pike', 'Muskie'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select onChange={(e) => setFormData({...formData, bait: e.target.value})} style={{ padding: '12px', borderRadius: '12px', background: '#021526', border: '1px solid #334155', color: '#fff' }}>
              <option value="">Select Bait</option>
              {['Live Worms', 'Minnows', 'Jigs', 'Spinnerbaits', 'Crankbaits', 'Topwater Lures', 'Plastic Worms', 'Chatterbaits', 'Rooster Tail'].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <input type="number" placeholder="Length (cm)" onChange={(e) => setFormData({...formData, length_cm: e.target.value})} style={{ padding: '12px', borderRadius: '12px', background: '#021526', border: '1px solid #334155', color: '#fff' }} />
            <input type="number" placeholder="Weight (kg)" onChange={(e) => setFormData({...formData, weight_kg: e.target.value})} style={{ padding: '12px', borderRadius: '12px', background: '#021526', border: '1px solid #334155', color: '#fff' }} />
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ color: '#94a3b8' }} />
            <button type="submit" style={{ gridColumn: 'span 2', padding: '16px', background: '#10b981', borderRadius: '12px', border: 'none', color: '#fff', cursor: 'pointer' }}>Submit Catch</button>
          </form>
          {status && <p style={{ color: '#10b981', textAlign: 'center', marginTop: '10px' }}>{status}</p>}
        </div>

        <h2 style={{ color: '#38bdf8' }}>My Catches</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {catches.map((c) => (
            <div key={c.id} style={{ backgroundColor: 'rgba(3, 41, 57, 0.6)', padding: '15px', borderRadius: '16px', border: '1px solid #334155' }}>
              {c.photo_url ? <img src={c.photo_url} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} /> : <div style={{ height: '150px', background: '#032939', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '10px', color: '#475569' }}>No Photo</div>}
              <h3 style={{ margin: '0 0 5px 0' }}>{c.species}</h3>
              <p style={{ margin: '2px 0', color: '#94a3b8' }}>Size: {c.length_cm}cm / {c.weight_kg}kg</p>
              <p style={{ margin: '2px 0', color: '#94a3b8' }}>Bait: {c.bait}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => handleTogglePublic(c.id, c.is_public)} style={{ flex: 1, padding: '8px', background: c.is_public ? '#38bdf8' : '#334155', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>{c.is_public ? 'Public' : 'Private'}</button>
                <button onClick={() => handleDelete(c.id)} style={{ padding: '8px', background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}