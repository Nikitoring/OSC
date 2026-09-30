import { pool } from '../db/index.js';
import { User } from '../types/user.js';

export class UserService {
  async getUserById(userId: string) {
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          gender,
          created_at,

        FROM users

        WHERE id = $1
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }
}
