import React, { useState } from 'react';
import { Users, MessageSquare, Video, BookOpen, Award, Star, Clock, TrendingUp, Calendar, Trophy, HelpCircle, Lightbulb, Phone, Play, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { User, Language } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ForumPost {
  id: string;
  title: string;
  titleNepali: string;
  content: string;
  contentNepali: string;
  author: {
    name: string;
    nameNepali: string;
    role: 'farmer' | 'expert' | 'consumer';
    avatar: string;
    reputation: number;
  };
  category: string;
  categoryNepali: string;
  views: number;
  replies: number;
  upvotes: number;
  isAnswered: boolean;
  timestamp: string;
  tags: string[];
}

interface Expert {
  id: string;
  name: string;
  nameNepali: string;
  title: string;
  titleNepali: string;
  specialization: string[];
  specializationNepali: string[];
  rating: number;
  reviews: number;
  experience: number;
  avatar: string;
  available: boolean;
  consultationFee: number;
  languages: string[];
}

interface KnowledgeArticle {
  id: string;
  title: string;
  titleNepali: string;
  summary: string;
  summaryNepali: string;
  category: string;
  categoryNepali: string;
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: string;
  publishedAt: string;
  views: number;
  likes: number;
  image: string;
}

interface Challenge {
  id: string;
  title: string;
  titleNepali: string;
  description: string;
  descriptionNepali: string;
  prize: number;
  participants: number;
  endDate: string;
  category: string;
  status: 'active' | 'ended' | 'upcoming';
  image: string;
}

interface Props {
  user: User;
  language: Language;
  onClose: () => void;
}

export const CommunityKnowledgeHub: React.FC<Props> = ({ user, language, onClose }) => {
  const [activeTab, setActiveTab] = useState('forum');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [forumPosts] = useState<ForumPost[]>([
    {
      id: 'post_1',
      title: 'Best organic fertilizer for tomatoes?',
      titleNepali: 'टमाटरको लागि सबैभन्दा राम्रो जैविक मल के हो?',
      content: 'I need advice on organic fertilizers that work best for tomato cultivation in Nepal.',
      contentNepali: 'मलाई नेपालमा टमाटर खेतीका लागि सबैभन्दा राम्रो जैविक मलको बारेमा सल्लाह चाहिन्छ।',
      author: {
        name: 'Raj Kumar Sharma',
        nameNepali: 'राज कुमार शर्मा',
        role: 'farmer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        reputation: 245
      },
      category: 'Fertilizers',
      categoryNepali: 'मल',
      views: 156,
      replies: 8,
      upvotes: 12,
      isAnswered: true,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      tags: ['organic', 'tomatoes', 'fertilizer']
    },
    {
      id: 'post_2',
      title: 'Dealing with aphid infestation',
      titleNepali: 'माहुरी संक्रमणसँग कसरी व्यवहार गर्ने',
      content: 'My cucumber plants are heavily infested with aphids. Looking for natural solutions.',
      contentNepali: 'मेरो काकडीका बिरुवाहरूमा माहुरीको धेरै संक्रमण छ। प्राकृतिक समाधान खोज्दै छु।',
      author: {
        name: 'Dr. Sita Paudel',
        nameNepali: 'डा. सीता पौडेल',
        role: 'expert',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        reputation: 892
      },
      category: 'Pest Control',
      categoryNepali: 'कीरा नियन्त्रण',
      views: 89,
      replies: 5,
      upvotes: 7,
      isAnswered: false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      tags: ['pests', 'cucumber', 'organic']
    }
  ]);

  const [experts] = useState<Expert[]>([
    {
      id: 'expert_1',
      name: 'Dr. Ramesh Adhikari',
      nameNepali: 'डा. रमेश अधिकारी',
      title: 'Agricultural Scientist',
      titleNepali: 'कृषि वैज्ञानिक',
      specialization: ['Crop Diseases', 'Soil Management', 'Organic Farming'],
      specializationNepali: ['बाली रोगहरू', 'माटो व्यवस्थापन', 'जैविक खेती'],
      rating: 4.9,
      reviews: 127,
      experience: 15,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
      available: true,
      consultationFee: 500,
      languages: ['Nepali', 'English']
    },
    {
      id: 'expert_2',
      name: 'Dr. Kamala Shrestha',
      nameNepali: 'डा. कमला श्रेष्ठ',
      title: 'Horticulture Specialist',
      titleNepali: 'बागवानी विशेषज्ञ',
      specialization: ['Vegetable Farming', 'Greenhouse Technology', 'Post-Harvest Management'],
      specializationNepali: ['तरकारी खेती', 'हरितगृह प्रविधि', 'फसल पछि व्यवस्थापन'],
      rating: 4.8,
      reviews: 89,
      experience: 12,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      available: false,
      consultationFee: 750,
      languages: ['Nepali', 'English', 'Hindi']
    }
  ]);

  const [knowledgeArticles] = useState<KnowledgeArticle[]>([
    {
      id: 'article_1',
      title: 'Complete Guide to Tomato Farming in Nepal',
      titleNepali: 'नेपालमा टमाटर खेतीको पूर्ण गाइड',
      summary: 'Everything you need to know about growing tomatoes successfully in Nepali climate.',
      summaryNepali: 'नेपाली मौसममा सफलतापूर्वक टमाटर उत्पादन गर्न आवश्यक सबै कुरा।',
      category: 'Vegetable Farming',
      categoryNepali: 'तरकारी खेती',
      readTime: 8,
      difficulty: 'beginner',
      author: 'Dr. Ram Prasad',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      views: 542,
      likes: 89,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'
    },
    {
      id: 'article_2',
      title: 'Organic Pest Control Methods',
      titleNepali: 'जैविक कीरा नियन्त्रण विधिहरू',
      summary: 'Natural and effective ways to control pests without harmful chemicals.',
      summaryNepali: 'हानिकारक रसायन बिना कीराहरूलाई नियन्त्रण गर्ने प्राकृतिक र प्रभावकारी तरिकाहरू।',
      category: 'Pest Management',
      categoryNepali: 'कीरा व्यवस्थापन',
      readTime: 12,
      difficulty: 'intermediate',
      author: 'Sita Sharma',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      views: 387,
      likes: 67,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
    }
  ]);

  const [challenges] = useState<Challenge[]>([
    {
      id: 'challenge_1',
      title: 'Best Crop Photo Contest',
      titleNepali: 'सबैभन्दा राम्रो बाली फोटो प्रतियोगिता',
      description: 'Share your best crop photos and win amazing prizes!',
      descriptionNepali: 'आफ्नो सबैभन्दा राम्रो बालीका फोटोहरू साझा गर्नुहोस् र अद्भुत पुरस्कारहरू जित्नुहोस्!',
      prize: 10000,
      participants: 156,
      endDate: new Date(Date.now() + 604800000).toISOString(),
      category: 'Photography',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400'
    },
    {
      id: 'challenge_2',
      title: 'Sustainable Farming Innovation',
      titleNepali: 'दिगो खेती नवाचार',
      description: 'Present innovative solutions for sustainable farming practices.',
      descriptionNepali: 'दिगो खेती अभ्यासका लागि नवाचार समाधानहरू प्रस्तुत गर्नुहोस्।',
      prize: 25000,
      participants: 43,
      endDate: new Date(Date.now() + 1209600000).toISOString(),
      category: 'Innovation',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400'
    }
  ]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return t('Just now', 'भर्खरै');
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}${t('h ago', 'घन्टा अगाडि')}`;
    } else {
      return `${Math.floor(diffInHours / 24)}${t('d ago', 'दिन अगाडि')}`;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farmer': return '👨‍🌾';
      case 'expert': return '👨‍🎓';
      case 'consumer': return '🛒';
      default: return '👤';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleBookConsultation = (expertId: string) => {
    toast.success(t('Consultation request sent!', 'परामर्श अनुरोध पठाइयो!'));
  };

  const handleJoinChallenge = (challengeId: string) => {
    toast.success(t('Successfully joined challenge!', 'चुनौतीमा सफलतापूर्वक सामेल भयो!'));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              <h2 className="text-lg font-bold">{t('Community Hub', 'समुदायिक केन्द्र')}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              ×
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-8 w-8" />
                <div>
                  <h3 className="font-bold">{t('Learn, Share, Grow Together', 'सँगै सिक्नुहोस्, साझा गर्नुहोस्, बढ्नुहोस्')}</h3>
                  <p className="text-sm opacity-90">
                    {t('Connect with experts and fellow farmers', 'विशेषज्ञहरू र सहकर्मी किसानहरूसँग जोडिनुहोस्')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="forum" className="text-xs">
                {t('Forum', 'फोरम')}
              </TabsTrigger>
              <TabsTrigger value="experts" className="text-xs">
                {t('Experts', 'विशेषज्ञहरू')}
              </TabsTrigger>
              <TabsTrigger value="learn" className="text-xs">
                {t('Learn', 'सिक्नुहोस्')}
              </TabsTrigger>
              <TabsTrigger value="challenges" className="text-xs">
                {t('Challenges', 'चुनौतीहरू')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forum" className="p-4 space-y-4">
              {/* Search and Filter */}
              <div className="space-y-3">
                <Input
                  placeholder={t('Search discussions...', 'छलफलहरू खोज्नुहोस्...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select category', 'श्रेणी छान्नुहोस्')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('All Categories', 'सबै श्रेणीहरू')}</SelectItem>
                    <SelectItem value="fertilizers">{t('Fertilizers', 'मल')}</SelectItem>
                    <SelectItem value="pest-control">{t('Pest Control', 'कीरा नियन्त्रण')}</SelectItem>
                    <SelectItem value="irrigation">{t('Irrigation', 'सिंचाई')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Forum Posts */}
              <div className="space-y-3">
                {forumPosts.map((post) => (
                  <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <img src={post.author.avatar} alt={post.author.name} className="rounded-full" />
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm line-clamp-1">
                              {language === 'en' ? post.title : post.titleNepali}
                            </h3>
                            {post.isAnswered && (
                              <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                                ✓ {t('Answered', 'उत्तर दिइएको')}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {language === 'en' ? post.content : post.contentNepali}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs">{getRoleIcon(post.author.role)}</span>
                              <span className="text-xs font-medium">
                                {language === 'en' ? post.author.name : post.author.nameNepali}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {language === 'en' ? post.category : post.categoryNepali}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.replies}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{post.upvotes}</span>
                              </div>
                              <span>{formatTimeAgo(post.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Ask Question Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    {t('Ask a Question', 'प्रश्न सोध्नुहोस्')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('Ask the Community', 'समुदायलाई सोध्नुहोस्')}</DialogTitle>
                    <DialogDescription>
                      {t('Post your question to get help from the farming community', 'कृषि समुदायबाट मद्दत प्राप्त गर्न आफ्नो प्रश्न पोस्ट गर्नुहोस्')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder={t('Question title', 'प्रश्नको शीर्षक')} />
                    <Textarea placeholder={t('Describe your question in detail...', 'आफ्नो प्रश्न विस्तारमा वर्णन गर्नुहोस्...')} />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select category', 'श्रेणी छान्नुहोस्')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fertilizers">{t('Fertilizers', 'मल')}</SelectItem>
                        <SelectItem value="pest-control">{t('Pest Control', 'कीरा नियन्त्रण')}</SelectItem>
                        <SelectItem value="irrigation">{t('Irrigation', 'सिंचाई')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full">{t('Post Question', 'प्रश्न पोस्ट गर्नुहोस्')}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="experts" className="p-4 space-y-3">
              {experts.map((expert) => (
                <Card key={expert.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <img src={expert.avatar} alt={expert.name} className="rounded-full" />
                        </Avatar>
                        {expert.available && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            {language === 'en' ? expert.name : expert.nameNepali}
                          </h3>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            👨‍🎓 {t('Expert', 'विशेषज्ञ')}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {language === 'en' ? expert.title : expert.titleNepali}
                        </p>
                        
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{expert.rating}</span>
                            <span className="text-xs text-gray-600">({expert.reviews})</span>
                          </div>
                          <span className="text-xs text-gray-600">
                            {expert.experience} {t('years exp', 'वर्ष अनुभव')}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {(language === 'en' ? expert.specialization : expert.specializationNepali).map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-emerald-600">
                              {formatCurrency(expert.consultationFee)}/session
                            </p>
                            <p className="text-xs text-gray-600">
                              {expert.languages.join(', ')}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={!expert.available}
                            >
                              <Video className="h-3 w-3 mr-1" />
                              {t('Video Call', 'भिडियो कल')}
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleBookConsultation(expert.id)}
                              disabled={!expert.available}
                              className="bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              {t('Book', 'बुक गर्नुहोस्')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="learn" className="p-4 space-y-3">
              {knowledgeArticles.map((article) => (
                <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {language === 'en' ? article.title : article.titleNepali}
                          </h3>
                        </div>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {language === 'en' ? article.summary : article.summaryNepali}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(article.difficulty)}>
                              {t(article.difficulty, article.difficulty === 'beginner' ? 'शुरुवाती' : article.difficulty === 'intermediate' ? 'मध्यम' : 'उन्नत')}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {language === 'en' ? article.category : article.categoryNepali}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{article.readTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>{article.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Video Tutorials */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Play className="h-5 w-5 text-blue-600" />
                    {t('Video Tutorials', 'भिडियो ट्यूटोरियलहरू')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Play className="h-4 w-4 mr-2 text-blue-600" />
                      {t('Organic Farming Basics', 'जैविक खेतीका आधारहरू')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Play className="h-4 w-4 mr-2 text-blue-600" />
                      {t('Pest Management Techniques', 'कीरा व्यवस्थापन प्रविधिहरू')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Play className="h-4 w-4 mr-2 text-blue-600" />
                      {t('Modern Irrigation Methods', 'आधुनिक सिंचाई विधिहरू')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Downloadable Guides */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Download className="h-5 w-5 text-emerald-600" />
                    {t('Downloadable Guides', 'डाउनलोड गर्न मिल्ने गाइडहरू')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2 text-emerald-600" />
                      {t('Crop Calendar 2024', 'बाली पञ्जिका २०२४')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2 text-emerald-600" />
                      {t('Soil Testing Guide', 'माटो परीक्षण गाइड')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="challenges" className="p-4 space-y-3">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden">
                  <div className="relative h-32">
                    <ImageWithFallback
                      src={challenge.image}
                      alt={challenge.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-emerald-500 text-white">
                        {t(challenge.status, challenge.status === 'active' ? 'सक्रिय' : 'समाप्त')}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-orange-500 text-white">
                        <Trophy className="h-3 w-3 mr-1" />
                        {formatCurrency(challenge.prize)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? challenge.title : challenge.titleNepali}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {language === 'en' ? challenge.description : challenge.descriptionNepali}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{challenge.participants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} {t('days left', 'दिन बाँकी')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600"
                      disabled={challenge.status !== 'active'}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      {t('Join Challenge', 'चुनौतीमा सामेल हुनुहोस्')}
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Leaderboard */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    {t('Top Contributors', 'शीर्ष योगदानकर्ताहरू')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: 'Ram Bahadur', nameNepali: 'राम बहादुर', points: 2450, rank: 1 },
                      { name: 'Sita Sharma', nameNepali: 'सीता शर्मा', points: 2380, rank: 2 },
                      { name: 'Krishna Thapa', nameNepali: 'कृष्ण थापा', points: 2250, rank: 3 }
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            user.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                            user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                            'bg-orange-300 text-orange-900'
                          }`}>
                            {user.rank}
                          </div>
                          <span className="text-sm font-medium">
                            {language === 'en' ? user.name : user.nameNepali}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">{user.points} pts</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};