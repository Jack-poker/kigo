import React, { useEffect } from "react";
import { Check, AlertCircle, X } from "lucide-react";

interface VercelToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}




const VercelToast: React.FC<VercelToastProps> = ({
  message,
  type = "success",
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4 text-green-600" data-oid="6o:7shy" />;
      case "error":
        return (
          <AlertCircle className="w-4 h-4 text-red-600" data-oid="cz.fijy" />
        );

      default:
        return <Check className="w-4 h-4 text-green-600" data-oid="4sgpua5" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-green-500";
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 border-l-4 ${getBorderColor()} p-4 flex items-center space-x-3 min-w-[320px] animate-in slide-in-from-right duration-300`}
      data-oid="a3j5fih"
    >
      <div
        className={`flex-shrink-0 p-1 rounded-full ${type === "success" ? "bg-green-50" : "bg-red-50"}`}
        data-oid="m029yeg"
      >
        {getIcon()}
      </div>
      <p
        className="text-sm font-medium text-gray-900 flex-1"
        data-oid="xrz8m5k"
      >
        {message}
      </p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        data-oid="h8syfrz"
      >
        <X className="w-4 h-4" data-oid="h0rxycc" />
      </button>
    </div>
  );
};

export default VercelToast;
