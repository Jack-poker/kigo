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
        return <Check className="w-5 h-5 text-green-600" data-oid="z.ymlec" />;
      case "error":
        return (
          <AlertCircle className="w-5 h-5 text-red-600" data-oid="24qhrqh" />
        );

      default:
        return <Check className="w-5 h-5 text-blue-600" data-oid="s5h-d-z" />;
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
      data-oid="59sx8:1"
    >
      {getIcon()}
      <p
        className="text-sm font-medium text-gray-900 flex-1"
        data-oid="sp5it9w"
      >
        {message}
      </p>
      <button
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        data-oid="bp7mpti"
      >
        <X className="w-4 h-4" data-oid="zh3t3mi" />
      </button>
    </div>
  );
};

export default Toast;
