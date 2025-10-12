import { supabase } from '../auth/supabase.client.ts';
// import { RatingService } from './rating.service'
// import { UploadService } from './upload.service'

export class CatsService {
  // private ratingService = new RatingService()
  // private uploadService = new UploadService()

  async getCats(params: {
    page: number;
    limit: number;
    bounds?: any;
    filters?: any;
  }) {
    let query = supabase.from('cats').select(
      `
        *,
        profiles:created_by(username, avatar_url),
        cat_photos(*),
        cat_sightings(count)
      `,
      { count: 'exact' }
    );

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

    return {
      cats: data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
      },
    };
  }

  async createCat(catData: any, photos: Express.Multer.File[]) {
    // Загрузка фото
    // const photoUrls = await this.uploadService.uploadPhotos(photos)

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

    if (error) throw new Error(error.message);

    // Добавление фото
    // if (photoUrls.length > 0) {
    //   await supabase
    //     .from('cat_photos')
    //     .insert(photoUrls.map((url, index) => ({
    //       cat_id: cat.id,
    //       url,
    //       is_main: index === 0
    //     })))
    // }

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
    // if (newPhotos && newPhotos.length > 0) {
    //   const photoUrls = await this.uploadService.uploadPhotos(newPhotos)
    //   await supabase
    //     .from('cat_photos')
    //     .insert(photoUrls.map(url => ({
    //       cat_id: catId,
    //       url,
    //       is_main: false
    //     })))
    // }

    return this.getCatById(catId);
  }

  async getCatById(catId: string) {
    const { data, error } = await supabase
      .from('cats')
      .select(
        `
        *,
        profiles:created_by(username, avatar_url, rating, level),
        cat_photos(*),
        cat_sightings(count)
      `
      )
      .eq('id', catId)
      .single();

    if (error) throw new Error(error.message);
    return data;
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
