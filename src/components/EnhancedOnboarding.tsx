import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Leaf, Users, Truck, Heart, Star, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Language } from '../App';

interface EnhancedOnboardingProps {
  onComplete: () => void;
  language: Language;
}

const slides = [
  {
    icon: <Leaf className="h-16 w-16 text-white" />,
    titleEn: 'Buy Fresh, Pay Fair',
    titleNe: 'ताजा किन्नुहोस्, उचित तिर्नुहोस्',
    subtitleEn: 'Direct from Farm to Your Home',
    subtitleNe: 'खेतबाट सिधै तपाईंको घरमा',
    descriptionEn: 'Get fresh vegetables and fruits directly from verified farmers. No middlemen, fair prices for everyone.',
    descriptionNe: 'प्रमाणित किसानहरूबाट सिधै ताजा तरकारी र फलफूल पाउनुहोस्। कुनै बिचौलिया छैन, सबैका लागि उचित मूल्य।',
    gradient: 'from-emerald-400 via-green-400 to-emerald-500',
    bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
    features: ['ताजा उत्पादन', 'उचित मूल्य', 'प्रत्यक्ष खरिद']
  },
  {
    icon: <Users className="h-16 w-16 text-white" />,
    titleEn: 'Farmers Earn More',
    titleNe: 'किसानहरूले धेरै कमाउँछन्',
    subtitleEn: 'Set Your Own Prices',
    subtitleNe: 'आफ्नै मूल्य निर्धारण गर्नुहोस्',
    descriptionEn: 'Farmers can sell directly to consumers, set their own prices, and earn 40% more than traditional markets.',
    descriptionNe: 'किसानहरूले उपभोक्ताहरूलाई सिधै बेच्न, आफ्नै मूल्य तोक्न र परम्परागत बजार भन्दा ४०% बढी कमाउन सक्छन्।',
    gradient: 'from-orange-400 via-amber-400 to-orange-500',
    bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
    features: ['आफ्नै मूल्य', '४०% बढी कमाई', 'प्रत्यक्ष बिक्री']
  },
  {
    icon: <Truck className="h-16 w-16 text-white" />,
    titleEn: 'Fast Delivery',
    titleNe: 'छिटो डेलिभरी',
    subtitleEn: 'Same Day Delivery',
    subtitleNe: 'सोही दिन डेलिभरी',
    descriptionEn: 'Lightning-fast delivery within Kathmandu Valley. Track your orders in real-time with GPS.',
    descriptionNe: 'काठमाडौं उपत्यका भित्र अति छिटो डेलिभरी। GPS को साथ आफ्नो अर्डर वास्तविक समयमा ट्र्याक गर्नुहोस्।',
    gradient: 'from-blue-400 via-indigo-400 to-blue-500',
    bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    features: ['२-४ घण्टा', 'GPS ट्र्याकिङ', 'सुरक्षित डेलिभरी']
  }
];

export function EnhancedOnboarding({ onComplete, language }: EnhancedOnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        onComplete();
      }
      setIsAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isAnimating || currentSlide === 0) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentSlide(currentSlide - 1);
      setIsAnimating(false);
    }, 300);
  };

  const skipToEnd = () => {
    onComplete();
  };

  // Optional auto-advance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        nextSlide();
      }
    }, 5000); // 5 seconds per slide

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br ${slide.bgGradient}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-orange-200/30 dark:bg-orange-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-200/30 dark:bg-green-800/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Progress Indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentSlide 
                    ? 'w-8 bg-gradient-to-r from-emerald-500 to-orange-500' 
                    : index < currentSlide
                    ? 'w-6 bg-emerald-400'
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <Card className={`p-8 text-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 shadow-2xl transform transition-all duration-500 ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}>
          {/* Icon with Gradient Background */}
          <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300`}>
            {slide.icon}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-green-600 to-orange-600 bg-clip-text text-transparent">
            {t(slide.titleEn, slide.titleNe)}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 font-medium">
            {t(slide.subtitleEn, slide.subtitleNe)}
          </p>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {t(slide.descriptionEn, slide.descriptionNe)}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {slide.features.map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="bg-gradient-to-r from-emerald-100 to-orange-100 dark:from-emerald-900/40 dark:to-orange-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 px-3 py-1"
              >
                {feature}
              </Badge>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mb-4">
            {currentSlide > 0 && (
              <Button 
                onClick={prevSlide}
                variant="outline"
                className="flex-1 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('Back', 'पछाडि')}
              </Button>
            )}
            
            <Button 
              onClick={nextSlide}
              className={`${currentSlide === 0 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              size="lg"
            >
              <span className="mr-2">
                {currentSlide === slides.length - 1 
                  ? t('Get Started', 'सुरु गर्नुहोस्')
                  : t('Continue', 'जारी राख्नुहोस्')
                }
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Skip Button */}
          {currentSlide < slides.length - 1 && (
            <Button 
              onClick={skipToEnd}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {t('Skip Introduction', 'परिचय छोड्नुहोस्')}
            </Button>
          )}
        </Card>

        {/* Cultural Elements */}
        <div className="flex justify-center mt-6 gap-4">
          <div className="text-2xl animate-bounce delay-100">🏔️</div>
          <div className="text-2xl animate-bounce delay-300">🌾</div>
          <div className="text-2xl animate-bounce delay-500">🏡</div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          {t('Proudly made in Nepal', 'नेपालमा गर्वका साथ निर्मित')} 🇳🇵
        </p>
      </div>
    </div>
  );
}