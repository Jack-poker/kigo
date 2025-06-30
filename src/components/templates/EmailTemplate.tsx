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
      data-oid="rl3rwsf"
    >
      {/* Email Header */}
      <div
        className="bg-gray-50 border-b border-gray-200 p-6"
        data-oid="gtcph98"
      >
        <div
          className="flex items-center justify-between mb-4"
          data-oid="bsezl5y"
        >
          <div className="flex items-center space-x-3" data-oid=".lt:8v8">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: color }}
              data-oid="m3d.6s7"
            >
              {brand?.charAt(0) || "B"}
            </div>
            <div data-oid="qvgu:cf">
              <h2
                className="font-bold text-gray-900 text-lg"
                data-oid="ehb78gm"
              >
                {brand || "Your Brand"}
              </h2>
              <p className="text-gray-600 text-sm" data-oid="elojrm2">
                {email || "noreply@company.com"}
              </p>
            </div>
          </div>
          <div className="text-right" data-oid="gvgx6wn">
            <p className="text-gray-500 text-sm" data-oid="w5.sexu">
              To: {recipient || "customer@email.com"}
            </p>
            <p className="text-gray-500 text-xs" data-oid="9r7rekr">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900" data-oid="bonbbm8">
          {title || "Important Message"}
        </h1>
      </div>

      {/* Email Body */}
      <div className="p-8" data-oid="zc5cjbg">
        <div className="mb-6" data-oid="4ndyrth">
          <p
            className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap"
            data-oid="8d17nx7"
          >
            {recipient && `Dear ${recipient},\n\n`}
            {content ||
              "Thank you for your interest in our services. We are excited to help you achieve your goals."}
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center my-8" data-oid="6km_4qw">
          <button
            className="px-8 py-3 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: color }}
            data-oid="o_84fg."
          >
            Get Started
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8" data-oid="uz36h:k">
          <p className="text-gray-600 text-sm" data-oid=".d15q.n">
            Best regards,
            <br data-oid="pa4z_3s" />
            <strong data-oid="26da5lg">{brand || "Your Brand"} Team</strong>
          </p>
        </div>
      </div>

      {/* Email Footer */}
      <div
        className="bg-gray-50 border-t border-gray-200 p-6"
        data-oid="07jz2gt"
      >
        <div className="text-center" data-oid="0m.n-j:">
          <p className="text-gray-500 text-xs mb-2" data-oid="-xvi42h">
            © 2024 {brand || "Your Brand"}. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs" data-oid="-losd.n">
            You received this email because you subscribed to our newsletter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
