import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Mic, Camera, MapPin, Filter, Star, Zap, Eye, Bot, Volume2, Sparkles, TrendingUp, Clock, Heart, ScanLine } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import type { User, Language } from '../App';

interface AdvancedSearchDiscoveryProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function AdvancedSearchDiscovery({ user, language, onClose }: AdvancedSearchDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isVisualSearch, setIsVisualSearch] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [distance, setDistance] = useState([5]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTab, setCurrentTab] = useState('smart');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Mock search data
  const trendingSearches = [
    { query: t('Fresh Tomatoes', 'ताजा टमाटर'), count: 1234, trend: '+15%' },
    { query: t('Organic Rice', 'जैविक चामल'), count: 987, trend: '+23%' },
    { query: t('Farm Fresh Milk', 'फार्मको ताजा दूध'), count: 856, trend: '+8%' },
    { query: t('Seasonal Vegetables', 'मौसमी तरकारी'), count: 743, trend: '+12%' }
  ];

  const recentSearches = [
    t('Organic vegetables near me', 'मेरो नजिकका जैविक तरकारी'),
    t('Fresh fruits delivery', 'ताजा फलफूल डिलिभरी'),
    t('Local dairy products', 'स्थानीय दुग्ध उत्पादन'),
  ];

  const smartSuggestions = [
    { type: 'seasonal', text: t('Winter vegetables are in season', 'हिउँदका तरकारीहरू मौसममा छन्'), icon: '🥬' },
    { type: 'weather', text: t('Rain expected - order covered produce', 'वर्षाको सम्भावना - ढाकेका उत्पादन अर्डर गर्नुहोस्'), icon: '🌧️' },
    { type: 'price', text: t('Tomato prices dropped 20%', 'टमाटरको मूल्य २०% घट्यो'), icon: '📉' },
    { type: 'nearby', text: t('New farmer joined 2km away', '२ किमी टाढा नयाँ किसान सामेल भए'), icon: '🚜' }
  ];

  const popularCategories = [
    { name: t('Vegetables', 'तरकारी'), icon: '🥕', count: 245, color: 'bg-green-500' },
    { name: t('Fruits', 'फलफूल'), icon: '🍎', count: 189, color: 'bg-red-500' },
    { name: t('Grains', 'अन्न'), icon: '🌾', count: 156, color: 'bg-yellow-500' },
    { name: t('Dairy', 'दुग्ध'), icon: '🥛', count: 98, color: 'bg-blue-500' },
    { name: t('Herbs', 'जडीबुटी'), icon: '🌿', count: 87, color: 'bg-emerald-500' },
    { name: t('Flowers', 'फूलहरू'), icon: '🌸', count: 67, color: 'bg-pink-500' }
  ];

  const handleVoiceSearch = () => {
    setIsVoiceRecording(true);
    // Simulate voice recording
    setTimeout(() => {
      setIsVoiceRecording(false);
      setSearchQuery(t('Fresh organic tomatoes near me', 'मेरो नजिकका ताजा जैविक टमाटर'));
      performSearch(t('Fresh organic tomatoes near me', 'मेरो नजिकका ताजा जैविक टमाटर'));
    }, 3000);
  };

  const handleVisualSearch = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsVisualSearch(true);
      // Simulate image processing
      setTimeout(() => {
        setIsVisualSearch(false);
        setSearchQuery(t('Red Apple - Visual Match', 'रातो स्याउ - दृश्य मिलान'));
        performSearch(t('Red Apple - Visual Match', 'रातो स्याउ - दृश्य मिलान'));
      }, 2000);
    }
  };

  const performSearch = (query: string) => {
    setIsSearching(true);
    
    // Mock search results
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: t('Organic Tomatoes', 'जैविक टमाटर'),
          farmer: t('Ram Bahadur', 'राम बहादुर'),
          price: 80,
          unit: t('per kg', 'प्रति केजी'),
          distance: 2.5,
          rating: 4.8,
          image: '🍅',
          inSeason: true,
          freshness: 95,
          organic: true
        },
        {
          id: 2,
          name: t('Farm Fresh Apples', 'फार्मका ताजा स्याउ'),
          farmer: t('Sita Devi', 'सीता देवी'),
          price: 150,
          unit: t('per kg', 'प्रति केजी'),
          distance: 4.2,
          rating: 4.9,
          image: '🍎',
          inSeason: false,
          freshness: 88,
          organic: false
        },
        {
          id: 3,
          name: t('Green Vegetables Bundle', 'हरियो तरकारी बन्डल'),
          farmer: t('Krishna Shrestha', 'कृष्ण श्रेष्ठ'),
          price: 200,
          unit: t('per bundle', 'प्रति बन्डल'),
          distance: 1.8,
          rating: 4.7,
          image: '🥬',
          inSeason: true,
          freshness: 92,
          organic: true
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)'
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-emerald-100 dark:border-emerald-700">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            {t('AI-Powered Discovery', 'AI-संचालित खोज')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-emerald-50 dark:bg-emerald-900/20">
              <TabsTrigger value="smart" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                {t('Smart', 'स्मार्ट')}
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                {t('Voice', 'आवाज')}
              </TabsTrigger>
              <TabsTrigger value="visual" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                {t('Visual', 'दृश्य')}
              </TabsTrigger>
              <TabsTrigger value="discover" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t('Discover', 'खोज्नुहोस्')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="smart" className="space-y-6">
              {/* Smart Search Bar */}
              <div className="relative">
                <div className="relative flex items-center gap-2 p-2 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
                     style={{
                       transform: 'perspective(1000px) rotateX(1deg)',
                     }}>
                  <Search className="h-5 w-5 text-emerald-600 ml-2" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('Ask AI: "Fresh tomatoes near me with best price"', 'AI लाई सोध्नुहोस्: "मेरो नजिकको राम्रो मूल्यमा ताजा टमाटर"')}
                    className="border-0 text-base focus-visible:ring-0 bg-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleVoiceSearch}
                      className={`h-8 w-8 ${isVoiceRecording ? 'animate-pulse bg-red-100 dark:bg-red-900/20' : ''}`}
                    >
                      <Mic className={`h-4 w-4 ${isVoiceRecording ? 'text-red-500' : 'text-gray-500'}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleVisualSearch}
                      className="h-8 w-8"
                    >
                      <Camera className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button 
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200"
                    >
                      {isSearching ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        t('Search', 'खोज्नुहोस्')
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* AI Voice Recording Indicator */}
                {isVoiceRecording && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-pulse">
                    <Volume2 className="h-4 w-4" />
                    {t('Listening...', 'सुन्दै...')}
                  </div>
                )}

                {/* Visual Search Processing */}
                {isVisualSearch && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-pulse">
                    <ScanLine className="h-4 w-4" />
                    {t('Analyzing image...', 'छवि विश्लेषण गर्दै...')}
                  </div>
                )}
              </div>

              {/* Smart Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {smartSuggestions.map((suggestion, index) => (
                  <Card key={index} className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border border-emerald-100 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-500"
                        style={{
                          transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                        }}
                        onClick={() => {
                          setSearchQuery(suggestion.text);
                          performSearch(suggestion.text);
                        }}>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{suggestion.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{suggestion.text}</p>
                        <Badge variant="secondary" className="mt-1">
                          {suggestion.type === 'seasonal' && t('Seasonal', 'मौसमी')}
                          {suggestion.type === 'weather' && t('Weather Alert', 'मौसम चेतावनी')}
                          {suggestion.type === 'price' && t('Price Update', 'मूल्य अद्यावधिक')}
                          {suggestion.type === 'nearby' && t('Nearby', 'नजिकै')}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    {t('Search Results', 'खोज परिणामहरू')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((product, index) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-emerald-100 dark:border-emerald-700 group"
                            style={{
                              transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'}) scale(1)`;
                            }}>
                        <div className="relative">
                          <div className="w-full h-32 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
                            <span className="text-4xl">{product.image}</span>
                          </div>
                          {product.organic && (
                            <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                              {t('Organic', 'जैविक')}
                            </Badge>
                          )}
                          {product.inSeason && (
                            <Badge className="absolute top-2 right-2 bg-orange-500 text-white">
                              {t('In Season', 'मौसममा')}
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.farmer}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{product.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="h-3 w-3" />
                              {product.distance}km
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <span className="text-lg font-bold text-emerald-600">Rs. {product.price}</span>
                              <span className="text-sm text-gray-500 ml-1">{product.unit}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600">{product.freshness}% {t('Fresh', 'ताजा')}</span>
                            </div>
                          </div>
                          <Button className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 group-hover:scale-105 transition-transform duration-200">
                            {t('Add to Cart', 'कार्टमा थप्नुहोस्')}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="voice" className="space-y-6">
              <div className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center relative"
                     style={{
                       transform: 'perspective(1000px) rotateX(15deg)',
                     }}>
                  <Mic className="h-16 w-16 text-white" />
                  {isVoiceRecording && (
                    <div className="absolute inset-0 rounded-full bg-red-400 animate-ping"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t('Voice Search', 'आवाज खोज')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('Say what you\'re looking for in Nepali or English', 'नेपाली वा अङ्ग्रेजीमा के खोज्दै हुनुहुन्छ भन्नुहोस्')}
                  </p>
                  <Button
                    onClick={handleVoiceSearch}
                    disabled={isVoiceRecording}
                    className={`px-8 py-3 ${isVoiceRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'} transform hover:scale-105 transition-all duration-200`}
                  >
                    {isVoiceRecording ? (
                      <>
                        <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                        {t('Listening...', 'सुन्दै...')}
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        {t('Start Voice Search', 'आवाज खोज सुरु गर्नुहोस्')}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Voice Search Examples */}
              <div className="space-y-4">
                <h4 className="font-semibold">{t('Try saying:', 'यो भन्ने प्रयास गर्नुहोस्:')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    t('"Show me organic vegetables near me"', '"मेरो नजिकका जैविक तरकारीहरू देखाउनुहोस्"'),
                    t('"Fresh milk under 100 rupees"', '"१०० रुपैया भन्दा कम मूल्यको ताजा दूध"'),
                    t('"Best rated tomatoes"', '"सबैभन्दा राम्रो मूल्याङ्कन भएका टमाटर"'),
                    t('"Seasonal fruits in my area"', '"मेरो क्षेत्रका मौसमी फलफूल"')
                  ].map((example, index) => (
                    <Card key={index} className="p-3 hover:shadow-md transition-shadow cursor-pointer border border-emerald-100 dark:border-emerald-700"
                          onClick={() => {
                            setSearchQuery(example.replace(/"/g, ''));
                            performSearch(example.replace(/"/g, ''));
                          }}>
                      <p className="text-sm">{example}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visual" className="space-y-6">
              <div className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center relative"
                     style={{
                       transform: 'perspective(1000px) rotateX(15deg)',
                     }}>
                  {isVisualSearch ? (
                    <ScanLine className="h-16 w-16 text-white animate-pulse" />
                  ) : (
                    <Camera className="h-16 w-16 text-white" />
                  )}
                  {isVisualSearch && (
                    <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t('Visual Search', 'दृश्य खोज')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('Take a photo or upload an image to find similar products', 'समान उत्पादनहरू फेला पार्न फोटो खिच्नुहोस् वा छवि अपलोड गर्नुहोस्')}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={handleVisualSearch}
                      disabled={isVisualSearch}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {t('Upload Image', 'छवि अपलोड गर्नुहोस्')}
                    </Button>
                    <Button
                      variant="outline"
                      className="px-6 py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transform hover:scale-105 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t('Take Photo', 'फोटो खिच्नुहोस्')}
                    </Button>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Visual Search Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  {t('Visual Search Tips', 'दृश्य खोज सुझावहरू')}
                </h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• {t('Ensure good lighting for clear photos', 'स्पष्ट फोटोका लागि राम्रो प्रकाश सुनिश्चित गर्नुहोस्')}</li>
                  <li>• {t('Focus on the main product', 'मुख्य उत्पादनमा ध्यान दिनुहोस्')}</li>
                  <li>• {t('Avoid cluttered backgrounds', 'अस्तव्यस्त पृष्ठभूमिबाट बच्नुहोस्')}</li>
                  <li>• {t('Multiple angles help better identification', 'धेरै कोणहरूले राम्रो पहिचान गर्न मद्दत गर्छ')}</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="discover" className="space-y-6">
              {/* Trending Searches */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  {t('Trending Now', 'अहिले ट्रेन्डिङ')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingSearches.map((trend, index) => (
                    <Card key={index} className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border border-orange-100 dark:border-orange-700 hover:border-orange-300 dark:hover:border-orange-500"
                          style={{
                            transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                          }}
                          onClick={() => {
                            setSearchQuery(trend.query);
                            performSearch(trend.query);
                          }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{trend.query}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{trend.count} {t('searches', 'खोजहरू')}</p>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          {trend.trend}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  {t('Popular Categories', 'लोकप्रिय श्रेणीहरू')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {popularCategories.map((category, index) => (
                    <Card key={index} className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                          style={{
                            transform: `perspective(1000px) rotateX(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = `perspective(1000px) rotateX(${index % 2 === 0 ? '2deg' : '-2deg'}) scale(1)`;
                          }}
                          onClick={() => {
                            setSearchQuery(category.name);
                            performSearch(category.name);
                          }}>
                      <div className="text-center space-y-2">
                        <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto text-white text-xl group-hover:scale-110 transition-transform duration-200`}>
                          {category.icon}
                        </div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.count} {t('products', 'उत्पादनहरू')}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  {t('Recent Searches', 'हालैका खोजहरू')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-1 transition-colors"
                      onClick={() => {
                        setSearchQuery(search);
                        performSearch(search);
                      }}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}