import React, { useState } from 'react';
import { Check, ArrowRight, Users, Leaf, Truck, Star, Crown, Heart, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { UserRole, Language } from '../App';

interface EnhancedRoleSelectionProps {
  onRoleSelect: (roles: UserRole[]) => void;
  language: Language;
}

const roleData = {
  farmer: {
    icon: '👨‍🌾',
    iconComponent: <Leaf className="h-10 w-10" />,
    titleEn: 'Farmer',
    titleNe: 'किसान',
    subtitleEn: 'Grow & Sell Your Crops',
    subtitleNe: 'आफ्नो बाली उत्पादन र बिक्री गर्नुहोस्',
    descriptionEn: 'Set your own prices, manage inventory, and connect directly with consumers. No middlemen, maximum profit.',
    descriptionNe: 'आफ्नै मूल्य निर्धारण गर्नुहोस्, सूची व्यवस्थापन गर्नुहोस्, र उपभोक्ताहरूसँग प्रत्यक्ष जडान गर्नुहोस्। कुनै बिचौलिया छैन, अधिकतम नाफा।',
    featuresEn: [
      'Set own prices & earn 40% more',
      'Upload photos & videos of crops',
      'Go Live selling with viewers',
      'Batch orders for efficiency',
      'Direct withdraw to eSewa/Khalti'
    ],
    featuresNe: [
      'आफ्नै मूल्य निर्धारण र ४०% बढी कमाई',
      'बालीको फोटो र भिडियो अपलोड',
      'दर्शकहरूसँग लाइभ बिक्री',
      'दक्षताका लागि ब्याच अर्डर',
      'eSewa/Khalti मा सिधै निकासी'
    ],
    gradient: 'from-emerald-400 via-green-400 to-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-700',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    popularity: 'Most Popular',
    tipEn: 'Perfect for farmers who want to eliminate middlemen and sell directly to consumers.',
    tipNe: 'बिचौलियाहरू हटाउन र उपभोक्ताहरूलाई सिधै बेच्न चाहने किसानहरूका लागि उत्तम।'
  },
  consumer: {
    icon: '🛒',
    iconComponent: <Users className="h-10 w-10" />,
    titleEn: 'Consumer',
    titleNe: 'उपभोक्ता',
    subtitleEn: 'Buy Fresh Produce',
    subtitleNe: 'ताजा उत्पादन किन्नुहोस्',
    descriptionEn: 'Browse fresh vegetables and fruits directly from farmers. Fair prices, guaranteed freshness, fast delivery.',
    descriptionNe: 'किसानहरूबाट सिधै ताजा तरकारी र फलफूल ब्राउज गर्नुहोस्। उचित मूल्य, ग्यारेन्टी ताजगी, छिटो डेलिभरी।',
    featuresEn: [
      'Fresh produce from verified farmers',
      'Fair prices (up to 30% less)',
      'Same-day delivery in KTM Valley',
      'Track orders with GPS',
      'Multiple payment options'
    ],
    featuresNe: [
      'प्रमाणित किसानहरूबाट ताजा उत्पादन',
      'उचित मूल्य (३०% सम्म कम)',
      'काठमाडौं उपत्यकामा सोही दिन डेलिभरी',
      'GPS सँग अर्डर ट्र्याक गर्नुहोस्',
      'बहु भुक्तानी विकल्पहरू'
    ],
    gradient: 'from-blue-400 via-indigo-400 to-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700',  
    textColor: 'text-blue-700 dark:text-blue-300',
    popularity: 'Recommended',
    tipEn: 'Great for families who want fresh, affordable produce delivered to their doorstep.',
    tipNe: 'आफ्नो घरको ढोकामा ताजा, किफायती उत्पादन चाहने परिवारहरूका लागि उत्तम।'
  },
  driver: {
    icon: '🚚',
    iconComponent: <Truck className="h-10 w-10" />,
    titleEn: 'Driver',
    titleNe: 'चालक',
    subtitleEn: 'Deliver & Earn',
    subtitleNe: 'डेलिभर गर्नुहोस् र कमाउनुहोस्',
    descriptionEn: 'Pick up orders from farmers and deliver to consumers. Flexible hours, competitive rates, instant payments.',
    descriptionNe: 'किसानहरूबाट अर्डर लिनुहोस् र उपभोक्ताहरूलाई डेलिभर गर्नुहोस्। लचिलो घण्टा, प्रतिस्पर्धी दरहरू, तत्काल भुक्तानी।',
    featuresEn: [
      'Flexible working hours',
      'Choose your delivery fee (Rs 1-5/kg)',
      'Batch multiple orders',
      'GPS navigation & route optimization',
      'Instant payment to wallet'
    ],
    featuresNe: [
      'लचिलो काम घण्टा',
      'आफ्नो डेलिभरी शुल्क छान्नुहोस् (रु १-५/केजी)',
      'धेरै अर्डरहरू ब्याच गर्नुहोस्',
      'GPS नेभिगेसन र मार्ग अनुकूलन',
      'वालेटमा तत्काल भुक्तानी'
    ],
    gradient: 'from-orange-400 via-amber-400 to-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-700',
    textColor: 'text-orange-700 dark:text-orange-300',
    popularity: 'High Demand',
    tipEn: 'Ideal for drivers who want flexible income with fair compensation.',
    tipNe: 'उचित पारिश्रमिकसँग लचिलो आम्दानी चाहने चालकहरूका लागि आदर्श।'
  }
};

export function EnhancedRoleSelection({ onRoleSelect, language }: EnhancedRoleSelectionProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTip, setCurrentTip] = useState<UserRole | null>(null);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const toggleRole = (role: UserRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
    setCurrentTip(role);
  };

  const handleContinue = () => {
    if (selectedRoles.length === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      onRoleSelect(selectedRoles);
    }, 300);
  };

  const isSelected = (role: UserRole) => selectedRoles.includes(role);

  const getPopularityBadge = (role: UserRole) => {
    const data = roleData[role];
    if (role === 'farmer') {
      return (
        <Badge className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 flex items-center gap-1">
          <Star className="h-3 w-3" />
          {t(data.popularity, 'सबैभन्दा लोकप्रिय')}
        </Badge>
      );
    }
    if (role === 'consumer') {
      return (
        <Badge className="text-xs bg-gradient-to-r from-green-400 to-green-500 text-green-900 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {t(data.popularity, 'सिफारिश गरिएको')}
        </Badge>
      );
    }
    if (role === 'driver') {
      return (
        <Badge className="text-xs bg-gradient-to-r from-red-400 to-red-500 text-red-900 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {t(data.popularity, 'उच्च माग')}
        </Badge>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-orange-50 to-green-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-orange-900/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-12 w-40 h-40 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-8 w-48 h-48 bg-orange-200/20 dark:bg-orange-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 via-green-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <Crown className="h-10 w-10 text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="h-3 w-3 text-yellow-800" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-green-600 to-orange-600 bg-clip-text text-transparent">
            {t('Choose Your Role', 'आफ्नो भूमिका छान्नुहोस्')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('Select one or multiple roles to unlock your earning potential', 'आफ्नो आम्दानीको सम्भावना अनलक गर्न एक वा धेरै भूमिकाहरू चयन गर्नुहोस्')}
          </p>
        </div>

        {/* Role Cards */}
        <div className={`space-y-4 mb-6 transform transition-all duration-300 ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}>
          {(Object.keys(roleData) as UserRole[]).map((role) => {
            const data = roleData[role];
            const selected = isSelected(role);
            
            return (
              <Card
                key={role}
                className={`p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  selected 
                    ? `${data.bgColor} ${data.borderColor} border-2 shadow-xl ring-2 ring-emerald-200 dark:ring-emerald-700` 
                    : 'bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600'
                } backdrop-blur-md`}
                onClick={() => toggleRole(role)}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <div className="mt-1">
                    <Checkbox
                      checked={selected}
                      className={`w-5 h-5 ${selected ? 'border-emerald-500 bg-emerald-500' : ''}`}
                    />
                  </div>

                  {/* Role Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${data.gradient} flex items-center justify-center shadow-lg flex-shrink-0 relative`}>
                    <div className="text-white">
                      {data.iconComponent}
                    </div>
                    {selected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                    )}
                  </div>

                  {/* Role Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold">
                        {t(data.titleEn, data.titleNe)}
                      </h3>
                      {getPopularityBadge(role)}
                    </div>
                    
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      {t(data.subtitleEn, data.subtitleNe)}
                    </p>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                      {t(data.descriptionEn, data.descriptionNe)}
                    </p>

                    {/* Top Features */}
                    <div className="space-y-1">
                      {(language === 'en' ? data.featuresEn : data.featuresNe).slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                      {(language === 'en' ? data.featuresEn : data.featuresNe).length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 ml-5">
                          +{(language === 'en' ? data.featuresEn : data.featuresNe).length - 3} {t('more features', 'थप सुविधाहरू')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tip Section */}
                {selected && (
                  <div className="mt-4 p-3 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        {t(data.tipEn, data.tipNe)}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Multi-role Benefits */}
        {selectedRoles.length > 1 && (
          <Alert className="mb-6 bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20 border-emerald-200 dark:border-emerald-700">
            <Crown className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700 dark:text-emerald-300">
              <div className="font-medium mb-1">
                {t('Multi-role Benefits Unlocked! 🎉', 'बहु-भूमिका फाइदाहरू अनलक भयो! 🎉')}
              </div>
              <div className="text-sm space-y-1">
                <div>• {t('Switch roles anytime based on demand', 'मागको आधारमा जहिले पनि भूमिका बदल्नुहोस्')}</div>
                <div>• {t('Maximize earnings across seasons', 'मौसमहरूमा आम्दानी अधिकतम गर्नुहोस्')}</div>
                <div>• {t('Access exclusive multi-role features', 'विशेष बहु-भूमिका सुविधाहरू पहुँच गर्नुहोस्')}</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={selectedRoles.length === 0 || isAnimating}
          className="w-full h-12 bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isAnimating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {t('Setting up your roles...', 'तपाईंका भूमिकाहरू सेटअप गर्दै...')}
            </div>
          ) : selectedRoles.length === 0 ? (
            t('Select at least one role to continue', 'जारी राख्न कम्तिमा एक भूमिका चयन गर्नुहोस्')
          ) : (
            <div className="flex items-center gap-2">
              {t('Continue with', 'जारी राख्नुहोस्')} {selectedRoles.length} {t('role(s)', 'भूमिका(हरू)')}
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>

        {/* Cultural Elements */}
        <div className="flex justify-center mt-6 gap-3">
          <div className="text-xl animate-bounce delay-100">🇳🇵</div>
          <div className="text-xl animate-bounce delay-300">🤝</div>
          <div className="text-xl animate-bounce delay-500">💚</div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          {t('You can add or remove roles anytime in settings', 'तपाईं सेटिङहरूमा जहिले पनि भूमिकाहरू थप्न वा हटाउन सक्नुहुन्छ')}
        </p>
      </div>
    </div>
  );
}