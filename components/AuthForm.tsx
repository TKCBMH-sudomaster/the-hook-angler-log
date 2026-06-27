'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthForm({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: authError } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

      if (authError) throw authError
      onAuthSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900/90 via-blue-950/90 to-slate-950">
      <Card className="w-full max-w-lg shadow-2xl mx-auto">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-5xl font-bold text-blue-700 tracking-tight">The Hook</CardTitle>
          <CardDescription className="text-xl text-slate-600 mt-2">Angler Log • Track every catch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Log In' : 'Create Account'}
            </Button>
          </form>

          <Button
            variant="link"
            className="w-full text-blue-600 text-base"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}