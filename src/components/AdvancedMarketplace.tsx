import React, { useState, useEffect } from 'react';
import { Search, Filter, Zap, TrendingUp, Clock, Star, MapPin, Calendar, Package, Target, Brain, Sparkles, Timer, Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { User, Language } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  nameNepali: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  stock: number;
  minOrder: number;
  maxOrder?: number;
  quality: 'premium' | 'standard' | 'organic';
  certifications: string[];
  rating: number;
  reviews: number;
  freshnessScore: number;
  harvestDate: string;
  estimatedShelfLife: number;
  images: string[];
  description: string;
  descriptionNepali: string;
  isAuction: boolean;
  auctionEndTime?: string;
  currentBid?: number;
  minimumBid?: number;
  bulkPricing?: { quantity: number; price: number }[];
  tags: string[];
  seasonality: string[];
  trending: boolean;
  aiRecommended: boolean;
}

interface AuctionItem {
  id: string;
  product: Product;
  startTime: string;
  endTime: string;
  currentBid: number;
  minimumBid: number;
  bidIncrement: number;
  totalBids: number;
  highestBidder?: string;
  status: 'active' | 'ending_soon' | 'ended';
}

interface SubscriptionBox {
  id: string;
  name: string;
  nameNepali: string;
  description: string;
  descriptionNepali: string;
  price: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  contents: string[];
  farmersIncluded: number;
  rating: number;
  subscribers: number;
  image: string;
  customizable: boolean;
}

interface BulkOrder {
  id: string;
  productId: string;
  productName: string;
  targetQuantity: number;
  currentQuantity: number;
  pricePerUnit: number;
  discountPercent: number;
  endTime: string;
  participants: number;
  minimumParticipants: number;
  status: 'active' | 'fulfilled' | 'cancelled';
}

interface Props {
  user: User;
  language: Language;
  onProductSelect: (product: Product) => void;
}

