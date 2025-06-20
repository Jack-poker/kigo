import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

interface MessageData {
  content: string;
  recipient?: string;
  brand?: string;
  timestamp?: string;
  color?: string;
  amount?: string;
  studentName?: string;
  transactionId?: string;
}

interface WhatsAppTemplateProps {
  messageData: MessageData;
}

const WhatsAppTemplate: React.FC<WhatsAppTemplateProps> = ({ messageData }) => {
  const { 
    content, 
    recipient, 
    brand = 'StudentPay', 
    timestamp = '12:34', 
    color = '#25D366',
    amount,
    studentName,
    transactionId
  } = messageData;

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 p-1 rounded-3xl shadow-2xl">
      <div className="bg-white rounded-2xl p-8 h-full min-h-[400px] flex flex-col justify-center items-center text-center">
        {/* Brand Header */}
        <div className="mb-6">
          {/* <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto shadow-lg"
            style={{ backgroundColor: color }}
          >
            {brand.charAt(0)}
          </div> */}
          <img src="/assets/logo.png" className='w-45 h-20' alt="" srcset=""  />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {brand}
          </h1>
          <p className="text-sm text-gray-500">Money Transfer Service</p>
        </div>

        {/* Success Icon */}
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCheck className="w-6 h-6 text-green-600" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Transfer Successful!</h2>
          
          {amount && (
            <div className="bg-green-50 border-2 border-brand rounded-xl p-4 w-full max-w-xs">
              <p className="text-green-700 font-bold text-2xl">${amount}</p>
              <p className="text-green-600 text-sm">Amount Sent</p>
            </div>
          )}

          <div className="space-y-2 text-sm w-full max-w-xs">
            {studentName && (
              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{studentName}</span>
              </div>
            )}
            {transactionId && (
              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-xs">{transactionId}</span>
              </div>
            )}
          </div>

          {content && (
            <p className="text-gray-700 text-sm leading-relaxed max-w-xs mt-4">
              {recipient && `Hi ${recipient}! `}
              {content}
            </p>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2 mt-6">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
          <div 
            className="w-3 h-3 rounded-full opacity-60"
            style={{ backgroundColor: color }}
          ></div>
          <div 
            className="w-3 h-3 rounded-full opacity-30"
            style={{ backgroundColor: color }}
          ></div>
        </div>

        {/* Footer with timestamp */}
        <div className="mt-6 flex items-center justify-center space-x-2">
          <span className="text-xs text-gray-500">{timestamp || formatTime()}</span>
          <CheckCheck className="w-3 h-3 text-green-500" />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTemplate;