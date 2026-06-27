'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'log' | 'catches'>('log')
  
  // Form Field States
  const [date, setDate] = useState('2026-06-27')
  const [species, setSpecies] = useState('')
  const [location, setLocation] = useState('')
  const [length, setLength] = useState('')
  const [weight, setWeight] = useState('')
  const [bait, setBait] = useState('')
  const [conditions, setConditions] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#021526', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', paddingBottom: '40px' }}>
      
      {/* Top Premium Navigation Banner */}
      <header style={{ background: 'linear-gradient(90deg, #032939 0%, #021526 100%)', borderBottom: '2px solid #0ea5e9', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px #0ea5e9)' }}>⚓</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.02em' }}>THE HOOK</h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>ANGLER LOG</p>
          </div>
        </div>

        {/* User Badge & Logout */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '14px', color: '#bae6fd', fontWeight: 500 }}>👤 trevor.mhunter@yahoo.com</span>
          <button style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(239,68,68,0.3)' }}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <main style={{ maxWidth: '850px', margin: '40px auto 0 auto', padding: '0 20px' }}>
        
        {/* Gamified Tab Selectors */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button 
            onClick={() => setActiveTab('log')}
            style={{ 
              flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', border: 'none',
              backgroundColor: activeTab === 'log' ? '#0ea5e9' : 'rgba(255,255,255,0.05)',
              color: '#ffffff', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: activeTab === 'log' ? '0 8px 20px rgba(14,165,233,0.3)' : 'none'
            }}
          >
            🎣 Log New Catch
          </button>
          <button 
            onClick={() => setActiveTab('catches')}
            style={{ 
              flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', border: 'none',
              backgroundColor: activeTab === 'catches' ? '#0ea5e9' : 'rgba(255,255,255,0.05)',
              color: '#ffffff', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: activeTab === 'catches' ? '0 8px 20px rgba(14,165,233,0.3)' : 'none'
            }}
          >
            🐟 My Catches <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '10px', fontSize: '13px' }}>0</span>
          </button>
        </div>

        {/* Form Container Panel */}
        {activeTab === 'log' && (
          <div style={{ backgroundColor: 'rgba(3, 41, 57, 0.45)', backdropFilter: 'blur(12px)', border: '2px solid rgba(14, 165, 233, 0.3)', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            
            <h2 style={{ margin: '0 0 24px 0', fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📝 Record Adventure Data
            </h2>

            {/* Added suppressHydrationWarning to prevent mobile autofill crash overlays */}
            <form suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Row 1: Date & Species */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>📅 Date</label>
                  <input suppressHydrationWarning type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#021526', color: '#ffffff', fontSize: '15px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>🐟 Fish Species</label>
                  <select suppressHydrationWarning value={species} onChange={(e) => setSpecies(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#021526', color: '#ffffff', fontSize: '15px' }}>
                    <option value="">Select species</option>
                    <option value="bass">Largemouth Bass</option>
                    <option value="bluegill">Bluegill</option>
                    <option value="walleye">Walleye</option>
                    <option value="pike">Northern Pike</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>📍 Location</label>
                <input suppressHydrationWarning type="text" placeholder="e.g. Fox Chain O'Lakes, Lake Michigan shore" value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#021526', color: '#ffffff', fontSize: '15px' }} />
              </div>

              {/* Row 3: Length & Weight */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>📏 Length (cm)</label>
                  <input suppressHydrationWarning type="number" placeholder="0.0" value={length} onChange={(e) => setLength(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#021526', color: '#ffffff', fontSize: '15px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>⚖️ Weight (kg)</label>
                  <input suppressHydrationWarning type="number" placeholder="0.0" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#021526', color: '#ffffff', fontSize: '15px' }} />
                </div>
              </div>

              {/* Row 4: Bait / Lure */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>🪱 Bait / Lure Used</label>
                <input suppressHydrationWarning type="text" placeholder="Spinnerbaits, plastic worms, live bait..." value={bait} onChange={(e) => setBait(e.target.value)} style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#021526', color: '#ffffff', fontSize: '15px' }} />
              </div>

              {/* Row 5: Conditions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>☀️ Conditions (Weather, Time, Water Temp)</label>
                <input suppressHydrationWarning type="text" placeholder="Sunny, evening, clear water, 72°F..." value={conditions} onChange={(e) => setConditions(e.target.value)} style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#021526', color: '#ffffff', fontSize: '15px' }} />
              </div>

              {/* Row 6: Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>📓 Catch Notes & Story</label>
                <textarea suppressHydrationWarning rows={3} placeholder="Fought hard near the logs! Fished right off the shore..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#021526', color: '#ffffff', fontSize: '15px', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              {/* Row 7: File Upload Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>📸 Trophy Photo (Optional)</label>
                <div style={{ border: '2px dashed rgba(56, 189, 248, 0.3)', padding: '20px', borderRadius: '16px', textAlign: 'center', backgroundColor: 'rgba(2, 21, 38, 0.4)', cursor: 'pointer' }}>
                  <input type="file" id="file-upload" style={{ display: 'none' }} />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#38bdf8', fontWeight: 600 }}>
                    🖼️ Click to select your fish photo
                  </label>
                </div>
              </div>

              {/* Big Interactive Submit Action */}
              <button 
                type="submit"
                style={{
                  width: '100%', marginTop: '12px', padding: '18px', backgroundColor: '#10b981', color: '#ffffff',
                  fontWeight: 900, fontSize: '1.25rem', borderRadius: '16px', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: '0 8px 24px rgba(16,185,129,0.35)', transition: 'transform 0.1s'
                }}
              >
                ⚓ Log This Catch 🎣
              </button>

            </form>
          </div>
        )}

        {/* Empty State Mock for Catches List */}
        {activeTab === 'catches' && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'rgba(3, 41, 57, 0.45)', borderRadius: '24px', border: '2px dashed rgba(56,189,248,0.2)' }}>
            <span style={{ fontSize: '4rem' }}>🌊</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '16px', color: '#bae6fd' }}>Your Tackle Box is Empty!</h3>
            <p style={{ color: '#94a3b8', maxWidth: '340px', margin: '8px auto 0 auto' }}>Head out to the water and log your first massive catch to build up your trophy room badge collection.</p>
          </div>
        )}

      </main>
    </div>
  )
}