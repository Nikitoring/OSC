// src/stores/authStore.js
import { writable } from 'svelte/store';
import { supabase } from '../plugins/supabaseClient';

export const user = writable(null);
export const isLoading = writable(false);
export const error = writable(null);

export const authStore = () => {
  // Инициализация пользователя
  const initializeAuth = async () => {
    isLoading.set(true);

    // Проверяем существующую сессию
    const {
      data: { session },
    } = await supabase.auth.getSession();
    user.set(session?.user ?? null);

    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      user.set(session?.user ?? null);
      isLoading.set(false);
    });

    isLoading.set(false);
  };

  const clearError = () => {
    error.set(null);
  };

  const register = async (email: string, password: string, fullName = '') => {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) throw new Error(authError.message);
    return data;
  };

  const login = async (email: string, password: string) => {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);
    return data;
  };

  const logout = async () => {
    const { error: authError } = await supabase.auth.signOut();
    if (authError) throw new Error(authError.message);
  };

  const resetPassword = async (email) => {
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (authError) throw new Error(authError.message);
  };

  const updateProfile = async (updates) => {
    const { error: authError } = await supabase.auth.updateUser(updates);
    if (authError) throw new Error(authError.message);
  };

  return {
    initializeAuth,
    clearError,
    register,
    login,
    logout,
    resetPassword,
    updateProfile,
  };
};
