
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Share2, Copy, MessageSquare, Shield, Palette } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import WhatsAppTemplate from '@/components/templates/WhatsAppTemplate';
import EmailTemplate from '@/components/templates/EmailTemplate';
import OTPTemplate from '@/components/templates/OTPTemplate';
// import NotificationTemplate from '@/components/templates/NotificationTemplate';
// import BusinessTemplate from '@/components/templates/BusinessTemplate';
// import SocialTemplate from '@/components/templates/SocialTemplate';

interface MessageData {
  type: 'whatsapp' | 'email' | 'otp' | 'notification' | 'business' | 'social';
  title?: string;
  content: string;
  recipient?: string;
  brand?: string;
  code?: string;
  expiry?: string;
  color?: string;
  avatar?: string;
  timestamp?: string;
  phone?: string;
  email?: string;
  companyLogo?: string;
  buttonText?: string;
  buttonUrl?: string;
}

const templates = [
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, component: WhatsAppTemplate },
  { id: 'email', name: 'Email', icon: MessageSquare, component: EmailTemplate },
  { id: 'otp', name: 'OTP Code', icon: Shield, component: OTPTemplate },
//   { id: 'notification', name: 'Notification', icon: MessageSquare, component: NotificationTemplate },
//   { id: 'business', name: 'Business', icon: MessageSquare, component: BusinessTemplate },
//   { id: 'social', name: 'Social Media', icon: Palette, component: SocialTemplate },
];

const MessageGenerator = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageData, setMessageData] = useState<MessageData>({
    type: 'whatsapp',
    content: '',
    recipient: '',
    brand: 'Your Brand',
    title: 'New Message',
    color: '#25D366',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load data from URL parameters on component mount
  useEffect(() => {
    const urlParams = Object.fromEntries(searchParams.entries());
    
    if (Object.keys(urlParams).length > 0) {
      setMessageData(prev => ({
        ...prev,
        ...urlParams,
        type: (urlParams.type as MessageData['type']) || 'whatsapp',
      }));
      
      // Enable screenshot mode if 'screenshot' parameter is present
      if (urlParams.screenshot === 'true') {
        setScreenshotMode(true);
        // Auto-generate after a short delay to ensure rendering
        setTimeout(() => {
          handleGenerate();
        }, 500);
      }
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!messageData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter message content to generate",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!screenshotMode) {
        toast({
          title: "Message Generated!",
          description: "Your beautiful message is ready to share",
        });
      }
    } catch (error) {
      if (!screenshotMode) {
        toast({
          title: "Generation Failed",
          description: "Please try again",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const updateUrlParams = (newData: Partial<MessageData>) => {
    const updatedData = { ...messageData, ...newData };
    setMessageData(updatedData);
    
    // Update URL parameters
    const params = new URLSearchParams();
    Object.entries(updatedData).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  };

  const copyUrlToClipboard = () => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString());
    toast({
      title: "URL Copied!",
      description: "Share this URL to reproduce the same message",
    });
  };

  const getCurrentTemplate = () => {
    const template = templates.find(t => t.id === messageData.type);
    return template?.component || WhatsAppTemplate;
  };

  const TemplateComponent = getCurrentTemplate();

  if (screenshotMode) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4" style={{ width: '400px', margin: '0 auto' }}>
        <div ref={messageRef} className="w-full">
          <TemplateComponent messageData={messageData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="p-2 hover:bg-emerald-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-emerald-600" />
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                Message Generator
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyUrlToClipboard}
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600"
                title="Copy shareable URL"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(messageData.content)}
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600"
                title="Copy message content"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-800 mb-6">Message Settings</h2>
              
              {/* Template Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-emerald-700 mb-3">
                  Template
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => updateUrlParams({ type: template.id as MessageData['type'] })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                          messageData.type === template.id
                            ? 'border-emerald-400 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-200'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium text-sm">{template.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-emerald-700 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={messageData.brand || ''}
                  onChange={(e) => updateUrlParams({ brand: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                  placeholder="Your Brand"
                />
              </div>

              {/* Recipient */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-emerald-700 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={messageData.recipient || ''}
                  onChange={(e) => updateUrlParams({ recipient: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              {/* Dynamic Fields Based on Template */}
              {messageData.type === 'otp' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={messageData.code || ''}
                    onChange={(e) => updateUrlParams({ code: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>
              )}

              {(messageData.type === 'business' || messageData.type === 'email') && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={messageData.title || ''}
                    onChange={(e) => updateUrlParams({ title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                    placeholder="Enter message title"
                  />
                </div>
              )}

              {/* Message Content */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-emerald-700 mb-2">
                  Message Content
                </label>
                <textarea
                  value={messageData.content}
                  onChange={(e) => updateUrlParams({ content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 h-32 resize-none"
                  placeholder="Enter your message content..."
                />
              </div>

              {/* Color Theme */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-emerald-700 mb-2">
                  Color Theme
                </label>
                <div className="flex space-x-2">
                  {['#25D366', '#007bff', '#dc3545', '#ffc107', '#6f42c1', '#20c997'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateUrlParams({ color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        messageData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-4 px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span>Generate Message</span>
                  </>
                )}
              </button>

              {/* URL Example */}
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
                <p className="text-sm text-emerald-700 font-medium mb-2">Shareable URL Example:</p>
                <code className="text-xs text-emerald-600 break-all">
                  {window.location.origin}/message-generator?type={messageData.type}&content={encodeURIComponent(messageData.content.substring(0, 20))}...
                </code>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-800 mb-6">Preview</h2>
              <div ref={messageRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <TemplateComponent messageData={messageData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator;