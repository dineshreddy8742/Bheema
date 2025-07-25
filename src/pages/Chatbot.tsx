import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MessageCircle, 
  Mic, 
  MicOff,
  Send, 
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoice?: boolean;
}

const Chatbot = () => {
  const { translate, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI farming assistant. I can help you with crop monitoring, disease identification, market prices, and weather forecasts. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      'weather': 'Based on current data, expect partly cloudy weather with 25°C temperature. Perfect conditions for most crops. Humidity at 65% is ideal for plant growth.',
      'disease': 'For disease detection, please upload a clear image of the affected plant. I can identify common diseases like blight, rust, and fungal infections with 85% accuracy.',
      'market': 'Current market prices: Tomato ₹45/kg (+12%), Onion ₹32/kg (-8%), Rice ₹52/kg (stable). Best time to sell tomatoes is within next 2-3 days.',
      'crop': 'Your crop monitoring shows good health overall. Soil moisture at 68% - optimal range. Consider light irrigation for Field 2 in the next 24 hours.',
      'help': 'I can assist with: 🌾 Crop monitoring, 🦠 Disease identification, 📈 Market prices, 🌤️ Weather forecasts, 🏛️ Government schemes, and 💡 Farming tips.',
      'default': 'I understand you need farming assistance. Could you be more specific? Ask me about weather, diseases, market prices, or crop monitoring.'
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('rain')) {
      return responses.weather;
    } else if (lowerMessage.includes('disease') || lowerMessage.includes('pest') || lowerMessage.includes('infection')) {
      return responses.disease;
    } else if (lowerMessage.includes('market') || lowerMessage.includes('price') || lowerMessage.includes('sell')) {
      return responses.market;
    } else if (lowerMessage.includes('crop') || lowerMessage.includes('monitor') || lowerMessage.includes('soil')) {
      return responses.crop;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return responses.help;
    } else {
      return responses.default;
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    
    setIsSpeaking(true);
    
    // Simulate text-to-speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage.code === 'en' ? 'en-US' : 'hi-IN';
    utterance.onend = () => setIsSpeaking(false);
    
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.log('Speech synthesis not available');
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await simulateBotResponse(inputText);
      const translatedResponse = currentLanguage.code !== 'en' 
        ? await translate(botResponse) 
        : botResponse;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: translatedResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Auto-speak bot response
      if (voiceEnabled) {
        setTimeout(() => speakText(translatedResponse), 500);
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Error getting bot response:', error);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start voice recognition
      try {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = currentLanguage.code === 'en' ? 'en-US' : 'hi-IN';
        recognition.start();
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsRecording(false);
        };
        
        recognition.onerror = () => {
          setIsRecording(false);
        };
      } catch (error) {
        console.log('Speech recognition not available');
        setIsRecording(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'What is the weather forecast?',
    'Check my crop health',
    'Current market prices',
    'Identify plant disease',
    'Government schemes available'
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-hero text-primary font-indian mb-2">
            🤖 AI Farming Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Get instant help with your farming questions
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>AI Powered</span>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="flex items-center space-x-2"
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
            </Button>
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>Chat with AI Assistant</span>
                {isSpeaking && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Volume2 className="h-4 w-4 text-accent" />
                  </motion.div>
                )}
              </CardTitle>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] flex items-start space-x-2 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-accent text-white'
                      }`}>
                        {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>

                      {/* Message Bubble */}
                      <div className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.sender === 'bot' && voiceEnabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakText(message.content)}
                              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                            >
                              <Volume2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        {[1, 2, 3].map((dot) => (
                          <motion.div
                            key={dot}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: dot * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Quick Questions */}
            <div className="border-t p-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickQuestions.map((question, index) => (
                  <motion.button
                    key={question}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setInputText(question)}
                    className="text-xs bg-accent/10 hover:bg-accent/20 text-accent px-2 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about farming, weather, diseases, market prices..."
                    className="pr-12"
                  />
                  <Button
                    onClick={handleVoiceInput}
                    variant="ghost"
                    size="sm"
                    className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                      isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="h-10 w-10 p-0"
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { icon: '🌾', title: 'Crop Monitoring', desc: 'Get real-time crop health insights' },
            { icon: '🦠', title: 'Disease Detection', desc: 'AI-powered plant disease identification' },
            { icon: '📈', title: 'Market Analysis', desc: 'Latest prices and market trends' },
            { icon: '🌤️', title: 'Weather Forecasts', desc: 'Accurate weather predictions' }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="text-center p-4 hover:shadow-glow transition-all">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-medium text-primary mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Chatbot;