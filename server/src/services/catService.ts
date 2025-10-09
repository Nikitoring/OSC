// services/catService.ts
import { supabase } from '../lib/supabase';
import type { Cat, CreateCatRequest } from '../types/cat';

export class CatService {
  static async getAllCats(): Promise<Cat[]> {
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getCatById(id: number): Promise<Cat | null> {
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  static async createCat(catData: CreateCatRequest): Promise<Cat> {
    const { data, error } = await supabase
      .from('cats')
      .insert([catData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCat(
    id: number,
    catData: Partial<CreateCatRequest>
  ): Promise<Cat> {
    const { data, error } = await supabase
      .from('cats')
      .update(catData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Cat not found');
      throw error;
    }
    return data;
  }

  static async deleteCat(id: number): Promise<void> {
    const { error } = await supabase.from('cats').delete().eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Cat not found');
      throw error;
    }
  }
}
