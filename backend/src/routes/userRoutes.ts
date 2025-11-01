import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();

// Get user by wallet address
router.get('/address/:address', userController.getUserByAddress);

// Get user by username
router.get('/username/:username', userController.getUserByUsername);

// Register new user
router.post('/register', userController.registerUser);

export default router;
