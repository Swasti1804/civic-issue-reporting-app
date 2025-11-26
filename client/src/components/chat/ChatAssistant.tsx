import React, { useState } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, Info, AlertTriangle, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isInfo?: boolean;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  const civicServices = [
    {
      question: "report issue",
      response: "To report a civic issue like potholes or garbage collection: \n1. Visit the municipal website \n2. Use the 'Report Issue' form \n3. Include photos and location details",
      icon: <AlertTriangle size={16} className="mr-2" />
    },
    {
      question: "contact",
      response: "Municipal contacts:\n☎️ 24x7 Helpline: 1800-123-4567\n📧 Email: contact@municipal.gov.in\n📍 Office: Town Hall, Main Road",
      icon: <Phone size={16} className="mr-2" />
    },
    {
      question: "services",
      response: "Available civic services:\n• Water connection\n• Property tax payment\n• Birth/death certificate\n• Building permits\n• Grievance redressal",
      icon: <Info size={16} className="mr-2" />
    }
  ];

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
      // Add welcome message when first opened
      if (!isOpen && messages.length === 0) {
        setMessages([{
          id: `msg-${Date.now()}`,
          text: "Hello! I can help you with:\n• Reporting civic issues\n• Contact information\n• Available services\n\nTry asking about 'report issue', 'contact', or 'services'",
          sender: 'assistant',
          timestamp: new Date(),
          isInfo: true
        }]);
      }
    }
  };
  
  const minimizeChat = () => {
    setIsMinimized(true);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Find matching response
    const lowerMessage = message.toLowerCase();
    const matchedService = civicServices.find(service => 
      lowerMessage.includes(service.question)
    );
    
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now()}`,
        text: matchedService 
          ? matchedService.response 
          : "Sorry, I didn't understand. Try asking about:\n• 'report issue'\n• 'contact'\n• 'services'",
        sender: 'assistant',
        timestamp: new Date(),
        isInfo: true
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 500);
  };
  
  return (
    <>
      <Button
        variant="primary"
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 flex items-center gap-2"
        onClick={toggleChat}
      >
        <MessageSquare size={20} />
        <span>Help Desk</span>
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-20 right-6 w-[350px] bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200 ${
              isMinimized ? 'h-auto' : 'h-[500px]'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-600 text-white">
              <div className="flex items-center">
                <MessageSquare size={20} className="mr-2" />
                <h3 className="font-semibold">Civic Help Desk</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:text-gray-200"
                >
                  {isMinimized ? (
                    <Maximize2 size={18} />
                  ) : (
                    <Minimize2 size={18} />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {!isMinimized && (
              <>
                <div className="h-[380px] overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === 'user'
                            ? 'bg-primary-600 text-white'
                            : msg.isInfo
                              ? 'bg-blue-50 text-gray-800 border border-blue-100'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.sender === 'assistant' && msg.isInfo && (
                          <div className="flex items-start mb-2">
                            {civicServices.find(s => msg.text.includes(s.response))?.icon || <Info size={16} className="mr-2" />}
                          </div>
                        )}
                        {msg.text.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about civic services..."
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSendMessage}
                      className="rounded-lg"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage("How to report an issue?")}
                      className="text-xs"
                    >
                      Report Issue
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage("Contact information")}
                      className="text-xs"
                    >
                      Contacts
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage("Available services")}
                      className="text-xs"
                    >
                      Services
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;