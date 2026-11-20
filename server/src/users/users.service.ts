import { pool } from '../db/index.js';

export class UserService {
  async getProfile(userId: string) {
    const userResult = await pool.query(
      `
        SELECT id AS "userId", username, created_at AS "createdAt"
        FROM users
        WHERE id = $1
      `,
      [userId],
    );

    if (userResult.rows.length === 0) return null;

    const [statsResult, activityResult] = await Promise.all([
      pool.query(
        `
          SELECT
            (SELECT COUNT(*)::int FROM cats WHERE created_by = $1) AS "catsAdded",
            (SELECT COUNT(*)::int FROM help_requests WHERE created_by = $1) AS "helpEvents",
            (SELECT COUNT(*)::int FROM help_requests WHERE created_by = $1 AND status = 'resolved') AS "resolvedHelpEvents"
        `,
        [userId],
      ),
      pool.query(
        `
          SELECT
            event_type AS "eventType",
            id,
            cat_id AS "catId",
            cat_name AS "catName",
            help_type AS "helpType",
            status,
            created_at AS "createdAt"
          FROM (
            SELECT
              'cat_created'::text AS event_type,
              c.id,
              c.id AS cat_id,
              c.name AS cat_name,
              NULL::text AS help_type,
              NULL::text AS status,
              c.created_at
            FROM cats c
            WHERE c.created_by = $1

            UNION ALL

            SELECT
              'help_created'::text AS event_type,
              h.id,
              h.cat_id,
              c.name AS cat_name,
              h.type AS help_type,
              h.status,
              h.created_at
            FROM help_requests h
            JOIN cats c ON c.id = h.cat_id
            WHERE h.created_by = $1
          ) activity
          ORDER BY created_at DESC, id DESC
          LIMIT 10
        `,
        [userId],
      ),
    ]);

    return {
      ...userResult.rows[0],
      stats: statsResult.rows[0],
      recentActivity: activityResult.rows,
    };
  }

}
