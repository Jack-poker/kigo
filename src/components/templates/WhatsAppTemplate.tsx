import React from "react";
import { Check, CheckCheck } from "lucide-react";

interface MessageData {
  content: string;
  recipient?: string;
  brand?: string;
  timestamp?: string;
  color?: string;
  amount?: string;
  studentName?: string;
  transactionId?: string;
}

interface WhatsAppTemplateProps {
  messageData: MessageData;
}

const WhatsAppTemplate: React.FC<WhatsAppTemplateProps> = ({ messageData }) => {
  const {
    content,
    recipient,
    brand = "StudentPay",
    timestamp = "12:34",
    color = "#25D366",
    amount,
    studentName,
    transactionId,
  } = messageData;

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div
      className="w-full max-w-lg mx-auto bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 p-1 rounded-3xl shadow-2xl"
      data-oid="nox4iqj"
    >
      <div
        className="bg-white rounded-2xl p-8 h-full min-h-[400px] flex flex-col justify-center items-center text-center"
        data-oid="p.4sy:8"
      >
        {/* Brand Header */}
        <div className="mb-6" data-oid="mwtq79r">
          {/* <div 
                                 className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto shadow-lg"
                                 style={{ backgroundColor: color }}
                                >
                                 {brand.charAt(0)}
                                </div> */}
          <img
            src="/assets/logo.png"
            className="w-45 h-20"
            alt=""
            srcset=""
            data-oid="1_8wgk."
          />

          <h1
            className="text-2xl font-bold text-gray-800 mb-1"
            data-oid=":cu.w.k"
          >
            {brand}
          </h1>
          <p className="text-sm text-gray-500" data-oid="e:3pyyl">
            Money Transfer Service
          </p>
        </div>

        {/* Success Icon */}
        <div
          className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          data-oid="p06.-2a"
        >
          <CheckCheck className="w-6 h-6 text-green-600" data-oid="_2lg0:_" />
        </div>

        {/* Main Content */}
        <div
          className="flex-1 flex flex-col items-center justify-center space-y-4"
          data-oid="i3._3gw"
        >
          <h2
            className="text-xl font-semibold text-gray-900"
            data-oid="hzm:p84"
          >
            Transfer Successful!
          </h2>

          {amount && (
            <div
              className="bg-green-50 border-2 border-brand rounded-xl p-4 w-full max-w-xs"
              data-oid="vh3ok6:"
            >
              <p
                className="text-green-700 font-bold text-2xl"
                data-oid=":ri.ndq"
              >
                ${amount}
              </p>
              <p className="text-green-600 text-sm" data-oid="azh-jpl">
                Amount Sent
              </p>
            </div>
          )}

          <div className="space-y-2 text-sm w-full max-w-xs" data-oid="8jlo7l9">
            {studentName && (
              <div
                className="flex justify-between items-center bg-gray-50 rounded-lg p-2"
                data-oid="a9jnbwp"
              >
                <span className="text-gray-600" data-oid="cvfx:8v">
                  To:
                </span>
                <span className="font-medium" data-oid="soqje:9">
                  {studentName}
                </span>
              </div>
            )}
            {transactionId && (
              <div
                className="flex justify-between items-center bg-gray-50 rounded-lg p-2"
                data-oid="am9gw4-"
              >
                <span className="text-gray-600" data-oid="6x9d5pa">
                  ID:
                </span>
                <span className="font-mono text-xs" data-oid="ce7fnhr">
                  {transactionId}
                </span>
              </div>
            )}
          </div>

          {content && (
            <p
              className="text-gray-700 text-sm leading-relaxed max-w-xs mt-4"
              data-oid="_:uj3w3"
            >
              {recipient && `Hi ${recipient}! `}
              {content}
            </p>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2 mt-6" data-oid="s_g82m7">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
            data-oid="9qv6let"
          ></div>
          <div
            className="w-3 h-3 rounded-full opacity-60"
            style={{ backgroundColor: color }}
            data-oid="1ej:ciz"
          ></div>
          <div
            className="w-3 h-3 rounded-full opacity-30"
            style={{ backgroundColor: color }}
            data-oid="ka0ii_a"
          ></div>
        </div>

        {/* Footer with timestamp */}
        <div
          className="mt-6 flex items-center justify-center space-x-2"
          data-oid="6wdlmim"
        >
          <span className="text-xs text-gray-500" data-oid="9usm9rn">
            {timestamp || formatTime()}
          </span>
          <CheckCheck className="w-3 h-3 text-green-500" data-oid="z59rhmj" />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTemplate;
