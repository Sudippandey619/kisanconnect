import React, { useState } from 'react';
import { X, User, MapPin, Bell, Moon, Sun, Globe, HelpCircle, Shield, Heart, Settings, LogOut, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { User as UserType, Language, UserRole } from '../App';

interface ProfileSettingsProps {
  user: UserType | null;
  language: Language;
  darkMode: boolean;
  onLanguageChange: (language: Language) => void;
  onDarkModeChange: (darkMode: boolean) => void;
  onClose: () => void;
  onUserUpdate: (user: UserType) => void;
}

export function ProfileSettings({
  user,
  language,
  darkMode,
  onLanguageChange,
  onDarkModeChange,
  onClose,
  onUserUpdate
}: ProfileSettingsProps) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    deliveries: true,
    promotions: false,
    tips: true
  });

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const handleLogout = () => {
    // In a real app, this would clear authentication
    window.location.reload();
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'farmer': return '👨‍🌾';
      case 'consumer': return '🛒';
      case 'driver': return '🚚';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    if (language === 'ne') {
      switch (role) {
        case 'farmer': return 'किसान';
        case 'consumer': return 'उपभोक्ता';
        case 'driver': return 'चालक';
      }
    } else {
      switch (role) {
        case 'farmer': return 'Farmer';
        case 'consumer': return 'Consumer';
        case 'driver': return 'Driver';
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <Card className="w-full max-w-sm h-[90vh] m-4 flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3 bg-gradient-to-r from-emerald-500 to-orange-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">
              {t('Profile & Settings', 'प्रोफाइल र सेटिङहरू')}
            </CardTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-y-auto">
          {/* User Profile Section */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-gray-600 text-sm">{user.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  {user.verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      ✓ {t('Verified', 'प्रमाणित')}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {t('Member since', 'सदस्य भएको')} {new Date(user.createdAt).getFullYear()}
                  </Badge>
                </div>
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setShowEditProfile(true)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            {/* User Roles */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Your Roles', 'तपाईंका भूमिकाहरू')}
              </p>
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <Badge
                    key={role}
                    variant={role === user.currentRole ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    <span>{getRoleIcon(role)}</span>
                    <span>{getRoleLabel(role)}</span>
                    {role === user.currentRole && (
                      <span className="text-xs">({t('Active', 'सक्रिय')})</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-1">
            {/* Account Settings */}
            <div className="p-4 border-b">
              <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
                {t('Account', 'खाता')}
              </h4>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start h-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>{t('Delivery Addresses', 'डेलिभरी ठेगानाहरू')}</span>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Heart className="h-4 w-4 text-green-600" />
                    </div>
                    <span>{t('Favorites', 'मनपर्ने')}</span>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>{t('Privacy & Security', 'गोपनीयता र सुरक्षा')}</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* App Settings */}
            <div className="p-4 border-b">
              <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
                {t('App Settings', 'एप्प सेटिङहरू')}
              </h4>
              <div className="space-y-3">
                {/* Language Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-4 w-4 text-orange-600" />
                    </div>
                    <span>{t('Language', 'भाषा')}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLanguageChange(language === 'en' ? 'ne' : 'en')}
                  >
                    {language === 'en' ? 'नेपाली' : 'English'}
                  </Button>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {darkMode ? <Moon className="h-4 w-4 text-gray-600" /> : <Sun className="h-4 w-4 text-gray-600" />}
                    </div>
                    <span>{t('Dark Mode', 'डार्क मोड')}</span>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={onDarkModeChange} />
                </div>

                {/* Notifications */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Bell className="h-4 w-4 text-red-600" />
                    </div>
                    <span>{t('Notifications', 'सूचनाहरू')}</span>
                  </div>
                  
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('Order updates', 'अर्डर अपडेट')}</span>
                      <Switch 
                        checked={notifications.orders} 
                        onCheckedChange={(checked) => setNotifications({...notifications, orders: checked})}
                        size="sm" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('Delivery updates', 'डेलिभरी अपडेट')}</span>
                      <Switch 
                        checked={notifications.deliveries} 
                        onCheckedChange={(checked) => setNotifications({...notifications, deliveries: checked})}
                        size="sm" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('Promotions', 'प्रमोसनहरू')}</span>
                      <Switch 
                        checked={notifications.promotions} 
                        onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                        size="sm" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('Tips & guides', 'टिप्स र गाइड')}</span>
                      <Switch 
                        checked={notifications.tips} 
                        onCheckedChange={(checked) => setNotifications({...notifications, tips: checked})}
                        size="sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support & Help */}
            <div className="p-4 border-b">
              <h4 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
                {t('Support', 'सहायता')}
              </h4>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start h-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <HelpCircle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span>{t('Help Center', 'सहायता केन्द्र')}</span>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-4 w-4 text-teal-600" />
                    </div>
                    <span>{t('Contact Support', 'सम्पर्क सहायता')}</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Logout */}
            <div className="p-4">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <LogOut className="h-4 w-4 text-red-600" />
                  </div>
                  <span>{t('Sign Out', 'साइन आउट')}</span>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('Edit Profile', 'प्रोफा��ल सम्पादन गर्नुहोस्')}</DialogTitle>
            <DialogDescription>
              {t('Update your profile information below', 'तलका जानकारी अद्यावधिक गर्नुहोस्')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-emerald-100 text-emerald-800 text-2xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">{t('Name', 'नाम')}</label>
                <Input defaultValue={user.name} />
              </div>
              
              <div>
                <label className="text-sm font-medium">{t('Phone', 'फोन')}</label>
                <Input defaultValue={user.phone} disabled />
              </div>
              
              {user.location && (
                <div>
                  <label className="text-sm font-medium">{t('Location', 'स्थान')}</label>
                  <Input defaultValue={user.location} />
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">{t('Bio', 'बायो')}</label>
                <Textarea placeholder={t('Tell us about yourself...', 'आफ्नो बारेमा भन्नुहोस्...')} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setShowEditProfile(false)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {t('Save Changes', 'परिवर्तन बचत गर्नुहोस्')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowEditProfile(false)}
                className="flex-1"
              >
                {t('Cancel', 'रद्द गर्नुहोस्')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}