import axios from 'axios';
import type {
  CloverMerchant,
  CloverItem,
  CloverCategory,
  CloverOrder,
  CloverEmployee,
  CloverPayment
} from '../types/clover';

class CloverApiService {
  private baseURL = 'https://api.clover.com/v3';
  private accessToken: string | null = null;
  private merchantId: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('clover_access_token');
    this.merchantId = localStorage.getItem('clover_merchant_id');
  }

  private getHeaders() {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }
    
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  private async apiCall<T>(endpoint: string): Promise<T> {
    if (!this.merchantId) {
      throw new Error('No merchant ID available');
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/merchants/${this.merchantId}${endpoint}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  // Merchant information
  async getMerchant(): Promise<CloverMerchant> {
    return this.apiCall<CloverMerchant>('');
  }

  // Inventory management
  async getItems(): Promise<{ elements: CloverItem[] }> {
    return this.apiCall<{ elements: CloverItem[] }>('/items');
  }

  async getItem(itemId: string): Promise<CloverItem> {
    return this.apiCall<CloverItem>(`/items/${itemId}`);
  }

  async getCategories(): Promise<{ elements: CloverCategory[] }> {
    return this.apiCall<{ elements: CloverCategory[] }>('/categories');
  }

  // Orders
  async getOrders(params?: { limit?: number; filter?: string }): Promise<{ elements: CloverOrder[] }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.apiCall<{ elements: CloverOrder[] }>(`/orders${queryString}`);
  }

  async getOrder(orderId: string): Promise<CloverOrder> {
    return this.apiCall<CloverOrder>(`/orders/${orderId}`);
  }

  async getOrderLineItems(orderId: string): Promise<{ elements: any[] }> {
    return this.apiCall<{ elements: any[] }>(`/orders/${orderId}/line_items`);
  }

  // Payments
  async getPayments(params?: { limit?: number }): Promise<{ elements: CloverPayment[] }> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.apiCall<{ elements: CloverPayment[] }>(`/payments${queryString}`);
  }

  async getOrderPayments(orderId: string): Promise<{ elements: CloverPayment[] }> {
    return this.apiCall<{ elements: CloverPayment[] }>(`/orders/${orderId}/payments`);
  }

  // Employees
  async getEmployees(): Promise<{ elements: CloverEmployee[] }> {
    return this.apiCall<{ elements: CloverEmployee[] }>('/employees');
  }

  // Real-time updates using webhooks (for future implementation)
  async setupWebhooks(webhookUrl: string, events: string[]) {
    // This would be implemented to set up webhooks for real-time updates
    console.log('Webhook setup:', { webhookUrl, events });
  }
}

export const cloverApi = new CloverApiService();