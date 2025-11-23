import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase/client';
import { User } from '../App';

export interface Notification {
  id: string;
  type: 'order' | 'delivery' | 'payment' | 'inventory' | 'message' | 'system';
  title: string;
  titleNepali: string;
  message: string;
  messageNepali: string;
  userId: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
  createdAt: string;
  expiresAt?: string;
}

export interface OrderUpdate {
  orderId: string;
  status: 'pending' | 'confirmed' | 'prepared' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  location?: { lat: number; lng: number };
  estimatedDelivery?: string;
  driverId?: string;
  message?: string;
  timestamp: string;
}

export interface InventoryUpdate {
  productId: string;
  farmerId: string;
  stock: number;
  price: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'farmer' | 'consumer' | 'driver';
  message: string;
  type: 'text' | 'image' | 'location' | 'order_reference';
  metadata?: any;
  timestamp: string;
  read: boolean;
}

interface RealTimeContextType {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Order Tracking
  orderUpdates: Record<string, OrderUpdate[]>;
  subscribeToOrder: (orderId: string) => void;
  unsubscribeFromOrder: (orderId: string) => void;
  
  // Inventory Updates
  inventoryUpdates: Record<string, InventoryUpdate>;
  subscribeToInventory: (farmerId: string) => void;
  updateInventory: (update: InventoryUpdate) => void;
  
  // Messaging
  conversations: Record<string, ChatMessage[]>;
  activeConversations: string[];
  sendMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  subscribeToConversation: (conversationId: string) => void;
  
  // Connection Status
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
}

const RealTimeContext = createContext<RealTimeContextType | null>(null);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within RealTimeProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
  user: User | null;
}

export const RealTimeProvider: React.FC<Props> = ({ children, user }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [orderUpdates, setOrderUpdates] = useState<Record<string, OrderUpdate[]>>({});
  const [inventoryUpdates, setInventoryUpdates] = useState<Record<string, InventoryUpdate>>({});
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({});
  const [activeConversations, setActiveConversations] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'offline'>('offline');

  // Connection monitoring
  useEffect(() => {
    const checkConnection = () => {
      const start = Date.now();
      fetch('/api/ping', { method: 'HEAD' })
        .then(() => {
          const latency = Date.now() - start;
          setIsConnected(true);
          if (latency < 100) setConnectionQuality('excellent');
          else if (latency < 300) setConnectionQuality('good');
          else setConnectionQuality('poor');
        })
        .catch(() => {
          setIsConnected(false);
          setConnectionQuality('offline');
        });
    };

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    checkConnection(); // Initial check

    return () => clearInterval(interval);
  }, []);

  // Supabase real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to notifications
    const notificationChannel = supabase
      .channel(`notifications:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const notification = payload.new as any;
        addNotification({
          type: notification.type,
          title: notification.title,
          titleNepali: notification.title_nepali,
          message: notification.message,
          messageNepali: notification.message_nepali,
          userId: notification.user_id,
          read: false,
          priority: notification.priority,
          data: notification.data
        });
      })
      .subscribe();

    // Subscribe to order updates
    const orderChannel = supabase
      .channel('order_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_tracking'
      }, (payload) => {
        const update = payload.new as any;
        setOrderUpdates(prev => ({
          ...prev,
          [update.order_id]: [...(prev[update.order_id] || []), {
            orderId: update.order_id,
            status: update.status,
            location: update.location,
            estimatedDelivery: update.estimated_delivery,
            driverId: update.driver_id,
            message: update.message,
            timestamp: update.created_at
          }]
        }));
      })
      .subscribe();

    // Subscribe to inventory updates
    const inventoryChannel = supabase
      .channel('inventory_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, (payload) => {
        const product = payload.new as any;
        setInventoryUpdates(prev => ({
          ...prev,
          [product.id]: {
            productId: product.id,
            farmerId: product.farmer_id,
            stock: product.stock,
            price: product.price,
            status: product.stock > 10 ? 'available' : product.stock > 0 ? 'low_stock' : 'out_of_stock',
            lastUpdated: product.updated_at
          }
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notificationChannel);
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(inventoryChannel);
    };
  }, [user]);

  // Load initial notifications
  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (data) {
          setNotifications(data.map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            titleNepali: n.title_nepali,
            message: n.message,
            messageNepali: n.message_nepali,
            userId: n.user_id,
            read: n.read,
            priority: n.priority,
            data: n.data,
            createdAt: n.created_at,
            expiresAt: n.expires_at
          })));
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        // Load demo notifications for development
        setNotifications([
          {
            id: '1',
            type: 'order',
            title: 'New Order Received',
            titleNepali: 'नयाँ अर्डर प्राप्त भयो',
            message: 'You have received a new order for fresh tomatoes',
            messageNepali: 'तपाईंले ताजा टमाटरको लागि नयाँ अर्डर प्राप्त गर्नुभएको छ',
            userId: user.id,
            read: false,
            priority: 'high',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            type: 'delivery',
            title: 'Delivery In Progress',
            titleNepali: 'डेलिभरी जारी छ',
            message: 'Your order is on the way! ETA: 15 minutes',
            messageNepali: 'तपाईंको अर्डर बाटोमा छ! अनुमानित समय: १५ मिनेट',
            userId: user.id,
            read: false,
            priority: 'medium',
            createdAt: new Date(Date.now() - 300000).toISOString()
          }
        ]);
      }
    };

    loadNotifications();
  }, [user]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png'
      });
    }
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const subscribeToOrder = useCallback((orderId: string) => {
    // This would typically subscribe to real-time order updates
    console.log('Subscribing to order:', orderId);
  }, []);

  const unsubscribeFromOrder = useCallback((orderId: string) => {
    console.log('Unsubscribing from order:', orderId);
  }, []);

  const subscribeToInventory = useCallback((farmerId: string) => {
    console.log('Subscribing to inventory updates for farmer:', farmerId);
  }, []);

  const updateInventory = useCallback((update: InventoryUpdate) => {
    setInventoryUpdates(prev => ({
      ...prev,
      [update.productId]: update
    }));
  }, []);

  const sendMessage = useCallback((conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setConversations(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));
  }, []);

  const subscribeToConversation = useCallback((conversationId: string) => {
    setActiveConversations(prev => [...new Set([...prev, conversationId])]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: RealTimeContextType = {
    notifications,
    unreadCount,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    orderUpdates,
    subscribeToOrder,
    unsubscribeFromOrder,
    inventoryUpdates,
    subscribeToInventory,
    updateInventory,
    conversations,
    activeConversations,
    sendMessage,
    subscribeToConversation,
    isConnected,
    connectionQuality
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};