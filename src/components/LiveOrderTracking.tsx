import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Phone, Star, Truck, Package, CheckCircle, AlertCircle, RefreshCw, MessageCircle, ArrowLeft, Eye, Download, Share2, Camera, Mic, Video, Shield, Bell, Route, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { User, Language } from '../App';
import { useRealTime } from './RealTimeInfrastructure';

interface OrderLocation {
  lat: number;
  lng: number;
  address: string;
  addressNepali: string;
}

interface OrderItem {
  id: string;
  name: string;
  nameNepali: string;
  quantity: number;
  unit: string;
  price: number;
  image?: string;
  farmer?: string;
  farmerNepali?: string;
}

interface OrderTrackingData {
  orderId: string;
  status: 'confirmed' | 'preparing' | 'prepared' | 'picked_up' | 'in_transit' | 'nearby' | 'delivered' | 'cancelled';
  statusNepali: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
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
  customer: {
    name: string;
    nameNepali: string;
    phone: string;
    address: string;
    addressNepali: string;
  };
  items: OrderItem[];
  timeline: Array<{
    status: string;
    timestamp: string;
    message: string;
    messageNepali: string;
    location?: OrderLocation;
    photos?: string[];
    notes?: string;
  }>;
  currentLocation?: OrderLocation;
  pickupLocation: OrderLocation;
  deliveryLocation: OrderLocation;
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  specialInstructions?: string;
  qualityReports?: Array<{
    itemId: string;
    rating: number;
    photos: string[];
    notes: string;
    timestamp: string;
  }>;
}

interface Props {
  orderId: string;
  user: User;
  language: Language;
  onClose: () => void;
  orderData?: OrderTrackingData;
}

