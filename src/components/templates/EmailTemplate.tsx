import React from "react";

interface MessageData {
  content: string;
  recipient?: string;
  brand?: string;
  title?: string;
  color?: string;
  email?: string;
}

interface EmailTemplateProps {
  messageData: MessageData;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ messageData }) => {
  const {
    content,
    recipient,
    brand,
    title,
    color = "#007bff",
    email,
  } = messageData;

  return (
    <div
      className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden font-sans"
      data-oid="bmooclb"
    >
      {/* Email Header */}
      <div
        className="bg-gray-50 border-b border-gray-200 p-6"
        data-oid="xdzmq85"
      >
        <div
          className="flex items-center justify-between mb-4"
          data-oid="ubaikuu"
        >
          <div className="flex items-center space-x-3" data-oid="a5-5m0o">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: color }}
              data-oid="sok.ua8"
            >
              {brand?.charAt(0) || "B"}
            </div>
            <div data-oid="b:1.sc6">
              <h2
                className="font-bold text-gray-900 text-lg"
                data-oid="i:wq0r8"
              >
                {brand || "Your Brand"}
              </h2>
              <p className="text-gray-600 text-sm" data-oid="s93op.p">
                {email || "noreply@company.com"}
              </p>
            </div>
          </div>
          <div className="text-right" data-oid="t85oi16">
            <p className="text-gray-500 text-sm" data-oid="4hm_li_">
              To: {recipient || "customer@email.com"}
            </p>
            <p className="text-gray-500 text-xs" data-oid="el5t0fd">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900" data-oid="d4sjzj_">
          {title || "Important Message"}
        </h1>
      </div>

      {/* Email Body */}
      <div className="p-8" data-oid="ac-yur:">
        <div className="mb-6" data-oid="oj42mbt">
          <p
            className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap"
            data-oid="2tvbdbx"
          >
            {recipient && `Dear ${recipient},\n\n`}
            {content ||
              "Thank you for your interest in our services. We are excited to help you achieve your goals."}
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center my-8" data-oid="xdvg4:8">
          <button
            className="px-8 py-3 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: color }}
            data-oid="axr03mc"
          >
            Get Started
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8" data-oid="d95umy4">
          <p className="text-gray-600 text-sm" data-oid="wq-wdmn">
            Best regards,
            <br data-oid=".tv.776" />
            <strong data-oid="i9ifeb-">{brand || "Your Brand"} Team</strong>
          </p>
        </div>
      </div>

      {/* Email Footer */}
      <div
        className="bg-gray-50 border-t border-gray-200 p-6"
        data-oid="6jxamc4"
      >
        <div className="text-center" data-oid="qohnrgo">
          <p className="text-gray-500 text-xs mb-2" data-oid="10boi3_">
            © 2024 {brand || "Your Brand"}. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs" data-oid="ikg8zyh">
            You received this email because you subscribed to our newsletter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
