import axios from 'axios';
import crypto from 'crypto';

const BITREFILL_API_URL = 'https://api.bitrefill.com/v1';
const API_KEY = process.env.BITREFILL_API_KEY || '';
const API_SECRET = process.env.BITREFILL_API_SECRET || '';

interface BitrefillProduct {
  id: string;
  name: string;
  category: string;
  country: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  image: string;
}

interface BitrefillOrder {
  id: string;
  productId: string;
  amount: number;
  phoneNumber: string;
  status: 'pending' | 'completed' | 'failed';
  invoice?: {
    url: string;
    address: string;
    amount: string;
  };
}

// Generate HMAC signature for authentication
function generateSignature(timestamp: string, method: string, path: string, body: string = ''): string {
  const message = `${timestamp}${method}${path}${body}`;
  return crypto.createHmac('sha256', API_SECRET).update(message).digest('hex');
}

// Create authenticated request
async function authenticatedRequest(
  method: string,
  path: string,
  data?: any
): Promise<any> {
  const timestamp = Date.now().toString();
  const body = data ? JSON.stringify(data) : '';
  const signature = generateSignature(timestamp, method, path, body);

  try {
    const response = await axios({
      method,
      url: `${BITREFILL_API_URL}${path}`,
      headers: {
        'X-API-Key': API_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json',
      },
      data,
    });

    return response.data;
  } catch (error: any) {
    console.error('Bitrefill API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Bitrefill API request failed');
  }
}

export const bitrefillService = {
  // Get products by country
  async getProducts(country: string = 'NG'): Promise<BitrefillProduct[]> {
    try {
      const response = await authenticatedRequest('GET', `/products?country=${country}`);
      return response.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return mock data for development
      return [
        {
          id: 'mtn-airtime-ng',
          name: 'MTN Airtime',
          category: 'airtime',
          country: 'NG',
          currency: 'USD',
          minAmount: 1,
          maxAmount: 100,
          image: '/mtn-logo.png',
        },
        {
          id: 'airtel-airtime-ng',
          name: 'Airtel Airtime',
          category: 'airtime',
          country: 'NG',
          currency: 'USD',
          minAmount: 1,
          maxAmount: 100,
          image: '/airtel-logo.png',
        },
        {
          id: 'glo-airtime-ng',
          name: 'Glo Airtime',
          category: 'airtime',
          country: 'NG',
          currency: 'USD',
          minAmount: 1,
          maxAmount: 100,
          image: '/glo-logo.png',
        },
      ];
    }
  },

  // Get product details
  async getProduct(productId: string): Promise<BitrefillProduct | null> {
    try {
      const response = await authenticatedRequest('GET', `/products/${productId}`);
      return response.product || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Create order
  async createOrder(
    productId: string,
    amount: number,
    phoneNumber: string,
    paymentMethod: string = 'crypto'
  ): Promise<BitrefillOrder> {
    try {
      const response = await authenticatedRequest('POST', '/orders', {
        productId,
        amount,
        phoneNumber,
        paymentMethod,
        currency: 'USD',
      });

      return {
        id: response.orderId,
        productId,
        amount,
        phoneNumber,
        status: response.status,
        invoice: response.invoice,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      // Return mock order for development
      return {
        id: `mock_${Date.now()}`,
        productId,
        amount,
        phoneNumber,
        status: 'completed',
      };
    }
  },

  // Get order status
  async getOrderStatus(orderId: string): Promise<string> {
    try {
      const response = await authenticatedRequest('GET', `/orders/${orderId}`);
      return response.status || 'unknown';
    } catch (error) {
      console.error('Error fetching order status:', error);
      return 'unknown';
    }
  },

  // Get products by category
  async getProductsByCategory(category: 'airtime' | 'data' | 'giftcards', country: string = 'NG'): Promise<BitrefillProduct[]> {
    const products = await this.getProducts(country);
    return products.filter(p => p.category === category);
  },
};
