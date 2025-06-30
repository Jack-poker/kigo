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
        data-oid="q10u1lq"
      >
        <div ref={messageRef} className="w-full" data-oid="i9uyf05">
          <TemplateComponent messageData={messageData} data-oid="yp4sd1m" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50"
      data-oid=".b012oy"
    >
      {/* Header */}
      <div
        className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40"
        data-oid="5d9h4mi"
      >
        <div className="max-w-6xl mx-auto px-4 py-4" data-oid="ytj9y-x">
          <div className="flex items-center justify-between" data-oid="afj03sg">
            <div className="flex items-center space-x-4" data-oid="vbf6qmx">
              <Link
                to="/"
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors"
                data-oid="2n18j6x"
              >
                <ArrowLeft
                  className="w-5 h-5 text-emerald-600"
                  data-oid="j4gzxb1"
                />
              </Link>
              <h1
                className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent"
                data-oid="a-_1ui5"
              >
                Message Generator
              </h1>
            </div>
            <div className="flex items-center space-x-2" data-oid="e98epj5">
              <button
                onClick={copyUrlToClipboard}
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600"
                title="Copy shareable URL"
                data-oid="pi1.vog"
              >
                <Copy className="w-5 h-5" data-oid="ltww-d." />
              </button>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(messageData.content)
                }
                className="p-2 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600"
                title="Copy message content"
                data-oid="zqeneoq"
              >
                <MessageSquare className="w-5 h-5" data-oid="4ve2g6k" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8" data-oid="w6o7-pl">
        <div className="grid lg:grid-cols-2 gap-8" data-oid="rgyi8i8">
          {/* Input Form */}
          <div className="space-y-6" data-oid="cg1.ng:">
            <div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg"
              data-oid="340jr-r"
            >
              <h2
                className="text-xl font-bold text-emerald-800 mb-6"
                data-oid="0qkq-m2"
              >
                Message Settings
              </h2>

              {/* Template Selection */}
              <div className="mb-6" data-oid="4t3hlad">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-3"
                  data-oid="j2k4de7"
                >
                  Template
                </label>
                <div className="grid grid-cols-2 gap-3" data-oid="ylhnj-g">
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
                        data-oid="lo3y.c6"
                      >
                        <IconComponent
                          className="w-5 h-5 text-emerald-600"
                          data-oid="x4ql1.j"
                        />

                        <span
                          className="font-medium text-sm"
                          data-oid="5-adgmd"
                        >
                          {template.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Name */}
              <div className="mb-4" data-oid="zhw2axo">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-2"
                  data-oid=".29l634"
                >
                  Brand Name
                </label>
                <input
                  type="text"
                  value={messageData.brand || ""}
                  onChange={(e) => updateUrlParams({ brand: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                  placeholder="Your Brand"
                  data-oid="ynm7w.w"
                />
              </div>

              {/* Recipient */}
              <div className="mb-4" data-oid="hp4vqe.">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-2"
                  data-oid="vn9a9.m"
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
                  data-oid="jwq6_f-"
                />
              </div>

              {/* Dynamic Fields Based on Template */}
              {messageData.type === "otp" && (
                <div className="mb-4" data-oid="wwn68qc">
                  <label
                    className="block text-sm font-semibold text-emerald-700 mb-2"
                    data-oid="tx9nh50"
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
                    data-oid="t8runvz"
                  />
                </div>
              )}

              {(messageData.type === "business" ||
                messageData.type === "email") && (
                <div className="mb-4" data-oid="sggr.ei">
                  <label
                    className="block text-sm font-semibold text-emerald-700 mb-2"
                    data-oid="eesi9oa"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={messageData.title || ""}
                    onChange={(e) => updateUrlParams({ title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
                    placeholder="Enter message title"
                    data-oid="jbf1ovh"
                  />
                </div>
              )}

              {/* Message Content */}
              <div className="mb-4" data-oid="-rw5ukz">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-2"
                  data-oid=".cm9xgo"
                >
                  Message Content
                </label>
                <textarea
                  value={messageData.content}
                  onChange={(e) => updateUrlParams({ content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 h-32 resize-none"
                  placeholder="Enter your message content..."
                  data-oid="9wue4oz"
                />
              </div>

              {/* Color Theme */}
              <div className="mb-4" data-oid="pr.aexg">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-2"
                  data-oid=":khv5en"
                >
                  Color Theme
                </label>
                <div className="flex space-x-2" data-oid="2ycn6sk">
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
                      data-oid="aj0xlkq"
                    />
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-4 px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                data-oid="8peyrpq"
              >
                {isGenerating ? (
                  <div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    data-oid="t.7ij07"
                  ></div>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" data-oid="b0c5i5s" />
                    <span data-oid="49zhp8.">Generate Message</span>
                  </>
                )}
              </button>

              {/* URL Example */}
              <div
                className="mt-4 p-4 bg-emerald-50 rounded-xl"
                data-oid="np_caq-"
              >
                <p
                  className="text-sm text-emerald-700 font-medium mb-2"
                  data-oid="tgr9.3f"
                >
                  Shareable URL Example:
                </p>
                <code
                  className="text-xs text-emerald-600 break-all"
                  data-oid="u3bnoze"
                >
                  {window.location.origin}/message-generator?type=
                  {messageData.type}&content=
                  {encodeURIComponent(messageData.content.substring(0, 20))}...
                </code>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6" data-oid="03eguaq">
            <div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg"
              data-oid="07:k02x"
            >
              <h2
                className="text-xl font-bold text-emerald-800 mb-6"
                data-oid=":t0am8y"
              >
                Preview
              </h2>
              <div
                ref={messageRef}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                data-oid="xfwc1oh"
              >
                <TemplateComponent
                  messageData={messageData}
                  data-oid="0r35:k-"
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
