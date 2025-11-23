import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, ShoppingCart, MapPin, Star, Clock, Truck, Package, ArrowRight, RefreshCw, Zap, Leaf, Award, Users, Bell, Eye, Camera, Mic, Share2, Bookmark, ThumbsUp, MessageCircle, TrendingUp, Gift, Target, Compass, Sparkles, ShoppingBag, Phone, Map, Home, User as UserIcon, Globe, Calendar, Grid, List, Settings, ChevronRight, ChevronDown, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { User, Language } from '../App';
import { SupabaseClient } from '@supabase/supabase-js';
import { EnhancedCartSystem } from './EnhancedCartSystem';
import { LiveOrderTracking } from './LiveOrderTracking';
import OrderManager, { Order } from '../utils/orderManagement';
import { motion } from 'motion/react';

interface ConsumerAppProps {
  user: User;
  language: Language;
  accessToken: string | null;
  supabase: SupabaseClient;
}

interface Product {
  id: string;
  name: string;
  nameNepali: string;
  farmer: string;
  farmerNepali: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  rating: number;
  reviewCount: number;
  distance: string;
  image: string;
  verified: boolean;
  fresh: boolean;
  organic?: boolean;
  category: string;
  description: string;
  stock: number;
  deliveryTime: string;
  farmLocation: string;
  certification?: string[];
  healthBenefits?: string[];
  storageInstructions?: string;
  nutritionInfo?: {
    calories: number;
    protein: number;
    fiber: number;
    vitamins: string[];
  };
}

interface Farmer {
  id: string;
  name: string;
  nameNepali: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  specialties: string[];
  totalProducts: number;
  joinedDate: string;
  bio: string;
  certifications: string[];
}

export function ConsumerApp({ user, language, accessToken, supabase }: ConsumerAppProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [showFarmerProfile, setShowFarmerProfile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Load user orders and favorites
  useEffect(() => {
    const loadData = () => {
      const orders = OrderManager.getUserOrders(user.id);
      setUserOrders(orders);
      
      // Load favorites from localStorage
      const savedFavorites = localStorage.getItem(`kisanconnect:favorites:${user.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    };
    loadData();
    
    // Refresh orders every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [user.id]);

  const toggleFavorite = (productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    setFavorites(newFavorites);
    localStorage.setItem(`kisanconnect:favorites:${user.id}`, JSON.stringify(newFavorites));
  };

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Fresh Tomatoes',
      nameNepali: 'ताजा गोलभेंडा',
      farmer: 'Ram Bahadur',
      farmerNepali: 'राम बहादुर',
      price: 'रु. 80/kg',
      priceNum: 80,
      originalPrice: 'रु. 100/kg',
      rating: 4.8,
      reviewCount: 156,
      distance: '2.5 km',
      image: 'https://images.unsplash.com/photo-1546470427-e5869c9b1b0e?w=400',
      verified: true,
      fresh: true,
      organic: true,
      category: 'vegetables',
      description: 'Premium quality tomatoes grown using organic farming methods. Rich in vitamins and antioxidants.',
      stock: 50,
      deliveryTime: '30 mins',
      farmLocation: 'Lalitpur, Nepal',
      certification: ['Organic Certified', 'Nepal Good Agricultural Practice'],
      healthBenefits: ['Rich in Vitamin C', 'High in Antioxidants', 'Good for Heart Health'],
      storageInstructions: 'Store in cool, dry place. Best consumed within 3-4 days.',
      nutritionInfo: {
        calories: 18,
        protein: 0.9,
        fiber: 1.2,
        vitamins: ['Vitamin C', 'Vitamin K', 'Folate']
      }
    },
    {
      id: '2',
      name: 'Organic Carrots',
      nameNepali: 'जैविक गाजर',
      farmer: 'Sita Devi',
      farmerNepali: 'सीता देवी',
      price: 'रु. 60/kg',
      priceNum: 60,
      originalPrice: 'रु. 75/kg',
      rating: 4.9,
      reviewCount: 203,
      distance: '1.8 km',
      image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400',
      verified: true,
      fresh: true,
      organic: true,
      category: 'vegetables',
      description: 'Sweet and crunchy organic carrots, perfect for salads, cooking, or juicing.',
      stock: 30,
      deliveryTime: '25 mins',
      farmLocation: 'Bhaktapur, Nepal',
      certification: ['Organic Certified'],
      healthBenefits: ['High in Beta Carotene', 'Good for Eye Health', 'Rich in Fiber'],
      storageInstructions: 'Store in refrigerator. Can be stored for up to 2 weeks.',
      nutritionInfo: {
        calories: 41,
        protein: 0.9,
        fiber: 2.8,
        vitamins: ['Vitamin A', 'Vitamin K', 'Vitamin B6']
      }
    },
    {
      id: '3',
      name: 'Fresh Spinach',
      nameNepali: 'ताजा पालुङ्गो',
      farmer: 'Krishna Sharma',
      farmerNepali: 'कृष्ण शर्मा',
      price: 'रु. 40/bundle',
      priceNum: 40,
      rating: 4.7,
      reviewCount: 89,
      distance: '3.2 km',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
      verified: true,
      fresh: true,
      organic: false,
      category: 'vegetables',
      description: 'Fresh spinach leaves, perfect for cooking traditional Nepali dishes.',
      stock: 25,
      deliveryTime: '35 mins',
      farmLocation: 'Kathmandu, Nepal',
      certification: ['Good Agricultural Practice'],
      healthBenefits: ['High in Iron', 'Rich in Vitamins', 'Good for Blood Health'],
      storageInstructions: 'Wrap in damp cloth and refrigerate. Use within 2-3 days.',
      nutritionInfo: {
        calories: 23,
        protein: 2.9,
        fiber: 2.2,
        vitamins: ['Vitamin K', 'Vitamin A', 'Folate']
      }
    },
    {
      id: '4',
      name: 'Red Onions',
      nameNepali: 'रातो प्याज',
      farmer: 'Devi Maya',
      farmerNepali: 'देवी माया',
      price: 'रु. 90/kg',
      priceNum: 90,
      rating: 4.6,
      reviewCount: 134,
      distance: '4.1 km',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
      verified: true,
      fresh: true,
      organic: false,
      category: 'vegetables',
      description: 'High-quality red onions with rich flavor, essential for cooking.',
      stock: 40,
      deliveryTime: '40 mins',
      farmLocation: 'Kavre, Nepal',
      certification: ['Quality Assured'],
      healthBenefits: ['Anti-inflammatory', 'Rich in Antioxidants', 'Supports Immunity'],
      storageInstructions: 'Store in cool, dry place. Can be stored for several weeks.',
      nutritionInfo: {
        calories: 40,
        protein: 1.1,
        fiber: 1.7,
        vitamins: ['Vitamin C', 'Vitamin B6', 'Folate']
      }
    }
  ];

  const mockFarmers: Farmer[] = [
    {
      id: '1',
      name: 'Ram Bahadur',
      nameNepali: 'राम बहादुर',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.8,
      reviewCount: 234,
      location: 'Lalitpur, Nepal',
      verified: true,
      specialties: ['Organic Vegetables', 'Tomatoes', 'Peppers'],
      totalProducts: 12,
      joinedDate: '2022-03-15',
      bio: 'Experienced organic farmer with 15+ years of experience. Specializes in premium quality vegetables using sustainable farming practices.',
      certifications: ['Organic Certified', 'Nepal Good Agricultural Practice', 'Sustainable Farming Award 2023']
    },
    {
      id: '2',
      name: 'Sita Devi',
      nameNepali: 'सीता देवी',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 4.9,
      reviewCount: 189,
      location: 'Bhaktapur, Nepal',
      verified: true,
      specialties: ['Root Vegetables', 'Carrots', 'Radish'],
      totalProducts: 8,
      joinedDate: '2021-11-20',
      bio: 'Dedicated to providing the freshest vegetables to our community. Known for exceptional carrot quality and customer service.',
      certifications: ['Organic Certified', 'Women Farmer Excellence Award']
    }
  ];

  const categories = [
    { id: 'all', name: t('All', 'सबै'), icon: Grid },
    { id: 'vegetables', name: t('Vegetables', 'तरकारी'), icon: Leaf },
    { id: 'fruits', name: t('Fruits', 'फलफूल'), icon: Gift },
    { id: 'grains', name: t('Grains', 'अनाज'), icon: Package },
    { id: 'dairy', name: t('Dairy', 'दुग्ध उत्पादन'), icon: Users },
    { id: 'spices', name: t('Spices', 'मसला'), icon: Sparkles },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'preparing':
      case 'prepared':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'picked_up':
      case 'in_transit':
      case 'nearby':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const trackOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowOrderTracking(true);
  };

  const viewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowOrderDetails(true);
  };

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const viewFarmerProfile = (farmerId: string) => {
    const farmer = mockFarmers.find(f => f.id === farmerId);
    if (farmer) {
      setSelectedFarmer(farmer);
      setShowFarmerProfile(true);
    }
  };

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.nameNepali.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.priceNum >= priceRange[0] && product.priceNum <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.priceNum - b.priceNum;
        case 'price_high':
          return b.priceNum - a.priceNum;
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'newest':
          return b.id.localeCompare(a.id);
        default: // popularity
          return b.reviewCount - a.reviewCount;
      }
    });

  return (
    <div className="pb-20 bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-orange-50/30 dark:from-gray-900 dark:via-emerald-900/5 dark:to-orange-900/5">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Enhanced Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-5 h-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t-2 border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
              {[
                { value: 'home', icon: Home, label: t('Home', 'होम') },
                { value: 'marketplace', icon: ShoppingBag, label: t('Shop', 'पसल') },
                { value: 'orders', icon: Package, label: t('Orders', 'अर्डर'), badge: userOrders.filter(o => ['confirmed', 'preparing', 'in_transit'].includes(o.status)).length },
                { value: 'favorites', icon: Heart, label: t('Favorites', 'मनपर्ने'), badge: favorites.length },
                { value: 'profile', icon: UserIcon, label: t('Profile', 'प्रोफाइल') },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col gap-1 h-full data-[state=active]:text-emerald-600 relative group transition-all duration-300 hover:scale-105"
                >
                  <tab.icon className="h-4 w-4 group-hover:animate-bounce" />
                  <span className="text-xs">{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse">
                      {tab.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Enhanced Home Tab */}
        <TabsContent value="home" className="mt-0">
          <div className="p-4 space-y-6">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-emerald-500 via-green-500 to-orange-500 text-white border-0 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-green-600/20 to-orange-600/20 backdrop-blur-sm"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold mb-1">
                        {t('नमस्ते', 'Namaste')} {user.name}! 🛒
                      </h2>
                      <p className="text-white/90 text-sm">
                        {t('Fresh produce from local farmers delivered to your door', 'स्थानीय किसानहरूबाट ताजा उत्पादन तपाईंको ढोकामा')}
                      </p>
                    </div>
                    <div className="text-4xl animate-bounce">🥕</div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{filteredProducts.length}</p>
                      <p className="text-xs text-white/80">{t('Products', 'उत्पादनहरू')}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{mockFarmers.length}</p>
                      <p className="text-xs text-white/80">{t('Farmers', 'किसानहरू')}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">30</p>
                      <p className="text-xs text-white/80">{t('Min Delivery', 'मिनेट डेलिभरी')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('Search for vegetables, fruits, farmers...', 'तरकारी, फलफूल, किसान खोज्नुहोस्...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="h-12 w-12 bg-emerald-500 hover:bg-emerald-600 shadow-lg relative"
                  onClick={() => setShowCart(true)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">{t('Category', 'श्रेणी')}</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t('Sort by', 'क्रमबद्ध गर्नुहोस्')}</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="popularity">{t('Popularity', 'लोकप्रियता')}</SelectItem>
                            <SelectItem value="price_low">{t('Price: Low to High', 'मूल्य: कम देखि बढी')}</SelectItem>
                            <SelectItem value="price_high">{t('Price: High to Low', 'मूल्य: बढी देखि कम')}</SelectItem>
                            <SelectItem value="rating">{t('Rating', 'मूल्याङ्कन')}</SelectItem>
                            <SelectItem value="distance">{t('Distance', 'दूरी')}</SelectItem>
                            <SelectItem value="newest">{t('Newest', 'नयाँ')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">{t('Price Range', 'मूल्य दायरा')}</Label>
                      <div className="mt-2 px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={1000}
                          step={10}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>रु. {priceRange[0]}</span>
                          <span>रु. {priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('Categories', 'श्रेणीहरू')}</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('marketplace')}>
                  {t('View All', 'सबै हेर्नुहोस्')}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {categories.slice(1, 7).map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setActiveTab('marketplace');
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <category.icon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                        <p className="text-sm font-medium">{category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {mockProducts.filter(p => p.category === category.id).length} {t('items', 'वस्तुहरू')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Featured Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('Featured Products', 'विशेष उत्पादनहरू')}</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('marketplace')}>
                  {t('View All', 'सबै हेर्नुहोस्')}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                          onClick={() => viewProductDetails(product)}
                        />
                        <div className="absolute top-2 left-2 flex gap-1">
                          {product.verified && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              <Award className="h-2 w-2 mr-1" />
                              {t('Verified', 'प्रमाणित')}
                            </Badge>
                          )}
                          {product.organic && (
                            <Badge className="bg-green-500 text-white text-xs">
                              <Leaf className="h-2 w-2 mr-1" />
                              {t('Organic', 'जैविक')}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                        >
                          <Heart 
                            className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                          />
                        </Button>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm mb-1 line-clamp-1">
                          {language === 'ne' ? product.nameNepali : product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {language === 'ne' ? product.farmerNepali : product.farmer}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{product.rating}</span>
                            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{product.distance}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-emerald-600">{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through ml-1">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>
                          <Button size="sm" className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600">
                            <Plus className="h-3 w-3 mr-1" />
                            {t('Add', 'थप्नुहोस्')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Top Farmers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('Top Farmers', 'शीर्ष किसानहरू')}</h3>
                <Button variant="ghost" size="sm">
                  {t('View All', 'सबै हेर्नुहोस्')}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {mockFarmers.slice(0, 3).map((farmer, index) => (
                  <motion.div
                    key={farmer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                      onClick={() => viewFarmerProfile(farmer.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={farmer.avatar} alt={farmer.name} />
                            <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{language === 'ne' ? farmer.nameNepali : farmer.name}</h4>
                              {farmer.verified && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  <Award className="h-2 w-2 mr-1" />
                                  {t('Verified', 'प्रमाणित')}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{farmer.rating}</span>
                                <span>({farmer.reviewCount})</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{farmer.location}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {farmer.specialties.join(', ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{farmer.totalProducts}</p>
                            <p className="text-xs text-muted-foreground">{t('products', 'उत्पादनहरू')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Orders Summary */}
            {userOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t('Recent Orders', 'हालका अर्डरहरू')}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                        {t('View All', 'सबै हेर्नुहोस्')}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userOrders.slice(0, 2).map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">#{order.id}</p>
                              <p className="text-xs text-muted-foreground">
                                {order.items.length} {t('items', 'वस्तुहरू')} • रु. {order.total}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {t(order.status, order.status)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-1 h-6 text-xs"
                              onClick={() => trackOrder(order.id)}
                            >
                              {t('Track', 'ट्र्याक गर्नुहोस्')}
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>

        {/* Enhanced Marketplace Tab */}
        <TabsContent value="marketplace" className="mt-0">
          <div className="p-4 space-y-4">
            {/* Header with Search and View Toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('Marketplace', 'बजार')}</h2>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('Search products...', 'उत्पादनहरू खोज्नुहोस्...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t(`${filteredProducts.length} products found`, `${filteredProducts.length} उत्पादनहरू फेला परे`)}</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">{t('Popular', 'लोकप्रिय')}</SelectItem>
                  <SelectItem value="price_low">{t('Price ↑', 'मूल्य ↑')}</SelectItem>
                  <SelectItem value="price_high">{t('Price ↓', 'मूल्य ↓')}</SelectItem>
                  <SelectItem value="rating">{t('Rating', 'मूल्याङ्कन')}</SelectItem>
                  <SelectItem value="distance">{t('Distance', 'दूरी')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">{t('No products found', 'कुनै उत्पादन फेला परेन')}</h4>
                  <p className="text-muted-foreground mb-4">
                    {t('Try adjusting your search or filters', 'आफ्नो खोज वा फिल्टर परिवर्तन गर्ने प्रयास गर्नुहोस्')}
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange([0, 1000]);
                  }}>
                    {t('Reset Filters', 'फिल्टर रिसेट गर्नुहोस्')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-4">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                            onClick={() => viewProductDetails(product)}
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            {product.verified && (
                              <Badge className="bg-blue-500 text-white text-xs">
                                <Award className="h-2 w-2 mr-1" />
                                {t('Verified', 'प्रमाणित')}
                              </Badge>
                            )}
                            {product.organic && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <Leaf className="h-2 w-2 mr-1" />
                                {t('Organic', 'जैविक')}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(product.id);
                            }}
                          >
                            <Heart 
                              className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                            />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-1">
                            {language === 'ne' ? product.nameNepali : product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {language === 'ne' ? product.farmerNepali : product.farmer}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating}</span>
                              <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{product.distance}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-bold text-emerald-600 text-lg">{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  {product.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-orange-600">
                              <Clock className="h-3 w-3" />
                              <span>{product.deliveryTime}</span>
                            </div>
                          </div>
                          <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {t('Add to Cart', 'कार्टमा थप्नुहोस्')}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-20 h-20 rounded-lg object-cover"
                              onClick={() => viewProductDetails(product)}
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{language === 'ne' ? product.nameNepali : product.name}</h4>
                                  <p className="text-sm text-muted-foreground">{language === 'ne' ? product.farmerNepali : product.farmer}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm">{product.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      <span>{product.distance}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-orange-600">
                                      <Clock className="h-3 w-3" />
                                      <span>{product.deliveryTime}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleFavorite(product.id)}
                                    >
                                      <Heart 
                                        className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                                      />
                                    </Button>
                                  </div>
                                  <p className="font-bold text-emerald-600">{product.price}</p>
                                  {product.originalPrice && (
                                    <p className="text-sm text-muted-foreground line-through">
                                      {product.originalPrice}
                                    </p>
                                  )}
                                  <Button size="sm" className="mt-2 bg-emerald-500 hover:bg-emerald-600">
                                    <Plus className="h-3 w-3 mr-1" />
                                    {t('Add', 'थप्नुहोस्')}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </div>
        </TabsContent>

        {/* Enhanced Orders Tab */}
        <TabsContent value="orders" className="mt-0">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('My Orders', 'मेरा अर्डरहरू')}</h2>
              <Badge className="bg-emerald-100 text-emerald-800">
                {userOrders.length} {t('total orders', 'कुल अर्डर')}
              </Badge>
            </div>

            {userOrders.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">{t('No orders yet', 'अहिलेसम्म कुनै अर्डर छैन')}</h4>
                  <p className="text-muted-foreground mb-4">
                    {t('Start shopping to see your orders here', 'यहाँ आफ्ना अर्डरहरू हेर्न खरिदारी सुरु गर्नुहोस्')}
                  </p>
                  <Button onClick={() => setActiveTab('marketplace')} className="bg-emerald-500 hover:bg-emerald-600">
                    {t('Start Shopping', 'खरिदारी सुरु गर्नुहोस्')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">#{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} {t('items', 'वस्तुहरू')}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {t(order.status, order.status)}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-muted-foreground">{item.quantity} x रु. {item.price}</p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-muted-foreground pl-13">
                              +{order.items.length - 2} {t('more items', 'थप वस्तुहरू')}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <p className="font-bold text-lg">{t('Total', 'कुल')}: रु. {order.total}</p>
                            {order.deliveryAddress && (
                              <p className="text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {order.deliveryAddress}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewOrderDetails(order.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {t('Details', 'विवरण')}
                            </Button>
                            {['confirmed', 'preparing', 'in_transit'].includes(order.status) && (
                              <Button
                                size="sm"
                                onClick={() => trackOrder(order.id)}
                                className="bg-emerald-500 hover:bg-emerald-600"
                              >
                                <Truck className="h-3 w-3 mr-1" />
                                {t('Track', 'ट्र्याक गर्नुहोस्')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Enhanced Favorites Tab */}
        <TabsContent value="favorites" className="mt-0">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('My Favorites', 'मेरा मनपर्ने')}</h2>
              <Badge className="bg-red-100 text-red-800">
                {favorites.length} {t('favorites', 'मनपर्ने')}
              </Badge>
            </div>

            {favorites.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">{t('No favorites yet', 'अहिलेसम्म कुनै मनपर्ने छैन')}</h4>
                  <p className="text-muted-foreground mb-4">
                    {t('Heart products you love to find them easily later', 'पछि सजिलै फेला पार्न मनपर्ने उत्पादनहरूलाई मन पराउनुहोस्')}
                  </p>
                  <Button onClick={() => setActiveTab('marketplace')} className="bg-emerald-500 hover:bg-emerald-600">
                    {t('Browse Products', 'उत्पादनहरू ब्राउज गर्नुहोस्')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {mockProducts.filter(product => favorites.includes(product.id)).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                          onClick={() => viewProductDetails(product)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm mb-1">
                          {language === 'ne' ? product.nameNepali : product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {language === 'ne' ? product.farmerNepali : product.farmer}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-600">{product.price}</span>
                          <Button size="sm" className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600">
                            <Plus className="h-3 w-3 mr-1" />
                            {t('Add', 'थप्नुहोस्')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-0">
          <div className="p-4 space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-lg font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.phone}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {t('Consumer', 'उपभोक्ता')}
                      </Badge>
                      {user.verified && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Award className="h-3 w-3 mr-1" />
                          {t('Verified', 'प्रमाणित')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">{userOrders.length}</p>
                    <p className="text-sm text-muted-foreground">{t('Orders', 'अर्डरहरू')}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{favorites.length}</p>
                    <p className="text-sm text-muted-foreground">{t('Favorites', 'मनपर्ने')}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">5</p>
                    <p className="text-sm text-muted-foreground">{t('Reviews', 'समीक्षाहरू')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: MapPin, label: t('Delivery Addresses', 'डेलिभरी ठेगानाहरू'), value: '2 saved' },
                    { icon: Bell, label: t('Notifications', 'सूचनाहरू'), value: 'Enabled', action: true },
                    { icon: Globe, label: t('Language', 'भाषा'), value: language === 'ne' ? 'नेपाली' : 'English' },
                    { icon: Star, label: t('Rate App', 'एप रेटिङ गर्नुहोस्'), value: 'Give feedback' },
                    { icon: Phone, label: t('Support', 'सहायता'), value: 'Contact us' },
                    { icon: Settings, label: t('Settings', 'सेटिङहरू'), value: 'Preferences' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced Cart System */}
      {showCart && (
        <EnhancedCartSystem
          user={user}
          language={language}
          onClose={() => setShowCart(false)}
          onCartUpdate={(count) => setCartItemCount(count)}
        />
      )}

      {/* Order Tracking */}
      {showOrderTracking && selectedOrderId && (
        <LiveOrderTracking
          orderId={selectedOrderId}
          user={user}
          language={language}
          onClose={() => setShowOrderTracking(false)}
          orderData={userOrders.find(o => o.id === selectedOrderId)}
        />
      )}

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          language={language}
          onClose={() => setShowProductDetails(false)}
          onAddToCart={() => {}}
          onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
          isFavorite={favorites.includes(selectedProduct.id)}
        />
      )}

      {/* Farmer Profile Modal */}
      {showFarmerProfile && selectedFarmer && (
        <FarmerProfileModal
          farmer={selectedFarmer}
          language={language}
          onClose={() => setShowFarmerProfile(false)}
        />
      )}
    </div>
  );
}

// Enhanced Product Details Modal
function ProductDetailsModal({ product, language, onClose, onAddToCart, onToggleFavorite, isFavorite }: {
  product: Product;
  language: Language;
  onClose: () => void;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 rounded-t-2xl overflow-hidden"
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {product.verified && (
              <Badge className="bg-blue-500 text-white">
                <Award className="h-3 w-3 mr-1" />
                {t('Verified', 'प्रमाणित')}
              </Badge>
            )}
            {product.organic && (
              <Badge className="bg-green-500 text-white">
                <Leaf className="h-3 w-3 mr-1" />
                {t('Organic', 'जैविक')}
              </Badge>
            )}
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white/80 hover:bg-white"
              onClick={onToggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1">
              {language === 'ne' ? product.nameNepali : product.name}
            </h2>
            <p className="text-muted-foreground">
              {t('by', 'बाट')} {language === 'ne' ? product.farmerNepali : product.farmer}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{product.distance}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">{product.price}</p>
              {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  {product.originalPrice}
                </p>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">{t('Details', 'विवरण')}</TabsTrigger>
              <TabsTrigger value="nutrition">{t('Nutrition', 'पोषण')}</TabsTrigger>
              <TabsTrigger value="reviews">{t('Reviews', 'समीक्षा')}</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{t('Description', 'विवरण')}</h4>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">{t('Farm Information', 'खेत जानकारी')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('Location', 'स्थान')}</span>
                    <span>{product.farmLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Stock', 'स्टक')}</span>
                    <span>{product.stock} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Delivery Time', 'डेलिभरी समय')}</span>
                    <span>{product.deliveryTime}</span>
                  </div>
                </div>
              </div>

              {product.certification && (
                <div>
                  <h4 className="font-medium mb-2">{t('Certifications', 'प्रमाणपत्रहरू')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.certification.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.healthBenefits && (
                <div>
                  <h4 className="font-medium mb-2">{t('Health Benefits', 'स्वास्थ्य फाइदाहरू')}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {product.healthBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4">
              {product.nutritionInfo && (
                <div>
                  <h4 className="font-medium mb-3">{t('Nutritional Information (per 100g)', 'पोषण तथ्याङ्क (प्रति १०० ग्राम)')}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">{product.nutritionInfo.calories}</p>
                      <p className="text-xs text-muted-foreground">{t('Calories', 'क्यालोरी')}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{product.nutritionInfo.protein}g</p>
                      <p className="text-xs text-muted-foreground">{t('Protein', 'प्रोटिन')}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{product.nutritionInfo.fiber}g</p>
                      <p className="text-xs text-muted-foreground">{t('Fiber', 'फाइबर')}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{product.nutritionInfo.vitamins.length}</p>
                      <p className="text-xs text-muted-foreground">{t('Vitamins', 'भिटामिनहरू')}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">{t('Vitamins & Minerals', 'भिटामिन र खनिजहरू')}</h5>
                    <div className="flex flex-wrap gap-2">
                      {product.nutritionInfo.vitamins.map((vitamin, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {vitamin}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {product.storageInstructions && (
                <div>
                  <h4 className="font-medium mb-2">{t('Storage Instructions', 'भण्डारण निर्देशन')}</h4>
                  <p className="text-sm text-muted-foreground">{product.storageInstructions}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t('Reviews feature coming soon!', 'समीक्षा सुविधा चाँडै आउँदैछ!')}
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quantity Selector and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">{t('Quantity', 'मात्रा')}</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Plus className="h-3 w-3 rotate-45" />
                </Button>
                <span className="font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                {t('Close', 'बन्द गर्नुहोस्')}
              </Button>
              <Button
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                onClick={onAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t('Add to Cart', 'कार्टमा थप्नुहोस्')}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Farmer Profile Modal
function FarmerProfileModal({ farmer, language, onClose }: {
  farmer: Farmer;
  language: Language;
  onClose: () => void;
}) {
  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="relative bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white/20">
              <AvatarImage src={farmer.avatar} alt={farmer.name} />
              <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                {farmer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{language === 'ne' ? farmer.nameNepali : farmer.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{farmer.rating}</span>
                  <span className="text-white/80">({farmer.reviewCount})</span>
                </div>
                {farmer.verified && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Award className="h-3 w-3 mr-1" />
                    {t('Verified', 'प्रमाणित')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div>
            <p className="text-muted-foreground">{farmer.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <p className="text-lg font-bold text-emerald-600">{farmer.totalProducts}</p>
              <p className="text-xs text-muted-foreground">{t('Products', 'उत्पादनहरू')}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-lg font-bold text-blue-600">{farmer.reviewCount}</p>
              <p className="text-xs text-muted-foreground">{t('Reviews', 'समीक्षाहरू')}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">{t('Specialties', 'विशेषताहरू')}</h4>
            <div className="flex flex-wrap gap-2">
              {farmer.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">{t('Certifications', 'प्रमाणपत्रहरू')}</h4>
            <div className="space-y-2">
              {farmer.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t('Member since', 'सदस्य भएदेखि')}</span>
              <span>{new Date(farmer.joinedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
              <span>{t('Location', 'स्थान')}</span>
              <span>{farmer.location}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('Message', 'सन्देश')}
            </Button>
            <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
              <Eye className="h-4 w-4 mr-2" />
              {t('View Products', 'उत्पादनहरू हेर्नुहोस्')}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}