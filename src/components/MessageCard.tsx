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
        data-oid="in_3msj"
      >
        <div className="bg-white rounded-[22px] p-8" data-oid="8pey294">
          {/* Header */}
          <div className="text-center mb-6" data-oid="_6cq133">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl mb-4"
              data-oid="bn4tzyo"
            >
              <Shield className="w-8 h-8 text-emerald-600" data-oid="zx::.mx" />
            </div>
            <h2
              className="text-2xl font-bold text-gray-800 mb-2"
              data-oid="6o4:7cu"
            >
              Verification Code
            </h2>
            <p className="text-emerald-600 font-semibold" data-oid="t7_swsr">
              {messageData.brand || "Your Brand"}
            </p>
          </div>

          {/* OTP Code */}
          <div
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border-2 border-emerald-100"
            data-oid="0ifydz2"
          >
            <div className="text-center" data-oid="yxb-ha3">
              <p className="text-sm text-gray-600 mb-2" data-oid="xoned8l">
                Your verification code is:
              </p>
              <div
                className="text-4xl font-mono font-bold text-emerald-600 tracking-[0.3em] mb-2"
                data-oid="z8.i4a0"
              >
                {messageData.code || "123456"}
              </div>
              <p className="text-xs text-gray-500" data-oid="tmwl3f6">
                Valid for 10 minutes
              </p>
            </div>
          </div>

          {/* Message Content */}
          {messageData.content && (
            <div className="mb-6" data-oid="nzqoey3">
              <p
                className="text-gray-700 leading-relaxed text-center"
                data-oid="vsg3s9i"
              >
                {messageData.content}
              </p>
            </div>
          )}

          {/* Footer */}
          <div
            className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
            data-oid="hp30d1l"
          >
            <span data-oid="f79tth7">{currentTime}</span>
            <div className="flex items-center space-x-1" data-oid="otekv-n">
              <CheckCircle
                className="w-3 h-3 text-emerald-500"
                data-oid="wwebcc1"
              />

              <span data-oid="-m5q5._">Secure</span>
            </div>
          </div>

          {/* Recipient */}
          {messageData.recipient && (
            <div className="mt-2 text-center" data-oid="jbmw8eq">
              <p className="text-xs text-gray-400" data-oid="itka6r9">
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
      data-oid="rcestce"
    >
      <div className="bg-white rounded-[22px] p-8" data-oid="9cw:4e5">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="wap65fa"
        >
          <div className="flex items-center space-x-3" data-oid="cyu4hfe">
            <div
              className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl flex items-center justify-center"
              data-oid="d0p2zd1"
            >
              <MessageSquare
                className="w-5 h-5 text-white"
                data-oid="eg1pb:c"
              />
            </div>
            <div data-oid="3d0i6hx">
              <h3 className="font-bold text-gray-800" data-oid="un9_rak">
                {messageData.brand || "Your Brand"}
              </h3>
              <p className="text-xs text-gray-500" data-oid="y55_5i-">
                {currentTime}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1" data-oid="k8ism0g">
            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid="cdyzrso"
            />

            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid=".3gdomp"
            />
          </div>
        </div>

        {/* Title */}
        {messageData.title && (
          <div className="mb-4" data-oid="4aqmzp3">
            <h2 className="text-xl font-bold text-gray-800" data-oid="3-h0liu">
              {messageData.title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="mb-6" data-oid="o97tg6n">
          <p className="text-gray-700 leading-relaxed" data-oid="t6q:vrb">
            {messageData.content || "Your message content will appear here..."}
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-4" data-oid="jyiaa9h">
          <button
            className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition-all duration-200 shadow-lg"
            data-oid="pid6lxb"
          >
            View Details
          </button>
        </div>

        {/* Footer */}
        <div
          className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
          data-oid=".qvi1sd"
        >
          <span data-oid="d3hsoqn">Delivered</span>
          {messageData.recipient && (
            <span data-oid="o801nue">To: {messageData.recipient}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
