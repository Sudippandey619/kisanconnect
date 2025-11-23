import React, { useState, useRef } from 'react';
import { Camera, Upload, Shield, Award, Star, CheckCircle, AlertTriangle, Zap, Brain, Sparkles, Eye, TrendingUp, Clock, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { User, Language } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface QualityAnalysis {
  overall: number;
  freshness: number;
  appearance: number;
  size: number;
  color: number;
  defects: string[];
  recommendations: string[];
  certifications: string[];
  shelfLife: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
}

interface Certification {
  id: string;
  name: string;
  nameNepali: string;
  description: string;
  descriptionNepali: string;
  issuer: string;
  validUntil: string;
  verificationCode: string;
  icon: string;
  verified: boolean;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userRole: 'farmer' | 'consumer' | 'driver';
  rating: number;
  comment: string;
  commentNepali: string;
  images: string[];
  timestamp: string;
  helpful: number;
  verified: boolean;
}

interface Props {
  user: User;
  language: Language;
  onClose: () => void;
  productId?: string;
}

export const QualityAssuranceSystem: React.FC<Props> = ({ user, language, onClose, productId }) => {
  const [activeTab, setActiveTab] = useState('scan');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<QualityAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [certifications] = useState<Certification[]>([
    {
      id: 'cert_1',
      name: 'Organic Certified',
      nameNepali: 'जैविक प्रमाणित',
      description: 'Certified organic farming practices without pesticides',
      descriptionNepali: 'कीटनाशक बिना जैविक खेती अभ्यास प्रमाणित',
      issuer: 'Nepal Organic Certification Board',
      validUntil: new Date(Date.now() + 31536000000).toISOString(),
      verificationCode: 'NOC-2024-001234',
      icon: '🌱',
      verified: true
    },
    {
      id: 'cert_2',
      name: 'Pesticide-Free',
      nameNepali: 'कीटनाशक मुक्त',
      description: 'No chemical pesticides used in production',
      descriptionNepali: 'उत्पादनमा कुनै रासायनिक कीटनाशक प्रयोग गरिएको छैन',
      issuer: 'Food Safety Authority',
      validUntil: new Date(Date.now() + 15768000000).toISOString(),
      verificationCode: 'FSA-2024-005678',
      icon: '🚫',
      verified: true
    },
    {
      id: 'cert_3',
      name: 'Local Farm Fresh',
      nameNepali: 'स्थानीय फार्म ताजा',
      description: 'Locally grown within 50km radius',
      descriptionNepali: '५० किमी दायरा भित्र स्थानीय रूपमा उत्पादित',
      issuer: 'Local Agriculture Board',
      validUntil: new Date(Date.now() + 7884000000).toISOString(),
      verificationCode: 'LAB-2024-009012',
      icon: '🏡',
      verified: true
    }
  ]);

  const [reviews] = useState<Review[]>([
    {
      id: 'review_1',
      userId: 'user_1',
      userName: 'Sita Sharma',
      userRole: 'consumer',
      rating: 5,
      comment: 'Excellent quality! Very fresh tomatoes.',
      commentNepali: 'उत्कृष्ट गुणस्तर! धेरै ताजा गोलभेडा।',
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'],
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      helpful: 12,
      verified: true
    },
    {
      id: 'review_2',
      userId: 'user_2',
      userName: 'Krishna Thapa',
      userRole: 'consumer',
      rating: 4,
      comment: 'Good quality, delivered on time.',
      commentNepali: 'राम्रो गुणस्तर, समयमा डेलिभर भयो।',
      images: [],
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      helpful: 8,
      verified: true
    }
  ]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeQuality = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysis: QualityAnalysis = {
      overall: 87,
      freshness: 92,
      appearance: 85,
      size: 78,
      color: 89,
      defects: ['Minor bruising on 2 pieces', 'Slight size variation'],
      recommendations: [
        'Store in cool, dry place',
        'Use within 5-7 days for best quality',
        'Remove any damaged pieces to prevent spoilage'
      ],
      certifications: ['organic', 'pesticide-free'],
      shelfLife: 7,
      grade: 'A'
    };

    setAnalysisResult(mockAnalysis);
    setIsAnalyzing(false);
    toast.success(t('Quality analysis complete!', 'गुणस्तर विश्लेषण पूरा भयो!'));
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20';
      case 'A': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'B+': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'B': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'C': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              <h2 className="text-lg font-bold">{t('Quality Assurance', 'गुणस्तर आश्वासन')}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              ×
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8" />
                <div>
                  <h3 className="font-bold">{t('AI-Powered Quality Check', 'AI-संचालित गुणस्तर जाँच')}</h3>
                  <p className="text-sm opacity-90">
                    {t('Advanced image analysis for crop quality', 'बाली गुणस्तरको लागि उन्नत छवि विश्लेषण')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="scan" className="text-xs">
                {t('Scan', 'स्क्यान')}
              </TabsTrigger>
              <TabsTrigger value="certifications" className="text-xs">
                {t('Certs', 'प्रमाणपत्र')}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs">
                {t('Reviews', 'समीक्षाहरू')}
              </TabsTrigger>
              <TabsTrigger value="guarantee" className="text-xs">
                {t('Guarantee', 'ग्यारेन्टी')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="p-4 space-y-4">
              {/* Image Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    {t('Upload Crop Image', 'बाली छवि अपलोड गर्नुहोस्')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!uploadedImage ? (
                    <div className="space-y-3">
                      <div 
                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm font-medium">{t('Click to upload image', 'छवि अपलोड गर्न क्लिक गर्नुहोस्')}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {t('Supported: JPG, PNG, HEIC', 'समर्थित: JPG, PNG, HEIC')}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4 mr-2" />
                          {t('Upload', 'अपलोड')}
                        </Button>
                        <Button variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          {t('Camera', 'क्यामेरा')}
                        </Button>
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded crop" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setUploadedImage(null);
                            setAnalysisResult(null);
                          }}
                          className="absolute top-2 right-2"
                        >
                          ×
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={analyzeQuality}
                        disabled={isAnalyzing}
                        className="w-full bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t('Analyzing...', 'विश्लेषण गर्दै...')}
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            {t('Analyze Quality', 'गुणस्तर विश्लेषण गर्नुहोस्')}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {analysisResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      {t('AI Analysis Results', 'AI विश्लेषण परिणामहरू')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Overall Grade */}
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${getGradeColor(analysisResult.grade)}`}>
                        <Award className="h-5 w-5" />
                        {t('Grade:', 'ग्रेड:')} {analysisResult.grade}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {t('Overall Quality Score:', 'समग्र गुणस्तर स्कोर:')} {analysisResult.overall}%
                      </p>
                    </div>

                    {/* Quality Metrics */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t('Freshness', 'ताजापन')}</span>
                          <span>{analysisResult.freshness}%</span>
                        </div>
                        <Progress value={analysisResult.freshness} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t('Appearance', 'देखावट')}</span>
                          <span>{analysisResult.appearance}%</span>
                        </div>
                        <Progress value={analysisResult.appearance} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t('Color Quality', 'रंग गुणस्तर')}</span>
                          <span>{analysisResult.color}%</span>
                        </div>
                        <Progress value={analysisResult.color} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t('Size Consistency', 'आकार एकरूपता')}</span>
                          <span>{analysisResult.size}%</span>
                        </div>
                        <Progress value={analysisResult.size} className="h-2" />
                      </div>
                    </div>

                    {/* Shelf Life */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                          {t('Estimated Shelf Life:', 'अनुमानित शेल्फ जीवन:')} {analysisResult.shelfLife} {t('days', 'दिन')}
                        </span>
                      </div>
                    </div>

                    {/* Defects */}
                    {analysisResult.defects.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                            {t('Minor Issues Detected', 'सानातिना समस्याहरू पत्ता लागे')}
                          </span>
                        </div>
                        <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                          {analysisResult.defects.map((defect, index) => (
                            <li key={index}>• {defect}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                          {t('Storage Recommendations', 'भण्डारण सिफारिसहरू')}
                        </span>
                      </div>
                      <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="certifications" className="p-4 space-y-3">
              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{cert.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            {language === 'en' ? cert.name : cert.nameNepali}
                          </h3>
                          {cert.verified && (
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('Verified', 'प्रमाणित')}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {language === 'en' ? cert.description : cert.descriptionNepali}
                        </p>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <p><strong>{t('Issuer:', 'जारीकर्ता:')}</strong> {cert.issuer}</p>
                          <p><strong>{t('Valid Until:', 'को सम्म मान्य:')}</strong> {formatDate(cert.validUntil)}</p>
                          <p><strong>{t('Code:', 'कोड:')}</strong> {cert.verificationCode}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">
                + {t('Apply for New Certification', 'नयाँ प्रमाणीकरणको लागि आवेदन दिनुहोस्')}
              </Button>
            </TabsContent>

            <TabsContent value="reviews" className="p-4 space-y-3">
              {/* Summary Stats */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">4.7</p>
                      <div className="flex items-center justify-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">247 {t('reviews', 'समीक्षाहरू')}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">96%</p>
                      <p className="text-xs text-gray-600">{t('Satisfaction', 'सन्तुष्टि')}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">89%</p>
                      <p className="text-xs text-gray-600">{t('Repeat Buyers', 'दोहोरिने खरिदारहरू')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {review.userName.charAt(0)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{review.userName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {review.userRole === 'farmer' ? '👨‍🌾' : review.userRole === 'consumer' ? '🛒' : '🚚'}
                          </Badge>
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('Verified', 'प्रमाणित')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3 w-3 ${
                                star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">
                            {formatDate(review.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {language === 'en' ? review.comment : review.commentNepali}
                        </p>
                        
                        {review.images.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {review.images.map((image, index) => (
                              <img 
                                key={index}
                                src={image} 
                                alt="Review" 
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            👍 {t('Helpful', 'उपयोगी')} ({review.helpful})
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            {t('Reply', 'जवाफ दिनुहोस्')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">
                {t('Write a Review', 'समीक्षा लेख्नुहोस्')}
              </Button>
            </TabsContent>

            <TabsContent value="guarantee" className="p-4 space-y-4">
              <Card className="bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Medal className="h-8 w-8 text-emerald-600" />
                    <div>
                      <h3 className="font-bold text-emerald-800 dark:text-emerald-400">
                        {t('Freshness Guarantee', 'ताजापन ग्यारेन्टी')}
                      </h3>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        {t('100% satisfaction or money back', '१००% सन्तुष्टि वा पैसा फिर्ता')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>{t('7-day freshness guarantee', '७ दिनको ताजापन ग्यारेन्टी')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>{t('Free replacement if not satisfied', 'सन्तुष्ट नभएमा निःशुल्क प्रतिस्थापन')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>{t('Quality verified by AI', 'AI द्वारा गुणस्तर प्रमाणित')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('How It Works', 'यो कसरी काम गर्छ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <div>
                        <p className="text-sm font-medium">{t('Order & Receive', 'अर्डर र प्राप्त गर्नुहोस्')}</p>
                        <p className="text-xs text-gray-600">{t('Get your fresh produce delivered', 'तपाईंको ताजा उत्पादन डेलिभर गराउनुहोस्')}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <div>
                        <p className="text-sm font-medium">{t('Check Quality', 'गुणस्तर जाँच गर्नुहोस्')}</p>
                        <p className="text-xs text-gray-600">{t('Inspect freshness within 24 hours', '२४ घण्टा भित्र ताजापन जाँच गर्नुहोस्')}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <div>
                        <p className="text-sm font-medium">{t('Report Issues', 'समस्या रिपोर्ट गर्नुहोस्')}</p>
                        <p className="text-xs text-gray-600">{t('Contact us if not satisfied', 'सन्तुष्ट नभएमा हामीलाई सम्पर्क गर्नुहोस��')}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <div>
                        <p className="text-sm font-medium">{t('Get Refund/Replacement', 'फिर्ता/प्रतिस्थापन पाउनुहोस्')}</p>
                        <p className="text-xs text-gray-600">{t('Quick resolution within 2 hours', '२ घण्टा भित्र द्रुत समाधान')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600">
                {t('Report Quality Issue', 'गुणस्तर समस्या रिपोर्ट गर्नुहोस्')}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};