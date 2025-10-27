import { createClient } from '@supabase/supabase-js';

export class UploadService {
  private bucketName = 'cats_photos';

  async uploadFile(
    file: Express.Multer.File,
    userToken: string
  ): Promise<string> {
    const userSupabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Используем anon key, а не service role
      {
        global: {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      }
    );

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await userSupabase.storage
      .from(this.bucketName)
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }

    const {
      data: { publicURL },
      error: urlError,
    } = userSupabase.storage.from(this.bucketName).getPublicUrl(data.path);

    if (urlError) {
      throw new Error(`Getting public URL failed: ${urlError.message}`);
    }

    return publicURL;
  }

  async uploadPhotos(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, 'cats'));
    return Promise.all(uploadPromises);
  }
  // Удаление файла (если понадобится)
  async deleteFile(fileUrl: string): Promise<void> {
    // Извлекаем путь к файлу из URL
    const path = fileUrl.split('/').pop();
    if (!path) {
      throw new Error('Неверный URL файла');
    }

    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([path]);

    if (error) {
      throw new Error(`Ошибка удаления файла: ${error.message}`);
    }
  }
  validateFile(file: Express.Multer.File): {
    isValid: boolean;
    error?: string;
  } {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return {
        isValid: false,
        error: `Недопустимый тип файла. Разрешены: ${allowedMimeTypes.join(
          ', '
        )}`,
      };
    }

    if (file.size > maxFileSize) {
      return {
        isValid: false,
        error: `Файл слишком большой. Максимальный размер: ${
          maxFileSize / 1024 / 1024
        }MB`,
      };
    }

    return { isValid: true };
  }
}
