import React, { useState, useRef, useEffect } from 'react';
import { X, Video, VideoOff, Mic, MicOff, Users, Heart, MessageCircle, Share2, Camera, Settings, Eye, DollarSign, Clock, Star, Gift, Zap, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import type { User, Language } from '../App';

interface LiveVideoStreamingProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function LiveVideoStreaming({ user, language, onClose }: LiveVideoStreamingProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [viewers, setViewers] = useState(234);
  const [likes, setLikes] = useState(1567);
  const [hasLiked, setHasLiked] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [currentTab, setCurrentTab] = useState('live');
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [isWatching, setIsWatching] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Mock live streams data
  const liveStreams = [
    {
      id: 1,
      title: t('Organic Tomato Harvest Live', 'जैविक टमाटर फसल प्रत्यक्ष'),
      farmer: t('Ram Bahadur Shrestha', 'राम बहादुर श्रेष्ठ'),
      location: t('Kavrepalanchok', 'काभ्रेपलाञ्चोक'),
      viewers: 345,
      duration: '25:30',
      category: 'harvest',
      thumbnail: '🍅',
      isLive: true,
      likes: 892,
      description: t('Watch our organic tomato harvest process live from our farm in Kavrepalanchok', 'काभ्रेपलाञ्चोकको हाम्रो फार्मबाट जैविक टमाटर फसलको प्रक्रिया प्रत्यक्ष हेर्नुहोस्')
    },
    {
      id: 2,
      title: t('Traditional Rice Planting', 'परम्परागत धान रोपाइँ'),
      farmer: t('Sita Devi Adhikari', 'सीता देवी अधिकारी'),
      location: t('Chitwan', 'चितवन'),
      viewers: 567,
      duration: '1:45:22',
      category: 'planting',
      thumbnail: '🌾',
      isLive: true,
      likes: 1234,
      description: t('Learn traditional rice planting techniques from experienced farmers', 'अनुभवी किसानहरूबाट परम्परागत धान रोपाइँ प्रविधि सिक्नुहोस्')
    },
    {
      id: 3,
      title: t('Farm to Table Cooking', 'फार्मदेखि टेबलसम्म खाना पकाउने'),
      farmer: t('Krishna Maharjan', 'कृष्ण महर्जन'),
      location: t('Lalitpur', 'ललितपुर'),
      viewers: 189,
      duration: '42:15',
      category: 'cooking',
      thumbnail: '👨‍🍳',
      isLive: true,
      likes: 445,
      description: t('Fresh vegetables straight from farm to your plate', 'फार्मबाट सिधै तपाईंको थालमा ताजा तरकारी')
    }
  ];

  const chatMessages = [
    { user: 'Maya K.', message: t('Amazing quality tomatoes!', 'अद्भुत गुणस्तरका टमाटर!'), time: '2m ago', isSuper: false },
    { user: 'Ravi S.', message: t('How much per kg?', 'प्रति केजी कति?'), time: '3m ago', isSuper: true },
    { user: 'Priya T.', message: '❤️❤️❤️', time: '4m ago', isSuper: false },
    { user: 'Amit G.', message: t('Can you deliver to Kathmandu?', 'काठमाडौंमा डिलिभरी गर्न सक्नुहुन्छ?'), time: '5m ago', isSuper: false },
    { user: 'Sunita R.', message: t('Following your farm! 🌱', 'तपाईंको फार्मलाई फलो गर्दै! 🌱'), time: '6m ago', isSuper: true }
  ];

  const startStream = () => {
    setIsStreaming(true);
    // Simulate viewer count increase
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);

    return () => clearInterval(interval);
  };

  const stopStream = () => {
    setIsStreaming(false);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage('');
      // Handle message sending
    }
  };

  const watchStream = (stream: any) => {
    setSelectedStream(stream);
    setIsWatching(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-emerald-100 dark:border-emerald-700">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg">
              <Video className="h-5 w-5 text-white" />
            </div>
            {t('Live Video Streaming', 'प्रत्यक्ष भिडियो स्ट्रिमिङ')}
            {isStreaming && (
              <Badge className="bg-red-500 text-white animate-pulse">
                🔴 {t('LIVE', 'प्रत्यक्ष')}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 bg-emerald-50 dark:bg-emerald-900/20 m-4 mb-0">
              <TabsTrigger value="live" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                {t('Go Live', 'प्रत्यक्ष प्रसारण')}
              </TabsTrigger>
              <TabsTrigger value="watch" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {t('Watch Streams', 'स्ट्रिम हेर्नुहोस्')}
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('Scheduled', 'निर्धारित')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="mt-0 p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Stream Area */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="overflow-hidden border-2 border-red-200 dark:border-red-700"
                        style={{
                          transform: 'perspective(1000px) rotateY(-1deg)',
                        }}>
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 aspect-video flex items-center justify-center">
                      {isStreaming ? (
                        <div className="relative w-full h-full">
                          <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            style={{
                              filter: isVideoOn ? 'none' : 'blur(10px)',
                            }}
                          />
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <Badge className="bg-red-500 text-white animate-pulse">
                              🔴 {t('LIVE', 'प्रत्यक्ष')}
                            </Badge>
                            <div className="bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {viewers}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                            <Video className="h-12 w-12 text-red-500" />
                          </div>
                          <div>
                            <h3 className="text-white text-lg font-semibold">
                              {t('Ready to go live?', 'प्रत्यक्ष प्रसारणको लागि तयार हुनुहुन्छ?')}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {t('Share your farm activities with the community', 'समुदायसँग आफ्ना फार्मका गतिविधिहरू साझा गर्नुहोस्')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Stream Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`w-12 h-12 rounded-full ${!isVideoOn ? 'bg-red-500 text-white' : ''}`}
                    >
                      {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsAudioOn(!isAudioOn)}
                      className={`w-12 h-12 rounded-full ${!isAudioOn ? 'bg-red-500 text-white' : ''}`}
                    >
                      {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>

                    {!isStreaming ? (
                      <Button
                        onClick={startStream}
                        className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {t('Start Live Stream', 'प्रत्यक्ष प्रसारण सुरु गर्नुहोस्')}
                      </Button>
                    ) : (
                      <Button
                        onClick={stopStream}
                        variant="destructive"
                        className="px-8 py-3 transform hover:scale-105 transition-all duration-200"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {t('End Stream', 'प्रसारण समाप्त गर्नुहोस्')}
                      </Button>
                    )}

                    <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Stream Stats */}
                  {isStreaming && (
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                            style={{ transform: 'perspective(1000px) rotateY(2deg)' }}>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">{t('Viewers', 'दर्शकहरू')}</span>
                        </div>
                        <p className="text-2xl font-bold">{viewers}</p>
                      </Card>
                      <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                            style={{ transform: 'perspective(1000px) rotateY(0deg)' }}>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">{t('Likes', 'मनपराइहरू')}</span>
                        </div>
                        <p className="text-2xl font-bold">{likes}</p>
                      </Card>
                      <Card className="p-4 text-center hover:shadow-lg transition-shadow"
                            style={{ transform: 'perspective(1000px) rotateY(-2deg)' }}>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">{t('Duration', 'अवधि')}</span>
                        </div>
                        <p className="text-2xl font-bold">25:30</p>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Chat & Interaction Panel */}
                <div className="space-y-4">
                  <Card className="border-emerald-200 dark:border-emerald-700"
                        style={{ transform: 'perspective(1000px) rotateY(1deg)' }}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        {t('Live Chat', 'प्रत्यक्ष च्याट')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Chat Messages */}
                      <div className="h-64 overflow-y-auto space-y-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-emerald-600">{msg.user}</span>
                              {msg.isSuper && (
                                <Badge className="text-xs bg-yellow-500 text-white">
                                  ⭐
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">{msg.time}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <Input
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder={t('Type your message...', 'आफ्नो सन्देश टाइप गर्नुहोस्...')}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} size="icon">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLike}
                          className={`${hasLiked ? 'bg-red-50 text-red-500 border-red-200' : ''} hover:scale-110 transition-transform duration-200`}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${hasLiked ? 'fill-current' : ''}`} />
                          {t('Like', 'मनपराउनुहोस्')}
                        </Button>
                        <Button variant="outline" size="sm" className="hover:scale-110 transition-transform duration-200">
                          <Share2 className="h-4 w-4 mr-1" />
                          {t('Share', 'साझा गर्नुहोस्')}
                        </Button>
                        <Button variant="outline" size="sm" className="hover:scale-110 transition-transform duration-200">
                          <Gift className="h-4 w-4 mr-1" />
                          {t('Gift', 'उपहार')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="watch" className="mt-0 p-6 space-y-6">
              {isWatching && selectedStream ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsWatching(false)}
                      className="hover:scale-105 transition-transform duration-200"
                    >
                      ← {t('Back to Streams', 'स्ट्रिमहरूमा फिर्ता')}
                    </Button>
                    <h2 className="text-xl font-semibold">{selectedStream.title}</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Player */}
                    <div className="lg:col-span-2">
                      <Card className="overflow-hidden border-2 border-emerald-200 dark:border-emerald-700"
                            style={{ transform: 'perspective(1000px) rotateY(-1deg)' }}>
                        <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 aspect-video flex items-center justify-center">
                          <div className="relative w-full h-full bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="text-6xl mb-4">{selectedStream.thumbnail}</div>
                              <div className="flex items-center gap-2 justify-center">
                                <Badge className="bg-red-500 text-white animate-pulse">
                                  🔴 {t('LIVE', 'प्रत्यक्ष')}
                                </Badge>
                                <div className="bg-black/50 text-white px-3 py-1 rounded flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  {selectedStream.viewers} {t('viewers', 'दर्शकहरू')}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <div className="mt-4 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">{selectedStream.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStream.description}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>{selectedStream.farmer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedStream.farmer}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStream.location}</p>
                            </div>
                          </div>
                          <Button variant="outline" className="ml-auto">
                            {t('Follow', 'फलो गर्नुहोस्')}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Stream Info & Chat */}
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('Duration', 'अवधि')}</span>
                            <span>{selectedStream.duration}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('Likes', 'मनपराइहरू')}</span>
                            <span>{selectedStream.likes}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('Category', 'श्रेणी')}</span>
                            <Badge variant="outline">{selectedStream.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Live Chat for Watching */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">{t('Live Chat', 'प्रत्यक्ष च्याट')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="h-48 overflow-y-auto space-y-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            {chatMessages.map((msg, index) => (
                              <div key={index} className="text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-emerald-600">{msg.user}</span>
                                  <span className="text-xs text-gray-500">{msg.time}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder={t('Type a message...', 'सन्देश टाइप गर्नुहोस्...')}
                              className="flex-1"
                            />
                            <Button size="icon">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t('Live Streams', 'प्रत्यक्ष स्ट्रिमहरू')}</h2>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white animate-pulse">
                        🔴 {liveStreams.length} {t('Live Now', 'अहिले प्रत्यक्ष')}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveStreams.map((stream, index) => (
                      <Card key={stream.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            style={{
                              transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'}) scale(1)`;
                            }}
                            onClick={() => watchStream(stream)}>
                        <div className="relative">
                          <div className="w-full h-48 bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="text-4xl mb-2">{stream.thumbnail}</div>
                              <Badge className="bg-red-500 text-white animate-pulse">
                                🔴 {t('LIVE', 'प्रत्यक्ष')}
                              </Badge>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {stream.viewers}
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                            {stream.duration}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                            {stream.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{stream.farmer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{stream.farmer}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            📍 {stream.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Heart className="h-3 w-3" />
                              {stream.likes}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {stream.category}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="scheduled" className="mt-0 p-6 space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Clock className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Schedule Your Next Stream', 'आफ्नो अर्को स्ट्रिम निर्धारण गर्नुहोस्')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Plan and schedule your farm activities to share with the community', 'समुदायसँग साझा गर्न आफ्ना फार्मका गतिविधिहरूको योजना र निर्धारण गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
                  <Clock className="h-4 w-4 mr-2" />
                  {t('Schedule Stream', 'स्ट्रिम निर्धारण गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}