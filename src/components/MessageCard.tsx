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
        data-oid="mc56z0d"
      >
        <div className="bg-white rounded-[22px] p-8" data-oid="1n84j7d">
          {/* Header */}
          <div className="text-center mb-6" data-oid="r25za:5">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl mb-4"
              data-oid="g4bx6di"
            >
              <Shield className="w-8 h-8 text-emerald-600" data-oid="szgp:98" />
            </div>
            <h2
              className="text-2xl font-bold text-gray-800 mb-2"
              data-oid="301-:hv"
            >
              Verification Code
            </h2>
            <p className="text-emerald-600 font-semibold" data-oid="sfajrnz">
              {messageData.brand || "Your Brand"}
            </p>
          </div>

          {/* OTP Code */}
          <div
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border-2 border-emerald-100"
            data-oid="vod-sxw"
          >
            <div className="text-center" data-oid="i_9mt_6">
              <p className="text-sm text-gray-600 mb-2" data-oid=":jlgph3">
                Your verification code is:
              </p>
              <div
                className="text-4xl font-mono font-bold text-emerald-600 tracking-[0.3em] mb-2"
                data-oid=":nckuwu"
              >
                {messageData.code || "123456"}
              </div>
              <p className="text-xs text-gray-500" data-oid="x52yu3u">
                Valid for 10 minutes
              </p>
            </div>
          </div>

          {/* Message Content */}
          {messageData.content && (
            <div className="mb-6" data-oid="61.kw82">
              <p
                className="text-gray-700 leading-relaxed text-center"
                data-oid="rkedk9t"
              >
                {messageData.content}
              </p>
            </div>
          )}

          {/* Footer */}
          <div
            className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
            data-oid="fskuia3"
          >
            <span data-oid="or40c1y">{currentTime}</span>
            <div className="flex items-center space-x-1" data-oid="m5gqzrc">
              <CheckCircle
                className="w-3 h-3 text-emerald-500"
                data-oid="5h4xodf"
              />

              <span data-oid="5hu_o:8">Secure</span>
            </div>
          </div>

          {/* Recipient */}
          {messageData.recipient && (
            <div className="mt-2 text-center" data-oid="wz6azlk">
              <p className="text-xs text-gray-400" data-oid="jq856g3">
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
      data-oid="qfami9p"
    >
      <div className="bg-white rounded-[22px] p-8" data-oid="abw8bcj">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="-mlxg_q"
        >
          <div className="flex items-center space-x-3" data-oid="9e94z:v">
            <div
              className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl flex items-center justify-center"
              data-oid="5vfqy90"
            >
              <MessageSquare
                className="w-5 h-5 text-white"
                data-oid="955jdd."
              />
            </div>
            <div data-oid="d4a:b2e">
              <h3 className="font-bold text-gray-800" data-oid="-:56yzk">
                {messageData.brand || "Your Brand"}
              </h3>
              <p className="text-xs text-gray-500" data-oid="8i_:w4o">
                {currentTime}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1" data-oid="w8z6hd7">
            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid="tsx.-dh"
            />

            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid="4am8boj"
            />
          </div>
        </div>

        {/* Title */}
        {messageData.title && (
          <div className="mb-4" data-oid="25qmtrk">
            <h2 className="text-xl font-bold text-gray-800" data-oid="i12u_yy">
              {messageData.title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="mb-6" data-oid="0swxj:n">
          <p className="text-gray-700 leading-relaxed" data-oid=".:i06xs">
            {messageData.content || "Your message content will appear here..."}
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-4" data-oid="bj._ds2">
          <button
            className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition-all duration-200 shadow-lg"
            data-oid="f14oxhy"
          >
            View Details
          </button>
        </div>

        {/* Footer */}
        <div
          className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
          data-oid="44svvwt"
        >
          <span data-oid="ndzu-.k">Delivered</span>
          {messageData.recipient && (
            <span data-oid=".38jk84">To: {messageData.recipient}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
