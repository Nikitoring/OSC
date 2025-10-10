import { supabase } from '../lib/supabase.ts';
import type { User, CreateUserRequest } from '../types/user';

export class CatService {
  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getUserById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUser(
    id: number,
    userData: Partial<CreateUserRequest>
  ): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('User not found');
      throw error;
    }
    return data;
  }

  static async deleteUser(id: number): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') throw new Error('User not found');
      throw error;
    }
  }
}
