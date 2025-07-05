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
      data-oid="d0efsk9"
    >
      {/* Email Header */}
      <div
        className="bg-gray-50 border-b border-gray-200 p-6"
        data-oid="rfug5s."
      >
        <div
          className="flex items-center justify-between mb-4"
          data-oid="l6gi-at"
        >
          <div className="flex items-center space-x-3" data-oid="gdd48my">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: color }}
              data-oid="koovw8j"
            >
              {brand?.charAt(0) || "B"}
            </div>
            <div data-oid="7vmnr6:">
              <h2
                className="font-bold text-gray-900 text-lg"
                data-oid="jjxpgl3"
              >
                {brand || "Your Brand"}
              </h2>
              <p className="text-gray-600 text-sm" data-oid="yvhw:.u">
                {email || "noreply@company.com"}
              </p>
            </div>
          </div>
          <div className="text-right" data-oid="-2xrc-n">
            <p className="text-gray-500 text-sm" data-oid=".3nvfd3">
              To: {recipient || "customer@email.com"}
            </p>
            <p className="text-gray-500 text-xs" data-oid="m8kqpy.">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900" data-oid=".vpg0er">
          {title || "Important Message"}
        </h1>
      </div>

      {/* Email Body */}
      <div className="p-8" data-oid="vryh_b1">
        <div className="mb-6" data-oid="e8081w9">
          <p
            className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap"
            data-oid="uqlgxo0"
          >
            {recipient && `Dear ${recipient},\n\n`}
            {content ||
              "Thank you for your interest in our services. We are excited to help you achieve your goals."}
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center my-8" data-oid="pw1cpkl">
          <button
            className="px-8 py-3 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: color }}
            data-oid="przxbhw"
          >
            Get Started
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8" data-oid="c4ug8r5">
          <p className="text-gray-600 text-sm" data-oid="_u0d5ak">
            Best regards,
            <br data-oid="9nvtgyc" />
            <strong data-oid="u8-nk.-">{brand || "Your Brand"} Team</strong>
          </p>
        </div>
      </div>

      {/* Email Footer */}
      <div
        className="bg-gray-50 border-t border-gray-200 p-6"
        data-oid="5vi9g82"
      >
        <div className="text-center" data-oid="_9_ws7k">
          <p className="text-gray-500 text-xs mb-2" data-oid="1e_rafx">
            © 2024 {brand || "Your Brand"}. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs" data-oid="pp7s220">
            You received this email because you subscribed to our newsletter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
