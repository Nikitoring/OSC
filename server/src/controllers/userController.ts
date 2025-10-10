import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';

export class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const cats = await UserService.getAllUsers();
      res.status(200).json({
        success: true,
        data: cats,
        count: cats.length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getCat(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const cat = await UserService.getUserById(id);

      if (!cat) {
        res.status(404).json({
          success: false,
          error: 'Cat not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: cat,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async createCat(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({
          success: false,
          error: 'Name is required',
        });
        return;
      }

      const newCat = await UserService.createUser({ name });
      res.status(201).json({
        success: true,
        data: newCat,
        message: 'Cat created successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateCat(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;

      if (!name) {
        res.status(400).json({
          success: false,
          error: 'Name is required',
        });
        return;
      }

      const updatedCat = await UserService.updateUser(id, { name });
      res.status(200).json({
        success: true,
        data: updatedCat,
        message: 'Cat updated successfully',
      });
    } catch (error: any) {
      if (error.message === 'Cat not found') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  }

  static async deleteCat(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await UserService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'Cat deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Cat not found') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  }
}
