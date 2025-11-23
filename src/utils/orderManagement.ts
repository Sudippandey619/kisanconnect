// Order Management Utilities for KisanConnect

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  nameNepali: string;
  farmer: string;
  farmerNepali: string;
  price: number;
  originalPrice: number;
  quantity: number;
  unit: string;
  image: string;
  maxQuantity: number;
  verified: boolean;
  fresh: boolean;
  organic: boolean;
  rating: number;
  distance: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'prepared' | 'picked_up' | 'in_transit' | 'nearby' | 'delivered' | 'cancelled';
  statusNepali: string;
  createdAt: string;
  estimatedDelivery: string;
  trackingId: string;
  paymentMethod: string;
  deliveryAddress: string;
  customer: {
    name: string;
    nameNepali?: string;
    phone: string;
    address: string;
    addressNepali?: string;
  };
  driver?: {
    id: string;
    name: string;
    nameNepali: string;
    phone: string;
    rating: number;
    photo: string;
    vehicle: string;
    licensePlate: string;
    isOnline: boolean;
  };
  timeline: Array<{
    status: string;
    timestamp: string;
    message: string;
    messageNepali: string;
    location?: {
      lat: number;
      lng: number;
      address: string;
      addressNepali: string;
    };
    photos?: string[];
    notes?: string;
  }>;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  specialInstructions?: string;
}

export class OrderManager {
  private static orders: Order[] = [];

  static createOrder(orderData: Partial<Order>): Order {
    const orderId = 'ORD_' + Date.now();
    const trackingId = 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const order: Order = {
      id: orderId,
      items: orderData.items || [],
      total: orderData.total || 0,
      status: 'confirmed',
      statusNepali: 'पुष्टि भएको',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      trackingId,
      paymentMethod: orderData.paymentMethod || 'KisanConnect Wallet',
      deliveryAddress: orderData.deliveryAddress || '',
      customer: orderData.customer || {
        name: 'Customer',
        phone: '+977-9800000000',
        address: 'Kathmandu, Nepal'
      },
      timeline: [
        {
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          message: 'Order confirmed and payment received',
          messageNepali: 'अर्डर पुष्टि भयो र भुक्तानी प्राप्त भयो'
        }
      ],
      paymentStatus: 'paid',
      deliveryFee: orderData.deliveryFee || 0,
      discount: orderData.discount || 0,
      promoCode: orderData.promoCode,
      specialInstructions: orderData.specialInstructions,
      ...orderData
    };

    this.orders.unshift(order);
    this.saveOrders();
    return order;
  }

  static getOrder(orderId: string): Order | undefined {
    return this.orders.find(order => order.id === orderId);
  }

  static getUserOrders(userId: string): Order[] {
    // In a real app, this would filter by user ID
    return this.orders;
  }

  static updateOrderStatus(orderId: string, status: Order['status'], additionalData?: Partial<Order>): Order | null {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    const statusMessages = {
      confirmed: { en: 'Order confirmed and payment received', ne: 'अर्डर पुष्टि भयो र भुक्तानी प्राप्त भयो' },
      preparing: { en: 'Farmers are preparing your items', ne: 'किसानहरूले तपाईंका सामानहरू तयार गर्दै छन्' },
      prepared: { en: 'Items prepared and ready for pickup', ne: 'सामानहरू तयार भएर उठाउन तयार छ' },
      picked_up: { en: 'Items picked up by driver', ne: 'चालकले सामानहरू उठायो' },
      in_transit: { en: 'On the way to delivery location', ne: 'डेलिभरी स्थानमा जाँदै' },
      nearby: { en: 'Driver is nearby your location', ne: 'चालक तपाईंको स्थान नजिक छ' },
      delivered: { en: 'Order delivered successfully', ne: 'अर्डर सफलतापूर्वक डेलिभर भयो' },
      cancelled: { en: 'Order has been cancelled', ne: 'अर्डर रद्द गरिएको छ' }
    };

    const statusNepali = {
      confirmed: 'पुष्टि भएको',
      preparing: 'तयारी गर्दै',
      prepared: 'तयार',
      picked_up: 'उठाइएको',
      in_transit: 'ढुवानीमा',
      nearby: 'नजिकमा',
      delivered: 'डेलिभर भएको',
      cancelled: 'रद्द गरिएको'
    };

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      status,
      statusNepali: statusNepali[status],
      ...additionalData,
      timeline: [
        ...this.orders[orderIndex].timeline,
        {
          status,
          timestamp: new Date().toISOString(),
          message: statusMessages[status].en,
          messageNepali: statusMessages[status].ne
        }
      ]
    };

