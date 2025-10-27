import multer from 'multer';
import path from 'path';
import type { Request } from 'express';

// Конфигурация multer для обработки файлов в памяти
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Недопустимый тип файла. Разрешены только: ${allowedMimeTypes.join(
          ', '
        )}`
      )
    );
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5, // Максимум 5 файлов за раз
  },
});

// Middleware для обработки ошибок multer
export const handleUploadError = (
  error: any,
  req: Request,
  res: any,
  next: any
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Файл слишком большой',
        details: 'Максимальный размер файла: 10MB',
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Слишком много файлов',
        details: 'Максимальное количество файлов: 5',
      });
    }
  }

  if (error) {
    return res.status(400).json({
      error: 'Ошибка загрузки файла',
      details: error.message,
    });
  }

  next();
};
