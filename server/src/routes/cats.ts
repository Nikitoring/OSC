import pkg from 'express';
const { Router, Request, Response } = pkg;
import { supabase } from '../lib/supabase.ts';
import type { Cat, CreateCatRequest } from '../types/cat.ts';

const router = Router();

// GET /cats - получить всех котов
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: cats, error } = await supabase
      .from('cats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Database error', error: error.message });
      return;
    }

    if (!cats || cats.length === 0) {
      res.status(404).json({ message: 'No cats found' });
      return;
    }

    res.status(200).json(cats);
  } catch (err: any) {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /cats/:id - получить кота по ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { data: cat, error } = await supabase
      .from('cats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ message: 'Cat not found' });
        return;
      }
      throw error;
    }

    res.status(200).json(cat);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /cats - создать нового кота
router.post(
  '/',
  async (
    req: Request<{}, {}, CreateCatRequest>,
    res: Response
  ): Promise<void> => {
    const { name } = req.body;

    // Валидация
    if (!name || name.trim() === '') {
      res.status(400).json({ message: 'Name is required' });
      return;
    }

    if (name.length > 255) {
      res
        .status(400)
        .json({ message: 'Name is too long (max 255 characters)' });
      return;
    }

    try {
      const { data: cat, error } = await supabase
        .from('cats')
        .insert([{ name: name.trim() }])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        res
          .status(500)
          .json({ message: 'Failed to create cat', error: error.message });
        return;
      }

      res.status(201).json(cat);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// PUT /cats/:id - обновить кота
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === '') {
    res.status(400).json({ message: 'Name is required' });
    return;
  }

  try {
    const { data: cat, error } = await supabase
      .from('cats')
      .update({ name: name.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ message: 'Cat not found' });
        return;
      }
      throw error;
    }

    res.status(200).json(cat);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /cats/:id - удалить кота
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from('cats').delete().eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ message: 'Cat not found' });
        return;
      }
      throw error;
    }

    res.status(204).send();
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
