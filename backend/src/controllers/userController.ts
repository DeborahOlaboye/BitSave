import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';

export const userController = {
  async getUserByAddress(req: Request, res: Response) {
    try {
      const { address } = req.params;

      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      const user = await UserModel.findByAddress(address.toLowerCase());

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ data: user });
    } catch (error) {
      console.error('Error in getUserByAddress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getUserByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      const user = await UserModel.findByUsername(username);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ data: user });
    } catch (error) {
      console.error('Error in getUserByUsername:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async registerUser(req: Request, res: Response) {
    try {
      const { username, walletAddress } = req.body;

      // Validation
      if (!username || !walletAddress) {
        return res.status(400).json({ error: 'Username and wallet address are required' });
      }

      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res
          .status(400)
          .json({ error: 'Username can only contain letters, numbers, and underscores' });
      }

      // Check if username already exists
      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ error: 'Username already taken' });
      }

      // Check if wallet address already registered
      const existingWallet = await UserModel.findByAddress(walletAddress.toLowerCase());
      if (existingWallet) {
        return res.status(409).json({ error: 'Wallet address already registered' });
      }

      // Create user
      const user = await UserModel.create(username, walletAddress);

      res.status(201).json({
        data: user,
        message: 'User registered successfully',
      });
    } catch (error) {
      console.error('Error in registerUser:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
