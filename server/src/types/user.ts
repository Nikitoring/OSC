export interface User {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  token: string;
  password: string;
}

export interface CreateUserRequest {
  name: string;
  password: string;
}