export const AdvancedMarketplace: React.FC<Props> = ({ user, language, onProductSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod_1',
      name: 'Organic Tomatoes',
      nameNepali: 'जैविक गोलभेडा',
      category: 'vegetables',
      price: 120,
      originalPrice: 150,
      unit: 'kg',
      farmerId: 'farmer_1',
      farmerName: 'राम बहादुर श्रेष्ठ',
      farmerLocation: 'काभ्रेपलाञ्चोक',
      stock: 45,
      minOrder: 1,
      maxOrder: 10,
      quality: 'organic',
      certifications: ['organic', 'pesticide-free'],
      rating: 4.8,
      reviews: 127,
      freshnessScore: 95,
      harvestDate: new Date(Date.now() - 86400000).toISOString(),
      estimatedShelfLife: 7,
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'],
      description: 'Fresh organic tomatoes, perfect for cooking',
      descriptionNepali: 'ताजा जैविक गोलभेडा, खाना पकाउनको लागि उत्तम',
      isAuction: false,
      bulkPricing: [
        { quantity: 5, price: 115 },
        { quantity: 10, price: 110 }
      ],
      tags: ['fresh', 'local', 'organic'],
      seasonality: ['spring', 'summer'],
      trending: true,
      aiRecommended: true
    },
    {
      id: 'prod_2',
      name: 'Premium Basmati Rice',
      nameNepali: 'प्रिमियम बासमती चामल',
      category: 'grains',
      price: 180,
      unit: 'kg',
      farmerId: 'farmer_2',
      farmerName: 'सीता देवी पौडेल',
      farmerLocation: 'चितवन',
      stock: 200,
      minOrder: 5,
      quality: 'premium',
      certifications: ['quality-assured'],
      rating: 4.9,
      reviews: 89,
      freshnessScore: 100,
      harvestDate: new Date(Date.now() - 2592000000).toISOString(),
      estimatedShelfLife: 365,
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
      description: 'Premium quality basmati rice with excellent aroma',
      descriptionNepali: 'उत्कृष्ट सुगन्धको साथ प्रिमियम गुणस्तरको बासमती चामल',
      isAuction: true,
      auctionEndTime: new Date(Date.now() + 3600000).toISOString(),
      currentBid: 175,
      minimumBid: 160,
      bulkPricing: [
        { quantity: 25, price: 170 },
        { quantity: 50, price: 165 }
      ],
      tags: ['premium', 'aromatic', 'long-grain'],
      seasonality: ['all-year'],
      trending: false,
      aiRecommended: true
    }
  ]);

  const [auctions, setAuctions] = useState<AuctionItem[]>([
    {
      id: 'auction_1',
      product: products[1],
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      currentBid: 175,
      minimumBid: 160,
      bidIncrement: 5,
      totalBids: 12,
      highestBidder: 'user_123',
      status: 'active'
    }
  ]);

  const [subscriptionBoxes] = useState<SubscriptionBox[]>([
    {
      id: 'sub_1',
      name: 'Fresh Veggie Box',
      nameNepali: 'ताजा तरकारी बक्स',
      description: 'Weekly selection of fresh seasonal vegetables',
      descriptionNepali: 'ताजा मौसमी तरकारीहरूको साप्ताहिक चयन',
      price: 1200,
      frequency: 'weekly',
      contents: ['Tomatoes', 'Potatoes', 'Onions', 'Carrots', 'Leafy Greens'],
      farmersIncluded: 5,
      rating: 4.7,
      subscribers: 234,
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400',
      customizable: true
    }
  ]);

  const [bulkOrders] = useState<BulkOrder[]>([
    {
      id: 'bulk_1',
      productId: 'prod_1',
      productName: 'Organic Tomatoes',
      targetQuantity: 100,
      currentQuantity: 67,
      pricePerUnit: 100,
      discountPercent: 20,
      endTime: new Date(Date.now() + 86400000).toISOString(),
      participants: 23,
      minimumParticipants: 10,
      status: 'active'
    }
  ]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const aiSearchSuggestions = [
    { en: 'Fresh leafy greens for salad', ne: 'सलादको लागि ताजा हरियो पात' },
    { en: 'Organic vegetables under 100 NPR', ne: '१०० रुपैयाँ मुनिका जैविक तरकारीहरू' },
    { en: 'Seasonal fruits from nearby farms', ne: 'नजिकैका फार्महरूबाट मौसमी फलफूल' },
    { en: 'Premium rice varieties', ne: 'प्रिमियम चामलका किस्महरू' }
  ];

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'organic': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return '0h 0m';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleAISearch = (suggestion: { en: string; ne: string }) => {
    setSearchQuery(language === 'en' ? suggestion.en : suggestion.ne);
    toast.success(t('AI search activated!', 'AI खोज सक्रिय गरियो!'));
  };

  const handleBidOnAuction = (auctionId: string, bidAmount: number) => {
    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId 
        ? { ...auction, currentBid: bidAmount, totalBids: auction.totalBids + 1 }
        : auction
    ));
    toast.success(t('Bid placed successfully!', 'बिड सफलतापूर्वक राखियो!'));
  };

  const handleJoinBulkOrder = (bulkOrderId: string, quantity: number) => {
    setBulkOrders(prev => prev.map(order =>
      order.id === bulkOrderId
        ? { 
            ...order, 
            currentQuantity: order.currentQuantity + quantity,
            participants: order.participants + 1
          }
        : order
    ));
    toast.success(t('Joined bulk order!', 'बल्क अर्डरमा सामेल भयो!'));
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Search Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder={t('Search with AI...', 'AI सँग खोज्नुहोस्...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12"
              />
              <Button size="icon" className="absolute right-1 top-1 h-8 w-8 bg-gradient-to-r from-emerald-500 to-orange-500">
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* AI Search Suggestions */}
          <div className="flex flex-wrap gap-2">
            {aiSearchSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleAISearch(suggestion)}
                className="text-xs bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800"
              >
                <Brain className="h-3 w-3 mr-1" />
                {language === 'en' ? suggestion.en : suggestion.ne}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">{t('Category', 'श्रेणी')}</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('All Categories', 'सबै श्रेणीहरू')}</SelectItem>
                    <SelectItem value="vegetables">{t('Vegetables', 'तरकारीहरू')}</SelectItem>
                    <SelectItem value="fruits">{t('Fruits', 'फलफूल')}</SelectItem>
                    <SelectItem value="grains">{t('Grains', 'अन्न')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">{t('Sort By', 'क्रमबद्ध गर्नुहोस्')}</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">{t('AI Relevance', 'AI सान्दर्भिकता')}</SelectItem>
                    <SelectItem value="price_low">{t('Price: Low to High', 'मूल्य: कम देखि उच्च')}</SelectItem>
                    <SelectItem value="price_high">{t('Price: High to Low', 'मूल्य: उच्च देखि कम')}</SelectItem>
                    <SelectItem value="freshness">{t('Freshness Score', 'ताजापन स्कोर')}</SelectItem>
                    <SelectItem value="rating">{t('Customer Rating', 'ग्राहक मूल्याङ्कन')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">{t('Price Range (NPR)', 'मूल्य दायरा (नेरू)')}</label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={5000}
                step={50}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>NPR {priceRange[0]}</span>
                <span>NPR {priceRange[1]}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marketplace Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products" className="text-xs">
            {t('Products', 'उत्पादनहरू')}
          </TabsTrigger>
          <TabsTrigger value="auctions" className="text-xs">
            {t('Auctions', 'नीलामी')}
          </TabsTrigger>
          <TabsTrigger value="bulk" className="text-xs">
            {t('Bulk Orders', 'बल्क अर्डर')}
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="text-xs">
            {t('Subscriptions', 'सदस्यता')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-3">
          {products.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onProductSelect(product)}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="relative">
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    {product.aiRecommended && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-sm">
                        {language === 'en' ? product.name : product.nameNepali}
                      </h3>
                      {product.trending && <TrendingUp className="h-4 w-4 text-orange-500" />}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getQualityColor(product.quality)}>
                        {product.quality}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs">{product.freshnessScore}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-emerald-600">NPR {product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through ml-1">
                            NPR {product.originalPrice}
                          </span>
                        )}
                        <span className="text-xs text-gray-600">/{product.unit}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{product.farmerLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <Package className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {t('Stock:', 'स्टक:')} {product.stock} {product.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="auctions" className="space-y-3">
          {auctions.map((auction) => (
            <Card key={auction.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">
                    {language === 'en' ? auction.product.name : auction.product.nameNepali}
                  </h3>
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                    <Timer className="h-3 w-3 mr-1" />
                    {getTimeRemaining(auction.endTime)}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">{t('Current Bid', 'हालको बिड')}</p>
                    <p className="font-bold text-emerald-600">NPR {auction.currentBid}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">{t('Total Bids', 'कुल बिडहरू')}</p>
                    <p className="font-bold">{auction.totalBids}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">{t('Min Bid', 'न्यूनतम बिड')}</p>
                    <p className="font-medium">NPR {auction.minimumBid}</p>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      {t('Place Bid', 'बिड राख्नुहोस्')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('Place Your Bid', 'तपाईंको बिड राख्नुहोस्')}</DialogTitle>
                      <DialogDescription>
                        {t('Enter your bid amount for this auction', 'यस लिलामीको लागि आफ्नो बिड रकम प्रविष्ट गर्नुहोस्')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          {t('Bid Amount (NPR)', 'बिड रकम (नेरू)')}
                        </label>
                        <Input 
                          type="number" 
                          placeholder={String(auction.currentBid + auction.bidIncrement)}
                          min={auction.currentBid + auction.bidIncrement}
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => handleBidOnAuction(auction.id, auction.currentBid + auction.bidIncrement)}
                      >
                        {t('Confirm Bid', 'बिड पुष्टि गर्नुहोस्')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-3">
          {bulkOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{order.productName}</h3>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                    {order.discountPercent}% {t('OFF', 'छूट')}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t('Progress', 'प्रगति')}</span>
                      <span>{order.currentQuantity}/{order.targetQuantity} kg</span>
                    </div>
                    <Progress value={(order.currentQuantity / order.targetQuantity) * 100} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">{t('Price/kg', 'मूल्य/केजी')}</p>
                      <p className="font-bold text-emerald-600">NPR {order.pricePerUnit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">{t('Participants', 'सहभागीहरू')}</p>
                      <p className="font-bold">{order.participants}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">{t('Time Left', 'बाँकी समय')}</p>
                      <p className="font-medium">{getTimeRemaining(order.endTime)}</p>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        {t('Join Bulk Order', 'बल्क अर्डरमा सामेल हुनुहोस्')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('Join Bulk Order', 'बल्क अर्डरमा सामेल हुनुहोस्')}</DialogTitle>
                        <DialogDescription>
                          {t('Specify quantity to join this bulk order', 'यस बल्क अर्डरमा सामेल हुन मात्रा निर्दिष्ट गर्नुहोस्')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            {t('Quantity (kg)', 'मात्रा (केजी)')}
                          </label>
                          <Input type="number" placeholder="5" min="1" max="20" />
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                          <p className="text-sm">
                            <strong>{t('Your savings:', 'तपाईंको बचत:')}</strong> NPR {(150 - order.pricePerUnit) * 5}
                          </p>
                          <p className="text-xs text-gray-600">
                            {t('vs regular price of NPR 150/kg', 'नियमित मूल्य NPR 150/kg को तुलनामा')}
                          </p>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => handleJoinBulkOrder(order.id, 5)}
                        >
                          {t('Confirm Order', 'अर्डर पुष्टि गर्नुहोस्')}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-3">
          {subscriptionBoxes.map((box) => (
            <Card key={box.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <ImageWithFallback
                    src={box.image}
                    alt={box.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">
                        {language === 'en' ? box.name : box.nameNepali}
                      </h3>
                      <Badge variant="secondary">
                        {box.frequency}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {language === 'en' ? box.description : box.descriptionNepali}
                    </p>

                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{box.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs">{box.subscribers} {t('subscribers', 'सदस्यहरू')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-emerald-600">NPR {box.price}</span>
                        <span className="text-xs text-gray-600">/{box.frequency}</span>
                      </div>
                      <Button size="sm">
                        {t('Subscribe', 'सदस्यता लिनुहोस्')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};