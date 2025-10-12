import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Используем SERVICE ROLE, не anon key
);

export class SupabaseService {
  // Создание пользователя
  async createUser(email: string, password: string, userData: any) {
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    // Создаем профиль
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          username: userData.username,
          email: email,
          rating: 0,
          cats_count: 0,
          level: 'kitten',
        },
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    return { auth: authData, profile: profileData };
  }

  // Аутентификация пользователя
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }
  // Получение профиля пользователя
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        *,
        cats:cats(count),
        cat_sightings(count)
      `
      )
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Обновление сессии (тихая авторизация)
  async refreshSession(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) throw error;
    return data;
  }

  async signOut(accessToken: string) {
    const { error } = await supabase.auth.admin.signOut(accessToken);
    if (error) throw error;
  }

  // Валидация JWT токена
  async validateToken(token: string) {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return data;
  }
}
