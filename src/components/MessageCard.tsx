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
        data-oid="vgut9cu"
      >
        <div className="bg-white rounded-[22px] p-8" data-oid="48fa0g1">
          {/* Header */}
          <div className="text-center mb-6" data-oid="6lkn856">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl mb-4"
              data-oid="w5ewiou"
            >
              <Shield className="w-8 h-8 text-emerald-600" data-oid="tpw4iiq" />
            </div>
            <h2
              className="text-2xl font-bold text-gray-800 mb-2"
              data-oid="lt.m3w."
            >
              Verification Code
            </h2>
            <p className="text-emerald-600 font-semibold" data-oid="85-4d1q">
              {messageData.brand || "Your Brand"}
            </p>
          </div>

          {/* OTP Code */}
          <div
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border-2 border-emerald-100"
            data-oid="p31tifr"
          >
            <div className="text-center" data-oid="elrjjw9">
              <p className="text-sm text-gray-600 mb-2" data-oid="oc40n7j">
                Your verification code is:
              </p>
              <div
                className="text-4xl font-mono font-bold text-emerald-600 tracking-[0.3em] mb-2"
                data-oid="n9:8k38"
              >
                {messageData.code || "123456"}
              </div>
              <p className="text-xs text-gray-500" data-oid="i0gactc">
                Valid for 10 minutes
              </p>
            </div>
          </div>

          {/* Message Content */}
          {messageData.content && (
            <div className="mb-6" data-oid="iou.e2v">
              <p
                className="text-gray-700 leading-relaxed text-center"
                data-oid="-h0lszc"
              >
                {messageData.content}
              </p>
            </div>
          )}

          {/* Footer */}
          <div
            className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
            data-oid="15fyalg"
          >
            <span data-oid="kb-2cjl">{currentTime}</span>
            <div className="flex items-center space-x-1" data-oid="y6ql2-.">
              <CheckCircle
                className="w-3 h-3 text-emerald-500"
                data-oid="jzlc4ss"
              />

              <span data-oid="d9tr-r9">Secure</span>
            </div>
          </div>

          {/* Recipient */}
          {messageData.recipient && (
            <div className="mt-2 text-center" data-oid="fk2__um">
              <p className="text-xs text-gray-400" data-oid="b6d8tp8">
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
      data-oid="c7r-3hg"
    >
      <div className="bg-white rounded-[22px] p-8" data-oid="mb5:52p">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="l3wq30i"
        >
          <div className="flex items-center space-x-3" data-oid="58i7yv3">
            <div
              className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl flex items-center justify-center"
              data-oid="4ov3sv."
            >
              <MessageSquare
                className="w-5 h-5 text-white"
                data-oid="we.uvuk"
              />
            </div>
            <div data-oid="8qm09-z">
              <h3 className="font-bold text-gray-800" data-oid="jvtqn5o">
                {messageData.brand || "Your Brand"}
              </h3>
              <p className="text-xs text-gray-500" data-oid="xo1u6.8">
                {currentTime}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1" data-oid="nwpkp24">
            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid="gafzk:."
            />

            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid="aap:9ad"
            />
          </div>
        </div>

        {/* Title */}
        {messageData.title && (
          <div className="mb-4" data-oid="yw.herp">
            <h2 className="text-xl font-bold text-gray-800" data-oid="ukd4n37">
              {messageData.title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="mb-6" data-oid="7nvc80m">
          <p className="text-gray-700 leading-relaxed" data-oid="hfo-fv_">
            {messageData.content || "Your message content will appear here..."}
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-4" data-oid="dpad6y5">
          <button
            className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition-all duration-200 shadow-lg"
            data-oid="8kgmjv3"
          >
            View Details
          </button>
        </div>

        {/* Footer */}
        <div
          className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
          data-oid="z0:ew_r"
        >
          <span data-oid="4:.klqb">Delivered</span>
          {messageData.recipient && (
            <span data-oid="98jsmu4">To: {messageData.recipient}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
