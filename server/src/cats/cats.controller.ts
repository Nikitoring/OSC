import { Request, Response } from 'express';
import { CatsService } from './cats.service.ts';

const catsService = new CatsService();

export const catsController = {
  async getCats(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, bounds, ...filters } = req.query;

      const cats = await catsService.getCats({
        page: Number(page),
        limit: Number(limit),
        bounds: bounds ? JSON.parse(bounds as string) : undefined,
        filters,
      });

      res.json(cats);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async getCatById(req: Request, res: Response) {
    try {
      const cat = await catsService.getCatById(req.params.id);

      if (!cat) {
        return res.status(404).json({
          error: 'Кот не найден',
        });
      }

      res.json(cat);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async createCat(req: Request, res: Response) {
    try {
      const cat = await catsService.createCat(req.body, req.user.id);

      res.status(201).json(cat);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async getLastCats(req: Request, res: Response) {
    try {
      const { limit = 5 } = req.query;
      console.log('req.query', req.query, limit);
      const cats = await catsService.getLastCats(Number(limit));

      res.json(cats);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
};
