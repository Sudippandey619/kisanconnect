import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Clock, DollarSign, Star, Navigation, Package, Route, Fuel, Phone, MessageCircle, Camera, CheckCircle, AlertTriangle, Play, Pause, BarChart3, TrendingUp, Award, Users, Settings, Home, User as UserIcon, Activity, Zap, Bell, Target, Map, Calendar, Eye, Edit, Share2, Bookmark, ThumbsUp, RefreshCw, Filter, Search, Plus, X, ChevronRight, Compass } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { User, Language } from '../App';
import { SupabaseClient } from '@supabase/supabase-js';
import { motion } from 'motion/react';

interface DriverAppProps {
  user: User;
  language: Language;
  accessToken: string | null;
  supabase: SupabaseClient;
}

interface DeliveryRequest {
  id: string;
  pickup: string;
  dropoff: string;
  distance: string;
  weight: string;
  suggestedFee: string;
  items: string;
  time: string;
  farmer: string;
  customer: string;
  priority: 'low' | 'medium' | 'high';
  type: 'standard' | 'express' | 'scheduled';
  pickupTime?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  fragile?: boolean;
  temperature?: 'ambient' | 'cold' | 'frozen';
  rating?: number;
  farmLocation?: {
    lat: number;
    lng: number;
  };
  customerLocation?: {
    lat: number;
    lng: number;
  };
}

interface ActiveDelivery {
  id: string;
  status: 'picked_up' | 'in_transit' | 'nearby' | 'delivered';
  pickup: string;
  dropoff: string;
  customer: string;
  items: string;
  fee: string;
  startTime: string;
  estimatedDelivery: string;
  progress: number;
  customerPhone?: string;
  specialInstructions?: string;
  proof?: string;
}

