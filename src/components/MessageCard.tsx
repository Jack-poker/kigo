
import React from 'react';
import { MessageSquare, Shield, Clock, CheckCircle } from 'lucide-react';

interface MessageData {
  type: 'message' | 'otp';
  title?: string;
  content: string;
  recipient?: string;
  brand?: string;
  code?: string;
  expiry?: string;
}

interface MessageCardProps {
  messageData: MessageData;
}

const MessageCard: React.FC<MessageCardProps> = ({ messageData }) => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  if (messageData.type === 'otp') {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-emerald-500 via-green-400 to-emerald-600 rounded-3xl p-1 shadow-2xl">
        <div className="bg-white rounded-[22px] p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Code
            </h2>
            <p className="text-emerald-600 font-semibold">
              {messageData.brand || 'Your Brand'}
            </p>
          </div>

          {/* OTP Code */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border-2 border-emerald-100">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Your verification code is:</p>
              <div className="text-4xl font-mono font-bold text-emerald-600 tracking-[0.3em] mb-2">
                {messageData.code || '123456'}
              </div>
              <p className="text-xs text-gray-500">Valid for 10 minutes</p>
            </div>
          </div>

          {/* Message Content */}
          {messageData.content && (
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed text-center">
                {messageData.content}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
            <span>{currentTime}</span>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>Secure</span>
            </div>
          </div>

          {/* Recipient */}
          {messageData.recipient && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-400">
                Sent to {messageData.recipient}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-emerald-500 via-green-400 to-emerald-600 rounded-3xl p-1 shadow-2xl">
      <div className="bg-white rounded-[22px] p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">
                {messageData.brand || 'Your Brand'}
              </h3>
              <p className="text-xs text-gray-500">{currentTime}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        {/* Title */}
        {messageData.title && (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {messageData.title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">
            {messageData.content || 'Your message content will appear here...'}
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-4">
          <button className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition-all duration-200 shadow-lg">
            View Details
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
          <span>Delivered</span>
          {messageData.recipient && (
            <span>To: {messageData.recipient}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
