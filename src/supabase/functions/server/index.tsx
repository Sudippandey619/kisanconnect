import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logger
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Routes

// Health check
app.get('/make-server-c775349f/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication - Signup
app.post('/make-server-c775349f/auth/signup', async (c) => {
  try {
    const { phone, otp, name, nameNepali } = await c.req.json();
    
    // In a real app, you would verify the OTP here
    // For now, we'll simulate successful verification
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      phone: phone,
      password: crypto.randomUUID(), // Generate random password since we're using OTP
      user_metadata: { 
        name: name || 'User',
        nameNepali: nameNepali || 'प्रयोगकर्ता',
        phone: phone
      },
      // Automatically confirm the user since OTP is verified
      email_confirm: true,
      phone_confirm: true
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return c.json({ error: 'Failed to create user' }, 400);
    }

    // Create user profile in KV store
    const profile = {
      id: data.user.id,
      phone: phone,
      name: name || 'User',
      nameNepali: nameNepali || 'प्रयोगकर्ता',
      roles: ['consumer'], // Default role
      currentRole: 'consumer',
      verified: true, // Since OTP was verified
      location: '',
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${data.user.id}`, profile);

    // Initialize empty wallet
    await kv.set(`wallet:${data.user.id}`, {
      balance: 0,
      transactions: []
    });

    return c.json({ 
      user: profile,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Authentication - Login with OTP
app.post('/make-server-c775349f/auth/login', async (c) => {
  try {
    const { phone, otp } = await c.req.json();
    
    // In a real app, you would verify the OTP here
    // For demo purposes, we'll accept any 6-digit OTP
    if (!otp || otp.length !== 6) {
      return c.json({ error: 'Invalid OTP' }, 400);
    }

    // Generate session token (in real app, you'd use Supabase's passwordless login)
    const sessionToken = crypto.randomUUID();
    
    // Find user by phone
    const allUsers = await kv.getByPrefix('user:') || [];
    const user = allUsers.find((u: any) => u.phone === phone);
    
    if (!user) {
      return c.json({ error: 'User not found. Please sign up first.' }, 404);
    }

    return c.json({ 
      user,
      sessionToken,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error during login:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Initialize seed data
app.post('/make-server-c775349f/seed/data', async (c) => {
  try {
    // Check if data already exists
    const existingProducts = await kv.get('products:all');
    if (existingProducts && existingProducts.length > 0) {
      return c.json({ message: 'Seed data already exists' });
    }

    // Create sample categories
    const categories = [
      { id: 'vegetables', name: 'Vegetables', nameNepali: 'तरकारी', icon: '🥕' },
      { id: 'fruits', name: 'Fruits', nameNepali: 'फलफूल', icon: '🍎' },
      { id: 'grains', name: 'Grains', nameNepali: 'अनाज', icon: '🌾' },
      { id: 'dairy', name: 'Dairy', nameNepali: 'दुग्ध उत्पादन', icon: '🥛' },
      { id: 'spices', name: 'Spices', nameNepali: 'मसला', icon: '🌶️' }
    ];

    await kv.set('categories:all', categories);

    // Create sample products
    const sampleProducts = [
      {
        id: 'prod-1',
        name: 'Fresh Tomatoes',
        nameNepali: 'ताजा गोल्भेडा',
        description: 'Organic tomatoes from local farm',
        descriptionNepali: 'स्थानीय खेतबाट जैविक गोल्भेडा',
        category: 'vegetables',
        price: 80,
        unit: 'kg',
        unitNepali: 'केजी',
        image: 'https://images.unsplash.com/photo-1546470427-e9b4ee1d3de5?w=400',
        farmerId: 'demo-farmer-1',
        farmerName: 'राम बहादुर',
        location: 'काभ्रेपलाञ्चोक',
        rating: 4.5,
        reviews: 23,
        inStock: true,
        quantity: 100,
        tags: ['organic', 'fresh', 'local']
      },
      {
        id: 'prod-2',
        name: 'Basmati Rice',
        nameNepali: 'बासमती चामल',
        description: 'Premium quality basmati rice',
        descriptionNepali: 'उच्च गुणस्तरको बासमती चामल',
        category: 'grains',
        price: 120,
        unit: 'kg',
        unitNepali: 'केजी',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        farmerId: 'demo-farmer-2',
        farmerName: 'सीता देवी',
        location: 'चितवन',
        rating: 4.8,
        reviews: 45,
        inStock: true,
        quantity: 500,
        tags: ['premium', 'aromatic', 'long-grain']
      },
      {
        id: 'prod-3',
        name: 'Fresh Milk',
        nameNepali: 'ताजा दूध',
        description: 'Pure cow milk from our dairy',
        descriptionNepali: 'हाम्रो डेयरीबाट शुद्ध गाईको दूध',
        category: 'dairy',
        price: 60,
        unit: 'liter',
        unitNepali: 'लिटर',
        image: 'https://images.unsplash.com/photo-1559308484-593c63d3781f?w=400',
        farmerId: 'demo-farmer-3',
        farmerName: 'हरि प्रसाद',
        location: 'पोखरा',
        rating: 4.7,
        reviews: 67,
        inStock: true,
        quantity: 50,
        tags: ['fresh', 'pure', 'daily']
      }
    ];

    await kv.set('products:all', sampleProducts);

    // Create sample farmer profiles
    for (const product of sampleProducts) {
      const farmerProducts = await kv.get(`products:farmer:${product.farmerId}`) || [];
      farmerProducts.push(product);
      await kv.set(`products:farmer:${product.farmerId}`, farmerProducts);
    }

    return c.json({ 
      message: 'Seed data created successfully',
      categories: categories.length,
      products: sampleProducts.length
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// User Profile Management
app.get('/make-server-c775349f/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    // Get user profile from KV store
    const profile = await kv.get(`user:${user.id}`);
    if (profile) {
      return c.json(profile);
    }

    // Create default profile if not exists
    const defaultProfile = {
      id: user.id,
      phone: user.phone,
      name: user.user_metadata?.name || 'User',
      nameNepali: user.user_metadata?.nameNepali || 'प्रयोगकर्ता',
      roles: ['consumer'],
      currentRole: 'consumer',
      verified: false,
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, defaultProfile);
    return c.json(defaultProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c775349f/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const body = await c.req.json();
    const profile = {
      ...body,
      id: user.id,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, profile);
    return c.json(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Categories Management
app.get('/make-server-c775349f/categories', async (c) => {
  try {
    const categories = await kv.get('categories:all') || [];
    return c.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Role Management
app.post('/make-server-c775349f/user/roles', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const { roles } = await c.req.json();
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    profile.roles = roles;
    profile.currentRole = roles[0]; // Set first role as current
    profile.updatedAt = new Date().toISOString();

    await kv.set(`user:${user.id}`, profile);
    
    return c.json(profile);
  } catch (error) {
    console.error('Error updating user roles:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c775349f/user/switch-role', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const { role } = await c.req.json();
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    if (!profile.roles.includes(role)) {
      return c.json({ error: 'Role not available for user' }, 400);
    }

    profile.currentRole = role;
    profile.updatedAt = new Date().toISOString();

    await kv.set(`user:${user.id}`, profile);
    
    return c.json(profile);
  } catch (error) {
    console.error('Error switching user role:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Product Management
app.get('/make-server-c775349f/products', async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    const farmerId = c.req.query('farmer_id');

    let productsKey = 'products:all';
    if (farmerId) {
      productsKey = `products:farmer:${farmerId}`;
    }

    const products = await kv.get(productsKey) || [];
    
    let filteredProducts = products;
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter((p: any) => p.category === category);
    }
    
    if (search) {
      filteredProducts = filteredProducts.filter((p: any) => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameNepali.includes(search)
      );
    }

    return c.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c775349f/products', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const body = await c.req.json();
    const product = {
      ...body,
      id: crypto.randomUUID(),
      farmerId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save product
    await kv.set(`product:${product.id}`, product);
    
    // Update products list
    const allProducts = await kv.get('products:all') || [];
    allProducts.push(product);
    await kv.set('products:all', allProducts);

    // Update farmer's products
    const farmerProducts = await kv.get(`products:farmer:${user.id}`) || [];
    farmerProducts.push(product);
    await kv.set(`products:farmer:${user.id}`, farmerProducts);

    return c.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Order Management
app.post('/make-server-c775349f/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const body = await c.req.json();
    const order = {
      ...body,
      id: `ORD${Date.now()}`,
      consumerId: user.id,
      status: 'ordered',
      createdAt: new Date().toISOString(),
      trackingUpdates: [{
        status: 'ordered',
        timestamp: new Date().toISOString(),
        message: 'Order placed successfully'
      }]
    };

    // Save order
    await kv.set(`order:${order.id}`, order);
    
    // Update consumer's orders
    const consumerOrders = await kv.get(`orders:consumer:${user.id}`) || [];
    consumerOrders.push(order);
    await kv.set(`orders:consumer:${user.id}`, consumerOrders);

    // Update farmer's orders for each item
    const farmerOrders = new Map();
    for (const item of order.items) {
      if (!farmerOrders.has(item.farmerId)) {
        farmerOrders.set(item.farmerId, await kv.get(`orders:farmer:${item.farmerId}`) || []);
      }
      farmerOrders.get(item.farmerId).push({
        ...order,
        items: order.items.filter((i: any) => i.farmerId === item.farmerId)
      });
    }

    // Save updated farmer orders
    for (const [farmerId, orders] of farmerOrders) {
      await kv.set(`orders:farmer:${farmerId}`, orders);
    }

    return c.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/make-server-c775349f/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const role = c.req.query('role') || 'consumer';
    const orders = await kv.get(`orders:${role}:${user.id}`) || [];
    
    return c.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put('/make-server-c775349f/orders/:orderId/status', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const orderId = c.req.param('orderId');
    const { status } = await c.req.json();

    const order = await kv.get(`order:${orderId}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Update order status
    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.trackingUpdates.push({
      status,
      timestamp: new Date().toISOString(),
      message: `Order status updated to ${status}`
    });

    await kv.set(`order:${orderId}`, order);

    return c.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delivery Management
app.get('/make-server-c775349f/delivery/requests', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    // Get pending delivery requests
    const requests = await kv.get('delivery:requests:pending') || [];
    
    return c.json(requests);
  } catch (error) {
    console.error('Error fetching delivery requests:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c775349f/delivery/accept', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const { requestId } = await c.req.json();
    
    // Get and update delivery request
    const requests = await kv.get('delivery:requests:pending') || [];
    const requestIndex = requests.findIndex((r: any) => r.id === requestId);
    
    if (requestIndex === -1) {
      return c.json({ error: 'Request not found' }, 404);
    }

    const request = requests[requestIndex];
    request.driverId = user.id;
    request.status = 'accepted';
    request.acceptedAt = new Date().toISOString();

    // Remove from pending requests
    requests.splice(requestIndex, 1);
    await kv.set('delivery:requests:pending', requests);

    // Add to driver's active deliveries
    const activeDeliveries = await kv.get(`delivery:active:${user.id}`) || [];
    activeDeliveries.push(request);
    await kv.set(`delivery:active:${user.id}`, activeDeliveries);

    return c.json(request);
  } catch (error) {
    console.error('Error accepting delivery request:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Real-time notifications (WebSocket would be implemented here in a full system)
app.post('/make-server-c775349f/notifications/send', async (c) => {
  try {
    const { userId, title, message, type } = await c.req.json();
    
    const notification = {
      id: crypto.randomUUID(),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };

    // Save notification
    const userNotifications = await kv.get(`notifications:${userId}`) || [];
    userNotifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (userNotifications.length > 50) {
      userNotifications.splice(50);
    }
    
    await kv.set(`notifications:${userId}`, userNotifications);

    return c.json(notification);
  } catch (error) {
    console.error('Error sending notification:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/make-server-c775349f/notifications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const notifications = await kv.get(`notifications:${user.id}`) || [];
    return c.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Analytics for admin/farmers
app.get('/make-server-c775349f/analytics/sales', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const orders = await kv.get(`orders:farmer:${user.id}`) || [];
    const completedOrders = orders.filter((o: any) => o.status === 'delivered');
    
    const totalSales = completedOrders.reduce((sum: number, order: any) => sum + order.total, 0);
    const todaySales = completedOrders
      .filter((o: any) => new Date(o.createdAt).toDateString() === new Date().toDateString())
      .reduce((sum: number, order: any) => sum + order.total, 0);

    return c.json({
      totalSales,
      todaySales,
      totalOrders: completedOrders.length,
      pendingOrders: orders.filter((o: any) => o.status === 'ordered').length
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Wallet Management
app.get('/make-server-c775349f/wallet/:userId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const userId = c.req.param('userId');
    const wallet = await kv.get(`wallet:${userId}`) || {
      balance: 0,
      transactions: []
    };

    return c.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-c775349f/wallet/transaction', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const { amount, type, description } = await c.req.json();
    
    const wallet = await kv.get(`wallet:${user.id}`) || {
      balance: 0,
      transactions: []
    };

    const transaction = {
      id: crypto.randomUUID(),
      amount,
      type, // 'credit' or 'debit'
      description,
      timestamp: new Date().toISOString()
    };

    wallet.transactions.unshift(transaction);
    wallet.balance += type === 'credit' ? amount : -amount;
    
    // Keep only last 100 transactions
    if (wallet.transactions.length > 100) {
      wallet.transactions.splice(100);
    }

    await kv.set(`wallet:${user.id}`, wallet);

    return c.json(wallet);
  } catch (error) {
    console.error('Error processing wallet transaction:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Start server
Deno.serve(app.fetch);