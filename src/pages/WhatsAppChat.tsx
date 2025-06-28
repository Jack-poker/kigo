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
      data-oid="o10k9jb"
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between shadow-lg"
        data-oid="75s4sb_"
      >
        <div className="flex items-center space-x-3" data-oid="3as-lyi">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white hover:bg-green-700 p-1"
            data-oid="xsle0oy"
          >
            <ArrowLeft className="w-5 h-5" data-oid="lpijf5o" />
          </Button>
          <div
            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-lg"
            data-oid="yf7x91j"
          >
            A
          </div>
          <div data-oid="elm-k_l">
            <h3 className="font-semibold" data-oid="vii8075">
              Alex (Student)
            </h3>
            <p className="text-xs text-green-100" data-oid="3j7r631">
              StudentPay Verified
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2" data-oid="7c_x__3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 p-2"
            data-oid="7-87gdr"
          >
            <Video className="w-5 h-5" data-oid="_4u9c:z" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 p-2"
            data-oid="jknu88w"
          >
            <Phone className="w-5 h-5" data-oid="zqej1s0" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 p-2"
            data-oid="dlryrfq"
          >
            <MoreVertical className="w-5 h-5" data-oid="4nrmfjz" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        data-oid="ui9wh-a"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "parent" ? "justify-end" : "justify-start"}`}
            data-oid="racjp75"
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
              data-oid="lg8iu2e"
            >
              {msg.type === "payment" ? (
                <div className="text-center" data-oid="l9ip4n2">
                  <div className="text-2xl font-bold" data-oid="44mc-lo">
                    ${msg.amount}
                  </div>
                  <div className="text-sm opacity-90" data-oid="v4eax4g">
                    Money Transfer
                  </div>
                  <div className="text-xs opacity-75 mt-1" data-oid=".v:kbu9">
                    via StudentPay
                  </div>
                </div>
              ) : msg.type === "notification" ? (
                <div className="text-center text-sm" data-oid="oh31-fk">
                  <div className="font-medium" data-oid="8g01oa8">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div data-oid="obalrnc">{msg.text}</div>
              )}
              <div
                className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                  msg.sender === "parent" ? "text-green-100" : "text-gray-500"
                }`}
                data-oid="494yf6a"
              >
                <span data-oid="us16auv">{msg.timestamp}</span>
                {msg.sender === "parent" && (
                  <div className="flex" data-oid="9ih5ec:">
                    <div
                      className={`w-1 h-1 rounded-full ${
                        msg.status === "read" ? "bg-blue-300" : "bg-gray-300"
                      }`}
                      data-oid="ar757wv"
                    ></div>
                    <div
                      className={`w-1 h-1 rounded-full ml-0.5 ${
                        msg.status === "read"
                          ? "bg-blue-300"
                          : msg.status === "delivered"
                            ? "bg-gray-300"
                            : "bg-gray-400"
                      }`}
                      data-oid="fu7yqu4"
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200" data-oid="81odizv">
        <div className="flex items-center space-x-3" data-oid="mg-6o8t">
          <div className="flex-1 relative" data-oid=":8mcmja">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="rounded-full border-gray-300 pr-12 focus:border-green-500 focus:ring-green-500"
              data-oid="641sg2z"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            className="bg-green-600 hover:bg-green-700 rounded-full p-3"
            disabled={!message.trim()}
            data-oid="f48xnl8"
          >
            <Send className="w-5 h-5" data-oid=".jqq-7f" />
          </Button>
        </div>
        <div className="mt-2 flex justify-center" data-oid="w73dj_j">
          <div
            className="bg-green-50 px-3 py-1 rounded-full"
            data-oid="m__5wrr"
          >
            <span
              className="text-xs text-green-700 font-medium"
              data-oid="2c.wwq:"
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
