import type { Request, Response } from 'express';
import { HelpService, HelpServiceError } from './help.service';
import type { AuthenticatedRequest } from '@/middleware/auth';
import { helpTypeSchema } from './help.schema';

const helpService = new HelpService();

const sendError = (res: Response, error: unknown) => {
  if (error instanceof HelpServiceError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
};

const parseCatId = (value: string) => /^\d+$/.test(value) && value !== '0';

export const helpController = {
  async getCatHelp(req: Request, res: Response) {
    if (!parseCatId(req.params.catId)) {
      return res.status(400).json({ error: 'Некорректный ID кота' });
    }

    try {
      return res.json(await helpService.getCatHelp(req.params.catId));
    } catch (error) {
      return sendError(res, error);
    }
  },

  async getLast(req: Request, res: Response) {
    try {
      const { limit = 5 } = req.query;
      const cats = await helpService.getLastRequests(Number(limit));

      res.json(cats);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async createHelp(req: Request, res: Response) {
    if (!parseCatId(req.params.catId)) {
      return res.status(400).json({ error: 'Некорректный ID кота' });
    }

    try {
      const userId = (req as AuthenticatedRequest).user.id;
      const result = await helpService.createHelp(
        req.params.catId,
        req.body.type,
        userId,
      );
      return res.status(201).json(result);
    } catch (error) {
      return sendError(res, error);
    }
  },

  async resolveHelp(req: Request, res: Response) {
    if (!parseCatId(req.params.catId)) {
      return res.status(400).json({ error: 'Некорректный ID кота' });
    }

    const parsedType = helpTypeSchema.safeParse(req.params.type);
    if (!parsedType.success) {
      return res.status(400).json({ error: 'Неизвестный тип помощи' });
    }

    try {
      const userId = (req as AuthenticatedRequest).user.id;
      const result = await helpService.resolveHelp(
        req.params.catId,
        parsedType.data,
        userId,
      );
      return res.status(201).json(result);
    } catch (error) {
      return sendError(res, error);
    }
  },
};
