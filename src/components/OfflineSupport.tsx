import React, { useState } from 'react';
import { X, Wifi, WifiOff, Download, Upload, Smartphone, MessageSquare, Package, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import type { User, Language } from '../App';

interface OfflineSupportProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function OfflineSupport({ user, language, onClose }: OfflineSupportProps) {
  const [currentTab, setCurrentTab] = useState('offline');
  const [offlineMode, setOfflineMode] = useState(false);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-emerald-100 dark:border-emerald-700">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-gray-500 to-slate-500 rounded-lg">
              <WifiOff className="h-5 w-5 text-white" />
            </div>
            {t('Offline Support', 'अफलाइन सहयोग')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-50 dark:bg-gray-900/20">
              <TabsTrigger value="offline" className="flex items-center gap-2">
                <WifiOff className="h-4 w-4" />
                {t('Offline Mode', 'अफलाइन मोड')}
              </TabsTrigger>
              <TabsTrigger value="sync" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {t('Data Sync', 'डेटा सिङ्क')}
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('SMS Orders', 'SMS अर्डर')}
              </TabsTrigger>
              <TabsTrigger value="ussd" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                {t('USSD Support', 'USSD सहयोग')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="offline" className="space-y-6">
              <div className="space-y-6">
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{t('Offline Mode', 'अफलाइन मोड')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('Continue using the app without internet connection', 'इन्टरनेट जडान बिना एप प्रयोग गर्न जारी राख्नुहोस्')}
                        </p>
                      </div>
                      <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="font-medium">{t('Cached Products', 'क्यास गरिएका उत्पादन')}</h4>
                        <p className="text-2xl font-bold text-blue-600">250</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <h4 className="font-medium">{t('Pending Orders', 'पेन्डिङ अर्डर')}</h4>
                        <p className="text-2xl font-bold text-green-600">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(2deg)' }}>
                    <CardContent className="p-4 text-center">
                      <Download className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-medium mb-2">{t('Download Data', 'डेटा डाउनलोड गर्नुहोस्')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Cache product catalogs for offline use', 'अफलाइन प्रयोगका लागि उत्पादन क्यालग क्यास गर्नुहोस्')}
                      </p>
                      <Button size="sm" className="w-full">
                        {t('Download', 'डाउनलोड गर्नुहोस्')}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(0deg)' }}>
                    <CardContent className="p-4 text-center">
                      <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-medium mb-2">{t('Offline Orders', 'अफलाइन अर्डर')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Place orders without internet connection', 'इन्टरनेट जडान बिना अर्डर राख्नुहोस्')}
                      </p>
                      <Button size="sm" className="w-full">
                        {t('Enable', 'सक्षम गर्नुहोस्')}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-2deg)' }}>
                    <CardContent className="p-4 text-center">
                      <Upload className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <h4 className="font-medium mb-2">{t('Auto Sync', 'स्वचालित सिङ्क')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Automatically sync when connected', 'जडान हुँदा स्वचालित रूपमा सिङ्क गर्नुहोस्')}
                      </p>
                      <Button size="sm" className="w-full">
                        {t('Configure', 'कन्फिगर गर्नुहोस्')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sync" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Upload className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Data Synchronization', 'डेटा सिङ्क्रोनाइजेसन')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Sync your offline data when internet is available', 'इन्टरनेट उपलब्ध हुँदा आफ्नो अफलाइन डेटा सिङ्क गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('Sync Now', 'अहिले सिङ्क गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sms" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <MessageSquare className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('SMS Order System', 'SMS अर्डर प्रणाली')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Place orders via SMS when you have no internet', 'इन्टरनेट नभएको बेला SMS मार्फत अर्डर राख्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t('Learn SMS Commands', 'SMS कमाण्डहरू सिक्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ussd" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Smartphone className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('USSD Integration', 'USSD एकीकरण')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Access KisanConnect features on any basic phone', 'कुनै पनि आधारभूत फोनमा किसान कनेक्ट सुविधाहरू पहुँच गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200">
                  <Smartphone className="h-4 w-4 mr-2" />
                  {t('Get USSD Code', 'USSD कोड लिनुहोस्')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}