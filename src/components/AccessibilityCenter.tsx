import React, { useState } from 'react';
import { X, Volume2, Eye, Smartphone, Type, MousePointer, Keyboard, Star, Accessibility, VolumeX, ZoomIn } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import type { User, Language } from '../App';

interface AccessibilityCenterProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function AccessibilityCenter({ user, language, onClose }: AccessibilityCenterProps) {
  const [currentTab, setCurrentTab] = useState('voice');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [soundEnabled, setSoundEnabled] = useState(true);

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
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
              <Accessibility className="h-5 w-5 text-white" />
            </div>
            {t('Accessibility Center', 'पहुँच सुविधा केन्द्र')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-indigo-50 dark:bg-indigo-900/20">
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                {t('Voice', 'आवाज')}
              </TabsTrigger>
              <TabsTrigger value="visual" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {t('Visual', 'दृश्य')}
              </TabsTrigger>
              <TabsTrigger value="motor" className="flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                {t('Motor', 'गति')}
              </TabsTrigger>
              <TabsTrigger value="cognitive" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {t('Cognitive', 'संज्ञानात्मक')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="voice" className="space-y-6">
              <div className="space-y-6">
                <Card className="border-indigo-200 dark:border-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
                      style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                        <Volume2 className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{t('Voice Navigation', 'आवाज नेभिगेसन')}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t('Navigate the app using voice commands in Nepali or English', 'नेपाली वा अङ्ग्रेजीमा आवाज कमाण्ड प्रयोग गरेर एप नेभिगेट गर्नुहोस्')}
                        </p>
                      </div>
                      <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(2deg)' }}>
                    <CardContent className="p-4 text-center">
                      <Smartphone className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-medium mb-2">{t('Screen Reader', 'स्क्रिन रिडर')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Audio description of screen content', 'स्क्रिन सामग्रीको अडियो विवरण')}
                      </p>
                      <Button size="sm" className="w-full">
                        {t('Enable', 'सक्षम गर्नुहोस्')}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-2deg)' }}>
                    <CardContent className="p-4 text-center">
                      <Volume2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-medium mb-2">{t('Voice Commands', 'आवाज कमाण्ड')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Control app with voice instructions', 'आवाज निर्देशनले एप नियन्त्रण गर्नुहोस्')}
                      </p>
                      <Button size="sm" className="w-full">
                        {t('Learn Commands', 'कमाण्डहरू सिक्नुहोस्')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('Voice Settings', 'आवाज सेटिङहरू')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('Voice feedback', 'आवाज प्रतिक्रिया')}</span>
                      <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('Speech speed', 'बोली गति')}</label>
                      <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('Voice volume', 'आवाज भोल्युम')}</label>
                      <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="visual" className="space-y-6">
              <div className="space-y-6">
                <Card className="border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
                      style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{t('Visual Enhancements', 'दृश्य सुधार')}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t('Improve visibility with high contrast and large text', 'उच्च कन्ट्रास्ट र ठूलो पाठले दृश्यता सुधार गर्नुहोस्')}
                        </p>
                      </div>
                      <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(2deg)' }}>
                    <CardContent className="p-4 text-center">
                      <Type className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <h4 className="font-medium mb-2">{t('Large Text', 'ठूलो पाठ')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Increase text size for better readability', 'राम्रो पढ्नका लागि पाठ साइज बढाउनुहोस्')}
                      </p>
                      <Button size="sm" className="w-full">
                        {t('Adjust Size', 'साइज समायोजन गर्नुहोस्')}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(0deg)' }}>
                    <CardContent className="p-4 text-center">
                      <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-medium mb-2">{t('High Contrast', 'उच्च कन्ट्रास्ट')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Enhanced color contrast for low vision', 'कम दृष्टिका लागि बढाइएको रङ कन्ट्रास्ट')}
                      </p>
                      <Button size="sm" className="w-full">
                        {t('Enable', 'सक्षम गर्नुहोस्')}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-2deg)' }}>
                    <CardContent className="p-4 text-center">
                      <ZoomIn className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <h4 className="font-medium mb-2">{t('Magnifier', 'म्याग्निफायर')}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t('Zoom in on specific parts of the screen', 'स्क्रिनका विशेष भागहरूमा जुम इन गर्नुहोस्')}
                      </p>
                      <Button size="sm" className="w-full">
                        {t('Activate', 'सक्रिय गर्नुहोस्')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('Visual Settings', 'दृश्य सेटिङहरू')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('Font size', 'फन्ट साइज')}</label>
                      <Slider 
                        value={fontSize} 
                        onValueChange={setFontSize}
                        min={12} 
                        max={24} 
                        step={1} 
                        className="w-full" 
                      />
                      <div className="text-xs text-gray-500">{fontSize[0]}px</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('Reduce motion', 'गति कम गर्नुहोस्')}</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('Invert colors', 'रङहरू उल्टाउनुहोस्')}</span>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="motor" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <MousePointer className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Motor Accessibility', 'गति पहुँच सुविधा')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Simplified navigation for users with motor disabilities', 'गति अपाङ्गता भएका प्रयोगकर्ताहरूका लागि सरलीकृत नेभिगेसन')}
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200">
                  <MousePointer className="h-4 w-4 mr-2" />
                  {t('Configure', 'कन्फिगर गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="cognitive" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Star className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Simplified Mode', 'सरल मोड')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Icon-based navigation and simplified interface for better understanding', 'राम्रो बुझाइका लागि आइकन-आधारित नेभिगेसन र सरल इन्टरफेस')}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200">
                  <Star className="h-4 w-4 mr-2" />
                  {t('Enable Simple Mode', 'सरल मोड सक्षम गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}