import { Request, Response } from "express";
import { CatServiceError, CatsService } from "./cats.service.ts";
import type { AuthenticatedRequest } from "../middleware/auth.ts";

const catsService = new CatsService();

export const catsController = {
  async getCats(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, bounds, ...filters } = req.query;
      const prepareFilters = { ...filters };
      if (prepareFilters.help_type) {
        const helpType = prepareFilters.help_type;
        prepareFilters.help_type = Array.isArray(helpType)
          ? helpType
          : typeof helpType === "string"
            ? [helpType]
            : [];
      }
      const cats = await catsService.getCats({
        page: Number(page),
        limit: Number(limit),
        bounds: bounds ? JSON.parse(bounds as string) : undefined,
        filters: prepareFilters,
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
          error: "Кот не найден",
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
      const cat = await catsService.createCat(
        req.body,
        (req as AuthenticatedRequest).user.id,
      );

      res.status(201).json(cat);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async updateCat(req: Request, res: Response) {
    try {
      const cat = await catsService.updateCat(
        req.params.id,
        (req as AuthenticatedRequest).user.id,
        req.body,
      );

      return res.json(cat);
    } catch (error) {
      if (error instanceof CatServiceError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      console.error("PATCH /api/cats/:id failed", error);
      return res
        .status(500)
        .json({ error: "Не удалось обновить информацию о коте" });
    }
  },

  async getLastCats(req: Request, res: Response) {
    try {
      const { limit = 5 } = req.query;
      const cats = await catsService.getLastCats(Number(limit));

      res.json(cats);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async getStatistics(req: Request, res: Response) {
    try {
      const cats = await catsService.getCatsStatistic();

      res.json(cats);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
};
