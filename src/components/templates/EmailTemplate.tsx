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
      data-oid="mg5va7y"
    >
      {/* Email Header */}
      <div
        className="bg-gray-50 border-b border-gray-200 p-6"
        data-oid="2vn54h6"
      >
        <div
          className="flex items-center justify-between mb-4"
          data-oid="7zr3lmk"
        >
          <div className="flex items-center space-x-3" data-oid="htd126x">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: color }}
              data-oid="6y07n5s"
            >
              {brand?.charAt(0) || "B"}
            </div>
            <div data-oid="u71b0:r">
              <h2
                className="font-bold text-gray-900 text-lg"
                data-oid="326vh:v"
              >
                {brand || "Your Brand"}
              </h2>
              <p className="text-gray-600 text-sm" data-oid="jys6r8l">
                {email || "noreply@company.com"}
              </p>
            </div>
          </div>
          <div className="text-right" data-oid="97zix-z">
            <p className="text-gray-500 text-sm" data-oid="kis.x-n">
              To: {recipient || "customer@email.com"}
            </p>
            <p className="text-gray-500 text-xs" data-oid="nlp_nhf">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900" data-oid="wi29mpv">
          {title || "Important Message"}
        </h1>
      </div>

      {/* Email Body */}
      <div className="p-8" data-oid="1v7eup6">
        <div className="mb-6" data-oid="1_tj7r.">
          <p
            className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap"
            data-oid="w35_2r7"
          >
            {recipient && `Dear ${recipient},\n\n`}
            {content ||
              "Thank you for your interest in our services. We are excited to help you achieve your goals."}
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center my-8" data-oid="fju1v3b">
          <button
            className="px-8 py-3 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: color }}
            data-oid="bju:c.."
          >
            Get Started
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8" data-oid="p:7ngt-">
          <p className="text-gray-600 text-sm" data-oid="vln7v31">
            Best regards,
            <br data-oid="hwyip8u" />
            <strong data-oid="7w9kk_m">{brand || "Your Brand"} Team</strong>
          </p>
        </div>
      </div>

      {/* Email Footer */}
      <div
        className="bg-gray-50 border-t border-gray-200 p-6"
        data-oid="qvg:fw6"
      >
        <div className="text-center" data-oid="64ptrz2">
          <p className="text-gray-500 text-xs mb-2" data-oid="kq8ov79">
            © 2024 {brand || "Your Brand"}. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs" data-oid="a.8-4dy">
            You received this email because you subscribed to our newsletter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
