import express from 'express';
import { transactionController } from '../controllers/transactionController.js';

const router = express.Router();

// Get transactions by user ID
router.get('/:userId', transactionController.getTransactions);

// Create new transaction
router.post('/', transactionController.createTransaction);

// Update transaction status
router.patch('/:id/status', transactionController.updateTransactionStatus);

export default router;
