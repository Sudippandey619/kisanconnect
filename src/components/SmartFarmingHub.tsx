import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Thermometer, Wind, Sun, CloudRain, Zap, Leaf, TrendingUp, AlertTriangle, Settings, Wifi, WifiOff, Smartphone, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';
import { User, Language } from '../App';

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    uvIndex: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    humidity: number;
    precipitation: number;
    condition: string;
  }>;
}

interface SoilData {
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  conductivity: number;
  lastUpdated: string;
}

interface IrrigationSchedule {
  zones: Array<{
    id: string;
    name: string;
    nameNepali: string;
    crop: string;
    nextWatering: string;
    duration: number;
    autoMode: boolean;
    moistureThreshold: number;
  }>;
}

interface CropHealth {
  ndvi: number; // Normalized Difference Vegetation Index
  stress: 'low' | 'medium' | 'high';
  growth: 'excellent' | 'good' | 'average' | 'poor';
  recommendations: string[];
  recommendationsNepali: string[];
  lastSatelliteUpdate: string;
}

interface IoTDevice {
  id: string;
  name: string;
  nameNepali: string;
  type: 'soil_sensor' | 'weather_station' | 'irrigation_valve' | 'camera';
  status: 'online' | 'offline' | 'warning';
  batteryLevel: number;
  lastHeartbeat: string;
  location: { lat: number; lng: number };
}

interface Props {
  user: User;
  language: Language;
  onClose: () => void;
}

