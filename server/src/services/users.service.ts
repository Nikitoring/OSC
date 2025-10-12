import { supabase } from '../auth/supabase.client.ts';

export class UsersService {
  // Получить список пользователей
  async getUsers(params: {
    page: number;
    limit: number;
    sort_by?: 'rating' | 'cats_count' | 'created_at';
    order?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 20, sort_by = 'rating', order = 'desc' } = params;

    let query = supabase.from('profiles').select(
      `
        id,
        username,
        avatar_url,
        rating,
        cats_count,
        level,
        created_at
      `,
      { count: 'exact' }
    );

    // Сортировка
    query = query.order(sort_by, { ascending: order === 'asc' });

    const { data, error, count } = await query.range(
      (page - 1) * limit,
      page * limit - 1
    );

    if (error) throw new Error(error.message);

    return {
      users: data,
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  }

  // Получить пользователя по ID
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        *,
        cats:cats(count),
        cat_sightings(count)
      `
      )
      .eq('id', userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Обновить пользователя
  async updateUser(userId: string, updateData: any) {
    // Проверяем, что username уникален
    if (updateData.username) {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', updateData.username)
        .neq('id', userId)
        .single();

      if (existingUser) {
        throw new Error('Имя пользователя уже занято');
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
  // Получить котов пользователя
  async getUserCats(userId: string, page: number = 1, limit: number = 20) {
    const { data, error, count } = await supabase
      .from('cats')
      .select(
        `
        *,
        cat_photos(*),
        cat_sightings(count)
      `,
        { count: 'exact' }
      )
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(error.message);

    return {
      cats: data,
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  }

  // Удалить пользователя
  async deleteUser(userId: string) {
    // Note: В реальном приложении нужно каскадное удаление или soft delete
    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) throw new Error(error.message);

    // Также удаляем из auth (если нужно)
    // Это требует административных прав, поэтому может быть выполнено через триггер в Supabase
  }
}
