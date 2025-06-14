import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'parent' | 'student';
  timestamp: string;
  type: 'text' | 'payment' | 'notification';
  amount?: string;
  status?: 'sent' | 'delivered' | 'read';
}

const WhatsAppChat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi honey! Just sent your monthly allowance 💰',
      sender: 'parent',
      timestamp: '10:30',
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      text: '$500.00 sent successfully',
      sender: 'parent',
      timestamp: '10:31',
      type: 'payment',
      amount: '500.00',
      status: 'delivered'
    },
    {
      id: '3',
      text: 'Thank you so much Mom! Got it safely 🙏',
      sender: 'student',
      timestamp: '10:35',
      type: 'text',
      status: 'read'
    },
    {
      id: '4',
      text: 'Will use it wisely for books and meals',
      sender: 'student',
      timestamp: '10:36',
      type: 'text',
      status: 'read'
    },
    {
      id: '5',
      text: 'Payment received - StudentPay',
      sender: 'student',
      timestamp: '10:31',
      type: 'notification',
      status: 'delivered'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'parent',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        type: 'text',
        status: 'sent'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-green-700 p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-lg">
            A
          </div>
          <div>
            <h3 className="font-semibold">Alex (Student)</h3>
            <p className="text-xs text-green-100">StudentPay Verified</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-green-700 p-2">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-green-700 p-2">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-green-700 p-2">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                msg.type === 'payment'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : msg.type === 'notification'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : msg.sender === 'parent'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              {msg.type === 'payment' ? (
                <div className="text-center">
                  <div className="text-2xl font-bold">${msg.amount}</div>
                  <div className="text-sm opacity-90">Money Transfer</div>
                  <div className="text-xs opacity-75 mt-1">via StudentPay</div>
                </div>
              ) : msg.type === 'notification' ? (
                <div className="text-center text-sm">
                  <div className="font-medium">{msg.text}</div>
                </div>
              ) : (
                <div>{msg.text}</div>
              )}
              <div className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                msg.sender === 'parent' ? 'text-green-100' : 'text-gray-500'
              }`}>
                <span>{msg.timestamp}</span>
                {msg.sender === 'parent' && (
                  <div className="flex">
                    <div className={`w-1 h-1 rounded-full ${
                      msg.status === 'read' ? 'bg-blue-300' : 'bg-gray-300'
                    }`}></div>
                    <div className={`w-1 h-1 rounded-full ml-0.5 ${
                      msg.status === 'read' ? 'bg-blue-300' : 
                      msg.status === 'delivered' ? 'bg-gray-300' : 'bg-gray-400'
                    }`}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="rounded-full border-gray-300 pr-12 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            className="bg-green-600 hover:bg-green-700 rounded-full p-3"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="mt-2 flex justify-center">
          <div className="bg-green-50 px-3 py-1 rounded-full">
            <span className="text-xs text-green-700 font-medium">
              🔒 Secured by StudentPay
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChat;