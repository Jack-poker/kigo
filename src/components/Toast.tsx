import React, { useEffect } from "react";
import { Check, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5 text-green-600" data-oid="j97d_lz" />;
      case "error":
        return (
          <AlertCircle className="w-5 h-5 text-red-600" data-oid="-xl6xx-" />
        );

      default:
        return <Check className="w-5 h-5 text-blue-600" data-oid=":9:rtzv" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-l-4 ${getBorderColor()} p-4 flex items-center space-x-3 min-w-[300px] animate-in slide-in-from-right duration-300`}
      data-oid="fyei-lr"
    >
      {getIcon()}
      <p
        className="text-sm font-medium text-gray-900 flex-1"
        data-oid="1d2dven"
      >
        {message}
      </p>
      <button
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        data-oid="zjpnoeu"
      >
        <X className="w-4 h-4" data-oid="gzi-l4l" />
      </button>
    </div>
  );
};

export default Toast;
