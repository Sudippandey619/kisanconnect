import React, { useState, useRef } from 'react';
import { X, Share2, Heart, MessageCircle, Star, Gift, Users, Camera, Play, Plus, ShoppingCart, Award, Crown, Zap, TrendingUp, Eye, ThumbsUp, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import type { User, Language } from '../App';

interface SocialCommerceProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function SocialCommerce({ user, language, onClose }: SocialCommerceProps) {
  const [currentTab, setCurrentTab] = useState('stories');
  const [activeStory, setActiveStory] = useState<any>(null);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Mock stories data
  const stories = [
    {
      id: 1,
      user: t('Ram Farmer', 'राम किसान'),
      avatar: '👨‍🌾',
      stories: [
        {
          id: 1,
          type: 'image',
          content: '🍅',
          caption: t('Fresh tomatoes ready for harvest!', 'फसलका लागि तयार ताजा टमाटर!'),
          timestamp: '2h ago',
          views: 234,
          likes: 45
        },
        {
          id: 2,
          type: 'video',
          content: '🎥',
          caption: t('Watering the crops this morning', 'आज बिहान बाली सिँचाइ गर्दै'),
          timestamp: '5h ago',
          views: 189,
          likes: 32
        }
      ],
      hasNewStory: true
    },
    {
      id: 2,
      user: t('Sita Organic', 'सीता जैविक'),
      avatar: '👩‍🌾',
      stories: [
        {
          id: 3,
          type: 'image',
          content: '🥬',
          caption: t('Organic vegetables grown with love', 'माया लगाएर उब्जाएका जैविक तरकारी'),
          timestamp: '1h ago',
          views: 156,
          likes: 67
        }
      ],
      hasNewStory: true
    },
    {
      id: 3,
      user: t('Maya Fresh', 'माया फ्रेश'),
      avatar: '🧑‍🌾',
      stories: [
        {
          id: 4,
          type: 'image',
          content: '🌾',
          caption: t('Golden rice fields ready for harvest', 'फसलका लागि तयार सुनौलो धान खेत'),
          timestamp: '3h ago',
          views: 298,
          likes: 78
        }
      ],
      hasNewStory: false
    }
  ];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: t('Priya Customer', 'प्रिया ग्राहक'),
      avatar: '👩',
      rating: 5,
      review: t('Amazing quality tomatoes! Super fresh and delivered on time. Highly recommend this farmer.', 'अद्भुत गुणस्तरका टमाटर! एकदम ताजा र समयमै डिलिभरी। यो किसानलाई धेरै सिफारिस गर्छु।'),
      product: t('Organic Tomatoes', 'जैविक टमाटर'),
      date: '2 days ago',
      helpful: 12,
      images: ['🍅', '📦'],
      verified: true
    },
    {
      id: 2,
      user: t('Rajesh Buyer', 'राजेश खरिदकर्ता'),
      avatar: '👨',
      rating: 4,
      review: t('Good quality vegetables but delivery was a bit delayed. Overall satisfied with the purchase.', 'राम्रो गुणस्तरका तरकारी तर डिलिभरी अलि ढिलो भयो। समग्रमा खरिदसँग सन्तुष्ट छु।'),
      product: t('Mixed Vegetables', 'मिश्रित तरकारी'),
      date: '1 week ago',
      helpful: 8,
      images: ['🥕', '🥬'],
      verified: false
    },
    {
      id: 3,
      user: t('Sunita Regular', 'सुनिता नियमित'),
      avatar: '👩‍💼',
      rating: 5,
      review: t('Been buying from this farmer for months. Consistent quality and great prices. Thank you!', 'महिनौंदेखि यो किसानबाट किन्दै आएको छु। निरन्तर गुणस्तर र राम्रो मूल्य। धन्यवाद!'),
      product: t('Weekly Vegetable Box', 'साप्ताहिक तरकारी बक्स'),
      date: '3 days ago',
      helpful: 15,
      images: ['📦', '🥕', '🥬', '🍅'],
      verified: true
    }
  ];

  // Mock referral data
  const referralStats = {
    totalReferrals: 47,
    successfulReferrals: 23,
    pendingReferrals: 12,
    totalEarnings: 2340,
    currentMonthEarnings: 560,
    referralCode: 'KISAN2024'
  };

  // Mock influencer data
  const topInfluencers = [
    {
      id: 1,
      name: t('Organic Queen', 'जैविक रानी'),
      avatar: '👑',
      followers: 15600,
      posts: 234,
      engagement: 8.7,
      badge: 'Gold',
      earnings: 45000
    },
    {
      id: 2,
      name: t('Farm Fresh Pro', 'फार्म फ्रेश प्रो'),
      avatar: '🏆',
      followers: 12400,
      posts: 189,
      engagement: 7.2,
      badge: 'Silver',
      earnings: 28000
    },
    {
      id: 3,
      name: t('Green Guru', 'ग्रिन गुरु'),
      avatar: '🌱',
      followers: 9800,
      posts: 156,
      engagement: 6.8,
      badge: 'Bronze',
      earnings: 18500
    }
  ];

  const openStory = (story: any) => {
    setActiveStory(story);
  };

  const submitReview = () => {
    if (newReview.trim() && rating > 0) {
      // Handle review submission
      setNewReview('');
      setRating(0);
    }
  };

  const shareProduct = () => {
    // Handle product sharing
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-emerald-100 dark:border-emerald-700">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            {t('Social Commerce Hub', 'सामाजिक व्यापार केन्द्र')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-pink-50 dark:bg-pink-900/20">
              <TabsTrigger value="stories" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                {t('Stories', 'कथाहरू')}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {t('Reviews', 'समीक्षाहरू')}
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                {t('Referrals', 'सिफारिसहरू')}
              </TabsTrigger>
              <TabsTrigger value="influencers" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                {t('Influencers', 'प्रभावकारी')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stories" className="space-y-6">
              {/* Story Modal */}
              {activeStory && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                  <div className="relative w-full max-w-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveStory(null)}
                      className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Card className="overflow-hidden bg-gradient-to-br from-emerald-600 to-green-600"
                          style={{
                            transform: 'perspective(1000px) rotateY(0deg)',
                            height: '80vh'
                          }}>
                      <div className="relative h-full flex flex-col">
                        <div className="p-4 flex items-center gap-3 bg-black/20">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            {activeStory.user.stories[0].user || '👤'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{activeStory.user}</p>
                            <p className="text-white/70 text-sm">{activeStory.stories[0].timestamp}</p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-8xl mb-4">{activeStory.stories[0].content}</div>
                            <p className="text-lg">{activeStory.stories[0].caption}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-black/20">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm">{activeStory.stories[0].views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span className="text-sm">{activeStory.stories[0].likes}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Stories List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('Farm Stories', 'फार्म कथाहरू')}</h2>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Add Story', 'कथा थप्नुहोस्')}
                  </Button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4">
                  {stories.map((story, index) => (
                    <div
                      key={story.id}
                      className="flex-shrink-0 cursor-pointer group"
                      onClick={() => openStory(story)}
                    >
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl ${
                          story.hasNewStory 
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 p-1' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        } group-hover:scale-110 transition-transform duration-200`}
                             style={{
                               transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '5deg' : '-5deg'})`,
                             }}>
                          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                            {story.avatar}
                          </div>
                        </div>
                        {story.hasNewStory && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{story.stories.length}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-center text-sm mt-2 max-w-20 truncate">{story.user}</p>
                    </div>
                  ))}
                </div>

                {/* Featured Stories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.flatMap(story => story.stories).map((storyItem, index) => (
                    <Card key={storyItem.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
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
                        <div className="w-full h-48 bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-4xl mb-2">{storyItem.content}</div>
                            {storyItem.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                                  <Play className="h-6 w-6 text-white ml-1" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {storyItem.views}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm mb-3 group-hover:text-pink-600 transition-colors">{storyItem.caption}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{storyItem.timestamp}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Heart className="h-3 w-3" />
                              {storyItem.likes}
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('Customer Reviews', 'ग्राहक समीक्षाहरू')}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">(247 reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Write Review */}
                <Card className="border-emerald-200 dark:border-emerald-700"
                      style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                  <CardHeader>
                    <CardTitle className="text-sm">{t('Write a Review', 'समीक्षा लेख्नुहोस्')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{t('Rating:', 'मूल्याङ्कन:')}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setRating(star)}
                          >
                            <Star className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} hover:scale-125 transition-transform`} />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Input
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder={t('Share your experience...', 'आफ्नो अनुभव साझा गर्नुहोस्...')}
                      className="w-full"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={submitReview}
                        disabled={!newReview.trim() || rating === 0}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200"
                      >
                        {t('Submit Review', 'समीक्षा पेश गर्नुहोस्')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <Card key={review.id} className="hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
                          style={{
                            transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                          }}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                            {review.avatar}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{review.user}</h4>
                                  {review.verified && (
                                    <Badge className="bg-green-500 text-white text-xs">
                                      ✓ {t('Verified', 'प्रमाणित')}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{review.product}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300">{review.review}</p>
                            
                            {review.images && (
                              <div className="flex gap-2">
                                {review.images.map((image, imgIndex) => (
                                  <div key={imgIndex} className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-lg">
                                    {image}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:scale-105 transition-all duration-200"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {t('Helpful', 'उपयोगी')} ({review.helpful})
                              </Button>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto"
                       style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                    <Gift className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{t('Referral Program', 'सिफारिस कार्यक्रम')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('Earn rewards by referring friends to KisanConnect', 'साथीहरूलाई किसान कनेक्टमा सिफारिस गरेर पुरस्कार कमाउनुहोस्')}
                    </p>
                  </div>
                </div>

                {/* Referral Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(3deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{t('Total Referrals', 'कुल सिफारिसहरू')}</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{referralStats.totalReferrals}</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{t('Successful', 'सफल')}</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{referralStats.successfulReferrals}</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-1deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">{t('Total Earnings', 'कुल आम्दानी')}</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">Rs. {referralStats.totalEarnings}</p>
                  </Card>
                  <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                        style={{ transform: 'perspective(1000px) rotateY(-3deg)' }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">{t('This Month', 'यो महिना')}</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">Rs. {referralStats.currentMonthEarnings}</p>
                  </Card>
                </div>

                {/* Referral Code */}
                <Card className="border-yellow-200 dark:border-yellow-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                      style={{ transform: 'perspective(1000px) rotateY(0deg)' }}>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-4">{t('Your Referral Code', 'तपाईंको सिफारिस कोड')}</h3>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border-2 border-dashed border-yellow-400">
                        <span className="text-2xl font-bold text-yellow-600">{referralStats.referralCode}</span>
                      </div>
                      <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200">
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('Share', 'साझा गर्नुहोस्')}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('Share this code with friends to earn Rs. 50 for each successful referral', 'प्रत्येक सफल सिफारिसको लागि ५० रुपैया कमाउन साथीहरूसँग यो कोड साझा गर्नुहोस्')}
                    </p>
                  </CardContent>
                </Card>

                {/* How it Works */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('How Referral Program Works', 'सिफारिस कार्यक्रम कसरी काम गर्छ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                          <Share2 className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold">{t('1. Share Your Code', '१. आफ्नो कोड साझा गर्नुहोस्')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('Share your unique referral code with friends and family', 'साथीहरू र परिवारसँग आफ्नो अनन्य सिफारिस कोड साझा गर्नुहोस्')}
                        </p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold">{t('2. Friends Sign Up', '२. साथीहरू साइन अप गर्छन्')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('Your friends use your code to create their account', 'तपाईंका साथीहरूले आफ्नो खाता सिर्जना गर्न तपाईंको कोड प्रयोग गर्छन्')}
                        </p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                          <Gift className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold">{t('3. Earn Rewards', '३. पुरस्कार कमाउनुहोस्')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('Both you and your friend get rewards for successful referrals', 'सफल सिफारिसको लागि तपाईं र तपाईंको साथी दुवैले पुरस्कार पाउनुहुन्छ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="influencers" className="space-y-6">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto"
                       style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                    <Crown className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{t('Top Influencers', 'शीर्ष प्रभावकारी')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('Join our influencer program and earn by promoting farm products', 'हाम्रो प्रभावकारी कार्यक्रममा सामेल हुनुहोस् र फार्म उत्पादनहरूको प्रचार गरेर कमाउनुहोस्')}
                    </p>
                  </div>
                </div>

                {/* Influencer Leaderboard */}
                <div className="space-y-4">
                  {topInfluencers.map((influencer, index) => (
                    <Card key={influencer.id} className="hover:shadow-xl transition-all duration-300 border border-purple-100 dark:border-purple-700"
                          style={{
                            transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                          }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-4">
                            <div className={`text-2xl ${
                              index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-600'
                            }`}>
                              #{index + 1}
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                              {influencer.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">{influencer.name}</h3>
                                <Badge className={`${
                                  influencer.badge === 'Gold' ? 'bg-yellow-500' :
                                  influencer.badge === 'Silver' ? 'bg-gray-400' : 'bg-orange-500'
                                } text-white`}>
                                  {influencer.badge}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {influencer.followers.toLocaleString()} {t('followers', 'फलोअरहरू')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-purple-600">{influencer.posts}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{t('Posts', 'पोस्टहरू')}</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-600">{influencer.engagement}%</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{t('Engagement', 'संलग्नता')}</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-orange-600">Rs. {influencer.earnings.toLocaleString()}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{t('Earnings', 'आम्दानी')}</p>
                            </div>
                          </div>
                          
                          <Button
                            variant="outline"
                            className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 transform hover:scale-105 transition-all duration-200"
                          >
                            {t('Follow', 'फलो गर्नुहोस्')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Become an Influencer */}
                <Card className="border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                      style={{ transform: 'perspective(1000px) rotateY(0deg)' }}>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">{t('Become a KisanConnect Influencer', 'किसान कनेक्ट प्रभावकारी बन्नुहोस्')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {t('Join our influencer program and start earning by promoting quality farm products to your audience', 'हाम्रो प्रभावकारी कार्यक्रममा सामेल हुनुहोस् र आफ्ना दर्शकहरूलाई गुणस्तरीय फार्म उत्पादनहरूको प्रचार गरेर कमाउन सुरु गर्नुहोस्')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">15%</div>
                        <p className="text-sm">{t('Commission Rate', 'कमिसन दर')}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">Rs. 10,000</div>
                        <p className="text-sm">{t('Monthly Bonus', 'मासिक बोनस')}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">24/7</div>
                        <p className="text-sm">{t('Support', 'सहयोग')}</p>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200">
                      <Crown className="h-4 w-4 mr-2" />
                      {t('Apply Now', 'अहिले आवेदन दिनुहोस्')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}