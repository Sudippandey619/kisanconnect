import React, { useState } from 'react';
import { Navigation, CheckCircle, XCircle, Phone, MapPin, Package, Clock, Wallet, Star, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { User } from '../App';

interface DriverDashboardProps {
  user: User;
}

interface DeliveryRequest {
  id: string;
  farmer: {
    name: string;
    location: string;
    phone: string;
    avatar?: string;
  };
  consumer: {
    name: string;
    location: string;
    phone: string;
    avatar?: string;
  };
  items: string[];
  distance: number;
  estimatedTime: number;
  payment: number;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  createdAt: string;
  priority: 'normal' | 'urgent';
}

interface CompletedDelivery {
  id: string;
  farmer: string;
  consumer: string;
  payment: number;
  rating: number;
  completedAt: string;
  distance: number;
}

export function DriverDashboard({ user }: DriverDashboardProps) {
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([
    {
      id: '1',
      farmer: {
        name: 'राम बहादुर',
        location: 'काभ्रे, पनौती',
        phone: '+977-9841234567'
      },
      consumer: {
        name: 'श्याम शर्मा',
        location: 'काठमाडौं, बानेश्वर',
        phone: '+977-9876543210'
      },
      items: ['गोलभेंडा 5kg', 'गाजर 2kg'],
      distance: 15,
      estimatedTime: 45,
      payment: 250,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      priority: 'urgent'
    },
    {
      id: '2',
      farmer: {
        name: 'गीता देवी',
        location: 'ललितपुर, गोदावरी',
        phone: '+977-9812345678'
      },
      consumer: {
        name: 'हरि बहादुर',
        location: 'काठमाडौं, कपन',
        phone: '+977-9898989898'
      },
      items: ['स्याउ 3kg'],
      distance: 12,
      estimatedTime: 35,
      payment: 180,
      status: 'pending',
      createdAt: '2024-01-15T11:00:00Z',
      priority: 'normal'
    }
  ]);

  const [activeDelivery, setActiveDelivery] = useState<DeliveryRequest | null>(null);

  const completedDeliveries: CompletedDelivery[] = [
    {
      id: '1',
      farmer: 'राम बहादुर',
      consumer: 'श्याम शर्मा',
      payment: 300,
      rating: 4.8,
      completedAt: '2024-01-14T16:30:00Z',
      distance: 18
    },
    {
      id: '2',
      farmer: 'सीता देवी',
      consumer: 'गोपाल श्रेष्ठ',
      payment: 150,
      rating: 5.0,
      completedAt: '2024-01-13T14:15:00Z',
      distance: 8
    }
  ];

  const todayEarnings = 450;
  const monthlyEarnings = 12350;
  const totalDeliveries = 48;
  const averageRating = 4.7;

  const handleAcceptDelivery = (requestId: string) => {
    const request = deliveryRequests.find(r => r.id === requestId);
    if (request) {
      setActiveDelivery({ ...request, status: 'accepted' });
      setDeliveryRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleRejectDelivery = (requestId: string) => {
    setDeliveryRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const updateDeliveryStatus = (status: 'picked_up' | 'delivered') => {
    if (activeDelivery) {
      setActiveDelivery({ ...activeDelivery, status });
      if (status === 'delivered') {
        // Move to completed deliveries and clear active
        setTimeout(() => setActiveDelivery(null), 2000);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'पेन्डिङ';
      case 'accepted': return 'स्वीकार गरियो';
      case 'picked_up': return 'उठाइयो';
      case 'delivered': return 'डेलिभर भयो';
      default: return status;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-4">
        <h2 className="text-xl font-bold mb-1">नमस्ते, {user.name} जी</h2>
        <p className="text-muted-foreground text-sm">आज कति डेलिभरी गर्ने हो?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">आजको आम्दानी</span>
            </div>
            <p className="text-xl font-bold text-green-800 dark:text-green-200">रु. {todayEarnings}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-700 dark:text-orange-300">यो महिना</span>
            </div>
            <p className="text-xl font-bold text-orange-800 dark:text-orange-200">रु. {monthlyEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">कुल डेलिभरी</span>
            </div>
            <p className="text-xl font-bold">{totalDeliveries}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">रेटिङ</span>
            </div>
            <p className="text-xl font-bold">{averageRating} ⭐</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Delivery */}
      {activeDelivery && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              सक्रिय डेलिभरी
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge className={getStatusColor(activeDelivery.status)}>
                {getStatusText(activeDelivery.status)}
              </Badge>
              <span className="font-bold text-lg text-blue-600">रु. {activeDelivery.payment}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">{activeDelivery.farmer.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{activeDelivery.farmer.location}</span>
                  </div>
                </div>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">{activeDelivery.consumer.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{activeDelivery.consumer.location}</span>
                  </div>
                </div>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">वस्तुहरू:</p>
              {activeDelivery.items.map((item, index) => (
                <p key={index} className="text-sm text-muted-foreground">• {item}</p>
              ))}
            </div>

            <div className="flex gap-2">
              {activeDelivery.status === 'accepted' && (
                <Button
                  onClick={() => updateDeliveryStatus('picked_up')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  उठाएँ
                </Button>
              )}
              {activeDelivery.status === 'picked_up' && (
                <Button
                  onClick={() => updateDeliveryStatus('delivered')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  डेलिभर गरेँ
                </Button>
              )}
              <Button variant="outline" className="flex-1">
                <Navigation className="h-4 w-4 mr-1" />
                नेभिगेसन
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">
            नयाँ रिक्वेस्ट ({deliveryRequests.length})
          </TabsTrigger>
          <TabsTrigger value="history">इतिहास</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="space-y-4">
            {deliveryRequests.map((request) => (
              <Card 
                key={request.id} 
                className={`${request.priority === 'urgent' ? 'border-l-4 border-l-red-500' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={request.priority === 'urgent' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {request.priority === 'urgent' ? 'तुरुन्त' : 'साधारण'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleTimeString('ne-NP', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">रु. {request.payment}</p>
                      <p className="text-xs text-muted-foreground">{request.distance}km • {request.estimatedTime}min</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{request.farmer.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{request.farmer.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{request.consumer.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{request.consumer.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium mb-2">वस्तुहरू:</p>
                    {request.items.map((item, index) => (
                      <p key={index} className="text-sm text-muted-foreground">• {item}</p>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptDelivery(request.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={!!activeDelivery}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      स्वीकार गर्नुहोस्
                    </Button>
                    <Button
                      onClick={() => handleRejectDelivery(request.id)}
                      variant="outline"
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      अस्वीकार
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {deliveryRequests.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">कुनै नयाँ डेलिभरी रिक्वेस्ट छैन</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    नयाँ रिक्वेस्टको लागि पर्खनुहोस्
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h3 className="text-lg font-semibold">पूरा भएका डेलिभरीहरू</h3>
          
          <div className="space-y-3">
            {completedDeliveries.map((delivery) => (
              <Card key={delivery.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{delivery.farmer} → {delivery.consumer}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(delivery.completedAt).toLocaleDateString('ne-NP')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">रु. {delivery.payment}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{delivery.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{delivery.distance}km</span>
                    <Badge variant="secondary" className="text-xs">
                      पूरा भयो
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}