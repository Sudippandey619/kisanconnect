import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Users, Truck, Shield, Heart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Language } from '../App';

interface OnboardingScreenProps {
  onComplete: () => void;
  language: Language;
}

const slides = [
  {
    icon: <Leaf className="h-16 w-16 text-emerald-500" />,
    titleEn: 'Welcome to KisanConnect',
    titleNe: 'किसान कनेक्टमा स्वागत छ',
    subtitleEn: 'Connecting Nepal\'s Agricultural Community',
    subtitleNe: 'नेपालको कृषि समुदायलाई जोड्दै',
    descriptionEn: 'Bridge the gap between farmers, consumers, and drivers with smart technology and fair pricing.',
    descriptionNe: 'स्मार्ट प्रविधि र उचित मूल्यका साथ किसान, उपभोक्ता र चालकहरूबीच पुल निर्माण गर्नुहोस्।',
    gradient: 'from-emerald-400 via-green-400 to-emerald-500',
    features: ['स्मार्ट', 'दिगो', 'सामाजिक']
  },
  {
    icon: <Users className="h-16 w-16 text-orange-500" />,
    titleEn: 'Multiple Roles, One Platform',
    titleNe: 'धेरै भूमिका, एउटै प्लेटफर्म',
    subtitleEn: 'Be a Farmer, Consumer & Driver',
    subtitleNe: 'किसान, उपभोक्ता र चालक बन्नुहोस्',
    descriptionEn: 'Switch seamlessly between roles. Sell your crops as a farmer, buy fresh produce as a consumer, or earn by delivering as a driver.',
    descriptionNe: 'भूमिकाहरू बीच सजिलै बदल्नुहोस्। किसानको रूपमा बाली बेच्नुहोस्, उपभोक्ताको रूपमा ताजा उत्पादन किन्नुहोस्, वा चालकको रूपमा डेलिभरी गरेर कमाउनुहोस्।',
    gradient: 'from-orange-400 via-amber-400 to-orange-500',
    features: ['🌾 किसान', '🛒 उपभोक्ता', '🚚 चालक']
  },
  {
    icon: <Shield className="h-16 w-16 text-blue-500" />,
    titleEn: 'Fair & Transparent',
    titleNe: 'निष्पक्ष र पारदर्शी',
    subtitleEn: 'Direct Trade, Fair Prices',
    subtitleNe: 'प्रत्यक्ष व्यापार, उचित मूल्य',
    descriptionEn: 'Eliminate middlemen. Farmers set their own prices, consumers get fresh produce, and everyone benefits from transparent trading.',
    descriptionNe: 'बिचौलियाहरू हटाउनुहोस्। किसानहरूले आफ्नै मूल्य निर्धारण गर्छन्, उपभोक्ताहरूले ताजा उत्पादन पाउँछन्, र सबैले पारदर्शी व्यापारबाट फाइदा उठाउँछन्।',
    gradient: 'from-blue-400 via-indigo-400 to-blue-500',
    features: ['पारदर्शी', 'उचित', 'प्रत्यक्ष']
  },
  {
    icon: <Heart className="h-16 w-16 text-red-500" />,
    titleEn: 'Built for Nepal',
    titleNe: 'नेपालका लागि निर्मित',
    subtitleEn: 'Cultural Values, Modern Technology',
    subtitleNe: 'सांस्कृतिक मूल्य, आधुनिक प्रविधि',
    descriptionEn: 'Designed with Nepali culture in mind. Get guidance from our friendly chatbot and enjoy bilingual support throughout your journey.',
    descriptionNe: 'नेपाली संस्कृतिलाई ध्यानमा राखेर डिजाइन गरिएको। हाम्रो मित्रवत् च्याटबटबाट मार्गदर्शन पाउनुहोस् र आफ्नो यात्रामा द्विभाषी समर्थनको आनन्द लिनुहोस्।',
    gradient: 'from-red-400 via-pink-400 to-red-500',
    features: ['नेपाली', 'सांस्कृतिक', 'आधुनिक']
  }
];

export function OnboardingScreen({ onComplete, language }: OnboardingScreenProps) {
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

  const skipToEnd = () => {
    onComplete();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        nextSlide();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
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
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <Card className={`p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl transform transition-all duration-500 ${
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
                className="bg-gradient-to-r from-emerald-100 to-orange-100 dark:from-emerald-900 dark:to-orange-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 px-3 py-1"
              >
                {feature}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={nextSlide}
              className="w-full bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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

            {currentSlide < slides.length - 1 && (
              <Button 
                onClick={skipToEnd}
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {t('Skip Introduction', 'परिचय छोड्नुहोस्')}
              </Button>
            )}
          </div>
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