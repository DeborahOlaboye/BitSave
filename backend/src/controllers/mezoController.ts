import { Request, Response } from 'express';
import { mezoService } from '../services/mezoService.js';
import { redisService } from '../services/redisService.js';

export const mezoController = {
  async getBalances(req: Request, res: Response) {
    try {
      const { address } = req.params;

      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      // Try to get from cache first (cache for 30 seconds)
      const cacheKey = `balance:${address.toLowerCase()}`;
      const balances = await redisService.getOrSet(
        cacheKey,
        () => mezoService.getTotalBalance(address),
        30
      );

      res.json({ data: balances });
    } catch (error) {
      console.error('Error in getBalances:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getVaultInfo(req: Request, res: Response) {
    try {
      const vaultInfo = await mezoService.getVaultInfo();

      res.json({ data: vaultInfo });
    } catch (error) {
      console.error('Error in getVaultInfo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getBtcPrice(req: Request, res: Response) {
    try {
      // Cache BTC price for 60 seconds
      const price = await redisService.getOrSet(
        'btc:price',
        () => mezoService.getBtcPrice(),
        60
      );

      res.json({ data: { price } });
    } catch (error) {
      console.error('Error in getBtcPrice:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getBorrowPosition(req: Request, res: Response) {
    try {
      const { address } = req.params;

      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      const position = await mezoService.getBorrowPosition(address);

      res.json({ data: { position } });
    } catch (error) {
      console.error('Error in getBorrowPosition:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