export const SmartFarmingHub: React.FC<Props> = ({ user, language, onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weatherData] = useState<WeatherData>({
    current: {
      temperature: 24,
      humidity: 65,
      windSpeed: 12,
      precipitation: 0,
      uvIndex: 6,
      condition: 'sunny'
    },
    forecast: [
      { date: 'Today', high: 28, low: 18, humidity: 65, precipitation: 0, condition: 'sunny' },
      { date: 'Tomorrow', high: 26, low: 16, humidity: 70, precipitation: 20, condition: 'cloudy' },
      { date: 'Wed', high: 22, low: 14, humidity: 80, precipitation: 60, condition: 'rainy' },
      { date: 'Thu', high: 25, low: 17, humidity: 68, precipitation: 10, condition: 'cloudy' },
      { date: 'Fri', high: 27, low: 19, humidity: 62, precipitation: 0, condition: 'sunny' }
    ]
  });

  const [soilData] = useState<SoilData>({
    moisture: 45,
    ph: 6.8,
    nitrogen: 32,
    phosphorus: 28,
    potassium: 42,
    temperature: 22,
    conductivity: 1.2,
    lastUpdated: new Date().toISOString()
  });

  const [irrigationSchedule, setIrrigationSchedule] = useState<IrrigationSchedule>({
    zones: [
      {
        id: 'zone_1',
        name: 'Tomato Field A',
        nameNepali: 'टमाटर खेत अ',
        crop: 'Tomatoes',
        nextWatering: new Date(Date.now() + 7200000).toISOString(),
        duration: 30,
        autoMode: true,
        moistureThreshold: 40
      },
      {
        id: 'zone_2',
        name: 'Vegetable Garden',
        nameNepali: 'तरकारी बगैंचा',
        crop: 'Mixed Vegetables',
        nextWatering: new Date(Date.now() + 14400000).toISOString(),
        duration: 45,
        autoMode: false,
        moistureThreshold: 35
      }
    ]
  });

  const [cropHealth] = useState<CropHealth>({
    ndvi: 0.72,
    stress: 'low',
    growth: 'excellent',
    recommendations: [
      'Maintain current irrigation schedule',
      'Consider light fertilization in 2 weeks',
      'Monitor for early blight symptoms'
    ],
    recommendationsNepali: [
      'हालको सिंचाई तालिका कायम राख्नुहोस्',
      '२ हप्तामा हल्का मल प्रयोग गर्ने विचार गर्नुहोस्',
      'प्रारम्भिक ब्लाइट लक्षणहरूको निगरानी गर्नुहोस्'
    ],
    lastSatelliteUpdate: new Date(Date.now() - 86400000).toISOString()
  });

  const [iotDevices] = useState<IoTDevice[]>([
    {
      id: 'device_1',
      name: 'Soil Sensor #1',
      nameNepali: 'माटो सेन्सर #१',
      type: 'soil_sensor',
      status: 'online',
      batteryLevel: 87,
      lastHeartbeat: new Date().toISOString(),
      location: { lat: 27.7172, lng: 85.3240 }
    },
    {
      id: 'device_2',
      name: 'Weather Station',
      nameNepali: 'मौसम स्टेशन',
      type: 'weather_station',
      status: 'online',
      batteryLevel: 92,
      lastHeartbeat: new Date().toISOString(),
      location: { lat: 27.7172, lng: 85.3240 }
    },
    {
      id: 'device_3',
      name: 'Irrigation Valve #1',
      nameNepali: 'सिंचाई भल्भ #१',
      type: 'irrigation_valve',
      status: 'warning',
      batteryLevel: 23,
      lastHeartbeat: new Date(Date.now() - 300000).toISOString(),
      location: { lat: 27.7172, lng: 85.3240 }
    }
  ]);

  const [moistureHistory] = useState([
    { time: '00:00', moisture: 42, temperature: 20 },
    { time: '04:00', moisture: 41, temperature: 19 },
    { time: '08:00', moisture: 38, temperature: 22 },
    { time: '12:00', moisture: 35, temperature: 26 },
    { time: '16:00', moisture: 33, temperature: 28 },
    { time: '20:00', moisture: 36, temperature: 24 },
    { time: '24:00', moisture: 45, temperature: 22 }
  ]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getHealthColor = (stress: string) => {
    switch (stress) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleManualWatering = (zoneId: string) => {
    toast.success(t('Manual watering started!', 'म्यानुअल पानी दिन सुरु गरियो!'));
  };

  const handleAutoModeToggle = (zoneId: string, enabled: boolean) => {
    setIrrigationSchedule(prev => ({
      zones: prev.zones.map(zone => 
        zone.id === zoneId ? { ...zone, autoMode: enabled } : zone
      )
    }));
    toast.success(t('Auto mode updated!', 'अटो मोड अपडेट गरियो!'));
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Leaf className="h-6 w-6" />
              <h2 className="text-lg font-bold">{t('Smart Farming Hub', 'स्मार्ट खेती केन्द्र')}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              ×
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8" />
                <div>
                  <h3 className="font-bold">{t('IoT-Powered Agriculture', 'IoT-संचालित कृषि')}</h3>
                  <p className="text-sm opacity-90">
                    {t('Real-time monitoring & automation', 'वास्तविक समय निगरानी र स्वचालन')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="dashboard" className="text-xs">
                {t('Dashboard', 'ड्यासबोर्ड')}
              </TabsTrigger>
              <TabsTrigger value="weather" className="text-xs">
                {t('Weather', 'मौसम')}
              </TabsTrigger>
              <TabsTrigger value="irrigation" className="text-xs">
                {t('Irrigation', 'सिंचाई')}
              </TabsTrigger>
              <TabsTrigger value="devices" className="text-xs">
                {t('Devices', 'उपकरणहरू')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="p-4 space-y-4">
              {/* Current Conditions Overview */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{t('Temperature', 'तापक्रम')}</span>
                    </div>
                    <p className="text-xl font-bold">{weatherData.current.temperature}°C</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{t('Soil Moisture', 'माटोको आर्द्रता')}</span>
                    </div>
                    <p className="text-xl font-bold">{soilData.moisture}%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Crop Health Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-600" />
                    {t('Crop Health', 'बाली स्वास्थ्य')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('NDVI Score', 'NDVI स्कोर')}</span>
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {cropHealth.ndvi.toFixed(2)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('Growth Status', 'बृद्धि स्थिति')}</span>
                      <Badge className="bg-green-100 text-green-800">
                        {t(cropHealth.growth, 'उत्कृष्ट')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('Stress Level', 'तनाव स्तर')}</span>
                      <Badge className={getHealthColor(cropHealth.stress)}>
                        {t(cropHealth.stress, 'कम')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Soil Analytics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('Soil Moisture Trends', 'माटो आर्द्रता प्रवृत्ति')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={moistureHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="moisture" 
                        stroke="#27AE60" 
                        strokeWidth={2}
                        name={t('Moisture %', 'आर्द्रता %')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card className="bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    {t('Smart Recommendations', 'स्मार्ट सिफारिसहरू')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(language === 'en' ? cropHealth.recommendations : cropHealth.recommendationsNepali).map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-emerald-800 dark:text-emerald-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weather" className="p-4 space-y-4">
              {/* Current Weather */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(weatherData.current.condition)}
                      <div>
                        <p className="text-2xl font-bold">{weatherData.current.temperature}°C</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {t(weatherData.current.condition, 'घामिलो')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{t('UV Index', 'UV सूचकांक')}</p>
                      <p className="text-lg font-bold">{weatherData.current.uvIndex}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Wind className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">{t('Wind', 'हावा')}</p>
                      <p className="font-medium">{weatherData.current.windSpeed} km/h</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">{t('Humidity', 'आर्द्रता')}</p>
                      <p className="font-medium">{weatherData.current.humidity}%</p>
                    </div>
                    <div className="text-center">
                      <CloudRain className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">{t('Rain', 'वर्षा')}</p>
                      <p className="font-medium">{weatherData.current.precipitation}mm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('5-Day Forecast', '५ दिनको पूर्वानुमान')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getWeatherIcon(day.condition)}
                          <span className="text-sm font-medium">{day.date}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold">{day.high}°/{day.low}°</p>
                            <p className="text-xs text-gray-600">{day.precipitation}% rain</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weather Alerts */}
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                      {t('Weather Alert', 'मौसम चेतावनी')}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    {t('Rain expected tomorrow. Consider covering sensitive crops.', 'भोलि वर्षाको सम्भावना छ। संवेदनशील बालीहरूलाई छोप्ने विचार गर्नुहोस्।')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="irrigation" className="p-4 space-y-4">
              {/* Irrigation Zones */}
              {irrigationSchedule.zones.map((zone) => (
                <Card key={zone.id}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{language === 'en' ? zone.name : zone.nameNepali}</span>
                      <Badge variant="secondary">{zone.crop}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('Auto Mode', 'अटो मोड')}</span>
                      <Switch 
                        checked={zone.autoMode} 
                        onCheckedChange={(checked) => handleAutoModeToggle(zone.id, checked)}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">{t('Moisture Threshold', 'आर्द्रता सीमा')}</span>
                        <span className="text-sm font-medium">{zone.moistureThreshold}%</span>
                      </div>
                      <Slider
                        value={[zone.moistureThreshold]}
                        onValueChange={(value) => {
                          setIrrigationSchedule(prev => ({
                            zones: prev.zones.map(z => 
                              z.id === zone.id ? { ...z, moistureThreshold: value[0] } : z
                            )
                          }));
                        }}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('Next Watering', 'अर्को पानी')}</p>
                        <p className="font-medium">{formatTime(zone.nextWatering)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('Duration', 'अवधि')}</p>
                        <p className="font-medium">{zone.duration} min</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleManualWatering(zone.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <Droplets className="h-4 w-4 mr-2" />
                      {t('Water Now', 'अहिले पानी दिनुहोस्')}
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Water Usage Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('Water Usage This Week', 'यो हप्ताको पानी प्रयोग')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={[
                      { day: 'Mon', usage: 45 },
                      { day: 'Tue', usage: 52 },
                      { day: 'Wed', usage: 38 },
                      { day: 'Thu', usage: 61 },
                      { day: 'Fri', usage: 47 },
                      { day: 'Sat', usage: 55 },
                      { day: 'Sun', usage: 49 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} L`, t('Water Usage', 'पानी प्रयोग')]} />
                      <Bar dataKey="usage" fill="#27AE60" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="p-4 space-y-3">
              {iotDevices.map((device) => (
                <Card key={device.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                          {device.type === 'soil_sensor' && <Leaf className="h-4 w-4 text-emerald-600" />}
                          {device.type === 'weather_station' && <Cloud className="h-4 w-4 text-blue-600" />}
                          {device.type === 'irrigation_valve' && <Droplets className="h-4 w-4 text-blue-600" />}
                          {device.type === 'camera' && <Smartphone className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {language === 'en' ? device.name : device.nameNepali}
                          </p>
                          <p className="text-xs text-gray-600">
                            {t('Last update:', 'अन्तिम अपडेट:')} {formatTime(device.lastHeartbeat)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(device.status)}>
                          {device.status === 'online' && <Wifi className="h-3 w-3 mr-1" />}
                          {device.status === 'offline' && <WifiOff className="h-3 w-3 mr-1" />}
                          {device.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {t(device.status, device.status === 'online' ? 'अनलाइन' : 'अफलाइन')}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-600">{t('Battery', 'ब्याट्री')}</div>
                        <Progress value={device.batteryLevel} className="w-16 h-2" />
                        <span className="text-xs font-medium">{device.batteryLevel}%</span>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full">
                + {t('Add New Device', 'नयाँ उपकरण थप्नुहोस्')}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};