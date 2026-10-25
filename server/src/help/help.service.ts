import { pool } from '@/db/index';
import type { HelpType } from './help.schema.js';

type HelpStatus = 'needed' | 'resolved';

type LatestHelp = {
  status: HelpStatus;
  created_at: Date | string;
};

export class HelpServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'HelpServiceError';
  }
}

const getEffectiveStatus = (
  type: HelpType,
  latest?: LatestHelp,
): HelpStatus | null => {
  if (!latest) return null;

  if (
    type === 'food' &&
    latest.status === 'resolved' &&
    Date.now() - new Date(latest.created_at).getTime() >= 24 * 60 * 60 * 1000
  ) {
    return 'needed';
  }

  return latest.status;
};

export class HelpService {
  async getCatHelp(catId: string) {
    const catResult = await pool.query(
      `
        SELECT
          c.id,
          NOT EXISTS (
            SELECT 1
            FROM help_requests h
            WHERE h.cat_id = c.id
              AND h.type = 'home'
              AND h.status = 'resolved'
          ) AS is_active
        FROM cats c
        WHERE c.id = $1
      `,
      [catId],
    );

    if (catResult.rowCount === 0) {
      throw new HelpServiceError('Кот не найден', 404);
    }

    const [historyResult, currentResult] = await Promise.all([
      pool.query(
        `
          SELECT
            id,
            cat_id AS "catId",
            type,
            status AS state,
            created_at AS "createdAt",
            created_by AS "createdBy"
          FROM help_requests
          WHERE cat_id = $1
          ORDER BY created_at DESC, id DESC
        `,
        [catId],
      ),
      pool.query(
        `
          SELECT DISTINCT ON (type)
            id,
            cat_id AS "catId",
            type,
            status,
            created_at AS "createdAt",
            created_by AS "createdBy"
          FROM help_requests
          WHERE cat_id = $1
          ORDER BY type, created_at DESC, id DESC
        `,
        [catId],
      ),
    ]);

    const current = currentResult.rows.map((row) => ({
      id: row.id,
      catId: row.catId,
      type: row.type as HelpType,
      state: getEffectiveStatus(row.type as HelpType, {
        status: row.status,
        created_at: row.createdAt,
      }),
      createdAt: row.createdAt,
      createdBy: row.createdBy,
    }));

    return {
      catId: catResult.rows[0].id,
      isActive: catResult.rows[0].is_active,
      current,
      history: historyResult.rows,
    };
  }

  async getLastRequests(limit = 5) {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const result = await pool.query(
      `
      SELECT
        hr.id,
        hr.cat_id,
        c.name AS cat_name,
        c.gender AS cat_gender,
        hr.type,
        hr.status,
        hr.created_at,
        hr.created_by
      FROM help_requests hr
      JOIN cats c ON c.id = hr.cat_id
      ORDER BY hr.created_at DESC, hr.id DESC
      LIMIT $1
    `,
      [safeLimit],
    );
    return result.rows;
  }

  async createHelp(catId: string, type: HelpType, userId: string | number) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const catResult = await client.query(
        'SELECT id FROM cats WHERE id = $1 FOR UPDATE',
        [catId],
      );

      if (catResult.rowCount === 0) {
        throw new HelpServiceError('Кот не найден', 404);
      }

      const homeResult = await client.query(
        `
          SELECT status
          FROM help_requests
          WHERE cat_id = $1 AND type = 'home'
          ORDER BY created_at DESC, id DESC
          LIMIT 1
        `,
        [catId],
      );

      if (homeResult.rows[0]?.status === 'resolved') {
        throw new HelpServiceError(
          'Кот уже обрёл дом. Новые события помощи недоступны.',
          409,
        );
      }

      const latestResult = await client.query(
        `
          SELECT status, created_at
          FROM help_requests
          WHERE cat_id = $1 AND type = $2
          ORDER BY created_at DESC, id DESC
          LIMIT 1
        `,
        [catId, type],
      );
      const latest = latestResult.rows[0] as LatestHelp | undefined;
      const currentStatus = getEffectiveStatus(type, latest);

      if (currentStatus === 'needed') {
        throw new HelpServiceError(
          'Такая помощь уже отмечена как необходимая',
          409,
        );
      }

      if (
        type === 'food' &&
        latest?.status === 'resolved' &&
        currentStatus === 'resolved'
      ) {
        throw new HelpServiceError(
          'Повторно запросить еду можно через 24 часа после решения предыдущего события',
          409,
        );
      }

      const result = await client.query(
        `
          INSERT INTO help_requests (cat_id, type, status, created_at, created_by)
          VALUES ($1, $2, 'needed', NOW(), $3)
          RETURNING
            id,
            cat_id AS "catId",
            type,
            status AS state,
            created_at AS "createdAt",
            created_by AS "createdBy"
        `,
        [catId, type, userId],
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async resolveHelp(catId: string, type: HelpType, userId: string | number) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const catResult = await client.query(
        'SELECT id FROM cats WHERE id = $1 FOR UPDATE',
        [catId],
      );

      if (catResult.rowCount === 0) {
        throw new HelpServiceError('Кот не найден', 404);
      }

      const homeResult = await client.query(
        `
          SELECT status
          FROM help_requests
          WHERE cat_id = $1 AND type = 'home'
          ORDER BY created_at DESC, id DESC
          LIMIT 1
        `,
        [catId],
      );

      if (homeResult.rows[0]?.status === 'resolved') {
        throw new HelpServiceError(
          'Кот уже обрёл дом. Новые события помощи недоступны.',
          409,
        );
      }

      const latestResult = await client.query(
        `
          SELECT status, created_at
          FROM help_requests
          WHERE cat_id = $1 AND type = $2
          ORDER BY created_at DESC, id DESC
          LIMIT 1
        `,
        [catId, type],
      );
      const latest = latestResult.rows[0] as LatestHelp | undefined;

      if (getEffectiveStatus(type, latest) !== 'needed') {
        throw new HelpServiceError(
          'Нет активного события помощи, которое можно отметить решённым',
          409,
        );
      }

      const result = await client.query(
        `
          INSERT INTO help_requests (cat_id, type, status, created_at, created_by)
          VALUES ($1, $2, 'resolved', NOW(), $3)
          RETURNING
            id,
            cat_id AS "catId",
            type,
            status AS state,
            created_at AS "createdAt",
            created_by AS "createdBy"
        `,
        [catId, type, userId],
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
