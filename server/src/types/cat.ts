export interface Cat {
  id: number;
  name: string;
  location: number[];
  gender: 'male' | 'female' | 'unknown';
  description: string;
  created_at: string;
  created_by: string;
}

export interface CreateCatRequest {
  name: string;
  coordinates: string;
}
