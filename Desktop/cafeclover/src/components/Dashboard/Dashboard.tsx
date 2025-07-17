import { useState, useEffect } from 'react';
import { cloverApi } from '../../services/cloverApi';
import type { CloverMerchant, CloverItem, CloverOrder } from '../../types/clover';

export const Dashboard = () => {
  const [merchant, setMerchant] = useState<CloverMerchant | null>(null);
  const [items, setItems] = useState<CloverItem[]>([]);
  const [orders, setOrders] = useState<CloverOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load merchant info
        const merchantData = await cloverApi.getMerchant();
        setMerchant(merchantData);

        // Load items
        const itemsData = await cloverApi.getItems();
        setItems(itemsData.elements);

        // Load recent orders
        const ordersData = await cloverApi.getOrders({ limit: 10 });
        setOrders(ordersData.elements);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Cafe Management Dashboard</h1>
      
      {merchant && (
        <div className="merchant-info">
          <h2>{merchant.name}</h2>
          <p>{merchant.address.address1}, {merchant.address.city}, {merchant.address.state}</p>
          <p>Phone: {merchant.phone}</p>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h3>Menu Items ({items.length})</h3>
          <div className="items-list">
            {items.slice(0, 5).map(item => (
              <div key={item.id} className="item-card">
                <h4>{item.name}</h4>
                <p>${(item.price / 100).toFixed(2)}</p>
                {item.stockCount && <p>Stock: {item.stockCount}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Recent Orders ({orders.length})</h3>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <h4>Order #{order.id.slice(-6)}</h4>
                <p>Total: ${(order.total / 100).toFixed(2)}</p>
                <p>Status: {order.state}</p>
                <p>Items: {order.lineItems?.length || 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};