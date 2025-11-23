import React, { useState, useEffect } from 'react';
import { X, MapPin, Truck, Route, Clock, Package, Thermometer, Shield, AlertTriangle, CheckCircle, Navigation, Zap, Settings, Users, BarChart3, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import type { User, Language } from '../App';

interface AdvancedLogisticsProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function AdvancedLogistics({ user, language, onClose }: AdvancedLogisticsProps) {
  const [currentTab, setCurrentTab] = useState('routes');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Mock route optimization data
  const routes = [
    {
      id: 1,
      name: t('Central Valley Circuit', 'केन्द्रीय उपत्यका सर्किट'),
      distance: '45.2 km',
      duration: '2h 30m',
      stops: 8,
      efficiency: 92,
      savings: 1250,
      status: 'active',
      deliveries: [
        { location: t('Balaju Market', 'बालाजु बजार'), time: '9:00 AM', items: 3, priority: 'high' },
        { location: t('Kalimati Tarkari', 'कालिमाटी तरकारी'), time: '9:45 AM', items: 5, priority: 'medium' },
        { location: t('Asan Bazaar', 'आसन बजार'), time: '10:30 AM', items: 2, priority: 'high' },
        { location: t('New Road Market', 'न्यू रोड मार्केट'), time: '11:15 AM', items: 4, priority: 'low' }
      ]
    },
    {
      id: 2,
      name: t('Suburban Express Route', 'उपनगरीय एक्सप्रेस मार्ग'),
      distance: '67.8 km',
      duration: '3h 15m',
      stops: 12,
      efficiency: 88,
      savings: 1850,
      status: 'planned',
      deliveries: [
        { location: t('Bhaktapur Durbar', 'भक्तपुर दरबार'), time: '8:30 AM', items: 6, priority: 'high' },
        { location: t('Madhyapur Market', 'मध्यपुर बजार'), time: '9:20 AM', items: 3, priority: 'medium' },
        { location: t('Kirtipur Plaza', 'कीर्तिपुर प्लाजा'), time: '10:45 AM', items: 4, priority: 'medium' }
      ]
    }
  ];

  // Mock cold chain data
  const coldChainVehicles = [
    {
      id: 1,
      name: t('Cold Truck Alpha', 'कोल्ड ट्रक अल्फा'),
      temperature: 4.2,
      targetTemp: 4.0,
      humidity: 85,
      status: 'active',
      cargo: t('Dairy Products', 'दुग्ध उत्पादन'),
      location: t('En route to Kathmandu', 'काठमाडौं जाने बाटोमा'),
      batteryLevel: 78,
      alerts: []
    },
    {
      id: 2,
      name: t('Refrigerated Van Beta', 'रेफ्रिजरेटेड भ्यान बेटा'),
      temperature: 2.8,
      targetTemp: 2.5,
      humidity: 90,
      status: 'warning',
      cargo: t('Fresh Vegetables', 'ताजा तरकारी'),
      location: t('Stopped at checkpoint', 'चेकपोइन्टमा रोकिएको'),
      batteryLevel: 45,
      alerts: [t('Temperature slightly above target', 'तापक्रम लक्ष्यभन्दा अलि माथि')]
    }
  ];

  // Mock bulk order management
  const bulkOrders = [
    {
      id: 'BO001',
      client: t('Hotel Himalayan', 'होटल हिमालयन'),
      items: [
        { name: t('Fresh Vegetables', 'ताजा तरकारी'), quantity: '50 kg', value: 4500 },
        { name: t('Organic Rice', 'जैविक चामल'), quantity: '25 kg', value: 3750 },
        { name: t('Farm Chicken', 'फार्मको कुखुरा'), quantity: '10 pcs', value: 2500 }
      ],
      totalValue: 10750,
      deliveryDate: '2024-01-15',
      status: 'in_transit',
      priority: 'high',
      specialRequirements: [t('Cold storage required', 'कोल्ड स्टोरेज आवश्यक'), t('Morning delivery preferred', 'बिहान डिलिभरी प्राथमिकता')]
    },
    {
      id: 'BO002',
      client: t('ABC Restaurant Chain', 'ABC रेस्टुरेन्ट चेन'),
      items: [
        { name: t('Premium Tomatoes', 'प्रिमियम टमाटर'), quantity: '75 kg', value: 6750 },
        { name: t('Green Leafy Vegetables', 'हरियो पातेदार तरकारी'), quantity: '30 kg', value: 2700 }
      ],
      totalValue: 9450,
      deliveryDate: '2024-01-16',
      status: 'scheduled',
      priority: 'medium',
      specialRequirements: [t('Quality inspection required', 'गुणस्तर निरीक्षण आवश्यक')]
    }
  ];

  const optimizeRoute = async () => {
    setIsOptimizing(true);
    // Simulate route optimization
    setTimeout(() => {
      setIsOptimizing(false);
      // Update route efficiency
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'planned': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-emerald-100 dark:border-emerald-700">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Route className="h-5 w-5 text-white" />
            </div>
            {t('Advanced Logistics Hub', 'उन्नत रसद केन्द्र')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-blue-50 dark:bg-blue-900/20">
              <TabsTrigger value="routes" className="flex items-center gap-2">
                <Route className="h-4 w-4" />
                {t('Route Optimization', 'मार्ग अनुकूलन')}
              </TabsTrigger>
              <TabsTrigger value="coldchain" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                {t('Cold Chain', 'कोल्ड चेन')}
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t('Bulk Orders', 'बल्क अर्डरहरू')}
              </TabsTrigger>
              <TabsTrigger value="fleet" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                {t('Fleet Management', 'फ्लिट व्यवस्थापन')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="routes" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('AI-Powered Route Optimization', 'AI-संचालित मार्ग अनुकूलन')}</h2>
                  <Button
                    onClick={optimizeRoute}
                    disabled={isOptimizing}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200"
                  >
                    {isOptimizing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        {t('Optimizing...', 'अनुकूलन गर्दै...')}
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        {t('Optimize Routes', 'मार्गहरू अनुकूलन गर्नुहोस्')}
                      </>
                    )}
                  </Button>
                </div>

                {/* Route Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(3deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Route className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{t('Active Routes', 'सक्रिय मार्गहरू')}</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{t('Avg. Delivery Time', 'औसत डिलिभरी समय')}</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">2.4h</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-1deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">{t('Cost Savings', 'लागत बचत')}</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">Rs. 15,240</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-3deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">{t('Efficiency', 'दक्षता')}</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">89%</p>
                  </Card>
                </div>

                {/* Routes List */}
                <div className="space-y-4">
                  {routes.map((route, index) => (
                    <Card key={route.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                          style={{
                            transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                          }}
                          onClick={() => setSelectedRoute(route)}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(route.status)}`}></div>
                            <h3 className="text-lg font-semibold">{route.name}</h3>
                            <Badge className={route.status === 'active' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}>
                              {route.status === 'active' ? t('Active', 'सक्रिय') : t('Planned', 'योजनाबद्ध')}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Navigation className="h-4 w-4 mr-1" />
                            {t('Navigate', 'नेभिगेट गर्नुहोस्')}
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('Distance', 'दूरी')}</p>
                            <p className="font-semibold">{route.distance}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('Duration', 'अवधि')}</p>
                            <p className="font-semibold">{route.duration}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('Stops', 'स्टपहरू')}</p>
                            <p className="font-semibold">{route.stops}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('Savings', 'बचत')}</p>
                            <p className="font-semibold text-green-600">Rs. {route.savings}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Route Efficiency', 'मार्ग दक्षता')}</span>
                            <span className="text-sm font-medium">{route.efficiency}%</span>
                          </div>
                          <Progress value={route.efficiency} className="h-2" />
                        </div>

                        {/* Delivery Schedule Preview */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="text-sm font-medium mb-2">{t('Delivery Schedule', 'डिलिभरी तालिका')}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {route.deliveries.slice(0, 4).map((delivery, deliveryIndex) => (
                              <div key={deliveryIndex} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3 text-gray-500" />
                                  <span>{delivery.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`text-xs ${getPriorityColor(delivery.priority)}`}>
                                    {delivery.priority}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{delivery.time}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="coldchain" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('Cold Chain Monitoring', 'कोल्ड चेन निगरानी')}</h2>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white">
                      {t('All Systems Normal', 'सबै प्रणाली सामान्य')}
                    </Badge>
                  </div>
                </div>

                {/* Cold Chain Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(3deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{t('Avg. Temperature', 'औसत तापक्रम')}</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">3.5°C</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{t('Compliance', 'अनुपालना')}</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">98.5%</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-1deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">{t('Active Vehicles', 'सक्रिय गाडीहरू')}</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">8</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-3deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">{t('Alerts', 'चेतावनीहरू')}</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">2</p>
                  </Card>
                </div>

                {/* Cold Chain Vehicles */}
                <div className="space-y-4">
                  {coldChainVehicles.map((vehicle, index) => (
                    <Card key={vehicle.id} className="hover:shadow-xl transition-all duration-300"
                          style={{
                            transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                          }}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)} animate-pulse`}></div>
                            <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                            <Badge className={vehicle.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                              {vehicle.status === 'active' ? t('Active', 'सक्रिय') : t('Warning', 'चेतावनी')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              {t('Configure', 'कन्फिगर गर्नुहोस्')}
                            </Button>
                            <Button variant="outline" size="sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              {t('Track', 'ट्र्याक गर्नुहोस्')}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Thermometer className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('Temperature', 'तापक्रम')}</p>
                            <p className="font-semibold text-lg">{vehicle.temperature}°C</p>
                            <p className="text-xs text-gray-500">{t('Target:', 'लक्ष्य:')} {vehicle.targetTemp}°C</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="w-6 h-6 mx-auto mb-1 flex items-center justify-center">💧</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('Humidity', 'आर्द्रता')}</p>
                            <p className="font-semibold text-lg">{vehicle.humidity}%</p>
                            <p className="text-xs text-gray-500">{t('Optimal', 'इष्टतम')}</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="w-6 h-6 mx-auto mb-1 flex items-center justify-center">🔋</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('Battery', 'ब्यान्ट्री')}</p>
                            <p className="font-semibold text-lg">{vehicle.batteryLevel}%</p>
                            <Progress value={vehicle.batteryLevel} className="w-full h-1 mt-1" />
                          </div>
                          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <Package className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('Cargo', 'कार्गो')}</p>
                            <p className="font-semibold text-sm">{vehicle.cargo}</p>
                            <p className="text-xs text-gray-500">{vehicle.location}</p>
                          </div>
                        </div>

                        {vehicle.alerts.length > 0 && (
                          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                {t('Active Alerts', 'सक्रिय चेतावनीहरू')}
                              </span>
                            </div>
                            {vehicle.alerts.map((alert, alertIndex) => (
                              <p key={alertIndex} className="text-sm text-yellow-700 dark:text-yellow-300">
                                • {alert}
                              </p>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('Bulk Order Management', 'बल्क अर्डर व्यवस्थापन')}</h2>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200">
                    <Package className="h-4 w-4 mr-2" />
                    {t('New Bulk Order', 'नयाँ बल्क अर्डर')}
                  </Button>
                </div>

                {/* Bulk Order Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(3deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{t('Active Orders', 'सक्रिय अर्डरहरू')}</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">15</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{t('Total Value', 'कुल मूल्य')}</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">Rs. 2.4L</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-1deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">{t('Avg. Delivery', 'औसत डिलिभरी')}</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">1.8 days</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-3deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">{t('Success Rate', 'सफलता दर')}</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">94.2%</p>
                  </Card>
                </div>

                {/* Bulk Orders List */}
                <div className="space-y-4">
                  {bulkOrders.map((order, index) => (
                    <Card key={order.id} className="hover:shadow-xl transition-all duration-300"
                          style={{
                            transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                          }}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                              {order.id.slice(-2)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{order.client}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Order #{order.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getPriorityColor(order.priority)}`}>
                              {order.priority === 'high' ? t('High Priority', 'उच्च प्राथमिकता') :
                               order.priority === 'medium' ? t('Medium Priority', 'मध्यम प्राथमिकता') :
                               t('Low Priority', 'कम प्राथमिकता')}
                            </Badge>
                            <Badge className={order.status === 'in_transit' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>
                              {order.status === 'in_transit' ? t('In Transit', 'ट्रान्जिटमा') : t('Scheduled', 'निर्धारित')}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">{t('Order Items', 'अर्डर वस्तुहरू')}</h4>
                            <div className="space-y-2">
                              {order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.quantity}</p>
                                  </div>
                                  <p className="font-semibold">Rs. {item.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{t('Total Value:', 'कुल मूल्य:')}</span>
                              <span className="text-xl font-bold text-green-600">Rs. {order.totalValue}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{t('Delivery Date:', 'डिलिभरी मिति:')}</span>
                              <span>{order.deliveryDate}</span>
                            </div>
                            
                            {order.specialRequirements.length > 0 && (
                              <div>
                                <h5 className="font-medium mb-2">{t('Special Requirements:', 'विशेष आवश्यकताहरू:')}</h5>
                                <div className="space-y-1">
                                  {order.specialRequirements.map((req, reqIndex) => (
                                    <p key={reqIndex} className="text-sm text-orange-600 dark:text-orange-400">
                                      • {req}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {t('Track', 'ट्र्याक गर्नुहोस्')}
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {t('Contact Client', 'ग्राहकलाई सम्पर्क गर्नुहोस्')}
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                            {t('Update Status', 'स्थिति अद्यावधिक गर्नुहोस्')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fleet" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Truck className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Fleet Management System', 'फ्लिट व्यवस्थापन प्रणाली')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Comprehensive vehicle tracking, maintenance scheduling, and driver management', 'व्यापक गाडी ट्र्याकिङ, मर्मत तालिका, र चालक व्यवस्थापन')}
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
                  <Truck className="h-4 w-4 mr-2" />
                  {t('Manage Fleet', 'फ्लिट व्यवस्थापन गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}