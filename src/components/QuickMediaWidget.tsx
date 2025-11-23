import React, { useState, useRef } from 'react';
import { 
  Camera, Video, Mic, Upload, Plus, X, Check, 
  Sparkles, Share2, Heart, Star, MessageCircle,
  Send, Zap, Eye, Download, Edit, Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Language } from '../App';
import { motion, AnimatePresence } from 'motion/react';

interface QuickMediaWidgetProps {
  language: Language;
  context: 'product' | 'farm' | 'delivery' | 'general';
  contextId?: string;
  onMediaUpload?: (media: any[]) => void;
  onActionComplete?: (action: string, data?: any) => void;
  className?: string;
}

interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'audio';
  file: File;
  preview: string;
  caption: string;
  filters: string[];
  uploadProgress: number;
  uploaded: boolean;
}

export function QuickMediaWidget({ 
  language, 
  context, 
  contextId,
  onMediaUpload,
  onActionComplete,
  className = ''
}: QuickMediaWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'video' | 'audio'>('video');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const getContextActions = () => {
    switch (context) {
      case 'product':
        return [
          { 
            id: 'quick-photo', 
            icon: Camera, 
            label: t('Quick Photo', 'छिटो फोटो'),
            color: 'from-blue-500 to-cyan-500',
            action: () => triggerPhotoCapture()
          },
          { 
            id: 'review-video', 
            icon: Video, 
            label: t('Video Review', 'भिडियो समीक्षा'),
            color: 'from-red-500 to-pink-500',
            action: () => startVideoRecording()
          },
          { 
            id: 'voice-review', 
            icon: Mic, 
            label: t('Voice Note', 'आवाज नोट'),
            color: 'from-green-500 to-emerald-500',
            action: () => startAudioRecording()
          }
        ];
      case 'farm':
        return [
          { 
            id: 'crop-photo', 
            icon: Camera, 
            label: t('Crop Photo', 'बाली फोटो'),
            color: 'from-emerald-500 to-green-500',
            action: () => triggerPhotoCapture()
          },
          { 
            id: 'progress-video', 
            icon: Video, 
            label: t('Progress Video', 'प्रगति भिडियो'),
            color: 'from-orange-500 to-amber-500',
            action: () => startVideoRecording()
          },
          { 
            id: 'farm-update', 
            icon: Mic, 
            label: t('Farm Update', 'खेत अद्यावधिक'),
            color: 'from-teal-500 to-cyan-500',
            action: () => startAudioRecording()
          }
        ];
      case 'delivery':
        return [
          { 
            id: 'delivery-proof', 
            icon: Camera, 
            label: t('Delivery Proof', 'डेलिभरी प्रमाण'),
            color: 'from-purple-500 to-indigo-500',
            action: () => triggerPhotoCapture()
          },
          { 
            id: 'location-video', 
            icon: Video, 
            label: t('Location Video', 'स्थान भिडियो'),
            color: 'from-blue-500 to-purple-500',
            action: () => startVideoRecording()
          }
        ];
      default:
        return [
          { 
            id: 'quick-capture', 
            icon: Camera, 
            label: t('Quick Capture', 'छिटो क्याप्चर'),
            color: 'from-gray-500 to-gray-600',
            action: () => triggerPhotoCapture()
          }
        ];
    }
  };

  const triggerPhotoCapture = () => {
    fileInputRef.current?.click();
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
        await processMediaFile(file, 'video');
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType('video');
      
      toast.success(t('Video recording started', 'भिडियो रेकर्डिङ सुरु भयो'));
      
    } catch (error) {
      console.error('Error starting video recording:', error);
      toast.error(t('Failed to start video recording', 'भिडियो रेकर्डिङ सुरु गर्न सकिएन'));
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
        await processMediaFile(file, 'audio');
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType('audio');
      
      toast.success(t('Audio recording started', 'अडियो रेकर्डिङ सुरु भयो'));
      
    } catch (error) {
      console.error('Error starting audio recording:', error);
      toast.error(t('Failed to start audio recording', 'अडियो रेकर्डिङ सुरु गर्न सकिएन'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const processMediaFile = async (file: File, type: 'photo' | 'video' | 'audio') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const mediaItem: MediaItem = {
        id: Date.now().toString(),
        type,
        file,
        preview: e.target?.result as string,
        caption: '',
        filters: [],
        uploadProgress: 0,
        uploaded: false
      };
      
      setMediaItems(prev => [...prev, mediaItem]);
      simulateUpload(mediaItem.id);
      
      // Auto-expand to show preview
      setIsExpanded(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = async (files: FileList, type: 'photo' | 'video') => {
    for (let i = 0; i < files.length; i++) {
      await processMediaFile(files[i], type);
    }
  };

  const simulateUpload = (itemId: string) => {
    const interval = setInterval(() => {
      setMediaItems(prev => {
        const updated = prev.map(item => {
          if (item.id === itemId && item.uploadProgress < 100) {
            return { ...item, uploadProgress: item.uploadProgress + 20 };
          } else if (item.id === itemId && item.uploadProgress >= 100) {
            clearInterval(interval);
            return { ...item, uploaded: true };
          }
          return item;
        });
        return updated;
      });
    }, 300);
  };

  const removeMediaItem = (itemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItemCaption = (itemId: string, caption: string) => {
    setMediaItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, caption } : item
    ));
  };

  const shareAllMedia = () => {
    if (mediaItems.length === 0) {
      toast.error(t('No media to share', 'साझा गर्नको लागि कुनै मिडिया छैन'));
      return;
    }

    if (onMediaUpload) {
      onMediaUpload(mediaItems);
    }

    if (onActionComplete) {
      onActionComplete('media-share', {
        context,
        contextId,
        mediaCount: mediaItems.length,
        types: [...new Set(mediaItems.map(item => item.type))]
      });
    }

    toast.success(t('Media shared successfully!', 'मिडिया सफलतापूर्वक साझा गरियो!'));
    setMediaItems([]);
    setIsExpanded(false);
  };

  const actions = getContextActions();

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {isExpanded && mediaItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-emerald-200 dark:border-emerald-700 p-4 max-w-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {t('Captured Media', 'क्याप्चर गरिएको मिडिया')} ({mediaItems.length})
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {mediaItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {item.type === 'photo' && (
                        <img 
                          src={item.preview} 
                          alt="Captured" 
                          className="w-full h-full object-cover"
                        />
                      )}
                      {item.type === 'video' && (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      {item.type === 'audio' && (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Mic className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Upload Progress */}
                      {item.uploadProgress > 0 && !item.uploaded && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Progress value={item.uploadProgress} className="w-16" />
                        </div>
                      )}
                      
                      {/* Success Indicator */}
                      {item.uploaded && (
                        <div className="absolute top-1 right-1">
                          <div className="bg-green-500 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMediaItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      
                      {/* Type Badge */}
                      <Badge 
                        className="absolute bottom-1 left-1 text-xs"
                        variant={item.type === 'video' ? 'destructive' : item.type === 'audio' ? 'secondary' : 'default'}
                      >
                        {item.type === 'video' && <Video className="h-2 w-2" />}
                        {item.type === 'audio' && <Mic className="h-2 w-2" />}
                        {item.type === 'photo' && <Camera className="h-2 w-2" />}
                      </Badge>
                    </div>
                    
                    <Input
                      placeholder={t('Add caption...', 'क्याप्शन थप्नुहोस्...')}
                      value={item.caption}
                      onChange={(e) => updateItemCaption(item.id, e.target.value)}
                      className="mt-1 text-xs h-8"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={shareAllMedia}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white h-8 text-xs"
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  {t('Share All', 'सबै साझा गर्नुहोस्')}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setMediaItems([])}
                  className="h-8 text-xs border-emerald-200 dark:border-emerald-700"
                >
                  {t('Clear', 'खाली गर्नुहोस्')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 max-w-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {t('Recording', 'रेकर्ड गर्दै')} {recordingType === 'video' ? t('video', 'भिडियो') : t('audio', 'अडियो')}...
              </span>
            </div>
            <Button
              onClick={stopRecording}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white h-8 text-xs"
            >
              {t('Stop', 'रोक्नुहोस्')}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Widget */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex flex-col gap-2"
      >
        {/* Expanded Actions */}
        <AnimatePresence>
          {isExpanded && !isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-2"
            >
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      onClick={action.action}
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white dark:border-gray-800 group`}
                      size="icon"
                    >
                      <div className="flex flex-col items-center">
                        <Icon className="h-4 w-4 text-white group-hover:animate-bounce" />
                        <span className="text-xs text-white/90 mt-0.5 leading-none">
                          {action.label.split(' ')[0]}
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-orange-500 hover:from-emerald-600 hover:via-green-600 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white dark:border-gray-800 group ${
            isExpanded ? 'rotate-45' : ''
          }`}
          size="icon"
        >
          <div className="flex flex-col items-center">
            {isExpanded ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <>
                <Plus className="h-5 w-5 text-white mb-0.5" />
                <div className="flex gap-0.5">
                  <Camera className="h-2 w-2 text-white/80" />
                  <Video className="h-2 w-2 text-white/80" />
                  <Mic className="h-2 w-2 text-white/80" />
                </div>
              </>
            )}
          </div>
          
          {/* Notification Badge */}
          {mediaItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs bg-red-500 text-white border-2 border-white dark:border-gray-800 animate-bounce">
              {mediaItems.length}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFileSelect(e.target.files, 'photo')}
        className="hidden"
      />
      
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={(e) => e.target.files && handleFileSelect(e.target.files, 'video')}
        className="hidden"
      />
    </div>
  );
}