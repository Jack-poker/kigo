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
      data-oid="ff4tf_n"
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between shadow-lg"
        data-oid="0sfosyj"
      >
        <div className="flex items-center space-x-3" data-oid="ho-o7oq">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white hover:bg-green-700 p-1"
            data-oid="1f1zehy"
          >
            <ArrowLeft className="w-5 h-5" data-oid="g4gj6:j" />
          </Button>
          <div
            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-lg"
            data-oid="617scoj"
          >
            A
          </div>
          <div data-oid="d_6xyn7">
            <h3 className="font-semibold" data-oid="u17-u_f">
              Alex (Student)
            </h3>
            <p className="text-xs text-green-100" data-oid="wyqmscc">
              StudentPay Verified
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2" data-oid="6r-1tg3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 p-2"
            data-oid="yvy9nm-"
          >
            <Video className="w-5 h-5" data-oid="9.pahw." />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 p-2"
            data-oid="0m_e_it"
          >
            <Phone className="w-5 h-5" data-oid="82d8j07" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 p-2"
            data-oid="rlz_-gz"
          >
            <MoreVertical className="w-5 h-5" data-oid="tyd.sz5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        data-oid="g:zx3ho"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "parent" ? "justify-end" : "justify-start"}`}
            data-oid=":4snkre"
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
              data-oid="wh7a71f"
            >
              {msg.type === "payment" ? (
                <div className="text-center" data-oid="k6.kxkt">
                  <div className="text-2xl font-bold" data-oid="kj262ct">
                    ${msg.amount}
                  </div>
                  <div className="text-sm opacity-90" data-oid="7hyly-3">
                    Money Transfer
                  </div>
                  <div className="text-xs opacity-75 mt-1" data-oid="x3yrxi-">
                    via StudentPay
                  </div>
                </div>
              ) : msg.type === "notification" ? (
                <div className="text-center text-sm" data-oid="g6hy9ha">
                  <div className="font-medium" data-oid="ew9iqcj">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div data-oid="o28:igf">{msg.text}</div>
              )}
              <div
                className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                  msg.sender === "parent" ? "text-green-100" : "text-gray-500"
                }`}
                data-oid="o_o1w75"
              >
                <span data-oid=".qgv9vp">{msg.timestamp}</span>
                {msg.sender === "parent" && (
                  <div className="flex" data-oid="j_o5c49">
                    <div
                      className={`w-1 h-1 rounded-full ${
                        msg.status === "read" ? "bg-blue-300" : "bg-gray-300"
                      }`}
                      data-oid="-o4as8i"
                    ></div>
                    <div
                      className={`w-1 h-1 rounded-full ml-0.5 ${
                        msg.status === "read"
                          ? "bg-blue-300"
                          : msg.status === "delivered"
                            ? "bg-gray-300"
                            : "bg-gray-400"
                      }`}
                      data-oid="l4psao2"
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200" data-oid="w5ycir1">
        <div className="flex items-center space-x-3" data-oid="ontrgqs">
          <div className="flex-1 relative" data-oid="gju7ln4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="rounded-full border-gray-300 pr-12 focus:border-green-500 focus:ring-green-500"
              data-oid="imze.5q"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            className="bg-green-600 hover:bg-green-700 rounded-full p-3"
            disabled={!message.trim()}
            data-oid="9mbqn3i"
          >
            <Send className="w-5 h-5" data-oid="5dunfec" />
          </Button>
        </div>
        <div className="mt-2 flex justify-center" data-oid="x99v41v">
          <div
            className="bg-green-50 px-3 py-1 rounded-full"
            data-oid="d6ivawj"
          >
            <span
              className="text-xs text-green-700 font-medium"
              data-oid="7hr34vm"
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
