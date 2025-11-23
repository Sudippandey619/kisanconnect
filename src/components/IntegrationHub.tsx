import React, { useState } from 'react';
import { X, Zap, Cloud, Smartphone, CreditCard, Truck, Database, Wifi, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import type { User, Language } from '../App';

interface IntegrationHubProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function IntegrationHub({ user, language, onClose }: IntegrationHubProps) {
  const [currentTab, setCurrentTab] = useState('weather');

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Mock integration data
  const integrations = {
    weather: {
      name: t('Weather API', 'मौसम API'),
      description: t('Real-time weather data and forecasts', 'वास्तविक समयको मौसम डेटा र पूर्वानुमान'),
      status: 'connected',
      icon: Cloud,
      features: [
        t('7-day weather forecast', '७ दिने मौसम पूर्वानुमान'),
        t('Rainfall predictions', 'वर्षा पूर्वानुमान'),
        t('Temperature alerts', 'तापक्रम चेतावनी'),
        t('Humidity monitoring', 'आर्द्रता निगरानी')
      ]
    },
    payments: {
      name: t('Payment Gateways', 'भुक्तानी गेटवे'),
      description: t('Multiple payment options for customers', 'ग्राहकहरूका लागि बहुविध भुक्तानी विकल्पहरू'),
      status: 'connected',
      icon: CreditCard,
      features: [
        t('eSewa integration', 'eSewa एकीकरण'),
        t('Khalti payments', 'Khalti भुक्तानी'),
        t('Bank transfers', 'बैंक स्थानान्तरण'),
        t('Cash on delivery', 'डिलिभरीमा नगद')
      ]
    },
    government: {
      name: t('Government APIs', 'सरकारी API'),
      description: t('Access subsidies and market price information', 'अनुदान र बजार मूल्य जानकारी पहुँच गर्नुहोस्'),
      status: 'available',
      icon: Database,
      features: [
        t('Subsidy information', 'अनुदान जानकारी'),
        t('Market prices', 'बजार मूल्य'),
        t('Government schemes', 'सरकारी योजनाहरू'),
        t('Agricultural policies', 'कृषि नीतिहरू')
      ]
    },
    logistics: {
      name: t('Logistics Partners', 'रसद साझेदारहरू'),
      description: t('Third-party delivery and logistics services', 'तेस्रो पक्षको डिलिभरी र रसद सेवाहरू'),
      status: 'connected',
      icon: Truck,
      features: [
        t('Real-time tracking', 'वास्तविक समय ट्र्याकिङ'),
        t('Delivery scheduling', 'डिलिभरी तालिका'),
        t('Route optimization', 'मार्ग अनुकूलन'),
        t('Cost calculation', 'लागत गणना')
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500 text-white';
      case 'available': return 'bg-blue-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'available': return Zap;
      case 'error': return AlertTriangle;
      default: return Settings;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-emerald-100 dark:border-emerald-700">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            {t('Integration Hub', 'एकीकरण केन्द्र')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-yellow-50 dark:bg-yellow-900/20">
              <TabsTrigger value="weather" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                {t('Weather', 'मौसम')}
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t('Payments', 'भुक्तानी')}
              </TabsTrigger>
              <TabsTrigger value="government" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                {t('Government', 'सरकार')}
              </TabsTrigger>
              <TabsTrigger value="logistics" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                {t('Logistics', 'रसद')}
              </TabsTrigger>
            </TabsList>

            {Object.entries(integrations).map(([key, integration]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div className="space-y-6">
                  {/* Integration Header */}
                  <Card className="border-yellow-200 dark:border-yellow-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                        style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                          <integration.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold">{integration.name}</h2>
                            <Badge className={getStatusColor(integration.status)}>
                              {React.createElement(getStatusIcon(integration.status), { className: "h-3 w-3 mr-1" })}
                              {integration.status === 'connected' ? t('Connected', 'जडित') :
                               integration.status === 'available' ? t('Available', 'उपलब्ध') :
                               t('Error', 'त्रुटि')}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{integration.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={integration.status === 'connected'} />
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            {t('Configure', 'कन्फिगर गर्नुहोस्')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Integration Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integration.features.map((feature, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-200"
                            style={{
                              transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                            }}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium">{feature}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Integration Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('Integration Settings', 'एकीकरण सेटिङहरू')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('Auto-sync data', 'स्वचालित डेटा सिङ्क')}</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('Real-time notifications', 'वास्तविक समय सूचना')}</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('Data export enabled', 'डेटा निर्यात सक्षम')}</span>
                        <Switch />
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            {t('Test Connection', 'जडान परीक्षण गर्नुहोस्')}
                          </Button>
                          <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                            {t('Save Settings', 'सेटिङहरू सेभ गर्नुहोस्')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}