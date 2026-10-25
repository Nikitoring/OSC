import { pool } from '../db/index.ts';
import bcrypt from 'bcrypt';
export class AuthService {
  async registration(authData: { login: string; password: string }) {
    try {
      const passwordHash = await bcrypt.hash(authData.password, 12);
      const result = await pool.query(
        `
				INSERT INTO users (
					username,
					password_hash
				)
				VALUES (
					$1,
					$2
				)
				RETURNING
					id,
					username
			`,
        [authData.login, passwordHash],
      );

      return result.rows[0];
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new Error('User already exists');
      }

      throw error;
    }
  }

  async login(loginData: { login: string; password: string }) {
    const result = await pool.query(
      `
      SELECT id, username, password_hash
      FROM users
      WHERE username = $1
    `,
      [loginData.login],
    );

    const user = result.rows[0];

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(
      loginData.password,
      user.password_hash,
    );

    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
    };
  }
}
