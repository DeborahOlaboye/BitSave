import express from 'express';
import { mezoController } from '../controllers/mezoController.js';

const router = express.Router();

// Get balances for an address
router.get('/balances/:address', mezoController.getBalances);

// Get vault info
router.get('/vault/info', mezoController.getVaultInfo);

// Get BTC price
router.get('/btc-price', mezoController.getBtcPrice);

// Get borrow position
router.get('/borrow/:address', mezoController.getBorrowPosition);

export default router;
