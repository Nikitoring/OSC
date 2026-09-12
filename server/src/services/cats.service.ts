import { pool } from '../db/index.ts';
export class CatsService {
  async getCats(params: {
    page: number;
    limit: number;
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
    filters?: {
      gender?: string[];
    };
  }) {
    const { page, limit, bounds, filters } = params;

    const offset = (page - 1) * limit;

    const values: unknown[] = [];
    const conditions: string[] = [];

    // --------------------------------
    // Фильтрация по области карты
    // --------------------------------

    if (bounds) {
      const { north, south, east, west } = bounds;

      values.push(west, south, east, north);

      conditions.push(`
        ST_Intersects(
          location,
          ST_MakeEnvelope(
            $1,
            $2,
            $3,
            $4,
            4326
          )::geography
        )
      `);
    }

    // --------------------------------
    // Фильтрация по gender
    // --------------------------------

    if (filters?.gender?.length) {
      values.push(filters.gender);

      conditions.push(`gender = ANY($${values.length})`);
    }

    // --------------------------------
    // WHERE
    // --------------------------------

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // --------------------------------
    // Получаем количество
    // --------------------------------

    const countResult = await pool.query(
      `
        SELECT COUNT(*)::int AS total
        FROM cats
        ${where}
      `,
      values,
    );

    const total = countResult.rows[0].total;

    // --------------------------------
    // Получаем котов
    // --------------------------------

    const dataValues = [...values, limit, offset];

    const result = await pool.query(
      `
        SELECT
          id,
          name,
          gender,
          ST_Y(location::geometry) AS latitude,
          ST_X(location::geometry) AS longitude,
          created_at,
          created_by

        FROM cats

        ${where}

        ORDER BY created_at DESC

        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
      `,
      dataValues,
    );

    return {
      cats: result.rows,

      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async createCat(catData: {
    name: string;
    gender: 'male' | 'female' | 'unknown';
    latitude: number;
    longitude: number;
    created_by: number;
  }) {
    const result = await pool.query(
      `
        INSERT INTO cats (
          name,
          gender,
          location,
          created_at,
          created_by
        )
        VALUES (
          $1,
          $2,
          ST_SetSRID(
            ST_MakePoint($3, $4),
            4326
          )::geography,
          NOW(),
          $5
        )
        RETURNING
          id,
          name,
          gender,
          ST_Y(location::geometry) AS latitude,
          ST_X(location::geometry) AS longitude,
          created_at,
          created_by
      `,
      [
        catData.name,
        catData.gender,
        catData.longitude,
        catData.latitude,
        catData.created_by,
      ],
    );

    return result.rows[0];
  }

  async getCatById(catId: string) {
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          gender,
          ST_Y(location::geometry) AS latitude,
          ST_X(location::geometry) AS longitude,
          created_at,
          created_by

        FROM cats

        WHERE id = $1
      `,
      [catId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async updateCat(
    catId: string,
    userId: number,
    updateData: {
      name?: string;
      gender?: 'male' | 'female' | 'unknown';
      latitude?: number;
      longitude?: number;
    },
  ) {
    // --------------------------------
    // Проверяем существование кота
    // и владельца
    // --------------------------------

    const existingCat = await pool.query(
      `
        SELECT created_by
        FROM cats
        WHERE id = $1
      `,
      [catId],
    );

    if (existingCat.rows.length === 0) {
      throw new Error('Кот не найден');
    }

    if (existingCat.rows[0].created_by !== userId) {
      throw new Error('Недостаточно прав');
    }

    // --------------------------------
    // Формируем UPDATE
    // --------------------------------

    const fields: string[] = [];
    const values: unknown[] = [];

    if (updateData.name !== undefined) {
      values.push(updateData.name);

      fields.push(`name = $${values.length}`);
    }

    if (updateData.gender !== undefined) {
      values.push(updateData.gender);

      fields.push(`gender = $${values.length}`);
    }

    if (
      updateData.latitude !== undefined &&
      updateData.longitude !== undefined
    ) {
      values.push(updateData.longitude, updateData.latitude);

      fields.push(`
        location = ST_SetSRID(
          ST_MakePoint(
            $${values.length - 1},
            $${values.length}
          ),
          4326
        )::geography
      `);
    }

    if (fields.length === 0) {
      return this.getCatById(catId);
    }

    values.push(catId);

    const result = await pool.query(
      `
        UPDATE cats

        SET ${fields.join(', ')}

        WHERE id = $${values.length}

        RETURNING
          id,
          name,
          gender,
          ST_Y(location::geometry) AS latitude,
          ST_X(location::geometry) AS longitude,
          created_at,
          created_by
      `,
      values,
    );

    return result.rows[0];
  }

  async deleteCat(catId: string, userId: number) {
    const result = await pool.query(
      `
        DELETE FROM cats

        WHERE id = $1
          AND created_by = $2

        RETURNING id
      `,
      [catId, userId],
    );

    if (result.rows.length === 0) {
      throw new Error('Кот не найден или недостаточно прав');
    }

    return {
      success: true,
    };
  }
}
