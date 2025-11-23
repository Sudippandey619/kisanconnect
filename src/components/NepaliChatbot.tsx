import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User, Language } from '../App';
import { getChatbotConstants } from './chatbot/ChatbotConstants';
import { getChatbotResponses } from './chatbot/ChatbotResponses';

interface NepaliChatbotProps {
  onClose: () => void;
  language: Language;
  user: User | null;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick_reply' | 'price_info' | 'help_guide';
  data?: any;
}

export function NepaliChatbot({ onClose, language, user }: NepaliChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;
  const constants = getChatbotConstants(language);
  const responses = getChatbotResponses(language);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: constants.welcomeMessage,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      // Find the scroll viewport within the ScrollArea
      const viewport = scrollRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLDivElement;
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight;
        }, 100);
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (replyId: string) => {
    const reply = constants.quickReplies.find(r => r.id === replyId);
    if (reply) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: reply.text,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const botResponse = getBotResponse(replyId);
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 800);
    }
  };

  const getBotResponse = (input: string): Message => {
    const baseMessage = {
      id: Date.now().toString() + '_bot',
      sender: 'bot' as const,
      timestamp: new Date()
    };

    // Handle specific queries
    if (input === 'prices' || input.includes('भाउ') || input.includes('price') || input.includes('मूल्य')) {
      return {
        ...baseMessage,
        text: t('Here are today\'s market prices:', 'आजका बजार भाउहरू यहाँ छन्:'),
        type: 'price_info',
        data: constants.priceData
      };
    }

    if (input === 'how_to_buy' || input.includes('किन') || input.includes('buy') || input.includes('उपभोक्ता')) {
      return { ...baseMessage, text: responses.howToBuy, type: 'help_guide' };
    }

    if (input === 'how_to_sell' || input.includes('बेच') || input.includes('sell') || input.includes('किसान')) {
      return { ...baseMessage, text: responses.howToSell, type: 'help_guide' };
    }

    if (input === 'delivery_help' || input.includes('डेलिभरी') || input.includes('delivery') || input.includes('ट्र्याक')) {
      return { ...baseMessage, text: responses.deliveryHelp, type: 'help_guide' };
    }

    if (input === 'farmer_support' || input.includes('सहयोग') || input.includes('support')) {
      return { ...baseMessage, text: responses.farmerSupport, type: 'help_guide' };
    }

    if (input === 'app_help' || input.includes('गाइड') || input.includes('guide') || input.includes('help')) {
      return { ...baseMessage, text: responses.appHelp, type: 'help_guide' };
    }

    // Default response
    const randomResponse = responses.defaultResponses[Math.floor(Math.random() * responses.defaultResponses.length)];
    return { ...baseMessage, text: randomResponse, type: 'text' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <Card className="w-full max-w-sm h-[85vh] m-4 flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3 bg-gradient-to-r from-emerald-500 to-orange-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-2xl">🧑‍🌾</span>
              </div>
              <div>
                <CardTitle className="text-white text-lg">
                  {t('Nepali Babu', 'नेपाली बाबु')}
                </CardTitle>
                <p className="text-white/80 text-sm">
                  {t('Your Farm2Home Assistant', 'तपाईंको Farm2Home सहायक')}
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'bot' && (
                    <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-orange-500 text-white text-xs">
                        🧑‍🌾
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-muted'} rounded-lg p-3`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    
                    {message.type === 'price_info' && message.data && (
                      <div className="mt-3 space-y-2">
                        {message.data.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.item}</span>
                              {getTrendIcon(item.trend)}
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-emerald-600">रु. {item.price}</span>
                              <p className="text-xs text-muted-foreground">{item.unit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString(language === 'en' ? 'en-US' : 'ne-NP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-orange-500 text-white text-xs">
                      🧑‍🌾
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </ScrollArea>
          </div>

          {/* Quick Replies */}
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {constants.quickReplies.map((reply) => (
                <Button
                  key={reply.id}
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickReply(reply.id)}
                  className="h-auto p-2 flex flex-col items-center gap-1 text-xs"
                >
                  <span className="text-lg">{reply.icon}</span>
                  <span className="text-center leading-tight">{reply.text}</span>
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder={t('Type your message...', 'सन्देश लेख्नुहोस्...')}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="text-sm"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}