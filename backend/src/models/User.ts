import { query } from '../services/database.js';

export interface User {
  id: number;
  username: string;
  wallet_address: string;
  mezo_borrow_position_id?: string;
  profile_data?: any;
  created_at: Date;
  updated_at: Date;
}

export const UserModel = {
  async findByAddress(address: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE wallet_address = $1', [address]);
    return result.rows[0] || null;
  },

  async findByUsername(username: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  },

  async findById(id: number): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async create(username: string, walletAddress: string): Promise<User> {
    const result = await query(
      `INSERT INTO users (username, wallet_address)
       VALUES ($1, $2)
       RETURNING *`,
      [username, walletAddress.toLowerCase()]
    );
    return result.rows[0];
  },

  async updateBorrowPosition(id: number, positionId: string): Promise<User> {
    const result = await query(
      `UPDATE users
       SET mezo_borrow_position_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [positionId, id]
    );
    return result.rows[0];
  },

  async updateProfile(id: number, profileData: any): Promise<User> {
    const result = await query(
      `UPDATE users
       SET profile_data = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(profileData), id]
    );
    return result.rows[0];
  },
};
