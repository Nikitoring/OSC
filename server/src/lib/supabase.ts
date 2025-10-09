// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Проверяем что переменные установлены
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase environment variables are missing. ' +
      'Please check your .env file and make sure SUPABASE_URL and SUPABASE_ANON_KEY are set.'
  );
}

console.log('Supabase URL:', supabaseUrl?.substring(0, 25) + '...'); // Логируем для проверки

export const supabase = createClient(supabaseUrl, supabaseKey);
