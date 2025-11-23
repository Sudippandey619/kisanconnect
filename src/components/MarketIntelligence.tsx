import React, { useState } from 'react';
import { X, TrendingUp, BarChart3, PieChart, LineChart, Target, AlertTriangle, CheckCircle, Compass, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import type { User, Language } from '../App';

interface MarketIntelligenceProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function MarketIntelligence({ user, language, onClose }: MarketIntelligenceProps) {
  const [currentTab, setCurrentTab] = useState('prices');

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
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Compass className="h-5 w-5 text-white" />
            </div>
            {t('Market Intelligence', 'बजार बुद्धिमत्ता')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-blue-50 dark:bg-blue-900/20">
              <TabsTrigger value="prices" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('Price Trends', 'मूल्य प्रवृत्ति')}
              </TabsTrigger>
              <TabsTrigger value="demand" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('Demand', 'माग')}
              </TabsTrigger>
              <TabsTrigger value="forecast" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                {t('Forecast', 'पूर्वानुमान')}
              </TabsTrigger>
              <TabsTrigger value="competition" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t('Competition', 'प्रतिस्पर्धा')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prices" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Price Prediction Analytics', 'मूल्य पूर्वानुमान विश्लेषण')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('AI-powered price trends and market analysis', 'AI-संचालित मूल्य प्रवृत्ति र बजार विश्लेषण')}
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t('View Price Analysis', 'मूल्य विश्लेषण हेर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="demand" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <BarChart3 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Crop Demand Forecasting', 'बाली माग पूर्वानुमान')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Understand market demand for different crops', 'विभिन्न बालीहरूको बजार माग बुझ्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {t('Check Demand', 'माग जाँच गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <LineChart className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Seasonal Trend Analysis', 'मौसमी प्रवृत्ति विश्लेषण')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Plan your farming based on seasonal forecasts', 'मौसमी पूर्वानुमानको आधारमा आफ्नो खेती योजना बनाउनुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200">
                  <LineChart className="h-4 w-4 mr-2" />
                  {t('View Forecasts', 'पूर्वानुमान हेर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="competition" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Target className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Competition Analysis', 'प्रतिस्पर्धा विश्लेषण')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Analyze competitor pricing and market positioning', 'प्रतिस्पर्धी मूल्य निर्धारण र बजार स्थितिको विश्लेषण गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200">
                  <Target className="h-4 w-4 mr-2" />
                  {t('Analyze Competition', 'प्रतिस्पर्धा विश्लेषण गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}