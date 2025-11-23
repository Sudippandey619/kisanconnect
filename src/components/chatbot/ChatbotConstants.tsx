import { Language } from '../../App';
import { Language } from '../../App';

export const getChatbotConstants = (language: Language) => {
  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  return {
    quickReplies: [
      { 
        id: 'prices', 
        text: t('Today\'s Prices', 'आजका भाउ'), 
        icon: '💰',
        description: t('Get current market prices', 'हालको बजार भाउ')
      },
      { 
        id: 'how_to_buy', 
        text: t('How to Buy', 'कसरी किन्ने?'), 
        icon: '🛒',
        description: t('Learn how to purchase', 'किन्ने तरिका सिक्नुहोस्')
      },
      { 
        id: 'how_to_sell', 
        text: t('How to Sell', 'कसरी बेच्ने?'), 
        icon: '🌾',
        description: t('Learn how to sell crops', 'फसल बेच्ने तरिका')
      },
      { 
        id: 'delivery_help', 
        text: t('Delivery Info', 'डेलिभरी जानकारी'), 
        icon: '🚚',
        description: t('Delivery and tracking info', 'डेलिभरी र ट्र्याकिङ')
      },
      { 
        id: 'farmer_support', 
        text: t('Farmer Support', 'किसान सहयोग'), 
        icon: '👨‍🌾',
        description: t('Support for farmers', 'किसानहरूका लागी सहयोग')
      },
      { 
        id: 'app_help', 
        text: t('App Guide', 'एप्प गाइड'), 
        icon: '📱',
        description: t('How to use the app', 'एप्प कसरी प्रयोग गर्ने')
      }
    ],

    priceData: [
      { item: t('Tomatoes', 'गोलभेंडा'), price: '80-90', unit: t('per kg', 'प्रति के.जी.'), trend: 'up' },
      { item: t('Carrots', 'गाजर'), price: '60-70', unit: t('per kg', 'प्रति के.जी.'), trend: 'stable' },
      { item: t('Potatoes', 'आलु'), price: '40-50', unit: t('per kg', 'प्रति के.जी.'), trend: 'down' },
      { item: t('Onions', 'प्याज'), price: '90-100', unit: t('per kg', 'प्रति के.जी.'), trend: 'up' },
      { item: t('Apples', 'स्याउ'), price: '180-220', unit: t('per kg', 'प्रति के.जी.'), trend: 'stable' },
      { item: t('Bananas', 'केरा'), price: '120-140', unit: t('per dozen', 'प्रति दर्जन'), trend: 'stable' }
    ],

    welcomeMessage: t(
      `🙏 Namaste! I'm Nepali Babu, your KisanConnect assistant with Dhaka Topi and a warm smile! How can I help you today?`,
      `🙏 नमस्ते! म नेपाली बाबु हुँ, ढाका टोपी र न्यानो मुस्कानका साथ तपाईंको KisanConnect सहायक! आज म कसरी मद्दत गर्न सक्छु?`
    )
  };
};