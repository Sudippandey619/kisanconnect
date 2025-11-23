import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, Camera, Video, Mic, Image as ImageIcon, 
  FileVideo, X, Check, Play, Pause, Download,
  Maximize, RotateCw, Crop, Filter, Sparkles,
  Volume2, VolumeX, Rewind, FastForward,
  Edit, Share2, Heart, Bookmark, Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../App';

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'audio';
  preview: string;
  thumbnail?: string;
  duration?: number;
  size: string;
  uploadProgress: number;
  uploaded: boolean;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
  };
  tags: string[];
  description: string;
  category: string;
}

interface MediaUploadSystemProps {
  language: Language;
  maxFiles?: number;
  acceptedTypes?: ('image' | 'video' | 'audio')[];
  onUploadComplete?: (files: MediaFile[]) => void;
  onFilesChange?: (files: MediaFile[]) => void;
  showPreview?: boolean;
  showEditor?: boolean;
  allowMultiple?: boolean;
}

export function MediaUploadSystem({
  language,
  maxFiles = 10,
  acceptedTypes = ['image', 'video', 'audio'],
  onUploadComplete,
  onFilesChange,
  showPreview = true,
  showEditor = false,
  allowMultiple = true
}: MediaUploadSystemProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showEditorDialog, setShowEditorDialog] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'video' | 'audio'>('video');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateThumbnail = (file: File, type: 'image' | 'video'): Promise<string> => {
    return new Promise((resolve) => {
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (type === 'video') {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          video.currentTime = 1; // Seek to 1 second for thumbnail
        };
        
        video.onseeked = () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            resolve(canvas.toDataURL());
          }
        };
        
        video.src = URL.createObjectURL(file);
      }
    });
  };

  const getMediaMetadata = (file: File, type: 'image' | 'video' | 'audio'): Promise<any> => {
    return new Promise((resolve) => {
      if (type === 'image') {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
            format: file.type
          });
        };
        img.src = URL.createObjectURL(file);
      } else if (type === 'video' || type === 'audio') {
        const element = type === 'video' 
          ? document.createElement('video')
          : document.createElement('audio');
        
        element.onloadedmetadata = () => {
          resolve({
            duration: element.duration,
            format: file.type,
            ...(type === 'video' && {
              width: (element as HTMLVideoElement).videoWidth,
              height: (element as HTMLVideoElement).videoHeight
            })
          });
        };
        
        element.src = URL.createObjectURL(file);
      }
    });
  };

  const processFile = async (file: File): Promise<MediaFile> => {
    const type = file.type.startsWith('image/') ? 'image' 
                : file.type.startsWith('video/') ? 'video' 
                : 'audio';

    const preview = await generateThumbnail(file, type);
    const metadata = await getMediaMetadata(file, type);

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      type,
      preview,
      thumbnail: type === 'video' ? preview : undefined,
      duration: metadata.duration,
      size: formatFileSize(file.size),
      uploadProgress: 0,
      uploaded: false,
      metadata,
      tags: [],
      description: '',
      category: ''
    };
  };

  const handleFileSelect = async (files: FileList) => {
    if (mediaFiles.length + files.length > maxFiles) {
      toast.error(t(`Maximum ${maxFiles} files allowed`, `अधिकतम ${maxFiles} फाइलहरू मात्र अनुमति छ`));
      return;
    }

    const newFiles: MediaFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const type = file.type.startsWith('image/') ? 'image' 
                  : file.type.startsWith('video/') ? 'video' 
                  : 'audio';

      if (!acceptedTypes.includes(type)) {
        toast.error(t(`${type} files not accepted`, `${type} फाइलहरू स्वीकार्य छैन`));
        continue;
      }

      try {
        const processedFile = await processFile(file);
        newFiles.push(processedFile);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error(t('Failed to process file', 'फाइल प्रोसेस गर्न सकिएन'));
      }
    }

    const updatedFiles = [...mediaFiles, ...newFiles];
    setMediaFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const startRecording = async (type: 'video' | 'audio') => {
    try {
      const constraints = type === 'video' 
        ? { video: { width: 1280, height: 720 }, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: type === 'video' ? 'video/webm' : 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { 
          type: type === 'video' ? 'video/webm' : 'audio/webm' 
        });
        
        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: type === 'video' ? 'video/webm' : 'audio/webm'
        });
        
        try {
          const processedFile = await processFile(file);
          const updatedFiles = [...mediaFiles, processedFile];
          setMediaFiles(updatedFiles);
          onFilesChange?.(updatedFiles);
        } catch (error) {
          console.error('Error processing recording:', error);
          toast.error(t('Failed to process recording', 'रेकर्डिङ प्रोसेस गर्न सकिएन'));
        }
        
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType(type);
      
      toast.success(t('Recording started', 'रेकर्डिङ सुरु भयो'));
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error(t('Failed to start recording', 'रेकर्डिङ सुरु गर्न सकिएन'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = mediaFiles.filter(f => f.id !== fileId);
    setMediaFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const updateFileMetadata = (fileId: string, updates: Partial<MediaFile>) => {
    const updatedFiles = mediaFiles.map(f => 
      f.id === fileId ? { ...f, ...updates } : f
    );
    setMediaFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setMediaFiles(prev => {
        const updated = prev.map(f => {
          if (f.id === fileId && f.uploadProgress < 100) {
            return { ...f, uploadProgress: f.uploadProgress + 10 };
          } else if (f.id === fileId && f.uploadProgress >= 100) {
            clearInterval(interval);
            return { ...f, uploaded: true };
          }
          return f;
        });
        return updated;
      });
    }, 200);
  };

  const uploadFiles = async () => {
    if (mediaFiles.length === 0) {
      toast.error(t('No files to upload', 'अपलोड गर्न फाइलहरू छैनन्'));
      return;
    }

    setIsUploading(true);
    
    // Simulate upload for each file
    mediaFiles.forEach(file => {
      if (!file.uploaded) {
        simulateUpload(file.id);
      }
    });

    // Complete upload after simulation
    setTimeout(() => {
      setIsUploading(false);
      toast.success(t('All files uploaded successfully!', 'सबै फाइलहरू सफलतापूर्वक अपलोड भए!'));
      onUploadComplete?.(mediaFiles);
    }, 3000);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [mediaFiles.length, maxFiles, acceptedTypes]);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={acceptedTypes.map(type => {
            switch(type) {
              case 'image': return 'image/*';
              case 'video': return 'video/*';
              case 'audio': return 'audio/*';
              default: return '';
            }
          }).join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {acceptedTypes.includes('image') && (
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
            )}
            {acceptedTypes.includes('video') && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Video className="h-6 w-6 text-red-600" />
              </div>
            )}
            {acceptedTypes.includes('audio') && (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Mic className="h-6 w-6 text-green-600" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t('Upload your media', 'आफ्नो मिडिया अपलोड गर्नुहोस्')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('Drag and drop files here, or click to browse', 'फाइलहरू यहाँ ड्र्याग र ड्रप गर्नुहोस्, वा ब्राउज गर्न क्लिक गर्नुहोस्')}
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('Browse Files', 'फाइलहरू ब्राउज गर्नुहोस्')}
            </Button>
            
            {acceptedTypes.includes('video') && (
              <Button
                onClick={() => startRecording('video')}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                disabled={isRecording}
              >
                <Video className="h-4 w-4 mr-2" />
                {t('Record Video', 'भिडियो रेकर्ड गर्नुहोस्')}
              </Button>
            )}
            
            {acceptedTypes.includes('audio') && (
              <Button
                onClick={() => startRecording('audio')}
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50"
                disabled={isRecording}
              >
                <Mic className="h-4 w-4 mr-2" />
                {t('Record Audio', 'अडियो रेकर्ड गर्नुहोस्')}
              </Button>
            )}
          </div>
          
          <p className="text-xs text-gray-400">
            {t(`Max ${maxFiles} files`, `अधिकतम ${maxFiles} फाइलहरू`)} • {t('Max 100MB each', 'प्रत्येक १०० MB सम्म')}
          </p>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-red-700 dark:text-red-300">
                  {t('Recording', 'रेकर्ड गर्दै')} {recordingType === 'video' ? t('video', 'भिडियो') : t('audio', 'अडियो')}...
                </span>
              </div>
            </div>
            <Button
              onClick={stopRecording}
              size="sm"
              variant="outline"
              className="bg-white dark:bg-gray-800 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
            >
              {t('Stop Recording', 'रेकर्डिङ रोक्नुहोस्')}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Files Preview */}
      {mediaFiles.length > 0 && showPreview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {t('Selected Files', 'छानिएका फाइलहरू')} ({mediaFiles.length})
            </h3>
            <Button
              onClick={uploadFiles}
              disabled={isUploading || mediaFiles.every(f => f.uploaded)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  {t('Uploading...', 'अपलोड गर्दै...')}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {t('Upload All', 'सबै अपलोड गर्नुहोस्')}
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {mediaFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-emerald-200 dark:border-emerald-700 hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                      {file.type === 'image' ? (
                        <img 
                          src={file.preview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : file.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <video 
                            src={file.preview} 
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Mic className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">{t('Audio File', 'अडियो फाइल')}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Upload Progress */}
                      {file.uploadProgress > 0 && !file.uploaded && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Progress value={file.uploadProgress} className="w-24 mb-2" />
                            <p className="text-sm">{file.uploadProgress}%</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Success Indicator */}
                      {file.uploaded && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-green-500 rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* File Actions */}
                      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => setSelectedFile(file)}
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {showEditor && (
                          <Button
                            onClick={() => {
                              setSelectedFile(file);
                              setShowEditorDialog(true);
                            }}
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          onClick={() => removeFile(file.id)}
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0 bg-red-500/80 hover:bg-red-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* File Type Badge */}
                      <Badge 
                        className="absolute bottom-2 left-2"
                        variant={file.type === 'video' ? 'destructive' : file.type === 'audio' ? 'secondary' : 'default'}
                      >
                        {file.type}
                      </Badge>
                      
                      {/* Duration Badge (for video/audio) */}
                      {file.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                          {Math.floor(file.duration / 60)}:{(file.duration % 60).toFixed(0).padStart(2, '0')}
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {file.file.name}
                          </p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                        
                        <Input
                          placeholder={t('Add description...', 'विवरण थप्नुहोस्...')}
                          value={file.description}
                          onChange={(e) => updateFileMetadata(file.id, { description: e.target.value })}
                          className="text-xs"
                        />
                        
                        <Select
                          value={file.category}
                          onValueChange={(value) => updateFileMetadata(file.id, { category: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder={t('Category', 'श्रेणी')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="products">{t('Products', 'उत्पादनहरू')}</SelectItem>
                            <SelectItem value="farm">{t('Farm', 'खेत')}</SelectItem>
                            <SelectItem value="tutorial">{t('Tutorial', 'ट्यूटोरियल')}</SelectItem>
                            <SelectItem value="market">{t('Market', 'बजार')}</SelectItem>
                            <SelectItem value="other">{t('Other', 'अन्य')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}