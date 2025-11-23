import React, { useState } from 'react';
import { X, Send, MessageCircle, HelpCircle, TrendingUp, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface ChatbotAssistantProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick_reply' | 'price_info';
  data?: any;
}

export function ChatbotAssistant({ onClose }: ChatbotAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'नमस्ते! म कृषि बजारको सहायक हुँ। म तपाईंलाई यस एप्प प्रयोग गर्न मद्दत गर्न सक्छु। के सहायता चाहिएको छ?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    { id: 'prices', text: 'आजका भाउ', icon: '💰' },
    { id: 'how_to_sell', text: 'कसरी बेच्ने?', icon: '🌾' },
    { id: 'how_to_buy', text: 'कसरी किन्ने?', icon: '🛒' },
    { id: 'delivery', text: 'डेलिभरी बारे', icon: '🚚' },
    { id: 'help', text: 'सहायता', icon: '❓' }
  ];

  const priceData = [
    { item: 'गोलभेंडा', price: '80-90', unit: 'प्रति के.जी.' },
    { item: 'गाजर', price: '60-70', unit: 'प्रति के.जी.' },
    { item: 'स्याउ', price: '180-220', unit: 'प्रति के.जी.' },
    { item: 'केरा', price: '120-140', unit: 'प्रति दर्जन' },
    { item: 'आलु', price: '40-50', unit: 'प्रति के.जी.' }
  ];

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

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickReply = (replyId: string) => {
    const reply = quickReplies.find(r => r.id === replyId);
    if (reply) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: reply.text,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, userMessage]);

      setTimeout(() => {
        const botResponse = getBotResponse(replyId);
        setMessages(prev => [...prev, botResponse]);
      }, 800);
    }
  };

  const getBotResponse = (input: string): Message => {
    const baseMessage = {
      id: Date.now().toString() + '_bot',
      sender: 'bot' as const,
      timestamp: new Date()
    };

    if (input === 'prices' || input.includes('भाउ') || input.includes('मूल्य')) {
      return {
        ...baseMessage,
        text: 'आजका बजार भाउहरू यहाँ छन्:',
        type: 'price_info',
        data: priceData
      };
    }

    if (input === 'how_to_sell' || input.includes('बेच') || input.includes('किसान')) {
      return {
        ...baseMessage,
        text: 'फसल बेच्नको लागि:\n\n1. किसानको भूमिकामा जानुहोस्\n2. "मेरो फसल" मा जानुहोस्\n3. "थप्नुहोस्" बटन थिच्नुहोस्\n4. फसलको विवरण भर्नुहोस्\n5. फोटो खिच्नुहोस्\n6. मूल्य तोक्नुहोस्\n\nतपाईंका फसलहरू तुरुन्त बजारमा देखिनेछन्!',
        type: 'text'
      };
    }

    if (input === 'how_to_buy' || input.includes('किन') || input.includes('उपभोक्ता')) {
      return {
        ...baseMessage,
        text: 'फसल किन्नको लागि:\n\n1. उपभोक्ताको भूमिकामा जानुहोस्\n2. बजारमा जानुहोस्\n3. चाहिएको फसल खोज्नुहोस्\n4. "कार्टमा हाल्नुहोस्" थिच्नुहोस्\n5. कार्ट खोलेर अर्डर गर्नुहोस्\n\nतपाईंको अर्डर सिधै किसानकहाँ पुग्नेछ!',
        type: 'text'
      };
    }

    if (input === 'delivery' || input.includes('डेलिभरी') || input.includes('चालक')) {
      return {
        ...baseMessage,
        text: 'डेलिभरी सेवाको बारेमा:\n\n• हाम्रा चालकहरूले घरै पुर्याउँछन्\n• सामान्यतः २-३ घण्टामा डेलिभरी\n• काठमाडौं उपत्यका भित्र फ्री डेलिभरी\n• चालक बन्न चाहनुहुन्छ भने चालकको भूमिका छान्नुहोस्\n\nथप जानकारीको लागि: 01-4567890',
        type: 'text'
      };
    }

    if (input === 'help' || input.includes('सहायता') || input.includes('मद्दत')) {
      return {
        ...baseMessage,
        text: 'म तपाईंलाई यी कुराहरूमा मद्दत गर्न सक्छु:\n\n🌾 फसल कसरी बेच्ने\n🛒 फसल कसरी किन्ने\n🚚 डेलिभरी सेवा\n💰 बजार भाउ जानकारी\n📞 ग्राहक सेवा\n\nके थप जान्न चाहनुहुन्छ?',
        type: 'text'
      };
    }

    // Default responses
    const responses = [
      'माफ गर्नुहोस्, मैले बुझिन। के तपाईं अझ स्पष्ट पारेर भन्न सक्नुहुन्छ?',
      'म अझै सिक्दै छु। के तपाईं अर्को तरिकाले सोध्न सक्नुहुन्छ?',
      'यो प्रश्नको जवाफ मसँग छैन। कृपया ग्राहक सेवामा सम्पर्क गर्नुहोस्: 01-4567890'
    ];

    return {
      ...baseMessage,
      text: responses[Math.floor(Math.random() * responses.length)],
      type: 'text'
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <Card className="w-full max-w-sm h-[80vh] m-4 flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3 bg-gradient-to-r from-green-500 to-orange-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🧑‍🌾</span>
              </div>
              <div>
                <CardTitle className="text-white text-base">कृषि सहायक</CardTitle>
                <p className="text-white/80 text-xs">तपाईंको डिजिटल साथी</p>
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
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-orange-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-white text-xs">🧑‍🌾</span>
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-muted'} rounded-lg p-3`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    
                    {message.type === 'price_info' && message.data && (
                      <div className="mt-3 space-y-2">
                        {message.data.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded">
                            <span className="text-sm font-medium">{item.item}</span>
                            <div className="text-right">
                              <span className="text-sm font-bold text-green-600">रु. {item.price}</span>
                              <p className="text-xs text-muted-foreground">{item.unit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('ne-NP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="p-4 border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickReplies.map((reply) => (
                <Button
                  key={reply.id}
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickReply(reply.id)}
                  className="text-xs"
                >
                  {reply.icon} {reply.text}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="सन्देश लेख्नुहोस्..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="text-sm"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
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