import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  MessageSquare,
  Shield,
  Palette,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import WhatsAppTemplate from "@/components/templates/WhatsAppTemplate";
import EmailTemplate from "@/components/templates/EmailTemplate";
import OTPTemplate from "@/components/templates/OTPTemplate";
// import NotificationTemplate from '@/components/templates/NotificationTemplate';
// import BusinessTemplate from '@/components/templates/BusinessTemplate';
// import SocialTemplate from '@/components/templates/SocialTemplate';

interface MessageData {
  type: "whatsapp" | "email" | "otp" | "notification" | "business" | "social";
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
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageSquare,
    component: WhatsAppTemplate,
  },
  { id: "email", name: "Email", icon: MessageSquare, component: EmailTemplate },
  { id: "otp", name: "OTP Code", icon: Shield, component: OTPTemplate },
  //   { id: 'notification', name: 'Notification', icon: MessageSquare, component: NotificationTemplate },
  //   { id: 'business', name: 'Business', icon: MessageSquare, component: BusinessTemplate },
  //   { id: 'social', name: 'Social Media', icon: Palette, component: SocialTemplate },
];

const MessageGenerator = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageData, setMessageData] = useState<MessageData>({
    type: "whatsapp",
    content: "",
    recipient: "",
    brand: "Your Brand",
    title: "New Message",
    color: "#25D366",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load data from URL parameters on component mount
  useEffect(() => {
    const urlParams = Object.fromEntries(searchParams.entries());

    if (Object.keys(urlParams).length > 0) {
      setMessageData((prev) => ({
        ...prev,
        ...urlParams,
        type: (urlParams.type as MessageData["type"]) || "whatsapp",
      }));

      // Enable screenshot mode if 'screenshot' parameter is present
      if (urlParams.screenshot === "true") {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      if (value && value !== "") {
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
    const template = templates.find((t) => t.id === messageData.type);
    return template?.component || WhatsAppTemplate;
  };

  const TemplateComponent = getCurrentTemplate();

  if (screenshotMode) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center p-4"
        style={{ width: "400px", margin: "0 auto" }}
        data-oid="7.i64eo"
      >
        <div ref={messageRef} className="w-full" data-oid="i:e1nem">
          <TemplateComponent messageData={messageData} data-oid="pgujoqs" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50"
      data-oid="dm5l0j7"
    >
      {/* Header */}
      <div
        className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40"
        data-oid="xvsw7.7"
      >
        <div className="max-w-6xl mx-auto px-4 py-4" data-oid="gy9k-fo">
          <div className="flex items-center justify-between" data-oid="51-20sq">
            <div className="flex items-center space-x-4" data-oid="3b655l-">
              <Link
                to="/"
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors"
                data-oid="a10ldf9"
              >
                <ArrowLeft
                  className="w-5 h-5 text-emerald-600"
                  data-oid="2uzjg_4"
                />
              </Link>
              <h1
                className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent"
                data-oid="rnybie7"
              >
                Message Generator
              </h1>
            </div>
            <div className="flex items-center space-x-2" data-oid="1:1q.5h">
              <button
                onClick={copyUrlToClipboard}
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600"
                title="Copy shareable URL"
                data-oid="f79ck3l"
              >
                <Copy className="w-5 h-5" data-oid="i5t8a8." />
              </button>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(messageData.content)
                }
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600"
                title="Copy message content"
                data-oid="eendpr1"
              >
                <MessageSquare className="w-5 h-5" data-oid="din3hca" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8" data-oid="6ig4_-x">
        <div className="grid lg:grid-cols-2 gap-8" data-oid="o-4fmk6">
          {/* Input Form */}
          <div className="space-y-6" data-oid="nd5zejg">
            <div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg"
              data-oid="35yni_z"
            >
              <h2
                className="text-xl font-bold text-emerald-800 mb-6"
                data-oid="s3aa.xl"
              >
                Message Settings
              </h2>

              {/* Template Selection */}
              <div className="mb-6" data-oid="wdkstjc">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-3"
                  data-oid=":xnbjlt"
                >
                  Template
                </label>
                <div className="grid grid-cols-2 gap-3" data-oid="e1m6j5c">
                  {templates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() =>
                          updateUrlParams({
                            type: template.id as MessageData["type"],
                          })
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                          messageData.type === template.id
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-gray-200 hover:border-emerald-200"
                        }`}
                        data-oid="ofj3wp-"
                      >
                        <IconComponent
                          className="w-5 h-5 text-emerald-600"
                          data-oid="2you3.g"
                        />

                        <span
                          className="font-medium text-sm"
                          data-oid="_ratjf0"
                        >
                          {template.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Name */}
              <div className="mb-4" data-oid="wj:udnl">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-2"
                  data-oid="2225fux"
                >
                  Brand Name
                </label>
                <input
                  type="text"
                  value={messageData.brand || ""}
                  onChange={(e) => updateUrlParams({ brand: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                  placeholder="Your Brand"
                  data-oid="klnnpg8"
                />
              </div>

              {/* Recipient */}
              <div className="mb-4" data-oid="47orvfd">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-2"
                  data-oid="_2.q5z4"
                >
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={messageData.recipient || ""}
                  onChange={(e) =>
                    updateUrlParams({ recipient: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                  placeholder="John Doe"
                  data-oid=".4ksb:o"
                />
              </div>

              {/* Dynamic Fields Based on Template */}
              {messageData.type === "otp" && (
                <div className="mb-4" data-oid="d_biwxb">
                  <label
                    className="block text-sm font-semibold text-emerald-700 mb-2"
                    data-oid="0gkjd71"
                  >
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={messageData.code || ""}
                    onChange={(e) => updateUrlParams({ code: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                    data-oid="u1icbsv"
                  />
                </div>
              )}

              {(messageData.type === "business" ||
                messageData.type === "email") && (
                <div className="mb-4" data-oid="2lchhut">
                  <label
                    className="block text-sm font-semibold text-emerald-700 mb-2"
                    data-oid="g12cxz5"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={messageData.title || ""}
                    onChange={(e) => updateUrlParams({ title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                    placeholder="Enter message title"
                    data-oid="fz-kw8u"
                  />
                </div>
              )}

              {/* Message Content */}
              <div className="mb-4" data-oid="uq36hl4">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-2"
                  data-oid="lr-0vav"
                >
                  Message Content
                </label>
                <textarea
                  value={messageData.content}
                  onChange={(e) => updateUrlParams({ content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 h-32 resize-none"
                  placeholder="Enter your message content..."
                  data-oid="apb6_zf"
                />
              </div>

              {/* Color Theme */}
              <div className="mb-4" data-oid="slm-hg1">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-2"
                  data-oid="49o9k.7"
                >
                  Color Theme
                </label>
                <div className="flex space-x-2" data-oid="livh0i:">
                  {[
                    "#25D366",
                    "#007bff",
                    "#dc3545",
                    "#ffc107",
                    "#6f42c1",
                    "#20c997",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateUrlParams({ color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        messageData.color === color
                          ? "border-gray-400 scale-110"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                      data-oid=":xoskxp"
                    />
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-4 px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                data-oid="0w6ijno"
              >
                {isGenerating ? (
                  <div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    data-oid="tmua1_o"
                  ></div>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" data-oid="mjjiugv" />
                    <span data-oid="1qutycr">Generate Message</span>
                  </>
                )}
              </button>

              {/* URL Example */}
              <div
                className="mt-4 p-4 bg-emerald-50 rounded-xl"
                data-oid="y:da_cj"
              >
                <p
                  className="text-sm text-emerald-700 font-medium mb-2"
                  data-oid="ffeq9uo"
                >
                  Shareable URL Example:
                </p>
                <code
                  className="text-xs text-emerald-600 break-all"
                  data-oid=".30ehq7"
                >
                  {window.location.origin}/message-generator?type=
                  {messageData.type}&content=
                  {encodeURIComponent(messageData.content.substring(0, 20))}...
                </code>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6" data-oid="612nn:z">
            <div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg"
              data-oid="69o44x8"
            >
              <h2
                className="text-xl font-bold text-emerald-800 mb-6"
                data-oid="senq4gn"
              >
                Preview
              </h2>
              <div
                ref={messageRef}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                data-oid="u3v6wvt"
              >
                <TemplateComponent
                  messageData={messageData}
                  data-oid="u6x.o.o"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator;
