import React, { useState } from 'react';
import { X, User, Award, Star, Camera, Edit, Shield, TrendingUp, Users, MapPin, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import type { User, Language } from '../App';

interface AdvancedProfilesProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function AdvancedProfiles({ user, language, onClose }: AdvancedProfilesProps) {
  const [currentTab, setCurrentTab] = useState('profile');

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Mock profile data
  const profileStats = {
    totalSales: 45600,
    rating: 4.8,
    reviews: 247,
    completedOrders: 189,
    responseTime: '2h',
    joinDate: '2023-03-15'
  };

  const certifications = [
    {
      id: 1,
      name: t('Organic Certified', 'जैविक प्रमाणित'),
      issuer: t('Nepal Organic Council', 'नेपाल जैविक परिषद्'),
      date: '2024-01-10',
      verified: true
    },
    {
      id: 2,
      name: t('Quality Assurance', 'गुणस्तर आश्वासन'),
      issuer: t('KisanConnect', 'किसान कनेक्ट'),
      date: '2023-12-05',
      verified: true
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-emerald-100 dark:border-emerald-700">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            {t('Advanced Profile', 'उन्नत प्रोफाइल')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-blue-50 dark:bg-blue-900/20">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('Profile', 'प्रोफाइल')}
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                {t('Portfolio', 'पोर्टफोलियो')}
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                {t('Certifications', 'प्रमाणपत्रहरू')}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('Analytics', 'एनालिटिक्स')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-6">
                {/* Profile Header */}
                <Card className="border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                      style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                            {user.name?.charAt(0) || '👤'}
                          </AvatarFallback>
                        </Avatar>
                        <Button size="icon" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600">
                          <Camera className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {user.roles.map(role => 
                            role === 'farmer' ? t('Farmer', 'किसान') :
                            role === 'consumer' ? t('Consumer', 'उपभोक्ता') :
                            t('Driver', 'चालक')
                          ).join(' • ')}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{profileStats.rating}</span>
                            <span className="text-sm text-gray-500">({profileStats.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-3 w-3" />
                            {user.location || t('Kathmandu, Nepal', 'काठमाडौं, नेपाल')}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {t('Joined', 'सामेल भएको')} {profileStats.joinDate}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        {t('Edit Profile', 'प्रोफाइल सम्पादन गर्नुहोस्')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="text-center p-4 hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(3deg)' }}>
                    <div className="text-2xl font-bold text-green-600">Rs. {profileStats.totalSales.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('Total Sales', 'कुल बिक्री')}</div>
                  </Card>
                  <Card className="text-center p-4 hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                    <div className="text-2xl font-bold text-blue-600">{profileStats.completedOrders}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('Orders', 'अर्डरहरू')}</div>
                  </Card>
                  <Card className="text-center p-4 hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-1deg)' }}>
                    <div className="text-2xl font-bold text-yellow-600">{profileStats.rating}/5</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('Rating', 'मूल्याङ्कन')}</div>
                  </Card>
                  <Card className="text-center p-4 hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-3deg)' }}>
                    <div className="text-2xl font-bold text-purple-600">{profileStats.responseTime}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('Response Time', 'प्रतिक्रिया समय')}</div>
                  </Card>
                </div>

                {/* Profile Completion */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('Profile Completion', 'प्रोफाइल पूरा गर्नुहोस्')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('Complete your profile to gain customer trust', 'ग्राहकको भरोसा प्राप्त गर्न आफ्नो प्रोफाइल पूरा गर्नुहोस्')}</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {t('Add farm photos and certifications to reach 100%', '१००% पुग्न फार्मका फोटो र प्रमाणपत्रहरू थप्नुहोस्')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Camera className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Professional Portfolio', 'व्यावसायिक पोर्टफोलियो')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Showcase your farm, products and work quality', 'आफ्नो फार्म, उत्पादन र कामको गुणस्तर प्रदर्शन गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200">
                  <Camera className="h-4 w-4 mr-2" />
                  {t('Add Photos', 'फोटो थप्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t('Certifications & Badges', 'प्रमाणपत्र र ब्याजहरू')}</h3>
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    {t('Add Certification', 'प्रमाणपत्र थप्नुहोस्')}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.map((cert, index) => (
                    <Card key={cert.id} className="hover:shadow-lg transition-all duration-200"
                          style={{
                            transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                          }}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{cert.name}</h4>
                              {cert.verified && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {t('Verified', 'प्रमाणित')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                            <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Profile Analytics', 'प्रोफाइल एनालिटिक्स')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Track your profile views and customer engagement', 'आफ्नो प्रोफाइल भ्यू र ग्राहक संलग्नता ट्र्याक गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t('View Analytics', 'एनालिटिक्स हेर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}