    this.saveOrders();
    return this.orders[orderIndex];
  }

  static addDriver(orderId: string, driver: Order['driver']): Order | null {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      driver,
      timeline: [
        ...this.orders[orderIndex].timeline,
        {
          status: 'driver_assigned',
          timestamp: new Date().toISOString(),
          message: `Driver ${driver?.name} has been assigned`,
          messageNepali: `चालक ${driver?.nameNepali || driver?.name} तोकिएको छ`
        }
      ]
    };

    this.saveOrders();
    return this.orders[orderIndex];
  }

  static addTimelineEvent(orderId: string, event: Order['timeline'][0]): Order | null {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    this.orders[orderIndex].timeline.push({
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    });

    this.saveOrders();
    return this.orders[orderIndex];
  }

  private static saveOrders(): void {
    localStorage.setItem('kisanconnect:orders', JSON.stringify(this.orders));
  }

  static loadOrders(): void {
    const saved = localStorage.getItem('kisanconnect:orders');
    if (saved) {
      this.orders = JSON.parse(saved);
    }
  }

  static getRecentOrders(limit: number = 5): Order[] {
    return this.orders.slice(0, limit);
  }

  static getOrdersByStatus(status: Order['status']): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  static calculateOrderStats(userId?: string): {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    totalValue: number;
  } {
    const userOrders = userId ? this.getUserOrders(userId) : this.orders;
    
    return {
      total: userOrders.length,
      completed: userOrders.filter(o => o.status === 'delivered').length,
      pending: userOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
      cancelled: userOrders.filter(o => o.status === 'cancelled').length,
      totalValue: userOrders.reduce((sum, order) => sum + order.total, 0)
    };
  }
}

// Initialize orders from localStorage
OrderManager.loadOrders();

// Add demo orders if none exist
if (OrderManager.getRecentOrders().length === 0) {
  // Create demo orders
  const demoOrders = [
    {
      items: [
        {
          id: 'cart_1',
          productId: '1',
          name: 'Fresh Tomatoes',
          nameNepali: 'ताजा गोलभेंडा',
          farmer: 'Ram Bahadur',
          farmerNepali: 'राम बहादुर',
          price: 80,
          originalPrice: 100,
          quantity: 2,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1546470427-e5869c9b1b0e?w=300',
          maxQuantity: 10,
          verified: true,
          fresh: true,
          organic: false,
          rating: 4.8,
          distance: '2.5 km',
          subscriptionEligible: true
        },
        {
          id: 'cart_2',
          productId: '2',
          name: 'Organic Carrots',
          nameNepali: 'जैविक गाजर',
          farmer: 'Sita Devi',
          farmerNepali: 'सीता देवी',
          price: 60,
          originalPrice: 75,
          quantity: 1,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=300',
          maxQuantity: 15,
          verified: true,
          fresh: true,
          organic: true,
          rating: 4.9,
          distance: '1.8 km',
          subscriptionEligible: true
        }
      ],
      total: 220,
      customer: {
        name: 'John Consumer',
        nameNepali: 'जन उपभोक्ता',
        phone: '+977-9841234567',
        address: 'Kathmandu, Nepal',
        addressNepali: 'काठमाडौं, नेपाल'
      },
      paymentMethod: 'wallet',
      deliveryAddress: 'Kathmandu, Nepal',
      specialInstructions: 'Please call before delivery'
    },
    {
      items: [
        {
          id: 'cart_3',
          productId: '3',
          name: 'Green Leafy Vegetables',
          nameNepali: 'हरो साग',
          farmer: 'Krishna Magar',
          farmerNepali: 'कृष्ण मगर',
          price: 40,
          originalPrice: 50,
          quantity: 3,
          unit: 'bunch',
          image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300',
          maxQuantity: 20,
          verified: true,
          fresh: true,
          organic: true,
          rating: 4.7,
          distance: '3.2 km',
          subscriptionEligible: false
        }
      ],
      total: 170,
      customer: {
        name: 'John Consumer',
        nameNepali: 'जन उपभोक्ता',
        phone: '+977-9841234567',
        address: 'Kathmandu, Nepal',
        addressNepali: 'काठमाडौं, नेपाल'
      },
      paymentMethod: 'esewa',
      deliveryAddress: 'Kathmandu, Nepal',
      deliveryFee: 50
    }
  ];

  // Create the demo orders with different statuses
  const order1 = OrderManager.createOrder(demoOrders[0]);
  OrderManager.updateOrderStatus(order1.id, 'in_transit');
  
  const order2 = OrderManager.createOrder(demoOrders[1]);
  OrderManager.updateOrderStatus(order2.id, 'delivered');
}

export default OrderManager;