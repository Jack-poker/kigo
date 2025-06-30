import React, { useState } from "react";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "parent" | "student";
  timestamp: string;
  type: "text" | "payment" | "notification";
  amount?: string;
  status?: "sent" | "delivered" | "read";
}

const WhatsAppChat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi honey! Just sent your monthly allowance 💰",
      sender: "parent",
      timestamp: "10:30",
      type: "text",
      status: "read",
    },
    {
      id: "2",
      text: "$500.00 sent successfully",
      sender: "parent",
      timestamp: "10:31",
      type: "payment",
      amount: "500.00",
      status: "delivered",
    },
    {
      id: "3",
      text: "Thank you so much Mom! Got it safely 🙏",
      sender: "student",
      timestamp: "10:35",
      type: "text",
      status: "read",
    },
    {
      id: "4",
      text: "Will use it wisely for books and meals",
      sender: "student",
      timestamp: "10:36",
      type: "text",
      status: "read",
    },
    {
      id: "5",
      text: "Payment received - StudentPay",
      sender: "student",
      timestamp: "10:31",
      type: "notification",
      status: "delivered",
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: "parent",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        type: "text",
        status: "sent",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
      className="h-screen bg-gray-100 flex flex-col max-w-md mx-auto"
      data-oid="d9qef68"
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between shadow-lg"
        data-oid="jiuqudz"
      >
        <div className="flex items-center space-x-3" data-oid="trw0fre">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white hover:bg-green-700 p-1"
            data-oid="1v67uy_"
          >
            <ArrowLeft className="w-5 h-5" data-oid="6esyql6" />
          </Button>
          <div
            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-lg"
            data-oid="ce3pm2a"
          >
            A
          </div>
          <div data-oid="6693_vb">
            <h3 className="font-semibold" data-oid="qyr0gun">
              Alex (Student)
            </h3>
            <p className="text-xs text-green-100" data-oid="46q:99u">
              StudentPay Verified
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2" data-oid="2fb56l7">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 p-2"
            data-oid="h0bs7bu"
          >
            <Video className="w-5 h-5" data-oid="ax:lprv" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 p-2"
            data-oid="b8.jepm"
          >
            <Phone className="w-5 h-5" data-oid="uksajzc" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 p-2"
            data-oid="qps0mey"
          >
            <MoreVertical className="w-5 h-5" data-oid="h4d4imq" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        data-oid="2u9ump9"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "parent" ? "justify-end" : "justify-start"}`}
            data-oid="_fvar32"
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                msg.type === "payment"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : msg.type === "notification"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : msg.sender === "parent"
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
              }`}
              data-oid="x.y9vdd"
            >
              {msg.type === "payment" ? (
                <div className="text-center" data-oid="s3f499w">
                  <div className="text-2xl font-bold" data-oid="h2winlg">
                    ${msg.amount}
                  </div>
                  <div className="text-sm opacity-90" data-oid="o-fwyhe">
                    Money Transfer
                  </div>
                  <div className="text-xs opacity-75 mt-1" data-oid="ow4t_sm">
                    via StudentPay
                  </div>
                </div>
              ) : msg.type === "notification" ? (
                <div className="text-center text-sm" data-oid="xt5ji4a">
                  <div className="font-medium" data-oid="i2b6q19">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div data-oid="sqd.9wd">{msg.text}</div>
              )}
              <div
                className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                  msg.sender === "parent" ? "text-green-100" : "text-gray-500"
                }`}
                data-oid="xzvkiye"
              >
                <span data-oid="pw5h_z0">{msg.timestamp}</span>
                {msg.sender === "parent" && (
                  <div className="flex" data-oid="xhq4k:u">
                    <div
                      className={`w-1 h-1 rounded-full ${
                        msg.status === "read" ? "bg-blue-300" : "bg-gray-300"
                      }`}
                      data-oid="bj7gkkt"
                    ></div>
                    <div
                      className={`w-1 h-1 rounded-full ml-0.5 ${
                        msg.status === "read"
                          ? "bg-blue-300"
                          : msg.status === "delivered"
                            ? "bg-gray-300"
                            : "bg-gray-400"
                      }`}
                      data-oid="kte10_5"
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200" data-oid="5rbt4fn">
        <div className="flex items-center space-x-3" data-oid="pk37_yj">
          <div className="flex-1 relative" data-oid="stbmdjt">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="rounded-full border-gray-300 pr-12 focus:border-green-500 focus:ring-green-500"
              data-oid="n2l9_7w"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            className="bg-green-600 hover:bg-green-700 rounded-full p-3"
            disabled={!message.trim()}
            data-oid="0vcyxng"
          >
            <Send className="w-5 h-5" data-oid="uxd35pc" />
          </Button>
        </div>
        <div className="mt-2 flex justify-center" data-oid="157_zua">
          <div
            className="bg-green-50 px-3 py-1 rounded-full"
            data-oid="3b4goz9"
          >
            <span
              className="text-xs text-green-700 font-medium"
              data-oid="wjpu.h6"
            >
              🔒 Secured by StudentPay
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChat;
