import React, { useState } from 'react';
import { 
  Star, Camera, Video, Mic, Send, ThumbsUp, ThumbsDown,
  Image as ImageIcon, FileVideo, Volume2, Play, Pause,
  Heart, Share2, Reply, MoreHorizontal, Flag, Verified,
  Award, ShoppingBag, Calendar, MapPin, Check, X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { Language } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { MediaUploadSystem } from './MediaUploadSystem';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  verified: boolean;
  rating: number;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  audio?: string;
  date: string;
  helpful: number;
  notHelpful: number;
  replies: ReviewReply[];
  purchaseVerified: boolean;
  tags: string[];
}

interface ReviewReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
}

interface ProductReviewSystemProps {
  productId: string;
  productName: string;
  language: Language;
  reviews?: Review[];
  onReviewSubmit?: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'notHelpful' | 'replies'>) => void;
  onClose?: () => void;
}

export function ProductReviewSystem({ 
  productId, 
  productName, 
  language, 
  reviews = [], 
  onReviewSubmit,
  onClose 
}: ProductReviewSystemProps) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewVideos, setReviewVideos] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'helpful'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Mock reviews for demonstration
  const mockReviews: Review[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'राम बहादुर',
      userAvatar: undefined,
      verified: true,
      rating: 5,
      title: t('Excellent quality!', 'उत्कृष्ट गुणस्तर!'),
      content: t('Very fresh vegetables, delivered on time. Highly recommended!', 'धेरै ताजा तरकारीहरू, समयमै डेलिभर भयो। अत्यधिक सिफारिस!'),
      images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'],
      videos: [],
      date: '2024-01-15',
      helpful: 12,
      notHelpful: 1,
      replies: [
        {
          id: 'r1',
          userId: 'farmer1',
          userName: 'किसान दाजु',
          content: t('Thank you for your feedback!', 'तपाईंको प्रतिक्रियाको लागि धन्यवाद!'),
          date: '2024-01-16'
        }
      ],
      purchaseVerified: true,
      tags: ['fresh', 'on-time', 'quality']
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'सीता देवी',
      verified: false,
      rating: 4,
      title: t('Good but could be better', 'राम्रो तर अझ राम्रो हुन सक्छ'),
      content: t('Good quality products but packaging could be improved.', 'राम्रो गुणस्तरका उत्पादनहरू तर प्याकेजिङ सुधार गर्न सकिन्छ।'),
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
      videos: ['https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4'],
      date: '2024-01-10',
      helpful: 8,
      notHelpful: 2,
      replies: [],
      purchaseVerified: true,
      tags: ['packaging', 'quality']
    }
  ];

  const allReviews = [...mockReviews, ...reviews];

  const averageRating = allReviews.length > 0 
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
    : 0;

  const ratingDistribution = {
    5: allReviews.filter(r => r.rating === 5).length,
    4: allReviews.filter(r => r.rating === 4).length,
    3: allReviews.filter(r => r.rating === 3).length,
    2: allReviews.filter(r => r.rating === 2).length,
    1: allReviews.filter(r => r.rating === 1).length,
  };

  const reviewTags = [
    { id: 'fresh', label: t('Fresh', 'ताजा'), color: 'green' },
    { id: 'quality', label: t('Quality', 'गुणस्तर'), color: 'blue' },
    { id: 'packaging', label: t('Packaging', 'प्याकेजिङ'), color: 'purple' },
    { id: 'delivery', label: t('Delivery', 'डेलिभरी'), color: 'orange' },
    { id: 'price', label: t('Price', 'मूल्य'), color: 'yellow' },
    { id: 'organic', label: t('Organic', 'अर्गानिक'), color: 'emerald' },
    { id: 'taste', label: t('Taste', 'स्वाद'), color: 'pink' },
    { id: 'service', label: t('Service', 'सेवा'), color: 'indigo' }
  ];

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleMediaUpload = (files: any[]) => {
    const images = files.filter(f => f.type === 'image').map(f => f.preview);
    const videos = files.filter(f => f.type === 'video').map(f => f.preview);
    
    setReviewImages(prev => [...prev, ...images]);
    setReviewVideos(prev => [...prev, ...videos]);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const submitReview = () => {
    if (rating === 0) {
      toast.error(t('Please select a rating', 'कृपया मूल्याङ्कन छान्नुहोस्'));
      return;
    }

    if (!content.trim()) {
      toast.error(t('Please write a review', 'कृपया समीक्षा लेख्नुहोस्'));
      return;
    }

    const newReview = {
      userId: 'current-user',
      userName: t('You', 'तपाईं'),
      verified: true,
      rating,
      title,
      content,
      images: reviewImages,
      videos: reviewVideos,
      purchaseVerified: true,
      tags: selectedTags
    };

    if (onReviewSubmit) {
      onReviewSubmit(newReview);
    }

    // Reset form
    setRating(0);
    setTitle('');
    setContent('');
    setReviewImages([]);
    setReviewVideos([]);
    setSelectedTags([]);
    setShowAddReview(false);

    toast.success(t('Review submitted successfully!', 'समीक्षा सफलतापूर्वक पेश गरियो!'));
  };

  const filteredAndSortedReviews = allReviews
    .filter(review => filterBy === 'all' || review.rating === parseInt(filterBy))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  const renderStars = (rating: number, interactive = false, size = 'h-4 w-4') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => handleStarClick(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent">
            {t('Product Reviews', 'उत्पादन समीक्षाहरू')}
          </DialogTitle>
          <DialogDescription>
            {productName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Review Statistics */}
          <div className="bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20 rounded-xl p-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">{averageRating.toFixed(1)}</div>
                {renderStars(Math.round(averageRating), false, 'h-5 w-5')}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {allReviews.length} {t('reviews', 'समीक्षाहरू')}
                </p>
              </div>
              
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{stars}★</span>
                    <Progress 
                      value={(ratingDistribution[stars as keyof typeof ratingDistribution] / allReviews.length) * 100} 
                      className="flex-1 h-2" 
                    />
                    <span className="w-8 text-right text-gray-600 dark:text-gray-400">
                      {ratingDistribution[stars as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Write Review Button */}
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddReview(true)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
            >
              <Star className="h-4 w-4 mr-2" />
              {t('Write Review', 'समीक्षा लेख्नुहोस्')}
            </Button>
            
            <Button
              onClick={() => setShowAddReview(true)}
              variant="outline"
              className="border-emerald-200 dark:border-emerald-700"
            >
              <Camera className="h-4 w-4 mr-2" />
              {t('Photo Review', 'फोटो समीक्षा')}
            </Button>
          </div>

          {/* Add Review Modal */}
          {showAddReview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-emerald-200 dark:border-emerald-700 rounded-xl p-6 bg-white dark:bg-gray-800"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t('Write Your Review', 'आफ्नो समीक्षा लेख्नुहोस्')}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddReview(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('Your Rating', 'तपाईंको मूल्याङ्कन')}
                  </label>
                  {renderStars(rating, true, 'h-8 w-8')}
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('Review Title', 'समीक्षा शीर्षक')}
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('Summarize your experience...', 'आफ्नो अनुभवको सारांश...')}
                    className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('Your Review', 'तपाईंको समीक्षा')}
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t('Tell others about your experience...', 'अरूलाई आफ्नो अनुभवको बारेमा भन्नुहोस्...')}
                    className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700"
                    rows={4}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('Tags (Optional)', 'ट्यागहरू (वैकल्पिक)')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {reviewTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedTags.includes(tag.id) 
                            ? `bg-${tag.color}-500 text-white hover:bg-${tag.color}-600` 
                            : `border-${tag.color}-300 text-${tag.color}-600 hover:bg-${tag.color}-50`
                        }`}
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Media Upload */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('Add Photos/Videos', 'फोटो/भिडियो थप्नुहोस्')}
                  </label>
                  <MediaUploadSystem
                    language={language}
                    maxFiles={5}
                    acceptedTypes={['image', 'video']}
                    onUploadComplete={handleMediaUpload}
                    showPreview={true}
                    allowMultiple={true}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={submitReview}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t('Submit Review', 'समीक्षा पेश गर्नुहोस्')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowAddReview(false)}
                    className="border-emerald-200 dark:border-emerald-700"
                  >
                    {t('Cancel', 'रद्द गर्नुहोस्')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters and Sort */}
          <div className="flex gap-2 flex-wrap">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-auto bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('Newest First', 'नयाँ पहिले')}</SelectItem>
                <SelectItem value="oldest">{t('Oldest First', 'पुराना पहिले')}</SelectItem>
                <SelectItem value="rating">{t('Highest Rating', 'उच्च मूल्याङ्कन')}</SelectItem>
                <SelectItem value="helpful">{t('Most Helpful', 'सबैभन्दा सहयोगी')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-auto bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All Ratings', 'सबै मूल्याङ्कन')}</SelectItem>
                <SelectItem value="5">5 ⭐</SelectItem>
                <SelectItem value="4">4 ⭐</SelectItem>
                <SelectItem value="3">3 ⭐</SelectItem>
                <SelectItem value="2">2 ⭐</SelectItem>
                <SelectItem value="1">1 ⭐</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredAndSortedReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-emerald-200 dark:border-emerald-700">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.userAvatar} />
                              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{review.userName}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Verified className="h-3 w-3 mr-1" />
                                    {t('Verified', 'प्रमाणित')}
                                  </Badge>
                                )}
                                {review.purchaseVerified && (
                                  <Badge variant="outline" className="text-xs">
                                    <ShoppingBag className="h-3 w-3 mr-1" />
                                    {t('Verified Purchase', 'प्रमाणित खरिदारी')}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Review Content */}
                        <div>
                          {review.title && (
                            <h4 className="font-medium mb-2">{review.title}</h4>
                          )}
                          <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                        </div>

                        {/* Tags */}
                        {review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {review.tags.map((tag) => {
                              const tagInfo = reviewTags.find(t => t.id === tag);
                              return tagInfo ? (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tagInfo.label}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}

                        {/* Media */}
                        {(review.images.length > 0 || review.videos.length > 0) && (
                          <div className="grid grid-cols-3 gap-2">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt="Review"
                                className="aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              />
                            ))}
                            {review.videos.map((video, index) => (
                              <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer">
                                <Play className="h-8 w-8 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {t('Helpful', 'सहयोगी')} ({review.helpful})
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-600">
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              ({review.notHelpful})
                            </Button>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Reply className="h-4 w-4 mr-1" />
                              {t('Reply', 'जवाफ')}
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Replies */}
                        {review.replies.length > 0 && (
                          <div className="ml-6 space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            {review.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={reply.userAvatar} />
                                  <AvatarFallback>{reply.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{reply.userName}</span>
                                    <span className="text-xs text-gray-500">{reply.date}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredAndSortedReviews.length === 0 && (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('No reviews yet', 'अहिलेसम्म कुनै समीक्षा छैन')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t('Be the first to review this product!', 'यस उत्पादनको समीक्षा गर्ने पहिलो व्यक्ति बन्नुहोस्!')}
              </p>
              <Button
                onClick={() => setShowAddReview(true)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
              >
                <Star className="h-4 w-4 mr-2" />
                {t('Write First Review', 'पहिलो समीक्षा लेख्नुहोस्')}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}