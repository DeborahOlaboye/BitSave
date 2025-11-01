import { Request, Response } from 'express';
import { bitrefillService } from '../services/bitrefillService.js';

export const bitrefillController = {
  async getProducts(req: Request, res: Response) {
    try {
      const { country } = req.params;
      const products = await bitrefillService.getProducts(country || 'NG');

      res.json({ data: products });
    } catch (error) {
      console.error('Error in getProducts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const product = await bitrefillService.getProduct(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ data: product });
    } catch (error) {
      console.error('Error in getProduct:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async createOrder(req: Request, res: Response) {
    try {
      const { productId, amount, phoneNumber, paymentMethod } = req.body;

      if (!productId || !amount || !phoneNumber) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const order = await bitrefillService.createOrder(
        productId,
        amount,
        phoneNumber,
        paymentMethod
      );

      res.status(201).json({ data: order });
    } catch (error) {
      console.error('Error in createOrder:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const status = await bitrefillService.getOrderStatus(orderId);

      res.json({ data: { status } });
    } catch (error) {
      console.error('Error in getOrderStatus:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getProductsByCategory(req: Request, res: Response) {
    try {
      const { category, country } = req.params;

      if (!['airtime', 'data', 'giftcards'].includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
      }

      const products = await bitrefillService.getProductsByCategory(
        category as 'airtime' | 'data' | 'giftcards',
        country || 'NG'
      );

      res.json({ data: products });
    } catch (error) {
      console.error('Error in getProductsByCategory:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
