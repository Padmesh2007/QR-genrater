import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: language === 'en' 
        ? "Hello! I'm your AI assistant. I can help you with document verification questions."
        : "नमस्ते! मैं आपका AI सहायक हूं। मैं दस्तावेज़ सत्यापन के प्रश्नों में आपकी सहायता कर सकता हूं।",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = {
        en: [
          "I can help you verify document authenticity. Upload your document or enter the unique ID.",
          "For best results, ensure your document has a clear QR code or barcode.",
          "Valid documents usually have unique watermarks and security features.",
          "If you're having trouble scanning, try better lighting or cleaning your camera lens.",
          "Document verification typically takes 2-3 seconds once uploaded."
        ],
        hi: [
          "मैं दस्तावेज़ की प्रामाणिकता सत्यापित करने में आपकी सहायता कर सकता हूं। अपना दस्तावेज़ अपलोड करें या विशिष्ट आईडी दर्ज करें।",
          "बेहतर परिणामों के लिए, सुनिश्चित करें कि आपके दस्तावेज़ में स्पष्ट QR कोड या बारकोड है।",
          "वैध दस्तावेज़ों में आमतौर पर अनूठे वॉटरमार्क और सुरक्षा सुविधाएं होती हैं।",
          "यदि स्कैनिंग में समस्या हो रही है, तो बेहतर प्रकाश व्यवस्था या अपने कैमरे के लेंस को साफ करने का प्रयास करें।",
          "दस्तावेज़ सत्यापन में आमतौर पर अपलोड के बाद 2-3 सेकंड का समय लगता है।"
        ]
      };

      const randomResponse = responses[language][Math.floor(Math.random() * responses[language].length)];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-80 bg-card border-l shadow-lg z-50 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t('aiAssistant')}</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex space-x-2",
                    message.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  {!message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg p-3 text-sm",
                      message.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex space-x-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-[typing_1.4s_infinite]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-[typing_1.4s_infinite_0.2s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-[typing_1.4s_infinite_0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder={t('askQuestion')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}