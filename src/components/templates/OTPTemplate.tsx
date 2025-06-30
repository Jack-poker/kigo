import React from "react";
import { Shield, Clock } from "lucide-react";

interface MessageData {
  content: string;
  recipient?: string;
  brand?: string;
  code?: string;
  expiry?: string;
  color?: string;
}

interface OTPTemplateProps {
  messageData: MessageData;
}

const OTPTemplate: React.FC<OTPTemplateProps> = ({ messageData }) => {
  const {
    content,
    recipient,
    brand,
    code,
    expiry,
    color = "#dc3545",
  } = messageData;

  return (
    <div
      className="w-full max-w-md mx-auto bg-white shadow-xl rounded-2xl overflow-hidden font-sans"
      data-oid="12kpu7k"
    >
      {/* Header */}
      <div
        className="text-center p-8"
        style={{ backgroundColor: `${color}10` }}
        data-oid="4jd8tbz"
      >
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: color }}
          data-oid="ah_-f8r"
        >
          <Shield className="w-8 h-8 text-white" data-oid="bt920vo" />
        </div>
        <h2
          className="text-2xl font-bold text-gray-900 mb-2"
          data-oid="6260233"
        >
          Verification Code
        </h2>
        <p className="text-gray-600" data-oid="wn4lizn">
          {brand || "Your Brand"}
        </p>
      </div>

      {/* Body */}
      <div className="p-8" data-oid="9cq8h0v">
        <div className="text-center mb-8" data-oid="_-yc1ik">
          <p className="text-gray-700 mb-6 leading-relaxed" data-oid="5ycy5_r">
            {recipient && `Hi ${recipient},\n\n`}
            {content ||
              "Please use the following verification code to complete your request:"}
          </p>

          {/* OTP Code */}
          <div className="mb-6" data-oid="821oq59">
            <div
              className="inline-block px-8 py-4 rounded-xl border-2 border-dashed"
              style={{ borderColor: color, backgroundColor: `${color}08` }}
              data-oid="ubk8y1l"
            >
              <span
                className="text-4xl font-mono font-bold tracking-widest"
                style={{ color: color }}
                data-oid=":d42yxc"
              >
                {code || "123456"}
              </span>
            </div>
          </div>

          {/* Expiry Info */}
          <div
            className="flex items-center justify-center space-x-2 text-gray-500 mb-6"
            data-oid="oecxdju"
          >
            <Clock className="w-4 h-4" data-oid="wa1_4d." />
            <span className="text-sm" data-oid="gq-_rq-">
              Expires in {expiry || "10 minutes"}
            </span>
          </div>

          {/* Security Notice */}
          <div
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            data-oid="-wyvmcv"
          >
            <p
              className="text-xs text-gray-600 leading-relaxed"
              data-oid="ccup5bj"
            >
              🔒 For security reasons, never share this code with anyone.
              {brand || "We"} will never ask for your verification code.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="bg-gray-50 border-t border-gray-200 p-6 text-center"
        data-oid="3sati5b"
      >
        <p className="text-xs text-gray-500" data-oid="wuhyqix">
          This code was requested from your account. If you didn't request this,
          please ignore this message.
        </p>
      </div>
    </div>
  );
};

export default OTPTemplate;
