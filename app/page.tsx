'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Catch } from '@/lib/types'
import AuthForm from '@/components/AuthForm'
import CatchForm from '@/components/CatchForm'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [catches, setCatches] = useState<Catch[]>([])
  const [activeTab, setActiveTab] = useState<'log' | 'catches'>('log')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCatches = async () => {
    if (!session?.user?.id) return
    const { data, error } = await supabase
      .from('catches')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false })

    if (error) console.error(error)
    else setCatches(data || [])
  }

  useEffect(() => {
    if (session) fetchCatches()
  }, [session])

  const handleCatchAdded = () => {
    fetchCatches()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center text-xl">Loading The Hook...</div>

  if (!session) {
    return <AuthForm onAuthSuccess={() => window.location.reload()} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-blue-600">The Hook</h1>
            <span className="text-lg text-gray-500">Angler Log</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 border-t">
          <div className="flex gap-8 text-sm font-medium">
            <button
              onClick={() => setActiveTab('log')}
              className={`py-4 border-b-2 transition ${activeTab === 'log' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
            >
              Log New Catch
            </button>
            <button
              onClick={() => setActiveTab('catches')}
              className={`py-4 border-b-2 transition ${activeTab === 'catches' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
            >
              My Catches ({catches.length})
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'log' && (
          <CatchForm onCatchAdded={handleCatchAdded} />
        )}

        {activeTab === 'catches' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Catches</h2>
            {catches.length === 0 ? (
              <p className="text-gray-500">No catches yet. Log your first one!</p>
            ) : (
              <div className="grid gap-4">
                {catches.map((c) => (
                  <div key={c.id} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between">
                      <div>
                        <strong>{c.date}</strong> — {c.species} at {c.location}
                      </div>
                      {c.length_cm && <span>{c.length_cm} cm</span>}
                    </div>
                    {c.photo_url && <img src={c.photo_url} alt="catch" className="mt-2 max-h-48 rounded" />}
                    {c.notes && <p className="mt-2 text-sm text-gray-600">{c.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}