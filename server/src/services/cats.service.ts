import { supabase } from '../auth/supabase.client.ts';
// import { RatingService } from './rating.service'
import { UploadService } from './upload.service.ts';

export class CatsService {
  // private ratingService = new RatingService()
  private uploadService = new UploadService();

  async getCats(params: {
    page: number;
    limit: number;
    bounds?: any;
    filters?: any;
  }) {
    let query = supabase
      .from('cats_with_coordinates')
      .select(
        `
        *,
        profiles:created_by(username),
        cats_photos(*)
        `,
        { count: 'exact' }
      )
      .range((params.page - 1) * params.limit, params.page * params.limit - 1);

    // Фильтрация по местоположению
    if (params.bounds) {
      const { north, south, east, west } = params.bounds;
      query = query.filter(
        'location',
        'in',
        `(${west},${south},${east},${north})`
      );
    }

    // Применение фильтров
    if (params.filters) {
      if (params.filters.health_status) {
        query = query.in('health_status', params.filters.health_status);
      }
      if (params.filters.is_sterilized !== undefined) {
        query = query.eq('is_sterilized', params.filters.is_sterilized);
      }
    }

    const { data, error, count } = await query
      .range((params.page - 1) * params.limit, params.page * params.limit - 1)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    const cats = data.map((cat) => {
      return {
        ...cat,
      };
    });
    return {
      cats,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
      },
    };
  }

  async createCat(
    catData: any,
    photos?: Express.Multer.File[],
    userToken: string
  ) {
    // Загрузка фото
    console.log('photos', photos);
    let photoUrls: string[] = [];
    if (photos && photos.length) {
      for (const photo of photos) {
        const validation = this.uploadService.validateFile(photo);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
      }

      photoUrls = await this.uploadService.uploadPhotos(photos, userToken);
    }
    // Создание кота
    const { data: cat, error } = await supabase
      .from('cats')
      .insert([
        {
          ...catData,
          location: `POINT(${catData.location.longitude} ${catData.location.latitude})`,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error.message);
      return { error, data: cat };
    }

    // Добавление фото
    if (photoUrls.length > 0) {
      const { error: photosError } = await supabase.from('cat_photos').insert(
        photoUrls.map((url, index) => ({
          cat_id: cat.id,
          url,
          is_main: index === 0,
        }))
      );

      if (photosError) {
        // Если не удалось добавить фото, удаляем созданного кота и загруженные файлы
        await this.deleteCat(cat.id, catData.created_by);
        throw new Error(`Failed to save photos: ${photosError.message}`);
      }
    }

    // Обновление рейтинга пользователя
    // await this.ratingService.updateUserRating(catData.created_by)

    return this.getCatById(cat.id);
  }

  async updateCat(
    catId: string,
    userId: string,
    updateData: any,
    newPhotos?: Express.Multer.File[]
  ) {
    // Проверка прав
    const { data: existingCat } = await supabase
      .from('cats')
      .select('created_by')
      .eq('id', catId)
      .single();

    if (!existingCat || existingCat.created_by !== userId) {
      throw new Error('Недостаточно прав');
    }

    // Обновление данных
    const { data: cat, error } = await supabase
      .from('cats')
      .update(updateData)
      .eq('id', catId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Добавление новых фото
    if (newPhotos && newPhotos.length > 0) {
      const photoUrls = await this.uploadService.uploadPhotos(newPhotos);
      await supabase.from('cats_photos').insert(
        photoUrls.map((url) => ({
          cat_id: catId,
          url,
          is_main: false,
        }))
      );
    }

    return this.getCatById(catId);
  }

  async getCatById(catId: string) {
    const { data, error } = await supabase
      .from('cats')
      .select(
        `
        *,
        profiles:created_by(username),
        cats_photos(*)
        `
      )
      .eq('id', catId)
      .single();

    if (error) {
      console.error('GetCatById: ', error.message);
      return { data, error };
    }
    return { data, error };
  }

  async deleteCat(catId: string, userId: string) {
    // Проверка прав
    const { data: existingCat } = await supabase
      .from('cats')
      .select('created_by')
      .eq('id', catId)
      .single();

    if (!existingCat || existingCat.created_by !== userId) {
      throw new Error('Недостаточно прав');
    }

    const { error } = await supabase.from('cats').delete().eq('id', catId);

    if (error) throw new Error(error.message);

    // Обновление рейтинга пользователя
    // await this.ratingService.updateUserRating(userId)
  }
}