export function DriverApp({ user, language, accessToken, supabase }: DriverAppProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(false);
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>([]);
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DeliveryRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0 });
  const [driverStats, setDriverStats] = useState({
    rating: 4.8,
    totalDeliveries: 156,
    completionRate: 98,
    onTimeRate: 95
  });

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Load driver data
  useEffect(() => {
    // Load mock data
    const mockRequests: DeliveryRequest[] = [
      {
        id: '1',
        pickup: t('Ram Bahadur Farm, Chitwan', 'राम बहादुर फार्म, चितवन'),
        dropoff: t('Kathmandu, Baneshwor', 'काठमाडौं, बानेश्वर'),
        distance: '25 km',
        weight: '15 kg',
        suggestedFee: 'रु. 125',
        items: t('Tomatoes, Carrots', 'गोलभेंडा, गाजर'),
        time: '30 mins',
        farmer: t('Ram Bahadur', 'राम बहादुर'),
        customer: t('Sita Sharma', 'सीता शर्मा'),
        priority: 'high',
        type: 'express',
        pickupTime: '10:30 AM',
        deliveryTime: '11:30 AM',
        specialInstructions: 'Handle with care - fragile vegetables',
        fragile: true,
        temperature: 'ambient',
        rating: 4.9,
        farmLocation: { lat: 27.5890, lng: 84.2718 },
        customerLocation: { lat: 27.6946, lng: 85.3278 }
      },
      {
        id: '2',
        pickup: t('Krishna Farm, Lalitpur', 'कृष्ण फार्म, ललितपुर'),
        dropoff: t('Kathmandu, Thamel', 'काठमाडौं, थमेल'),
        distance: '12 km',
        weight: '8 kg',
        suggestedFee: 'रु. 60',
        items: t('Spinach, Cabbage', 'पालुङ्गो, बन्दागोभी'),
        time: '20 mins',
        farmer: t('Krishna Sharma', 'कृष्ण शर्मा'),
        customer: t('Maya Devi', 'माया देवी'),
        priority: 'medium',
        type: 'standard',
        pickupTime: '2:00 PM',
        deliveryTime: '3:00 PM',
        specialInstructions: 'Call customer before delivery',
        fragile: false,
        temperature: 'cold',
        rating: 4.7,
        farmLocation: { lat: 27.6588, lng: 85.3247 },
        customerLocation: { lat: 27.7103, lng: 85.3121 }
      },
      {
        id: '3',
        pickup: t('Organic Farm, Bhaktapur', 'जैविक फार्म, भक्तपुर'),
        dropoff: t('Kathmandu, New Baneshwor', 'काठमाडौं, नयाँ बानेश्वर'),
        distance: '18 km',
        weight: '20 kg',
        suggestedFee: 'रु. 95',
        items: t('Mixed Vegetables', 'मिश्रित तरकारीहरू'),
        time: '35 mins',
        farmer: t('Devi Maya', 'देवी माया'),
        customer: t('Raj Kumar', 'राज कुमार'),
        priority: 'low',
        type: 'scheduled',
        pickupTime: '4:00 PM',
        deliveryTime: '5:30 PM',
        specialInstructions: 'Scheduled delivery - customer will be available after 5 PM',
        fragile: false,
        temperature: 'ambient',
        rating: 4.8,
        farmLocation: { lat: 27.6710, lng: 85.4298 },
        customerLocation: { lat: 27.6954, lng: 85.3421 }
      }
    ];

    const mockActiveDeliveries: ActiveDelivery[] = [
      {
        id: 'active-1',
        status: 'in_transit',
        pickup: t('Green Farm, Kavre', 'हरित फार्म, काभ्रे'),
        dropoff: t('Kathmandu, Lazimpat', 'काठमाडौं, लाजिम्पाट'),
        customer: t('Anil Thapa', 'अनिल थापा'),
        items: t('Fresh Tomatoes', 'ताजा गोलभेंडा'),
        fee: 'रु. 85',
        startTime: '9:30 AM',
        estimatedDelivery: '10:45 AM',
        progress: 65,
        customerPhone: '+977-9841234567',
        specialInstructions: 'Ring doorbell twice'
      },
      {
        id: 'active-2',
        status: 'picked_up',
        pickup: t('Sunrise Farm, Lalitpur', 'सूर्योदय फार्म, ललितपुर'),
        dropoff: t('Kathmandu, Pulchowk', 'काठमाडौं, पुल्चोक'),
        customer: t('Binita Rai', 'बिनिता राई'),
        items: t('Organic Carrots', 'जैविक गाजर'),
        fee: 'रु. 45',
        startTime: '10:15 AM',
        estimatedDelivery: '11:00 AM',
        progress: 25,
        customerPhone: '+977-9812345678',
        specialInstructions: 'Leave at security gate if not available'
      }
    ];

    setDeliveryRequests(mockRequests);
    setActiveDeliveries(mockActiveDeliveries);
    setEarnings({ today: 1850, week: 12500, month: 48200 });
  }, [language]);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const acceptRequest = (requestId: string) => {
    const request = deliveryRequests.find(r => r.id === requestId);
    if (request) {
      // Remove from requests and add to active deliveries
      setDeliveryRequests(prev => prev.filter(r => r.id !== requestId));
      
      const newActiveDelivery: ActiveDelivery = {
        id: `active-${requestId}`,
        status: 'picked_up',
        pickup: request.pickup,
        dropoff: request.dropoff,
        customer: request.customer,
        items: request.items,
        fee: request.suggestedFee,
        startTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        progress: 0,
        specialInstructions: request.specialInstructions
      };
      
      setActiveDeliveries(prev => [...prev, newActiveDelivery]);
      setShowRequestDetails(false);
      setActiveTab('active');
    }
  };

  const updateDeliveryStatus = (deliveryId: string, newStatus: ActiveDelivery['status']) => {
    setActiveDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { 
              ...delivery, 
              status: newStatus, 
              progress: newStatus === 'delivered' ? 100 : 
                       newStatus === 'nearby' ? 90 :
                       newStatus === 'in_transit' ? 60 : 25
            }
          : delivery
      )
    );

    if (newStatus === 'delivered') {
      // Remove from active deliveries after a delay
      setTimeout(() => {
        setActiveDeliveries(prev => prev.filter(d => d.id !== deliveryId));
      }, 2000);
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  const getStatusColor = (status: ActiveDelivery['status']) => {
    switch (status) {
      case 'picked_up':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'in_transit':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'nearby':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  return (
    <div className="pb-20 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/5 dark:to-purple-900/5">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Enhanced Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-5 h-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t-2 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
              {[
                { value: 'home', icon: Home, label: t('Home', 'होम') },
                { value: 'requests', icon: Route, label: t('Requests', 'अनुरोधहरू'), badge: deliveryRequests.length },
                { value: 'active', icon: Truck, label: t('Active', 'सक्रिय'), badge: activeDeliveries.length },
                { value: 'earnings', icon: DollarSign, label: t('Earnings', 'आम्दानी') },
                { value: 'profile', icon: UserIcon, label: t('Profile', 'प्रोफाइल') },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col gap-1 h-full data-[state=active]:text-blue-600 relative group transition-all duration-300 hover:scale-105"
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

        {/* Enhanced Home Tab */}
        <TabsContent value="home" className="mt-0">
          <div className="p-4 space-y-6">
            {/* Enhanced Header with Online Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white border-0 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-sm"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold mb-1">
                        {t('नमस्ते', 'Namaste')} {user.name}! 🚚
                      </h2>
                      <p className="text-white/90 text-sm">
                        {t('Ready to deliver fresh produce to customers?', 'ग्राहकहरूलाई ताजा उत्पादन डेलिभर गर्न तयार हुनुहुन्छ?')}
                      </p>
                    </div>
                    <div className="text-4xl animate-bounce">📦</div>
                  </div>
                  
                  {/* Online Status Toggle */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                        <div>
                          <p className="font-medium">
                            {isOnline ? t('You are Online', 'तपाईं अनलाइन हुनुहुन्छ') : t('You are Offline', 'तपाईं अफलाइन हुनुहुन्छ')}
                          </p>
                          <p className="text-xs text-white/80">
                            {isOnline ? t('Ready to receive requests', 'अनुरोधहरू प्राप्त गर्न तयार') : t('No new requests', 'कुनै नयाँ अनुरोध छैन')}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isOnline}
                        onCheckedChange={toggleOnlineStatus}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Status Alert */}
            {!isOnline && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <span className="font-medium text-orange-800 dark:text-orange-200">
                      {t('Go online to start receiving delivery requests', 'डेलिभरी अनुरोधहरू प्राप्त गर्न अनलाइन जानुहोस्')}
                    </span>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Enhanced Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { 
                  label: t("Today's Earnings", 'आजको आम्दानी'), 
                  value: `रु. ${earnings.today.toLocaleString()}`, 
                  icon: DollarSign, 
                  color: 'emerald',
                  change: '+12%'
                },
                { 
                  label: t('Active Deliveries', 'सक्रिय डेलिभरी'), 
                  value: activeDeliveries.length, 
                  icon: Truck, 
                  color: 'blue',
                  change: `${activeDeliveries.length} running`
                },
                { 
                  label: t('Driver Rating', 'चालक मूल्याङ्कन'), 
                  value: driverStats.rating, 
                  icon: Star, 
                  color: 'yellow',
                  change: `${driverStats.totalDeliveries} trips`
                },
                { 
                  label: t('Completion Rate', 'पूर्णता दर'), 
                  value: `${driverStats.completionRate}%`, 
                  icon: Target, 
                  color: 'purple',
                  change: `${driverStats.onTimeRate}% on time`
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-xl flex items-center justify-center`}>
                          <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                        </div>
                        <Badge variant="outline" className={`text-${stat.color}-600 border-${stat.color}-200`}>
                          {stat.change}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className={`text-xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('Quick Actions', 'द्रुत कार्यहरू')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { 
                      icon: Route, 
                      label: t('View Requests', 'अनुरोध हेर्नुहोस्'), 
                      action: () => setActiveTab('requests'), 
                      color: 'blue',
                      badge: deliveryRequests.length
                    },
                    { 
                      icon: Navigation, 
                      label: t('Navigation', 'नेभिगेसन'), 
                      action: () => {}, 
                      color: 'green'
                    },
                    { 
                      icon: BarChart3, 
                      label: t('Earnings', 'आम्दानी'), 
                      action: () => setActiveTab('earnings'), 
                      color: 'purple'
                    },
                    { 
                      icon: Phone, 
                      label: t('Support', 'सहायता'), 
                      action: () => {}, 
                      color: 'orange'
                    }
                  ].map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        className={`h-20 flex flex-col gap-2 bg-${action.color}-500 hover:bg-${action.color}-600 shadow-lg border-0 w-full relative`}
                        onClick={action.action}
                        disabled={!isOnline && action.label.includes('Request')}
                      >
                        <action.icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{action.label}</span>
                        {action.badge && action.badge > 0 && (
                          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                            {action.badge}
                          </Badge>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Active Deliveries Preview */}
            {activeDeliveries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        {t('Active Deliveries', 'सक्रिय डेलिभरीहरू')}
                      </CardTitle>
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('active')}>
                        {t('View All', 'सबै हेर्नुहोस्')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeDeliveries.slice(0, 2).map((delivery, index) => (
                        <motion.div 
                          key={delivery.id}
                          className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                        >
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium">{delivery.customer}</h5>
                              <Badge className={getStatusColor(delivery.status)}>
                                {t(delivery.status, delivery.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{delivery.items}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{t('Progress', 'प्रगति')}</span>
                                <span className="font-medium">{delivery.progress}%</span>
                              </div>
                              <Progress value={delivery.progress} className="h-2" />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">{delivery.fee}</p>
                            <p className="text-xs text-muted-foreground">{delivery.estimatedDelivery}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
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
                      { type: 'delivery', text: t('Completed delivery to Sita Sharma', 'सीता शर्माको डेलिभरी पूरा गरियो'), time: '1 hour ago', amount: '+रु. 125', icon: CheckCircle, color: 'green' },
                      { type: 'pickup', text: t('Picked up order from Ram Farm', 'राम फार्मबाट अर्डर उठाइयो'), time: '2 hours ago', icon: Package, color: 'blue' },
                      { type: 'earning', text: t('Daily target achieved!', 'दैनिक लक्ष्य पूरा भयो!'), time: '3 hours ago', amount: '+रु. 50 bonus', icon: Target, color: 'purple' },
                      { type: 'rating', text: t('Received 5-star rating', '५-तारे मूल्याङ्कन प्राप्त भयो'), time: '5 hours ago', icon: Star, color: 'yellow' },
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
          </div>
        </TabsContent>

        {/* Enhanced Requests Tab */}
        <TabsContent value="requests" className="mt-0">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('Delivery Requests', 'डेलिभरी अनुरोधहरू')}</h2>
              <div className="flex items-center gap-2">
                <Badge className={`${isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {isOnline ? t('Online', 'अनलाइन') : t('Offline', 'अफलाइन')}
                </Badge>
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4 mr-1" />
                  {t('Filter', 'फिल्टर')}
                </Button>
              </div>
            </div>

            {!isOnline ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">{t('You are offline', 'तपाईं अफलाइन हुनुहुन्छ')}</h4>
                  <p className="text-muted-foreground mb-4">
                    {t('Go online to start receiving delivery requests from farmers and customers', 'किसान र ग्राहकहरूबाट डेलिभरी अनुरोधहरू प्राप्त गर्न अनलाइन जानुहोस्')}
                  </p>
                  <Button onClick={toggleOnlineStatus} className="bg-blue-500 hover:bg-blue-600">
                    <Zap className="h-4 w-4 mr-2" />
                    {t('Go Online', 'अनलाइन जानुहोस्')}
                  </Button>
                </CardContent>
              </Card>
            ) : deliveryRequests.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Route className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">{t('No requests available', 'कुनै अनुरोध उपलब्ध छैन')}</h4>
                  <p className="text-muted-foreground mb-4">
                    {t('New delivery requests will appear here when available', 'नयाँ डेलिभरी अनुरोधहरू उपलब्ध हुँदा यहाँ देखाइनेछ')}
                  </p>
                  <Button onClick={() => setActiveTab('home')} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('Refresh', 'रिफ्रेस गर्नुहोस्')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {deliveryRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRequestDetails(true);
                          }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{request.customer}</h4>
                              <Badge className={getPriorityColor(request.priority)}>
                                {t(request.priority, request.priority)}
                              </Badge>
                              <Badge variant="outline">
                                {t(request.type, request.type)}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{request.pickup}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Navigation className="h-3 w-3" />
                                <span>{request.dropoff}</span>
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                  <Route className="h-3 w-3" />
                                  <span>{request.distance}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  <span>{request.weight}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{request.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{request.suggestedFee}</p>
                            {request.rating && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{request.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">{t('Items:', 'वस्तुहरू:')}</span> {request.items}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRequest(request);
                                setShowRequestDetails(true);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {t('Details', 'विवरण')}
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-blue-500 hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                acceptRequest(request.id);
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('Accept', 'स्वीकार गर्नुहोस्')}
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

        {/* Enhanced Active Deliveries Tab */}
        <TabsContent value="active" className="mt-0">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('Active Deliveries', 'सक्रिय डेलिभरीहरू')}</h2>
              <Badge className="bg-blue-100 text-blue-800">
                {activeDeliveries.length} {t('active', 'सक्रिय')}
              </Badge>
            </div>

            {activeDeliveries.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">{t('No active deliveries', 'कुनै सक्रिय डेलिभरी छैन')}</h4>
                  <p className="text-muted-foreground mb-4">
                    {t('Accept delivery requests to start earning', 'कमाउन सुरु गर्न डेलिभरी अनुरोधहरू स्वीकार गर्नुहोस्')}
                  </p>
                  <Button onClick={() => setActiveTab('requests')} className="bg-blue-500 hover:bg-blue-600">
                    {t('View Requests', 'अनुरोधहरू हेर्नुहोस्')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeDeliveries.map((delivery, index) => (
                  <motion.div
                    key={delivery.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{delivery.customer}</h4>
                              <Badge className={getStatusColor(delivery.status)}>
                                {t(delivery.status, delivery.status)}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{delivery.pickup}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Navigation className="h-3 w-3" />
                                <span>{delivery.dropoff}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Package className="h-3 w-3" />
                                <span>{delivery.items}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">{delivery.fee}</p>
                            <p className="text-xs text-muted-foreground">
                              {t('Started:', 'सुरु:')} {delivery.startTime}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t('ETA:', 'अनुमानित:')} {delivery.estimatedDelivery}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>{t('Delivery Progress', 'डेलिभरी प्रगति')}</span>
                            <span className="font-medium">{delivery.progress}%</span>
                          </div>
                          <Progress value={delivery.progress} className="h-3" />
                        </div>

                        {/* Special Instructions */}
                        {delivery.specialInstructions && (
                          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                              {t('Special Instructions:', 'विशेष निर्देशन:')}
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">{delivery.specialInstructions}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {delivery.customerPhone && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {t('Call', 'फोन गर्नुहोस्')}
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {t('Message', 'सन्देश')}
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Navigation className="h-3 w-3 mr-1" />
                            {t('Navigate', 'नेभिगेट')}
                          </Button>
                        </div>

                        {/* Status Update Buttons */}
                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          {delivery.status === 'picked_up' && (
                            <Button 
                              size="sm" 
                              className="flex-1 bg-orange-500 hover:bg-orange-600"
                              onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                            >
                              <Truck className="h-3 w-3 mr-1" />
                              {t('In Transit', 'यात्रामा छ')}
                            </Button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <Button 
                              size="sm" 
                              className="flex-1 bg-purple-500 hover:bg-purple-600"
                              onClick={() => updateDeliveryStatus(delivery.id, 'nearby')}
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              {t('Nearby', 'नजिकै छ')}
                            </Button>
                          )}
                          {delivery.status === 'nearby' && (
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-500 hover:bg-green-600"
                              onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('Delivered', 'डेलिभर भयो')}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Enhanced Earnings Tab */}
        <TabsContent value="earnings" className="mt-0">
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">{t('Earnings Dashboard', 'आम्दानी ड्यासबोर्ड')}</h2>
            
            {/* Earnings Summary */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t('Today', 'आज'), value: `रु. ${earnings.today.toLocaleString()}`, color: 'emerald' },
                { label: t('This Week', 'यो हप्ता'), value: `रु. ${earnings.week.toLocaleString()}`, color: 'blue' },
                { label: t('This Month', 'यो महिना'), value: `रु. ${earnings.month.toLocaleString()}`, color: 'purple' },
              ].map((earning, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">{earning.label}</p>
                      <p className={`text-xl font-bold text-${earning.color}-600`}>{earning.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Performance Metrics */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  {t('Performance Metrics', 'प्रदर्शन मेट्रिक्स')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{driverStats.rating}</p>
                    <p className="text-sm text-muted-foreground">{t('Driver Rating', 'चालक मूल्याङ्कन')}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{driverStats.totalDeliveries}</p>
                    <p className="text-sm text-muted-foreground">{t('Total Deliveries', 'कुल डेलिभरी')}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{driverStats.completionRate}%</p>
                    <p className="text-sm text-muted-foreground">{t('Completion Rate', 'पूर्णता दर')}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{driverStats.onTimeRate}%</p>
                    <p className="text-sm text-muted-foreground">{t('On-time Rate', 'समयमै दर')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Earnings */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  {t('Recent Earnings', 'हालका आम्दानी')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Today', amount: 1850, trips: 12, color: 'emerald' },
                    { date: 'Yesterday', amount: 2100, trips: 15, color: 'blue' },
                    { date: '2 days ago', amount: 1650, trips: 10, color: 'purple' },
                    { date: '3 days ago', amount: 1950, trips: 13, color: 'orange' },
                  ].map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">{t(day.date, day.date)}</p>
                        <p className="text-sm text-muted-foreground">{day.trips} {t('trips', 'यात्राहरू')}</p>
                      </div>
                      <p className={`text-lg font-bold text-${day.color}-600`}>रु. {day.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-0">
          <div className="p-4 space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.phone}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-100 text-blue-800">
                        {t('Driver', 'चालक')}
                      </Badge>
                      {user.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <Award className="h-3 w-3 mr-1" />
                          {t('Verified', 'प्रमाणित')}
                        </Badge>
                      )}
                      <Badge className={`${isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {isOnline ? t('Online', 'अनलाइन') : t('Offline', 'अफलाइन')}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{driverStats.rating}</p>
                    <p className="text-sm text-muted-foreground">{t('Rating', 'मूल्याङ्कन')}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{driverStats.totalDeliveries}</p>
                    <p className="text-sm text-muted-foreground">{t('Deliveries', 'डेलिभरी')}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{driverStats.completionRate}%</p>
                    <p className="text-sm text-muted-foreground">{t('Success', 'सफलता')}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">रु. {earnings.month.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{t('Monthly', 'मासिक')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Truck, label: t('Vehicle Information', 'सवारी साधन जानकारी'), value: 'Motorcycle • BA-12-PA-3456' },
                    { icon: MapPin, label: t('Service Area', 'सेवा क्षेत्र'), value: 'Kathmandu Valley' },
                    { icon: Clock, label: t('Working Hours', 'काम गर्ने समय'), value: '6:00 AM - 10:00 PM' },
                    { icon: Bell, label: t('Notifications', 'सूचनाहरू'), value: 'Enabled', action: true },
                    { icon: Phone, label: t('Emergency Contact', 'आपतकालीन सम्पर्क'), value: '+977-9812345678' },
                    { icon: Settings, label: t('Settings', 'सेटिङहरू'), value: 'App Preferences' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          language={language}
          onClose={() => setShowRequestDetails(false)}
          onAccept={() => acceptRequest(selectedRequest.id)}
        />
      )}
    </div>
  );
}

// Request Details Modal Component
function RequestDetailsModal({ request, language, onClose, onAccept }: {
  request: DeliveryRequest;
  language: Language;
  onClose: () => void;
  onAccept: () => void;
}) {
  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{t('Delivery Request', 'डेलिभरी अनुरोध')}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Header Info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h4 className="text-xl font-bold">{request.customer}</h4>
              <Badge className={getPriorityColor(request.priority)}>
                {t(request.priority, request.priority)}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">{request.suggestedFee}</p>
            <p className="text-sm text-muted-foreground">{t('Suggested Fee', 'सुझावित शुल्क')}</p>
          </div>

          {/* Route Information */}
          <div className="space-y-3">
            <h5 className="font-medium">{t('Route Details', 'मार्ग विवरण')}</h5>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-green-700">{t('Pickup', 'उठाउने ठाउँ')}</p>
                  <p className="text-sm text-muted-foreground">{request.pickup}</p>
                  {request.pickupTime && (
                    <p className="text-xs text-green-600">{t('Time:', 'समय:')} {request.pickupTime}</p>
                  )}
                </div>
              </div>
              
              <div className="ml-1.5 w-0.5 h-6 bg-gray-300 dark:bg-gray-600"></div>
              
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-red-700">{t('Dropoff', 'छाड्ने ठाउँ')}</p>
                  <p className="text-sm text-muted-foreground">{request.dropoff}</p>
                  {request.deliveryTime && (
                    <p className="text-xs text-red-600">{t('ETA:', 'अनुमानित:')} {request.deliveryTime}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Route className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="font-medium">{request.distance}</p>
              <p className="text-xs text-muted-foreground">{t('Distance', 'दूरी')}</p>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <p className="font-medium">{request.time}</p>
              <p className="text-xs text-muted-foreground">{t('Duration', 'अवधि')}</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Package className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="font-medium">{request.weight}</p>
              <p className="text-xs text-muted-foreground">{t('Weight', 'तौल')}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Star className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="font-medium">{request.rating || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">{t('Rating', 'मूल्याङ्कन')}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h5 className="font-medium mb-2">{t('Items to Deliver', 'डेलिभर गर्ने वस्तुहरू')}</h5>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm">{request.items}</p>
            </div>
          </div>

          {/* Special Instructions */}
          {request.specialInstructions && (
            <div>
              <h5 className="font-medium mb-2">{t('Special Instructions', 'विशेष निर्देशन')}</h5>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">{request.specialInstructions}</p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">{t('Farmer', 'किसान')}</p>
              <p className="text-muted-foreground">{request.farmer}</p>
            </div>
            <div>
              <p className="font-medium mb-1">{t('Delivery Type', 'डेलिभरी प्रकार')}</p>
              <Badge variant="outline">{t(request.type, request.type)}</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t('Cancel', 'रद्द गर्नुहोस्')}
            </Button>
            <Button className="flex-1 bg-blue-500 hover:bg-blue-600" onClick={onAccept}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('Accept Request', 'अनुरोध स्वीकार गर्नुहोस्')}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}