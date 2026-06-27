'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const speciesOptions = [
  'Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Yellow Perch',
  'Bluegill', 'Black Crappie', 'Channel Catfish', 'Northern Pike',
  'Rainbow Trout', 'Other'
]

export default function CatchForm({ onCatchAdded }: { onCatchAdded: () => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    species: '',
    length_cm: '',
    weight_kg: '',
    bait: '',
    conditions: '',
    notes: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let photoUrl = null

    // Upload photo if selected
    if (photo) {
      const fileExt = photo.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('catch-photos')
        .upload(fileName, photo)

      if (uploadError) {
        alert('Photo upload failed: ' + uploadError.message)
      } else {
        const { data: urlData } = supabase.storage
          .from('catch-photos')
          .getPublicUrl(fileName)
        photoUrl = urlData.publicUrl
      }
    }

    const { error } = await supabase.from('catches').insert([{
      ...formData,
      length_cm: formData.length_cm ? Number(formData.length_cm) : null,
      weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
      photo_url: photoUrl,
    }])

    if (error) {
      alert('Error saving catch: ' + error.message)
    } else {
      alert('Catch logged successfully! 🎣')
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        location: '',
        species: '',
        length_cm: '',
        weight_kg: '',
        bait: '',
        conditions: '',
        notes: '',
      })
      setPhoto(null)
      onCatchAdded() // This will refresh the list on the main page
    }

    setLoading(false)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Log New Catch</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Same form fields as before - date, species, location, length, weight, bait, conditions, notes, photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                required 
              />
            </div>
            <div>
              <Label>Species</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, species: value })} value={formData.species}>
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  {speciesOptions.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Location (e.g. Fox Chain O'Lakes, Lake Michigan shore)</Label>
            <Input 
              value={formData.location} 
              onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Length (cm)</Label>
              <Input 
                type="number" 
                value={formData.length_cm} 
                onChange={(e) => setFormData({ ...formData, length_cm: e.target.value })} 
              />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input 
                type="number" 
                step="0.01" 
                value={formData.weight_kg} 
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })} 
              />
            </div>
          </div>

          <div>
            <Label>Bait / Lure</Label>
            <Input value={formData.bait} onChange={(e) => setFormData({ ...formData, bait: e.target.value })} />
          </div>

          <div>
            <Label>Conditions (weather, time of day, water temp, etc.)</Label>
            <Input value={formData.conditions} onChange={(e) => setFormData({ ...formData, conditions: e.target.value })} />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea 
              value={formData.notes} 
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
              rows={3}
            />
          </div>

          <div>
            <Label>Photo of the catch (optional)</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setPhoto(e.target.files?.[0] || null)} 
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving Catch...' : 'Log This Catch 🎣'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}