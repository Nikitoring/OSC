import { Router } from 'express';
import type { Request, Response } from 'express';
import { supabase } from '../lib/supabase.ts';

const router = Router();

// Регистрация
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    res.status(201).json({
      message: 'User registered successfully',
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Вход
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.status(200).json({
      message: 'Login successful',
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Выход
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    res.status(200).json({ message: 'Logout successful' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить текущего пользователя (по токену)
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) throw error;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
