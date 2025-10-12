import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ValidationRequest extends Request {
  validatedData?: any;
}

export const validationMiddleware = (schema) => {
  return (req: ValidationRequest, res: Response, next: NextFunction) => {
    try {
      // Валидируем данные, объединяя body, params и query при необходимости
      const dataToValidate = {
        body: req.body,
        params: req.params,
        query: req.query,
      };
      const validated = schema.parse(dataToValidate);

      // Сохраняем валидированные данные в request
      req.validatedData = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          error: 'Ошибка валидации',
          details: validationErrors,
        });
      } else {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
      }
    }
  };
};

// Альтернативная версия для валидации только body
export const validateBody = (schema: ZodSchema) => {
  return (req: ValidationRequest, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedData = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          error: 'Ошибка валидации данных',
          details: validationErrors,
        });
      } else {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
      }
    }
  };
};
