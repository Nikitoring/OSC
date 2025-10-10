import { supabase } from '@lib/supabaseClient';
import { error } from '@stores/authStore';

import { config } from '../../config';

const { api } = config();
export const fetchWithAuth = async (url, options = {}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const configOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (session?.access_token) {
    configOptions.headers.Authorization = `Bearer ${session.access_token}`;
  }

  try {
    const response = await fetch(`${api}${url}`, configOptions);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: 'Unknown error' }));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (err) {
    error.set(err.message);
    throw err;
  }
};
