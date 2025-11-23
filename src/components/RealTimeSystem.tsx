import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, MessageCircle, Bell, Truck, Package, CheckCircle2, AlertCircle, Eye, Signal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { User, Language } from '../App';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'farmer' | 'consumer' | 'driver';
  content: string;
  timestamp: Date;
  type: 'text' | 'location' | 'image' | 'order_update';
  orderId?: string;
}

interface LiveOrder {
  id: string;
  farmerId: string;
  farmerName: string;
  consumerId: string;
  consumerName: string;
  driverId?: string;
  driverName?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  currentLocation?: { lat: number; lng: number };
  estimatedDelivery: Date;
  totalAmount: number;
  distance: number;
  createdAt: Date;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'message' | 'inventory' | 'payment' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface InventoryUpdate {
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  oldStock: number;
  newStock: number;
  price: number;
  timestamp: Date;
  status: 'available' | 'low_stock' | 'out_of_stock';
}

interface RealTimeSystemProps {
  user: User;
  language: Language;
  onOrderSelect?: (orderId: string) => void;
  onMessageUser?: (userId: string) => void;
}

export function RealTimeSystem({ user, language, onOrderSelect, onMessageUser }: RealTimeSystemProps) {
  const [activeTab, setActiveTab] = useState('tracking');
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [inventoryUpdates, setInventoryUpdates] = useState<InventoryUpdate[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Simulate real-time data updates
  useEffect(() => {
    // Initialize mock data
    const mockOrders: LiveOrder[] = [
      {
        id: 'ORD-001',
        farmerId: 'farmer-1',
        farmerName: 'राम बहादुर',
        consumerId: 'consumer-1',
        consumerName: 'सीता देवी',
        driverId: 'driver-1',
        driverName: 'श्याम दाई',
        items: [
          { name: 'ताजा टमाटर', quantity: 5, price: 80 },
          { name: 'हरियो धनिया', quantity: 2, price: 25 }
        ],
        status: 'in_transit',
        currentLocation: { lat: 27.7172, lng: 85.3240 },
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
        totalAmount: 425,
        distance: 2.5,
        createdAt: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: 'ORD-002',
        farmerId: 'farmer-2',
        farmerName: 'गीता किसान',
        consumerId: user.id,
        consumerName: user.name,
        status: 'picked_up',
        items: [
          { name: 'जैविक गाजर', quantity: 3, price: 120 },
          { name: 'बन्दाकोबी', quantity: 1, price: 60 }
        ],
        estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000),
        totalAmount: 180,
        distance: 1.8,
        createdAt: new Date(Date.now() - 20 * 60 * 1000)
      }
    ];

    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        senderId: 'farmer-1',
        senderName: 'राम बहादुर',
        senderRole: 'farmer',
        content: 'तपाईंको अर्डर तयार छ! ड्राइभर छिट्टै आउनेछ।',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: 'text'
      },
      {
        id: 'msg-2',
        senderId: 'driver-1',
        senderName: 'श्याम दाई',
        senderRole: 'driver',
        content: 'म तपाईंको डेलिभरी लिएर बाटोमा छु। 15 मिनेटमा पुगिहाल्छु।',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text'
      }
    ];

    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        title: 'अर्डर अपडेट',
        message: 'तपाईंको अर्डर #ORD-001 डेलिभरीको लागि निस्किएको छ',
        type: 'order',
        priority: 'high',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        actionUrl: '/orders/ORD-001'
      },
      {
        id: 'notif-2',
        title: 'नयाँ म्यासेज',
        message: 'श्याम दाईले तपाईंलाई सन्देश पठाउनुभएको छ',
        type: 'message',
        priority: 'medium',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        read: false
      },
      {
        id: 'notif-3',
        title: 'स्टक अपडेट',
        message: 'ताजा टमाटर फेरि स्टकमा आयो!',
        type: 'inventory',
        priority: 'low',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true
      }
    ];

    const mockInventoryUpdates: InventoryUpdate[] = [
      {
        productId: 'prod-1',
        productName: 'ताजा टमाटर',
        farmerId: 'farmer-1',
        farmerName: 'राम बहादुर',
        oldStock: 5,
        newStock: 25,
        price: 80,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'available'
      },
      {
        productId: 'prod-2',
        productName: 'जैविक गाजर',
        farmerId: 'farmer-2',
        farmerName: 'गीता किसान',
        oldStock: 10,
        newStock: 2,
        price: 120,
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: 'low_stock'
      }
    ];

    setLiveOrders(mockOrders);
    setMessages(mockMessages);
    setNotifications(mockNotifications);
    setInventoryUpdates(mockInventoryUpdates);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update order statuses randomly
      setLiveOrders(prev => prev.map(order => {
        if (Math.random() > 0.9) {
          const statuses = ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered'];
          const currentIndex = statuses.indexOf(order.status);
          const nextIndex = Math.min(currentIndex + 1, statuses.length - 1);
          return { ...order, status: statuses[nextIndex] as any };
        }
        return order;
      }));

      // Add random inventory updates
      if (Math.random() > 0.95) {
        const newUpdate: InventoryUpdate = {
          productId: `prod-${Date.now()}`,
          productName: ['ताजा टमाटर', 'जैविक गाजर', 'हरियो धनिया', 'बन्दाकोबी'][Math.floor(Math.random() * 4)],
          farmerId: `farmer-${Math.floor(Math.random() * 5) + 1}`,
          farmerName: ['राम बहादुर', 'गीता किसान', 'हरि प्रसाद', 'कमला देवी'][Math.floor(Math.random() * 4)],
          oldStock: Math.floor(Math.random() * 20),
          newStock: Math.floor(Math.random() * 50),
          price: Math.floor(Math.random() * 200) + 50,
          timestamp: new Date(),
          status: ['available', 'low_stock'][Math.floor(Math.random() * 2)] as any
        };
        setInventoryUpdates(prev => [newUpdate, ...prev.slice(0, 19)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'picked_up': return <Package className="h-4 w-4 text-orange-500" />;
      case 'in_transit': return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'accepted': return 25;
      case 'picked_up': return 50;
      case 'in_transit': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="h-4 w-4" />;
      case 'message': return <MessageCircle className="h-4 w-4" />;
      case 'inventory': return <Eye className="h-4 w-4" />;
      case 'payment': return <span className="text-sm">💳</span>;
      case 'system': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.currentRole,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Real-time Status Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20 border-emerald-200 dark:border-emerald-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="font-medium">
                  {isOnline ? t('Live Updates Active', 'लाइभ अपडेट सक्रिय') : t('Offline', 'अफलाइन')}
                </span>
              </div>
              <Signal className="h-4 w-4 text-emerald-600" />
            </div>
            <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200">
              {notifications.filter(n => !n.read).length} {t('new', 'नयाँ')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700">
          <TabsTrigger value="tracking" className="text-xs data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-800">
            <Truck className="h-4 w-4 mr-1" />
            {t('Tracking', 'ट्र्याकिङ')}
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-xs data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-800">
            <MessageCircle className="h-4 w-4 mr-1" />
            {t('Messages', 'सन्देश')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-800">
            <Bell className="h-4 w-4 mr-1" />
            {t('Alerts', 'सूचना')}
          </TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-800">
            <Eye className="h-4 w-4 mr-1" />
            {t('Stock', 'स्टक')}
          </TabsTrigger>
        </TabsList>

        {/* Live Order Tracking */}
        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                {t('Live Order Tracking', 'लाइभ अर्डर ट्र्याकिङ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  {liveOrders.map((order) => (
                    <Card key={order.id} className="p-4 border border-emerald-100 dark:border-emerald-800 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="font-medium">#{order.id}</span>
                          </div>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {t(order.status, order.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t('From:', 'बाट:')} {order.farmerName}</span>
                            <span>{t('To:', 'मा:')} {order.consumerName}</span>
                          </div>
                          {order.driverName && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {t('Driver:', 'चालक:')} {order.driverName}
                            </div>
                          )}
                        </div>

                        <Progress value={getStatusProgress(order.status)} className="h-2" />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.round((order.estimatedDelivery.getTime() - Date.now()) / 60000)} {t('min', 'मिनेट')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            {order.distance} {t('km', 'कि.मी.')}
                          </span>
                          <span className="font-medium text-emerald-600">
                            ₹{order.totalAmount}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => onOrderSelect?.(order.id)}
                          >
                            {t('View Details', 'विवरण हेर्नुहोस्')}
                          </Button>
                          {order.driverId && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onMessageUser?.(order.driverId!)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* In-App Messaging */}
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                {t('Live Chat', 'लाइभ च्याट')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-60 mb-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.senderId === user.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <div className="text-xs opacity-75 mb-1">
                          {message.senderName} ({t(message.senderRole, message.senderRole)})
                        </div>
                        <div>{message.content}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('Type a message...', 'सन्देश टाइप गर्नुहोस्...')}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Push Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-emerald-600" />
                {t('Live Notifications', 'लाइभ सूचनाहरू')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`p-3 cursor-pointer transition-all ${
                        !notification.read 
                          ? 'border-emerald-200 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          notification.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                          notification.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                          notification.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{notification.title}</h4>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              )}
                              <span className="text-xs text-gray-500">
                                {notification.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Inventory Updates */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-emerald-600" />
                {t('Live Inventory Updates', 'लाइभ स्टक अपडेट')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {inventoryUpdates.map((update) => (
                    <Card key={`${update.productId}-${update.timestamp.getTime()}`} className="p-3 border border-emerald-100 dark:border-emerald-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{update.productName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('by', 'द्वारा')} {update.farmerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {update.oldStock} → {update.newStock}
                            </span>
                            <Badge variant={
                              update.status === 'available' ? 'default' :
                              update.status === 'low_stock' ? 'secondary' : 'destructive'
                            }>
                              {t(update.status, update.status)}
                            </Badge>
                          </div>
                          <div className="text-sm font-medium text-emerald-600">
                            ₹{update.price}/{t('kg', 'कि.ग्रा.')}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {update.timestamp.toLocaleString()}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}