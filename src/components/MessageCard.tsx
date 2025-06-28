import React from "react";
import { MessageSquare, Shield, Clock, CheckCircle } from "lucide-react";

interface MessageData {
  type: "message" | "otp";
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
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (messageData.type === "otp") {
    return (
      <div
        className="max-w-md mx-auto bg-gradient-to-br from-emerald-500 via-green-400 to-emerald-600 rounded-3xl p-1 shadow-2xl"
        data-oid="7k58vyx"
      >
        <div className="bg-white rounded-[22px] p-8" data-oid="chml0v2">
          {/* Header */}
          <div className="text-center mb-6" data-oid="0dlaja9">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl mb-4"
              data-oid="a6j9n20"
            >
              <Shield className="w-8 h-8 text-emerald-600" data-oid="06gco95" />
            </div>
            <h2
              className="text-2xl font-bold text-gray-800 mb-2"
              data-oid="w9ta5m5"
            >
              Verification Code
            </h2>
            <p className="text-emerald-600 font-semibold" data-oid="6s14e9k">
              {messageData.brand || "Your Brand"}
            </p>
          </div>

          {/* OTP Code */}
          <div
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border-2 border-emerald-100"
            data-oid="z_9frhb"
          >
            <div className="text-center" data-oid="_3zva_b">
              <p className="text-sm text-gray-600 mb-2" data-oid="itujhar">
                Your verification code is:
              </p>
              <div
                className="text-4xl font-mono font-bold text-emerald-600 tracking-[0.3em] mb-2"
                data-oid="wdzpzzn"
              >
                {messageData.code || "123456"}
              </div>
              <p className="text-xs text-gray-500" data-oid="_is9omv">
                Valid for 10 minutes
              </p>
            </div>
          </div>

          {/* Message Content */}
          {messageData.content && (
            <div className="mb-6" data-oid="yz3tplm">
              <p
                className="text-gray-700 leading-relaxed text-center"
                data-oid="2-jf032"
              >
                {messageData.content}
              </p>
            </div>
          )}

          {/* Footer */}
          <div
            className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
            data-oid="zalyk.7"
          >
            <span data-oid="xdsa76j">{currentTime}</span>
            <div className="flex items-center space-x-1" data-oid="daf9:ql">
              <CheckCircle
                className="w-3 h-3 text-emerald-500"
                data-oid="5du0x_c"
              />

              <span data-oid="qsi3l4d">Secure</span>
            </div>
          </div>

          {/* Recipient */}
          {messageData.recipient && (
            <div className="mt-2 text-center" data-oid="gyunp1o">
              <p className="text-xs text-gray-400" data-oid="5o7bap-">
                Sent to {messageData.recipient}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-md mx-auto bg-gradient-to-br from-emerald-500 via-green-400 to-emerald-600 rounded-3xl p-1 shadow-2xl"
      data-oid="p_.wui_"
    >
      <div className="bg-white rounded-[22px] p-8" data-oid="jy3v:n_">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="weci7i-"
        >
          <div className="flex items-center space-x-3" data-oid="aa23:ai">
            <div
              className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl flex items-center justify-center"
              data-oid="bhc1ygg"
            >
              <MessageSquare
                className="w-5 h-5 text-white"
                data-oid="sb.-j8f"
              />
            </div>
            <div data-oid="x8l7v18">
              <h3 className="font-bold text-gray-800" data-oid="17quleb">
                {messageData.brand || "Your Brand"}
              </h3>
              <p className="text-xs text-gray-500" data-oid=":2lg7xy">
                {currentTime}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1" data-oid="h..oru.">
            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid="m0m:jn1"
            />

            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid="pkxc-8n"
            />
          </div>
        </div>

        {/* Title */}
        {messageData.title && (
          <div className="mb-4" data-oid="7k24--m">
            <h2 className="text-xl font-bold text-gray-800" data-oid="dlyooj4">
              {messageData.title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="mb-6" data-oid="1aw:fe.">
          <p className="text-gray-700 leading-relaxed" data-oid="npz8x2c">
            {messageData.content || "Your message content will appear here..."}
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-4" data-oid="d_h_buw">
          <button
            className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition-all duration-200 shadow-lg"
            data-oid="mhcwhrk"
          >
            View Details
          </button>
        </div>

        {/* Footer */}
        <div
          className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
          data-oid="jry5mrd"
        >
          <span data-oid="z11mk13">Delivered</span>
          {messageData.recipient && (
            <span data-oid="paiwyko">To: {messageData.recipient}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
