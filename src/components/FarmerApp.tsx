import React, { useState, useEffect } from 'react';
import { Plus, Package, ShoppingBag, TrendingUp, Zap, BarChart3, Camera, Users, Sprout, Calendar, Target, Droplets, Bell, Settings, Eye, Edit, MapPin, Cloud, Sun, Thermometer, Wind, Gauge, AlertTriangle, CheckCircle, Clock, Activity, DollarSign, Star, MessageSquare, Share2, Heart, Filter, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { User, Language } from '../App';
import { SupabaseClient } from '@supabase/supabase-js';
import { CropsManagement } from './CropsManagement';
import { motion } from 'motion/react';

interface FarmerAppProps {
  user: User;
  language: Language;
  accessToken: string | null;
  supabase: SupabaseClient;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    icon: string;
  }>;
}

interface Order {
  id: string;
  customerName: string;
  items: Array<{
    cropId: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  totalAmount: number;
  orderDate: string;
  deliveryDate?: string;
}

export function FarmerApp({ user, language, accessToken, supabase }: FarmerAppProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCropsManagement, setShowCropsManagement] = useState(false);
  const [crops, setCrops] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Load crops data
  useEffect(() => {
    const savedCrops = localStorage.getItem('kisanconnect:crops');
    if (savedCrops) {
      setCrops(JSON.parse(savedCrops));
    }
    
    // Load orders
    const savedOrders = localStorage.getItem('kisanconnect:farmer_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Mock orders data
      const mockOrders: Order[] = [
        {
          id: '1',
          customerName: 'राम बहादुर',
          items: [
            { cropId: '1', quantity: 5, price: 80 }
          ],
          status: 'pending',
          totalAmount: 400,
          orderDate: new Date().toISOString(),
        },
        {
          id: '2',
          customerName: 'सीता देवी',
          items: [
            { cropId: '2', quantity: 10, price: 60 }
          ],
          status: 'confirmed',
          totalAmount: 600,
          orderDate: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('kisanconnect:farmer_orders', JSON.stringify(mockOrders));
    }

    // Mock weather data
    setWeatherData({
      temperature: 25,
      humidity: 68,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      forecast: [
        { day: 'Today', temp: 25, condition: 'Partly Cloudy', icon: '⛅' },
        { day: 'Tomorrow', temp: 27, condition: 'Sunny', icon: '☀️' },
        { day: 'Friday', temp: 23, condition: 'Rainy', icon: '🌧️' },
        { day: 'Saturday', temp: 26, condition: 'Sunny', icon: '☀️' },
      ]
    });

    // Mock notifications
    setNotifications([
      {
        id: '1',
        type: 'order',
        title: t('New Order Received', 'नयाँ अर्डर प्राप्त भयो'),
        message: t('राम बहादुर ordered 5kg tomatoes', 'राम बहादुरले ५ के.जी. गोलभेंडा अर्डर गरे'),
        time: '2 min ago',
        read: false
      },
      {
        id: '2',
        type: 'weather',
        title: t('Weather Alert', 'मौसम चेतावनी'),
        message: t('Rain expected tomorrow, protect your crops', 'भोलि वर्षाको सम्भावना, आफ्ना बालीहरूको सुरक्षा गर्नुहोस्'),
        time: '1 hour ago',
        read: false
      }
    ]);
  }, [showCropsManagement, language]);

  // Enhanced stats with real-time calculations
  const getEnhancedStats = () => {
    const today = new Date();
    const todayOrders = orders.filter(order => 
      new Date(order.orderDate).toDateString() === today.toDateString()
    );
    const pendingOrders = orders.filter(order => order.status === 'pending');
    const activeCrops = crops.filter(crop => !['harvested', 'sold'].includes(crop.status));
    const totalRevenue = crops.reduce((sum, crop) => sum + (crop.revenue || 0), 0);
    const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      todaySales: `रु. ${todaySales.toLocaleString()}`,
      pendingOrders: pendingOrders.length,
      activeCrops: activeCrops.length,
      totalCrops: crops.length,
      totalRevenue: `रु. ${totalRevenue.toLocaleString()}`,
      avgYield: crops.length > 0 ? Math.round(crops.reduce((sum, crop) => sum + (crop.expectedYield || 0), 0) / crops.length) : 0,
      completionRate: Math.round((orders.filter(o => o.status === 'delivered').length / Math.max(orders.length, 1)) * 100),
      customerSatisfaction: 4.8
    };
  };

  const stats = getEnhancedStats();

  const getGrowthProgress = (crop: any) => {
    const planted = new Date(crop.plantedDate);
    const expected = new Date(crop.expectedHarvest);
    const now = new Date();
    
    const totalDays = Math.ceil((expected.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      growing: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      flowering: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      fruiting: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      harvested: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      sold: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getOrderStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      preparing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      ready: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('kisanconnect:farmer_orders', JSON.stringify(updatedOrders));
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         crop.nameNepali.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || crop.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pb-20 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-orange-50/50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-orange-900/10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Enhanced Bottom Navigation with 3D Effects */}
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-5 h-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t-2 border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
              {[
                { value: 'dashboard', icon: BarChart3, label: t('Dashboard', 'ड्यासबोर्ड') },
                { value: 'crops', icon: Sprout, label: t('Crops', 'बालीहरू') },
                { value: 'orders', icon: ShoppingBag, label: t('Orders', 'अर्डर'), badge: stats.pendingOrders },
                { value: 'analytics', icon: TrendingUp, label: t('Analytics', 'विश्लेषण') },
                { value: 'profile', icon: Users, label: t('Profile', 'प्रोफाइल') },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col gap-1 h-full data-[state=active]:text-emerald-600 relative group transition-all duration-300 hover:scale-105"
                >
                  <tab.icon className="h-4 w-4 group-hover:animate-bounce" />
                  <span className="text-xs">{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse">
                      {tab.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Enhanced Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-0">
          <div className="p-4 space-y-6">
            {/* Welcome Header with Weather */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-emerald-500 via-green-500 to-orange-500 text-white border-0 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-green-600/20 to-orange-600/20 backdrop-blur-sm"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold mb-1">
                        {t('नमस्ते', 'Namaste')} {user.name}! 👨‍🌾
                      </h2>
                      <p className="text-white/90 text-sm">
                        {t('Ready to sell your fresh produce today?', 'आज आफ्नो ताजा उत्पादन बेच्न तयार हुनुहुन्छ?')}
                      </p>
                    </div>
                    <div className="text-4xl animate-bounce">🌱</div>
                  </div>
                  
                  {/* Weather Widget */}
                  {weatherData && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4" />
                          <span className="text-sm font-medium">{weatherData.condition}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            <span>{weatherData.temperature}°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets className="h-3 w-3" />
                            <span>{weatherData.humidity}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Wind className="h-3 w-3" />
                            <span>{weatherData.windSpeed}km/h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            {notifications.filter(n => !n.read).length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <Bell className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <span className="font-medium text-orange-800 dark:text-orange-200">
                      {notifications.filter(n => !n.read).length} {t('new notifications', 'नयाँ सूचनाहरू')}
                    </span>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Enhanced KPI Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, staggerChildren: 0.1 }}
            >
              {[
                { label: t("Today's Sales", 'आजको बिक्री'), value: stats.todaySales, icon: TrendingUp, color: 'emerald', change: '+12%' },
                { label: t('Active Crops', 'सक्रिय बालीहरू'), value: stats.activeCrops, icon: Sprout, color: 'orange', change: '+3' },
                { label: t('Total Revenue', 'कुल आम्दानी'), value: stats.totalRevenue, icon: DollarSign, color: 'green', change: '+₹2.4K' },
                { label: t('Completion Rate', 'पूर्णता दर'), value: `${stats.completionRate}%`, icon: CheckCircle, color: 'blue', change: '+5%' },
                { label: t('Pending Orders', 'पेन्डिङ अर्डर'), value: stats.pendingOrders, icon: Clock, color: 'yellow', change: '2 new' },
                { label: t('Customer Rating', 'ग्राहक मूल्याङ्कन'), value: stats.customerSatisfaction, icon: Star, color: 'purple', change: '+0.2' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                          <p className={`text-xs text-${stat.color}-500 font-medium`}>{stat.change}</p>
                        </div>
                        <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-full flex items-center justify-center`}>
                          <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Weather Forecast */}
            {weatherData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Cloud className="h-5 w-5 text-blue-600" />
                      {t('Weather Forecast', 'मौसम पूर्वानुमान')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-3">
                      {weatherData.forecast.map((day, index) => (
                        <div key={index} className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
                          <div className="text-lg mb-1">{day.icon}</div>
                          <p className="text-sm font-medium">{day.temp}°</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Enhanced Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div>
                <h3 className="font-semibold mb-3 text-lg">{t('Quick Actions', 'द्रुत कार्यहरू')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Sprout, label: t('Manage Crops', 'बाली व्यवस्थापन'), action: () => setShowCropsManagement(true), color: 'emerald' },
                    { icon: Camera, label: t('Add Photos', 'फोटो थप्नुहोस्'), action: () => {}, color: 'blue' },
                    { icon: ShoppingBag, label: t('View Orders', 'अर्डर हेर्नुहोस्'), action: () => setActiveTab('orders'), color: 'orange' },
                    { icon: BarChart3, label: t('Analytics', 'विश्लेषण'), action: () => setActiveTab('analytics'), color: 'purple' },
                  ].map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, rotateX: 5 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <Button 
                        className={`h-20 flex flex-col gap-2 bg-${action.color}-500 hover:bg-${action.color}-600 shadow-lg border-0 w-full`}
                        onClick={action.action}
                      >
                        <action.icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{action.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity with Enhanced UI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    {t('Recent Activity', 'हालका गतिविधिहरू')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: TrendingUp, text: t('Sold 5 kg tomatoes', '५ के.जी. गोलभेंडा बेचियो'), time: t('2 hours ago', '२ घण्टा अगाडि'), amount: '+रु. 400', color: 'green' },
                      { icon: Plus, text: t('Added new listing: Carrots', 'नयाँ सूची थपियो: गाजर'), time: t('4 hours ago', '४ घण्टा अगाडि'), color: 'blue' },
                      { icon: Users, text: t('New follower: रीता देवी', 'नयाँ अनुसरणकर्ता: रीता देवी'), time: t('6 hours ago', '६ घण्टा अगाडि'), color: 'orange' },
                      { icon: Star, text: t('Received 5-star review', '५-तारे समीक्षा प्राप्त भयो'), time: t('1 day ago', '१ दिन अगाडि'), color: 'yellow' },
                    ].map((activity, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all duration-200"
                        whileHover={{ x: 5 }}
                      >
                        <div className={`w-10 h-10 bg-${activity.color}-100 dark:bg-${activity.color}-900/20 rounded-full flex items-center justify-center`}>
                          <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.text}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        {activity.amount && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                            {activity.amount}
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Crops Overview with Enhanced Features */}
            {crops.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-green-600" />
                        {t('Active Crops', 'सक्रिय बालीहरू')}
                      </CardTitle>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowCropsManagement(true)}
                        className="shadow-sm"
                      >
                        {t('View All', 'सबै हेर्नुहोस्')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {crops.filter(crop => !['harvested', 'sold'].includes(crop.status)).slice(0, 3).map((crop, index) => (
                        <motion.div 
                          key={crop.id}
                          className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:shadow-md transition-all duration-200 border border-emerald-200 dark:border-emerald-700"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <img 
                            src={crop.image} 
                            alt={crop.name}
                            className="w-16 h-16 rounded-xl object-cover shadow-md"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium">{language === 'ne' ? crop.nameNepali : crop.name}</h5>
                              <Badge className={getStatusColor(crop.status)}>
                                {crop.statusNepali}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{crop.location.field}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{t('Growth Progress', 'वृद्धि प्रगति')}</span>
                                <span className="font-medium">{Math.round(getGrowthProgress(crop))}%</span>
                              </div>
                              <Progress value={getGrowthProgress(crop)} className="h-2" />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">रु. {crop.pricePerKg}/kg</p>
                            <p className="text-xs text-muted-foreground">{crop.area} {t('ropani', 'रोपनी')}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>

        {/* Enhanced Crops Tab */}
        <TabsContent value="crops" className="mt-0">
          <div className="p-4 space-y-4">
            {/* Header with Search and Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t('My Crops', 'मेरा बालीहरू')}</h2>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 shadow-lg"
                  onClick={() => setShowCropsManagement(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('Add Crop', 'बाली थप्नुहोस्')}
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('Search crops...', 'बालीहरू खोज्नुहोस्...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('All', 'सबै')}</SelectItem>
                    <SelectItem value="planted">{t('Planted', 'रोपिएको')}</SelectItem>
                    <SelectItem value="growing">{t('Growing', 'बढ्दै')}</SelectItem>
                    <SelectItem value="flowering">{t('Flowering', 'फूल फुलेको')}</SelectItem>
                    <SelectItem value="fruiting">{t('Fruiting', 'फल लागेको')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredCrops.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Sprout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="font-medium mb-2">
                      {searchQuery ? 
                        t('No crops found', 'कुनै बाली फेला परेन') :
                        t('No crops yet', 'अहिलेसम्म कुनै बाली छैन')
                      }
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ?
                        t('Try adjusting your search or filters', 'आफ्नो खोज वा फिल्टर परिवर्तन गर्ने प्रयास गर्नुहोस्') :
                        t('Start by adding your first crop to track and manage your farming activities', 'आफ्ना खेती गतिविधिहरू ट्र्याक र व्यवस्थापन गर्न पहिलो बाली थप्नुहोस्')
                      }
                    </p>
                    {!searchQuery && (
                      <Button 
                        onClick={() => setShowCropsManagement(true)}
                        className="bg-emerald-500 hover:bg-emerald-600"
                      >
                        <Sprout className="h-4 w-4 mr-2" />
                        {t('Add First Crop', 'पहिलो बाली थप्नुहोस्')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredCrops.map((crop, index) => (
                  <motion.div
                    key={crop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={crop.image} 
                              alt={crop.name}
                              className="w-20 h-20 rounded-xl object-cover shadow-md"
                            />
                            <Badge className={`absolute -top-2 -right-2 ${getStatusColor(crop.status)}`}>
                              {crop.statusNepali}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-lg">{language === 'ne' ? crop.nameNepali : crop.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {crop.variety} • {crop.area} {t('ropani', 'रोपनी')} • {crop.location.field}
                            </p>
                            {!['harvested', 'sold'].includes(crop.status) && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>{t('Growth Progress', 'वृद्धि प्रगति')}</span>
                                  <span className="font-medium">{Math.round(getGrowthProgress(crop))}%</span>
                                </div>
                                <Progress value={getGrowthProgress(crop)} className="h-2" />
                              </div>
                            )}
                          </div>
                          <div className="text-right space-y-2">
                            <p className="text-lg font-bold text-emerald-600">रु. {crop.pricePerKg}/kg</p>
                            <p className="text-sm text-muted-foreground">{crop.currentStock} kg {t('stock', 'स्टक')}</p>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setShowCropsManagement(true)}
                                className="px-2"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="px-2"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Enhanced Orders Tab */}
        <TabsContent value="orders" className="mt-0">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('Orders Management', 'अर्डर व्यवस्थापन')}</h2>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                {orders.length} {t('total orders', 'कुल अर्डर')}
              </Badge>
            </div>

            {orders.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">{t('No orders yet', 'अहिलेसम्म कुनै अर्डर छैन')}</h4>
                  <p className="text-muted-foreground">
                    {t('Orders will appear here when customers place them', 'ग्राहकहरूले अर्डर गर्दा यहाँ देखिनेछ')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{order.customerName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('Order', 'अर्डर')} #{order.id} • {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {t(order.status, order.status)}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          {order.items.map((item, idx) => {
                            const crop = crops.find(c => c.id === item.cropId);
                            return (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>{crop?.name || 'Product'} x {item.quantity}kg</span>
                                <span>रु. {item.price * item.quantity}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="font-medium text-lg">
                            {t('Total', 'कुल')}: रु. {order.totalAmount}
                          </div>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                className="bg-blue-500 hover:bg-blue-600"
                              >
                                {t('Confirm', 'पुष्टि गर्नुहोस्')}
                              </Button>
                            )}
                            {order.status === 'confirmed' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                {t('Ready', 'तयार')}
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {t('Message', 'सन्देश')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Enhanced Analytics Tab */}
        <TabsContent value="analytics" className="mt-0">
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">{t('Analytics & Insights', 'विश्लेषण र अन्तर्दृष्टि')}</h2>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-lg">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{stats.avgYield} kg</p>
                  <p className="text-sm text-muted-foreground">{t('Avg Yield/Crop', 'औसत उत्पादन/बाली')}</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{stats.customerSatisfaction}</p>
                  <p className="text-sm text-muted-foreground">{t('Customer Rating', 'ग्राहक मूल्याङ्कन')}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>{t('Coming Soon', 'चाँडै आउँदैछ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  {t('Detailed analytics and insights will be available soon!', 'विस्तृत विश्लेषण र अन्तर्दृष्टि चाँडै उपलब्ध हुनेछ!')}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-0">
          <div className="p-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('Farmer Profile', 'किसान प्रोफाइल')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  {t('Profile settings available in main menu!', 'प्रोफाइल सेटिङहरू मुख्य मेनुमा उपलब्ध छ!')}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Crops Management Modal */}
      {showCropsManagement && (
        <CropsManagement
          user={user}
          language={language}
          onClose={() => setShowCropsManagement(false)}
        />
      )}
    </div>
  );
}