import express from 'express';
import { bitrefillController } from '../controllers/bitrefillController.js';

const router = express.Router();

// Get all products for a country
router.get('/products/:country', bitrefillController.getProducts);

// Get products by category
router.get('/products/:category/:country', bitrefillController.getProductsByCategory);

// Get specific product
router.get('/product/:productId', bitrefillController.getProduct);

// Create order
router.post('/order', bitrefillController.createOrder);

// Get order status
router.get('/order/:orderId', bitrefillController.getOrderStatus);

export default router;
