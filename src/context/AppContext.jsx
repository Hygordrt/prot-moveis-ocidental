import { createContext, useContext, useState } from 'react';
import { products as initialProducts } from '../data/products';
import { orders as initialOrders } from '../data/orders';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  function addProduct(product) {
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      soldCount: 0,
      reserved: 0,
      images: product.images?.length
        ? product.images
        : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }

  function updateProduct(id, updates) {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  }

  function deleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  function addOrder(order) {
    const newOrder = {
      ...order,
      id: `PED-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };
    if (newOrder.status === 'reservado') {
      newOrder.products.forEach(item => {
        updateProduct(item.productId, {
          reserved: (products.find(p => p.id === item.productId)?.reserved || 0) + item.quantity,
        });
      });
    } else if (newOrder.status === 'vendido') {
      newOrder.products.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          updateProduct(item.productId, {
            quantity: Math.max(0, prod.quantity - item.quantity),
            soldCount: prod.soldCount + item.quantity,
          });
        }
      });
    }
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }

  function markOrderSold(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === 'vendido') return;
    order.products.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        updateProduct(item.productId, {
          quantity: Math.max(0, prod.quantity - item.quantity),
          reserved: Math.max(0, (prod.reserved || 0) - item.quantity),
          soldCount: prod.soldCount + item.quantity,
        });
      }
    });
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: 'vendido' } : o)));
  }

  function cancelOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === 'cancelado') return;
    if (order.status === 'reservado') {
      order.products.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          updateProduct(item.productId, {
            reserved: Math.max(0, (prod.reserved || 0) - item.quantity),
          });
        }
      });
    }
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: 'cancelado' } : o)));
  }

  const adminLogin = (user, pass) => {
    if (user === 'admin' && pass === '1234') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => setIsAdminLoggedIn(false);

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        isAdminLoggedIn,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        markOrderSold,
        cancelOrder,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
