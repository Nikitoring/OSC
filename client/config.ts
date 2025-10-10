export const config = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const api = import.meta.env.VITE_API_BASE_URL;

  const isProd = import.meta.env.MODE === 'production';
  const isDev = import.meta.env.MODE === 'development';

  console.log(supabaseUrl, api);
  return {
    supabaseUrl,
    supabaseKey,
    api,
    isProd,
    isDev,
  };
};