export const LiveOrderTracking: React.FC<Props> = ({ orderId, user, language, onClose, orderData: propOrderData }) => {
  const { subscribeToOrder } = useRealTime();
  const [orderData, setOrderData] = useState<OrderTrackingData>(propOrderData || {
    orderId: orderId || 'ORD_12345',
    status: 'in_transit',
    statusNepali: 'ढुवानीमा',
    estimatedDelivery: new Date(Date.now() + 900000).toISOString(), // 15 minutes from now
    paymentMethod: 'KisanConnect Wallet',
    paymentStatus: 'paid',
    driver: {
      id: 'driver_1',
      name: 'Ravi Sharma',
      nameNepali: 'रवि शर्मा',
      phone: '+977-9841234567',
      rating: 4.8,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      vehicle: 'Motorcycle',
      licensePlate: 'BA 12 PA 3456',
      isOnline: true
    },
    customer: {
      name: user.name,
      nameNepali: user.nameNepali || user.name,
      phone: user.phone,
      address: 'Thamel, Ward 26, Kathmandu',
      addressNepali: 'थमेल, वडा २६, काठमाडौं'
    },
    items: [
      {
        id: 'item_1',
        name: 'Fresh Tomatoes',
        nameNepali: 'ताजा गोलभेंडा',
        quantity: 2,
        unit: 'kg',
        price: 160,
        image: 'https://images.unsplash.com/photo-1546470427-e5869c9b1b0e?w=300',
        farmer: 'Ram Bahadur',
        farmerNepali: 'राम बहादुर'
      },
      {
        id: 'item_2',
        name: 'Organic Carrots',
        nameNepali: 'जैविक गाजर',
        quantity: 1,
        unit: 'kg',
        price: 60,
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=300',
        farmer: 'Sita Devi',
        farmerNepali: 'सीता देवी'
      }
    ],
    timeline: [
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        message: 'Order confirmed and payment received',
        messageNepali: 'अर्डर पुष्टि भयो र भुक्तानी प्राप्त भयो'
      },
      {
        status: 'preparing',
        timestamp: new Date(Date.now() - 1500000).toISOString(),
        message: 'Farmers are preparing your items',
        messageNepali: 'किसानहरूले तपाईंका सामानहरू तयार गर्दै छन्'
      },
      {
        status: 'prepared',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        message: 'Items prepared and ready for pickup',
        messageNepali: 'सामानहरू तयार भएर उठाउन तयार छ',
        photos: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=300']
      },
      {
        status: 'picked_up',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        message: 'Items picked up by driver',
        messageNepali: 'चालकले सामानहरू उठायो',
        location: {
          lat: 27.7172,
          lng: 85.3240,
          address: 'Farmer Location - Kavre',
          addressNepali: 'किसानको स्थान - काभ्रे'
        }
      },
      {
        status: 'in_transit',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        message: 'On the way to delivery location',
        messageNepali: 'डेलिभरी स्थानमा जाँदै',
        location: {
          lat: 27.7021,
          lng: 85.3077,
          address: 'Koteshwor Highway',
          addressNepali: 'कोटेश्वर राजमार्ग'
        }
      }
    ],
    currentLocation: {
      lat: 27.7021,
      lng: 85.3077,
      address: 'Ring Road, Koteshwor',
      addressNepali: 'रिङ रोड, कोटेश्वर'
    },
    pickupLocation: {
      lat: 27.7172,
      lng: 85.3240,
      address: 'Organic Farm, Kavre',
      addressNepali: 'जैविक फार्म, काभ्रे'
    },
    deliveryLocation: {
      lat: 27.7172,
      lng: 85.3140,
      address: 'Thamel, Ward 26, Kathmandu',
      addressNepali: 'थमेल, वडा २६, काठमाडौं'
    },
    totalAmount: 220,
    deliveryFee: 0,
    discount: 20,
    promoCode: 'FRESH20',
    specialInstructions: 'Please call when you arrive'
  });

  const [refreshing, setRefreshing] = useState(false);
  const [etaCountdown, setEtaCountdown] = useState('');
  const [activeTab, setActiveTab] = useState('tracking');
  const [feedbackText, setFeedbackText] = useState('');
  const [showDriverContact, setShowDriverContact] = useState(false);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Subscribe to real-time updates
  useEffect(() => {
    if (orderId) {
      subscribeToOrder(orderId);
    }
  }, [orderId, subscribeToOrder]);

  // Update from prop changes
  useEffect(() => {
    if (propOrderData) {
      setOrderData(propOrderData);
    }
  }, [propOrderData]);

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const eta = new Date(orderData.estimatedDelivery);
      const now = new Date();
      const diff = eta.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (hours > 0) {
          setEtaCountdown(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setEtaCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      } else {
        setEtaCountdown(t('Arriving now!', 'अहिले आइपुग्दै!'));
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [orderData.estimatedDelivery, t]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'preparing': return <Package className="h-4 w-4 text-blue-500" />;
      case 'prepared': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'picked_up': return <Truck className="h-4 w-4 text-orange-500" />;
      case 'in_transit': return <Navigation className="h-4 w-4 text-purple-500" />;
      case 'nearby': return <MapPin className="h-4 w-4 text-red-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'prepared': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'picked_up': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'in_transit': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'nearby': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'confirmed': return 15;
      case 'preparing': return 30;
      case 'prepared': return 45;
      case 'picked_up': return 60;
      case 'in_transit': return 80;
      case 'nearby': return 95;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    toast.success(t('Location updated!', 'स्थान अपडेट भयो!'));
  };

  const handleCallDriver = () => {
    if (orderData.driver) {
      toast.success(t('Calling driver...', 'चालकलाई कल गर्दै...'));
      // In real app: window.open(`tel:${orderData.driver.phone}`)
    }
  };

  const handleMessageDriver = () => {
    setShowDriverContact(true);
  };

  const handleShareLocation = () => {
    toast.success(t('Location shared!', 'स्थान साझा गरियो!'));
  };

  const handleEmergencyContact = () => {
    toast.info(t('Connecting to support...', 'सहायतामा जडान गर्दै...'));
  };

  const formatCurrency = (amount: number) => {
    return `रु. ${amount.toLocaleString()}`;
  };

  const canCancelOrder = () => {
    return ['confirmed', 'preparing'].includes(orderData.status);
  };

  const handleCancelOrder = () => {
    toast.success(t('Order cancellation requested', 'अर्डर रद्द गर्ने अनुरोध पठाइयो'));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-lg font-bold">{t('Order Tracking', 'अर्डर ट्र्याकिङ')}</h2>
                <p className="text-sm opacity-90">#{orderData.orderId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {orderData.driver?.isOnline && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
              <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing} className="text-white hover:bg-white/20">
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Status Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(orderData.status)}
                  <Badge className={`${getStatusColor(orderData.status)} border-0`}>
                    {language === 'en' ? orderData.status.replace('_', ' ') : orderData.statusNepali}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <Clock className="h-4 w-4" />
                    {t('ETA', 'अनुमानित समय')}
                  </div>
                  <p className="text-xl font-bold">{etaCountdown}</p>
                </div>
              </div>
              <Progress value={getProgressValue(orderData.status)} className="h-2 bg-white/20" />
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="tracking" className="text-xs">
                {t('Track', 'ट्र्याक')}
              </TabsTrigger>
              <TabsTrigger value="items" className="text-xs">
                {t('Items', 'सामानहरू')}
              </TabsTrigger>
              <TabsTrigger value="driver" className="text-xs">
                {t('Driver', 'चालक')}
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs">
                {t('Details', 'विवरण')}
              </TabsTrigger>
            </TabsList>

            {/* Tracking Tab */}
            <TabsContent value="tracking" className="p-4 space-y-4">
              {/* Live Map Placeholder */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-orange-100 dark:from-emerald-900/20 dark:to-orange-900/20 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">{t('Live Location', 'प्रत्यक्ष स्थान')}</p>
                        {orderData.currentLocation && (
                          <p className="text-xs text-gray-600 mt-1 px-4">
                            {language === 'en' ? orderData.currentLocation.address : orderData.currentLocation.addressNepali}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Animated delivery icon */}
                    {orderData.status === 'in_transit' && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="animate-pulse">
                          <Truck className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    )}

                    {/* Route line visualization */}
                    <div className="absolute top-4 left-4">
                      <Button size="sm" variant="outline" className="bg-white/90">
                        <Route className="h-3 w-3 mr-1" />
                        {t('View Route', 'मार्ग हेर्नुहोस्')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('Order Timeline', 'अर्डर समयरेखा')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {language === 'en' ? event.message : event.messageNepali}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                          {event.location && (
                            <p className="text-xs text-gray-500 mt-1">
                              📍 {language === 'en' ? event.location.address : event.location.addressNepali}
                            </p>
                          )}
                          {event.photos && event.photos.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {event.photos.map((photo, photoIndex) => (
                                <img 
                                  key={photoIndex}
                                  src={photo} 
                                  alt="Status photo" 
                                  className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                                  onClick={() => window.open(photo, '_blank')}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Items Tab */}
            <TabsContent value="items" className="p-4 space-y-4">
              {orderData.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {language === 'en' ? item.name : item.nameNepali}
                        </h4>
                        {item.farmer && (
                          <p className="text-xs text-gray-600 mt-1">
                            👨‍🌾 {language === 'en' ? item.farmer : item.farmerNepali}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">
                            {item.quantity} {item.unit}
                          </span>
                          <span className="font-bold text-emerald-600">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Quality Reports */}
              {orderData.qualityReports && orderData.qualityReports.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t('Quality Reports', 'गुणस्तर रिपोर्टहरू')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {orderData.qualityReports.map((report, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {orderData.items.find(item => item.id === report.itemId)?.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{report.rating}</span>
                          </div>
                        </div>
                        {report.photos.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {report.photos.map((photo, photoIndex) => (
                              <img 
                                key={photoIndex}
                                src={photo} 
                                alt="Quality check" 
                                className="w-12 h-12 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                        {report.notes && (
                          <p className="text-xs text-gray-600">{report.notes}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Driver Tab */}
            <TabsContent value="driver" className="p-4 space-y-4">
              {orderData.driver ? (
                <>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-16 w-16">
                          <img src={orderData.driver.photo} alt={orderData.driver.name} className="rounded-full" />
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            {language === 'en' ? orderData.driver.name : orderData.driver.nameNepali}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{orderData.driver.rating}</span>
                            <Badge className={`text-xs ${orderData.driver.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {orderData.driver.isOnline ? t('Online', 'अनलाइन') : t('Offline', 'अफलाइन')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {orderData.driver.vehicle} • {orderData.driver.licensePlate}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={handleCallDriver} className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t('Call', 'कल')}
                        </Button>
                        <Button variant="outline" onClick={handleMessageDriver} className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          {t('Message', 'सन्देश')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t('Quick Actions', 'द्रुत कार्यहरू')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" onClick={handleShareLocation}>
                        <MapPin className="h-4 w-4 mr-2" />
                        {t('Share My Location', 'मेरो स्थान साझा गर्नुहोस्')}
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Camera className="h-4 w-4 mr-2" />
                        {t('Report Issue', 'समस्या रिपोर्ट गर्नुहोस्')}
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={handleEmergencyContact}>
                        <Bell className="h-4 w-4 mr-2" />
                        {t('Emergency Contact', 'आपातकालीन सम्पर्क')}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {t('Driver Not Assigned', 'चालक तोकिएको छैन')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('A driver will be assigned soon', 'चाँडै चालक तोकिनेछ')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="p-4 space-y-4">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('Order Summary', 'अर्डर सारांश')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">{t('Subtotal', 'उप-योग')}</span>
                      <span className="text-sm">{formatCurrency(orderData.totalAmount)}</span>
                    </div>
                    {orderData.discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span className="text-sm">
                          {t('Discount', 'छुट')} {orderData.promoCode && `(${orderData.promoCode})`}
                        </span>
                        <span className="text-sm">-{formatCurrency(orderData.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm">{t('Delivery Fee', 'डेलिभरी शुल्क')}</span>
                      <span className="text-sm">
                        {orderData.deliveryFee === 0 ? t('FREE', 'नि:शुल्क') : formatCurrency(orderData.deliveryFee)}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-medium">
                        <span>{t('Total Paid', 'कुल भुक्तानी')}</span>
                        <span className="text-emerald-600">
                          {formatCurrency(orderData.totalAmount - orderData.discount + orderData.deliveryFee)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('Payment Information', 'भुक्तानी जानकारी')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">{t('Payment Method', 'भुक्तानी विधि')}</span>
                      <span className="text-sm font-medium">{orderData.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('Payment Status', 'भुक्तानी स्थिति')}</span>
                      <Badge className={`text-xs ${
                        orderData.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        orderData.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {orderData.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('Delivery Address', 'डेलिभरी ठेगाना')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {language === 'en' ? orderData.deliveryLocation.address : orderData.deliveryLocation.addressNepali}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {t('Contact:', 'सम्पर्क:')} {orderData.customer.phone}
                  </p>
                  {orderData.specialInstructions && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium mb-1">{t('Special Instructions', 'विशेष निर्देशनहरू')}</p>
                      <p className="text-sm text-gray-600">{orderData.specialInstructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Actions */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t('Download Receipt', 'रसिद डाउनलोड गर्नुहोस्')}
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('Share Order', 'अर्डर साझा गर्नुहोस्')}
                </Button>
                {canCancelOrder() && (
                  <Button variant="outline" className="w-full text-red-600 border-red-300" onClick={handleCancelOrder}>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {t('Cancel Order', 'अर्डर रद्द गर्नुहोस्')}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Driver Contact Modal */}
        {showDriverContact && orderData.driver && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">{t('Contact Driver', 'चालकलाई सम्पर्क गर्नुहोस्')}</h3>
              <div className="space-y-4">
                <Textarea
                  placeholder={t('Type your message...', 'तपाईंको सन्देश टाइप गर्नुहोस्...')}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowDriverContact(false)}>
                    {t('Cancel', 'रद्द गर्नुहोस्')}
                  </Button>
                  <Button className="flex-1" onClick={() => {
                    toast.success(t('Message sent!', 'सन्देश पठाइयो!'));
                    setShowDriverContact(false);
                    setFeedbackText('');
                  }}>
                    {t('Send', 'पठाउनुहोस्')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};