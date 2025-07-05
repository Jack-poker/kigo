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
        data-oid="50aouck"
      >
        <div className="bg-white rounded-[22px] p-8" data-oid="zgunvrl">
          {/* Header */}
          <div className="text-center mb-6" data-oid="-g0t.ox">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl mb-4"
              data-oid="_y0cqzg"
            >
              <Shield className="w-8 h-8 text-emerald-600" data-oid="y_ghd--" />
            </div>
            <h2
              className="text-2xl font-bold text-gray-800 mb-2"
              data-oid="3qd_069"
            >
              Verification Code
            </h2>
            <p className="text-emerald-600 font-semibold" data-oid="hmmd04v">
              {messageData.brand || "Your Brand"}
            </p>
          </div>

          {/* OTP Code */}
          <div
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border-2 border-emerald-100"
            data-oid="3ftsnox"
          >
            <div className="text-center" data-oid="oh38a9x">
              <p className="text-sm text-gray-600 mb-2" data-oid="be6w6ub">
                Your verification code is:
              </p>
              <div
                className="text-4xl font-mono font-bold text-emerald-600 tracking-[0.3em] mb-2"
                data-oid="zxqvrwo"
              >
                {messageData.code || "123456"}
              </div>
              <p className="text-xs text-gray-500" data-oid="a_vs06o">
                Valid for 10 minutes
              </p>
            </div>
          </div>

          {/* Message Content */}
          {messageData.content && (
            <div className="mb-6" data-oid="tm6zah6">
              <p
                className="text-gray-700 leading-relaxed text-center"
                data-oid="oit321f"
              >
                {messageData.content}
              </p>
            </div>
          )}

          {/* Footer */}
          <div
            className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
            data-oid="kyhfv.w"
          >
            <span data-oid="lobao3l">{currentTime}</span>
            <div className="flex items-center space-x-1" data-oid="cv.pjcl">
              <CheckCircle
                className="w-3 h-3 text-emerald-500"
                data-oid=":j8t:ml"
              />

              <span data-oid="j:5j-s0">Secure</span>
            </div>
          </div>

          {/* Recipient */}
          {messageData.recipient && (
            <div className="mt-2 text-center" data-oid="a1dxjr-">
              <p className="text-xs text-gray-400" data-oid="-gbjanc">
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
      data-oid="hf.oao6"
    >
      <div className="bg-white rounded-[22px] p-8" data-oid="siekz1y">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="x57xcd."
        >
          <div className="flex items-center space-x-3" data-oid=":rvri:z">
            <div
              className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl flex items-center justify-center"
              data-oid="dt0vqzg"
            >
              <MessageSquare
                className="w-5 h-5 text-white"
                data-oid="3csrcst"
              />
            </div>
            <div data-oid="br--e04">
              <h3 className="font-bold text-gray-800" data-oid="n7r_6jj">
                {messageData.brand || "Your Brand"}
              </h3>
              <p className="text-xs text-gray-500" data-oid="f.n180t">
                {currentTime}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1" data-oid="9ba1zxg">
            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid="bkgy.fr"
            />

            <CheckCircle
              className="w-4 h-4 text-emerald-500"
              data-oid="3mk5wk4"
            />
          </div>
        </div>

        {/* Title */}
        {messageData.title && (
          <div className="mb-4" data-oid="0q4s7z5">
            <h2 className="text-xl font-bold text-gray-800" data-oid="sxbi5la">
              {messageData.title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="mb-6" data-oid="ftbcv9v">
          <p className="text-gray-700 leading-relaxed" data-oid="bcfauct">
            {messageData.content || "Your message content will appear here..."}
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-4" data-oid="grxbpdj">
          <button
            className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-500 transition-all duration-200 shadow-lg"
            data-oid="8q23426"
          >
            View Details
          </button>
        </div>

        {/* Footer */}
        <div
          className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500"
          data-oid="1mj.y3:"
        >
          <span data-oid="o3ogj7u">Delivered</span>
          {messageData.recipient && (
            <span data-oid="9yvju58">To: {messageData.recipient}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
