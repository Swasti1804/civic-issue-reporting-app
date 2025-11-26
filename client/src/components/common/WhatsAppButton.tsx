import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';

const WhatsAppButton: React.FC = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+918368932288'; // Your number with India country code
    const message = encodeURIComponent("Hi, I want to report a civic issue.");
    
    // Open WhatsApp chat with your number and pre-filled message
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="relative group">
      <Button
        variant="accent"
        size="lg"
        onClick={handleWhatsAppClick}
        leftIcon={<MessageCircle size={20} />}
        className="bg-[#25D366] hover:bg-[#128C7E] border-none text-white"
      >
        Report via WhatsApp
      </Button>
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Chat directly with our support team
      </div>
    </div>
  );
};

export default WhatsAppButton;