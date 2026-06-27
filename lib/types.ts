export interface Catch {
  id: string;
  user_id: string;
  date: string;
  location: string;
  species: string;
  length_cm?: number | null;
  weight_kg?: number | null;
  bait?: string | null;
  conditions?: string | null;
  notes?: string | null;
  photo_url?: string | null;
  created_at: string;
}