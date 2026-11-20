export interface Cat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  gender: 'male' | 'female' | 'unknown';
  description: string;
  created_at: string;
  created_by: string;
}

export interface CreateCatRequest {
  name: string;
  coordinates: string;
}
