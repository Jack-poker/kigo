import React, { useState, useRef } from 'react';
import { ArrowLeft, Download, Share2, Copy, MessageSquare, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import MessageCard from '@/components/MessageCard';
import { useToast } from '@/hooks/use-toast';

interface MessageData {
  type: 'message' | 'otp';
  title?: string;
  content: string;
  recipient?: string;
  brand?: string;
  code?: string;
  expiry?: string;
}

const MessageGenerator = () => {
  const [messageData, setMessageData] = useState<MessageData>({
    type: 'message',
    content: '',
    recipient: '',
    brand: 'Your Brand',
    title: 'New Message'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      // Simulate generation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Generated!",
        description: "Your beautiful message is ready to share",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!messageRef.current) return;

    try {
      // In a real implementation, you would send this to your backend
      // which would use Puppeteer to screenshot the message
      const response = await fetch('/api/generate-screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageData,
          elementHtml: messageRef.current.outerHTML
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `message-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to generate screenshot",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageData.content);
    toast({
      title: "Copied!",
      description: "Message content copied to clipboard",
    });
  };

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
                onClick={copyToClipboard}
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600"
              >
                <Download className="w-5 h-5" />
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
              
              {/* Message Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-emerald-700 mb-3">
                  Message Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMessageData(prev => ({ ...prev, type: 'message' }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                      messageData.type === 'message'
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-200'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">Message</span>
                  </button>
                  <button
                    onClick={() => setMessageData(prev => ({ ...prev, type: 'otp' }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                      messageData.type === 'otp'
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-200'
                    }`}
                  >
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">OTP</span>
                  </button>
                </div>
              </div>

              {/* Brand Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-emerald-700 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={messageData.brand}
                  onChange={(e) => setMessageData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                  placeholder="Your Brand"
                />
              </div>

              {/* Title (for regular messages) */}
              {messageData.type === 'message' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    Message Title
                  </label>
                  <input
                    type="text"
                    value={messageData.title}
                    onChange={(e) => setMessageData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                    placeholder="Enter message title"
                  />
                </div>
              )}

              {/* OTP Code (for OTP messages) */}
              {messageData.type === 'otp' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={messageData.code}
                    onChange={(e) => setMessageData(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                    placeholder="123456"
                    maxLength={6}
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
                  onChange={(e) => setMessageData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 h-32 resize-none"
                  placeholder={messageData.type === 'otp' 
                    ? "Enter your verification instructions..." 
                    : "Enter your message content..."
                  }
                />
              </div>

              {/* Recipient */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-emerald-700 mb-2">
                  Recipient (Optional)
                </label>
                <input
                  type="text"
                  value={messageData.recipient}
                  onChange={(e) => setMessageData(prev => ({ ...prev, recipient: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                  placeholder="John Doe"
                />
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
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-800 mb-6">Preview</h2>
              <div ref={messageRef}>
                <MessageCard messageData={messageData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator;