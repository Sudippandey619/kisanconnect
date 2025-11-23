import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, MapPin, Camera, Image, Package, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { User, Language } from '../App';
import { useRealTime, ChatMessage } from './RealTimeInfrastructure';

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    nameNepali: string;
    role: 'farmer' | 'consumer' | 'driver';
    avatar: string;
    online: boolean;
    lastSeen: string;
  }>;
  lastMessage: ChatMessage;
  unreadCount: number;
  type: 'direct' | 'order' | 'support';
  orderId?: string;
  createdAt: string;
}

interface Props {
  user: User;
  language: Language;
  onClose: () => void;
  openConversationId?: string;
}

export const RealTimeMessaging: React.FC<Props> = ({ user, language, onClose, openConversationId }) => {
  const { conversations, sendMessage, subscribeToConversation } = useRealTime();
  const [activeConversationId, setActiveConversationId] = useState<string>(openConversationId || '');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversationsList] = useState<Conversation[]>([
    {
      id: 'conv_1',
      participants: [
        {
          id: 'farmer_1',
          name: 'Ram Bahadur Shrestha',
          nameNepali: 'राम बहादुर श्रेष्ठ',
          role: 'farmer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          online: true,
          lastSeen: new Date().toISOString()
        }
      ],
      lastMessage: {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'farmer_1',
        senderName: 'Ram Bahadur',
        senderRole: 'farmer',
        message: 'Your tomatoes are ready for pickup!',
        type: 'text',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: false
      },
      unreadCount: 2,
      type: 'order',
      orderId: 'ORD_12345',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'conv_2',
      participants: [
        {
          id: 'driver_1',
          name: 'Ravi Sharma',
          nameNepali: 'रवि शर्मा',
          role: 'driver',
          avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150',
          online: false,
          lastSeen: new Date(Date.now() - 600000).toISOString()
        }
      ],
      lastMessage: {
        id: 'msg_2',
        conversationId: 'conv_2',
        senderId: 'driver_1',
        senderName: 'Ravi Sharma',
        senderRole: 'driver',
        message: 'I am 5 minutes away from your location',
        type: 'text',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        read: true
      },
      unreadCount: 0,
      type: 'direct',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]);

  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'farmer_1',
      senderName: 'Ram Bahadur',
      senderRole: 'farmer',
      message: 'Hello! Your organic tomatoes are ready for pickup.',
      type: 'text',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: true
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: user.id,
      senderName: user.name,
      senderRole: user.currentRole,
      message: 'Great! What time can I pick them up?',
      type: 'text',
      timestamp: new Date(Date.now() - 1500000).toISOString(),
      read: true
    },
    {
      id: 'msg_3',
      conversationId: 'conv_1',
      senderId: 'farmer_1',
      senderName: 'Ram Bahadur',
      senderRole: 'farmer',
      message: 'Anytime between 10 AM to 6 PM. They are freshly harvested this morning!',
      type: 'text',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      read: true
    },
    {
      id: 'msg_4',
      conversationId: 'conv_1',
      senderId: 'farmer_1',
      senderName: 'Ram Bahadur',
      senderRole: 'farmer',
      message: 'Your tomatoes are ready for pickup!',
      type: 'text',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false
    }
  ]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  useEffect(() => {
    if (activeConversationId) {
      subscribeToConversation(activeConversationId);
    }
  }, [activeConversationId, subscribeToConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversationId) return;

    const newMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      conversationId: activeConversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.currentRole,
      message: messageInput,
      type: 'text',
      read: false
    };

    sendMessage(activeConversationId, newMessage);
    setActiveMessages(prev => [...prev, {
      ...newMessage,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }]);
    
    setMessageInput('');
    toast.success(t('Message sent!', 'सन्देश पठाइयो!'));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConversationTitle = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(p => p.id !== user.id);
    if (!otherParticipant) return t('Unknown', 'अज्ञात');
    
    return language === 'en' ? otherParticipant.name : otherParticipant.nameNepali;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farmer': return '👨‍🌾';
      case 'consumer': return '🛒';
      case 'driver': return '🚚';
      default: return '👤';
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return t('Yesterday', 'हिजो');
    } else {
      return date.toLocaleDateString();
    }
  };

  const activeConversation = conversationsList.find(c => c.id === activeConversationId);
  const otherParticipant = activeConversation?.participants.find(p => p.id !== user.id);

  const emojis = ['😊', '👍', '❤️', '😂', '🔥', '💯', '🙏', '👏', '🎉', '🌟'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-orange-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                ←
              </Button>
              <h2 className="text-lg font-bold">{t('Messages', 'सन्देशहरू')}</h2>
            </div>
            {activeConversationId && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Active Chat Header */}
          {activeConversationId && otherParticipant && (
            <div className="flex items-center gap-3 mt-3 p-3 bg-white/10 rounded-lg">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <img src={otherParticipant.avatar} alt={otherParticipant.name} className="rounded-full" />
                </Avatar>
                {otherParticipant.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {language === 'en' ? otherParticipant.name : otherParticipant.nameNepali}
                  </p>
                  <span className="text-sm">{getRoleIcon(otherParticipant.role)}</span>
                </div>
                <p className="text-xs opacity-80">
                  {otherParticipant.online 
                    ? t('Online', 'अनलाइन') 
                    : `${t('Last seen', 'अन्तिम पटक देखियो')} ${formatMessageTime(otherParticipant.lastSeen)}`
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {!activeConversationId ? (
            // Conversations List
            <div className="w-full">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 m-4">
                  <TabsTrigger value="all">{t('All', 'सबै')}</TabsTrigger>
                  <TabsTrigger value="orders">{t('Orders', 'अर्डरहरू')}</TabsTrigger>
                  <TabsTrigger value="support">{t('Support', 'सहायता')}</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="px-4">
                  <ScrollArea className="h-[calc(90vh-200px)]">
                    <div className="space-y-2">
                      {conversationsList.map((conversation) => {
                        const participant = conversation.participants.find(p => p.id !== user.id);
                        if (!participant) return null;

                        return (
                          <Card 
                            key={conversation.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setActiveConversationId(conversation.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="h-12 w-12">
                                    <img src={participant.avatar} alt={participant.name} className="rounded-full" />
                                  </Avatar>
                                  {participant.online && (
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium truncate">
                                        {language === 'en' ? participant.name : participant.nameNepali}
                                      </p>
                                      <span className="text-xs">{getRoleIcon(participant.role)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {conversation.type === 'order' && (
                                        <Badge variant="secondary" className="text-xs">
                                          <Package className="h-3 w-3 mr-1" />
                                          {t('Order', 'अर्डर')}
                                        </Badge>
                                      )}
                                      {conversation.unreadCount > 0 && (
                                        <Badge className="bg-emerald-500 text-white text-xs min-w-5 h-5 rounded-full">
                                          {conversation.unreadCount}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 truncate">
                                    {conversation.lastMessage.message}
                                  </p>
                                  
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-gray-500">
                                      {formatMessageTime(conversation.lastMessage.timestamp)}
                                    </span>
                                    {conversation.orderId && (
                                      <span className="text-xs text-emerald-600">
                                        #{conversation.orderId}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="orders" className="px-4">
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t('No order conversations', 'कुनै अर्डर वार्तालाप छैन')}</p>
                  </div>
                </TabsContent>

                <TabsContent value="support" className="px-4">
                  <div className="text-center py-8">
                    <p className="text-gray-600">{t('No support conversations', 'कुनै सहायता वार्तालाप छैन')}</p>
                    <Button className="mt-4" variant="outline">
                      {t('Contact Support', 'सहायता सम्पर्क')}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Active Chat
            <div className="w-full flex flex-col">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeMessages.map((message) => {
                    const isOwn = message.senderId === user.id;
                    
                    return (
                      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
                          {!isOwn && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs">{getRoleIcon(message.senderRole)}</span>
                              <span className="text-xs font-medium text-gray-600">
                                {message.senderName}
                              </span>
                            </div>
                          )}
                          
                          <div className={`p-3 rounded-2xl ${
                            isOwn 
                              ? 'bg-gradient-to-r from-emerald-500 to-orange-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(message.timestamp)}
                            </span>
                            {isOwn && (
                              <div className="text-xs text-gray-500">
                                {message.read ? '✓✓' : '✓'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {showEmojiPicker && (
                  <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {emojis.map((emoji, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setMessageInput(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="text-lg p-1 h-8 w-8"
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon">
                    <Camera className="h-4 w-4" />
                  </Button>
                  
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('Type a message...', 'सन्देश टाइप गर्नुहोस्...')}
                    className="flex-1"
                  />
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};