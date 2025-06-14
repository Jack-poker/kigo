
import React from 'react';

interface MessageData {
  content: string;
  recipient?: string;
  brand?: string;
  title?: string;
  color?: string;
  email?: string;
}

interface EmailTemplateProps {
  messageData: MessageData;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ messageData }) => {
  const { content, recipient, brand, title, color = '#007bff', email } = messageData;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden font-sans">
      {/* Email Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: color }}
            >
              {brand?.charAt(0) || 'B'}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{brand || 'Your Brand'}</h2>
              <p className="text-gray-600 text-sm">{email || 'noreply@company.com'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">To: {recipient || 'customer@email.com'}</p>
            <p className="text-gray-500 text-xs">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{title || 'Important Message'}</h1>
      </div>

      {/* Email Body */}
      <div className="p-8">
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
            {recipient && `Dear ${recipient},\n\n`}
            {content || 'Thank you for your interest in our services. We are excited to help you achieve your goals.'}
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center my-8">
          <button 
            className="px-8 py-3 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: color }}
          >
            Get Started
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-gray-600 text-sm">
            Best regards,<br/>
            <strong>{brand || 'Your Brand'} Team</strong>
          </p>
        </div>
      </div>

      {/* Email Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-6">
        <div className="text-center">
          <p className="text-gray-500 text-xs mb-2">
            © 2024 {brand || 'Your Brand'}. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            You received this email because you subscribed to our newsletter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;