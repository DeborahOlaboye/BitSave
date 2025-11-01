import { query } from '../services/database.js';

export interface Transaction {
  id: number;
  user_id: number;
  type: string;
  amount: string;
  recipient_username?: string;
  recipient_address?: string;
  tx_hash?: string;
  status: string;
  note?: string;
  metadata?: any;
  created_at: Date;
}

export const TransactionModel = {
  async findByUserId(userId: number, limit: number = 50): Promise<Transaction[]> {
    const result = await query(
      `SELECT * FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  async findById(id: number): Promise<Transaction | null> {
    const result = await query('SELECT * FROM transactions WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const {
      user_id,
      type,
      amount,
      recipient_username,
      recipient_address,
      tx_hash,
      status = 'pending',
      note,
      metadata,
    } = transaction;

    const result = await query(
      `INSERT INTO transactions (
        user_id, type, amount, recipient_username, recipient_address,
        tx_hash, status, note, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        user_id,
        type,
        amount,
        recipient_username,
        recipient_address,
        tx_hash,
        status,
        note,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );
    return result.rows[0];
  },

  async updateStatus(id: number, status: string, txHash?: string): Promise<Transaction> {
    const result = await query(
      `UPDATE transactions
       SET status = $1, tx_hash = COALESCE($2, tx_hash)
       WHERE id = $3
       RETURNING *`,
      [status, txHash, id]
    );
    return result.rows[0];
  },
};
