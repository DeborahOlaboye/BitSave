import { Request, Response } from 'express';
import { TransactionModel } from '../models/Transaction.js';

export const transactionController = {
  async getTransactions(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const transactions = await TransactionModel.findByUserId(userId);

      res.json({ data: transactions });
    } catch (error) {
      console.error('Error in getTransactions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async createTransaction(req: Request, res: Response) {
    try {
      const transaction = await TransactionModel.create(req.body);

      res.status(201).json({
        data: transaction,
        message: 'Transaction created successfully',
      });
    } catch (error) {
      console.error('Error in createTransaction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateTransactionStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { status, txHash } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
      }

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const transaction = await TransactionModel.updateStatus(id, status, txHash);

      res.json({
        data: transaction,
        message: 'Transaction updated successfully',
      });
    } catch (error) {
      console.error('Error in updateTransactionStatus:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
