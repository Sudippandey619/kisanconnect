import React, { useState, useRef } from 'react';
import { 
  Camera, Video, Mic, Upload, Plus, X, Check, 
  Search, Star, MapPin, ShoppingBag, Truck, 
  Sparkles, Zap, Gift, Trophy, Target, Package,
  MessageCircle, Share2, Heart, Bookmark, Eye,
  Settings, BarChart3, Users, Bell, Clock, Globe,
  ArrowLeft, Grid, List, Image as ImageIcon,
  FileVideo, Volume2, Send
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { User, Language, UserRole } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { MediaUploadSystem } from './MediaUploadSystem';

interface QuickActionsHubProps {
  user: User;
  language: Language;
  onClose: () => void;
  onActionComplete?: (action: string, data?: any) => void;
}

export function QuickActionsHub({ user, language, onClose, onActionComplete }: QuickActionsHubProps) {
  const [activeMode, setActiveMode] = useState<'actions' | 'media' | 'voice' | 'social'>('actions');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceMessage, setVoiceMessage] = useState('');
  
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Enhanced Quick Actions based on user role
  const getQuickActions = () => {
    const baseActions = [
      {
        id: 'quick-photo',
        icon: Camera,
        label: t('Quick Photo', 'छिटो फोटो'),
        color: 'from-blue-500 to-cyan-500',
        description: t('Take or upload photos instantly', 'तुरुन्त फोटो खिच्नुहोस् वा अपलोड गर्नुहोस्'),
        action: () => setActiveMode('media')
      },
      {
        id: 'voice-message',
        icon: Mic,
        label: t('Voice Message', 'आवाज सन्देश'),
        color: 'from-green-500 to-emerald-500',
        description: t('Send voice messages', 'आवाज सन्देशहरू पठाउनुहोस्'),
        action: () => setActiveMode('voice')
      },
      {
        id: 'ai-search',
        icon: Search,
        label: t('AI Search', 'AI खोज'),
        color: 'from-purple-500 to-indigo-500',
        description: t('Search with AI assistance', 'AI सहायताको साथ खोज्नुहोस्'),
        action: () => handleQuickSearch()
      },
      {
        id: 'social-share',
        icon: Share2,
        label: t('Quick Share', 'छिटो साझा'),
        color: 'from-pink-500 to-rose-500',
        description: t('Share content quickly', 'छिटो सामग्री साझा गर्नुहोस्'),
        action: () => setActiveMode('social')
      }
    ];

    // Role-specific actions
    if (user.currentRole === 'farmer') {
      baseActions.push(
        {
          id: 'add-product',
          icon: Plus,
          label: t('Add Product', 'उत्पादन थप्नुहोस्'),
          color: 'from-orange-500 to-amber-500',
          description: t('Quickly add new products', 'छिटो नयाँ उत्पादन थप्नुहोस्'),
          action: () => handleAddProduct()
        },
        {
          id: 'farm-update',
          icon: MapPin,
          label: t('Farm Update', 'खेत अद्यावधिक'),
          color: 'from-teal-500 to-green-500',
          description: t('Share farm progress', 'खेतको प्रगति साझा गर्नुहोस्'),
          action: () => handleFarmUpdate()
        }
      );
    } else if (user.currentRole === 'consumer') {
      baseActions.push(
        {
          id: 'quick-order',
          icon: ShoppingBag,
          label: t('Quick Order', 'छिटो अर्डर'),
          color: 'from-orange-500 to-red-500',
          description: t('Place order quickly', 'छिटो अर्डर गर्नुहोस्'),
          action: () => handleQuickOrder()
        },
        {
          id: 'rate-review',
          icon: Star,
          label: t('Rate & Review', 'मूल्याङ्कन र समीक्षा'),
          color: 'from-yellow-500 to-orange-500',
          description: t('Rate and review purchases', 'खरिदारीको मूल्याङ्कन र समीक्षा'),
          action: () => handleRateReview()
        }
      );
    } else if (user.currentRole === 'driver') {
      baseActions.push(
        {
          id: 'delivery-update',
          icon: Truck,
          label: t('Delivery Update', 'डेलिभरी अद्यावधिक'),
          color: 'from-blue-500 to-purple-500',
          description: t('Update delivery status', 'डेलिभरी स्थिति अद्यावधिक'),
          action: () => handleDeliveryUpdate()
        },
        {
          id: 'location-share',
          icon: MapPin,
          label: t('Share Location', 'स्थान साझा'),
          color: 'from-green-500 to-blue-500',
          description: t('Share current location', 'वर्तमान स्थान साझा गर्नुहोस्'),
          action: () => handleLocationShare()
        }
      );
    }

    return baseActions;
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      voiceRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        // Process voice message
        toast.success(t('Voice message recorded', 'आवाज सन्देश रेकर्ड भयो'));
        
        if (onActionComplete) {
          onActionComplete('voice-message', { 
            audio: url, 
            duration: recordingDuration,
            message: voiceMessage 
          });
        }
        
        // Clean up
        if (voiceStreamRef.current) {
          voiceStreamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        setRecordingDuration(0);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start duration timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success(t('Voice recording started', 'आवाज रेकर्डिङ सुरु भयो'));
      
    } catch (error) {
      console.error('Error starting voice recording:', error);
      toast.error(t('Failed to start recording', 'रेकर्डिङ सुरु गर्न सकिएन'));
    }
  };

  const stopVoiceRecording = () => {
    if (voiceRecorderRef.current && isRecording) {
      voiceRecorderRef.current.stop();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleQuickSearch = () => {
    if (onActionComplete) {
      onActionComplete('ai-search');
    }
    onClose();
  };

  const handleAddProduct = () => {
    if (onActionComplete) {
      onActionComplete('add-product');
    }
    onClose();
  };

  const handleFarmUpdate = () => {
    setActiveMode('media');
    setSelectedAction('farm-update');
  };

  const handleQuickOrder = () => {
    if (onActionComplete) {
      onActionComplete('quick-order');
    }
    onClose();
  };

  const handleRateReview = () => {
    if (onActionComplete) {
      onActionComplete('rate-review');
    }
    onClose();
  };

  const handleDeliveryUpdate = () => {
    if (onActionComplete) {
      onActionComplete('delivery-update');
    }
    onClose();
  };

  const handleLocationShare = () => {
    if (onActionComplete) {
      onActionComplete('location-share');
    }
    onClose();
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const quickActions = getQuickActions();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {activeMode !== 'actions' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveMode('actions')}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent">
              {activeMode === 'actions' && t('Quick Actions Hub', 'द्रुत कार्य केन्द्र')}
              {activeMode === 'media' && t('Media Upload', 'मिडिया अपलोड')}
              {activeMode === 'voice' && t('Voice Message', 'आवाज सन्देश')}
              {activeMode === 'social' && t('Social Share', 'सामाजिक साझा')}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {activeMode === 'actions' && t('Access quick actions and shortcuts', 'द्रुत कार्य र सर्टकटहरू पहुँच गर्नुहोस्')}
              {activeMode === 'media' && t('Upload and manage media files', 'मिडिया फाइलहरू अपलोड र व्यवस्थापन गर्नुहोस्')}
              {activeMode === 'voice' && t('Record and send voice messages', 'आवाज सन्देशहरू रेकर्ड र पठाउनुहोस्')}
              {activeMode === 'social' && t('Share content on social media', 'सामाजिक मिडियामा सामग्री साझा गर्नुहोस्')}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Actions Grid */}
          {activeMode === 'actions' && (
            <div className="space-y-4">
              {/* Primary Actions */}
              <div className="grid grid-cols-2 gap-3">
                {quickActions.slice(0, 4).map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-emerald-200 dark:border-emerald-700 bg-gradient-to-br ${action.color} text-white overflow-hidden relative group`}
                        onClick={action.action}
                      >
                        <CardContent className="p-4 text-center relative z-10">
                          <Icon className="h-8 w-8 mx-auto mb-2 group-hover:animate-bounce" />
                          <h3 className="font-medium text-sm mb-1">{action.label}</h3>
                          <p className="text-xs opacity-90 leading-tight">{action.description}</p>
                        </CardContent>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Secondary Actions */}
              {quickActions.length > 4 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('Role Specific', 'भूमिका विशिष्ट')}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {quickActions.slice(4).map((action) => {
                      const Icon = action.icon;
                      return (
                        <motion.div
                          key={action.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className="cursor-pointer transition-all duration-300 hover:shadow-md border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800"
                            onClick={action.action}
                          >
                            <CardContent className="p-3 flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} text-white`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{action.label}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Access Tabs */}
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="recent">{t('Recent', 'हालका')}</TabsTrigger>
                  <TabsTrigger value="favorites">{t('Favorites', 'मनपर्ने')}</TabsTrigger>
                  <TabsTrigger value="trending">{t('Trending', 'ट्रेन्डिङ')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent" className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                      <Camera className="h-3 w-3 mr-1" />
                      {t('Product Photos', 'उत्पादन फोटो')}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {t('Customer Chat', 'ग्राहक च्याट')}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                      <MapPin className="h-3 w-3 mr-1" />
                      {t('Location Update', 'स्थान अद्यावधिक')}
                    </Badge>
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites" className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20">
                      <Heart className="h-3 w-3 mr-1" />
                      {t('Quick Order', 'छिटो अर्डर')}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20">
                      <Star className="h-3 w-3 mr-1" />
                      {t('Rate Products', 'उत्पादन मूल्याङ्कन')}
                    </Badge>
                  </div>
                </TabsContent>
                
                <TabsContent value="trending" className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <Video className="h-3 w-3 mr-1" />
                      {t('Farm Videos', 'खेत भिडियो')}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {t('AI Tips', 'AI सुझावहरू')}
                    </Badge>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Media Upload Mode */}
          {activeMode === 'media' && (
            <div className="space-y-4">
              <MediaUploadSystem
                language={language}
                maxFiles={5}
                acceptedTypes={['image', 'video']}
                onUploadComplete={(files) => {
                  if (onActionComplete) {
                    onActionComplete('media-upload', { 
                      files: files.map(f => f.file.name),
                      action: selectedAction 
                    });
                  }
                  onClose();
                }}
                showPreview={true}
                allowMultiple={true}
              />
            </div>
          )}

          {/* Voice Message Mode */}
          {activeMode === 'voice' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isRecording 
                    ? 'bg-red-100 dark:bg-red-900/30 animate-pulse' 
                    : 'bg-emerald-100 dark:bg-emerald-900/30'
                }`}>
                  <Mic className={`h-12 w-12 ${
                    isRecording ? 'text-red-500' : 'text-emerald-500'
                  }`} />
                </div>
                
                {isRecording ? (
                  <div className="space-y-4">
                    <div className="text-red-600 dark:text-red-400">
                      <p className="text-lg font-medium">{t('Recording...', 'रेकर्ड गर्दै...')}</p>
                      <p className="text-2xl font-mono">{formatRecordingTime(recordingDuration)}</p>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={stopVoiceRecording}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        {t('Stop & Send', 'रोक्नुहोस् र पठाउनुहोस्')}
                      </Button>
                      
                      <Button
                        onClick={() => {
                          stopVoiceRecording();
                          setRecordingDuration(0);
                        }}
                        variant="outline"
                        className="px-8 py-3"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t('Cancel', 'रद्द गर्नुहोस्')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {t('Record Voice Message', 'आवाज सन्देश रेकर्ड गर्नुहोस्')}
                    </h3>
                    
                    <Textarea
                      placeholder={t('Add a text message (optional)...', 'पाठ सन्देश थप्नुहोस् (वैकल्पिक)...')}
                      value={voiceMessage}
                      onChange={(e) => setVoiceMessage(e.target.value)}
                      className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700"
                      rows={3}
                    />
                    
                    <Button
                      onClick={startVoiceRecording}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      {t('Start Recording', 'रेकर्डिङ सुरु गर्नुहोस्')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Share Mode */}
          {activeMode === 'social' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card className="cursor-pointer hover:shadow-md transition-all duration-300 border-emerald-200 dark:border-emerald-700">
                  <CardContent className="p-4 text-center">
                    <Share2 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">{t('Share Post', 'पोस्ट साझा')}</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-all duration-300 border-emerald-200 dark:border-emerald-700">
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">{t('Send Message', 'सन्देश पठाउनुहोस्')}</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-all duration-300 border-emerald-200 dark:border-emerald-700">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                    <p className="text-sm font-medium">{t('Like & React', 'मनपर्यो र प्रतिक्रिया')}</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-all duration-300 border-emerald-200 dark:border-emerald-700">
                  <CardContent className="p-4 text-center">
                    <Bookmark className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm font-medium">{t('Save & Bookmark', 'बचत र बुकमार्क')}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}