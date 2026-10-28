import { pool } from '../db/index.js';
import { Cat } from '../types/cat.js';
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
      search_text?: string;
      help_type?: ('food' | 'medical' | 'home')[];
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
    // Фильтрация по имени и описанию
    // --------------------------------

    if (filters?.search_text?.length) {
      const searchPattern = `%${filters.search_text}%`;
      values.push(searchPattern);

      conditions.push(
        `(name ILIKE $${values.length} OR description ILIKE $${values.length})`,
      );
    }
    if (filters?.help_type?.length) {
      console.log('filters?.help_type', filters?.help_type);
      values.push(filters.help_type);
      conditions.push(`
        EXISTS (
          SELECT 1
          FROM help_requests hr
          WHERE hr.cat_id = cats.id
            AND hr.type = ANY($${values.length})
            AND hr.status = 'needed'
            AND hr.id = (
              SELECT hr_last.id
              FROM help_requests hr_last
              WHERE hr_last.cat_id = hr.cat_id
                AND hr_last.type = hr.type
              ORDER BY hr_last.created_at DESC, hr_last.id DESC
              LIMIT 1
            )
        )
      `);
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
        c.id,
        c.name,
        c.gender,
        ST_Y(c.location::geometry) AS latitude,
        ST_X(c.location::geometry) AS longitude,
        c.created_at,
        c.created_by,
        c.description,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'catId', hr.cat_id,
                'type', hr.type,
                'state', hr.status,
                'createdAt', hr.created_at,
                'createdBy', hr.created_by
              )
              ORDER BY hr.created_at ASC
            )
            FROM help_requests hr
            WHERE hr.cat_id = c.id
          ),
          '[]'::json
        ) AS help

      FROM cats c

      ${where}

      ORDER BY c.created_at DESC

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

  async createCat(catData: Cat, userId: string | number) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const name = catData.name?.trim();
      const gender = catData.gender ?? 'unknown';

      const result = await client.query(
        `
        WITH new_id AS (
          SELECT nextval(pg_get_serial_sequence('cats', 'id')) AS id
        )
        INSERT INTO cats (
          id,
          name,
          gender,
          location,
          created_at,
          created_by,
          description
        )
        SELECT
          id,
          COALESCE(NULLIF($1, ''), 'Кот #' || id),
          $2,
          ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography,
          NOW(),
          $5,
          $6
        FROM new_id
        RETURNING
          id,
          name,
          gender,
          ST_Y(location::geometry) AS latitude,
          ST_X(location::geometry) AS longitude,
          created_at,
          created_by,
          description;
      `,
        [
          name,
          gender,
          catData.longitude,
          catData.latitude,
          userId,
          catData.description ?? null,
        ],
      );

      let cat = result.rows[0];

      if (!name) {
        const updated = await client.query(
          `
          UPDATE cats
          SET name = 'Кот #' || id
          WHERE id = $1
          RETURNING
            id,
            name,
            gender,
            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude,
            created_at,
            created_by,
            description
        `,
          [cat.id],
        );

        cat = updated.rows[0];
      }

      await client.query('COMMIT');

      return cat;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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
          created_by,
          description

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

  async getLastCats(limit = 5) {
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          gender,
          ST_Y(location::geometry) AS latitude,
          ST_X(location::geometry) AS longitude,
          created_at,
          created_by,
          description

        FROM cats

        ORDER BY created_at DESC

        LIMIT $1
      `,
      [limit],
    );
    return result.rows;
  }
}
