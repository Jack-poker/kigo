import React from "react";
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";
import BinanceLoader from "./BinanceLoader";

interface BinanceConfirmationModalProps {
  title: string;
  message: string;
  type: "warning" | "success" | "info" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const BinanceConfirmationModal: React.FC<BinanceConfirmationModalProps> = ({
  title,
  message,
  type = "info",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return (
          <AlertTriangle
            className="w-8 h-8 text-yellow-500"
            data-oid="88hul:d"
          />
        );

      case "success":
        return (
          <CheckCircle className="w-8 h-8 text-green-500" data-oid="kpyc-dn" />
        );

      case "danger":
        return (
          <AlertTriangle className="w-8 h-8 text-red-500" data-oid="p5y4b_o" />
        );

      default:
        return <Info className="w-8 h-8 text-blue-500" data-oid="8v.zwyr" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "success":
        return "bg-green-500 hover:bg-green-600";
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      data-oid="dn-c:sm"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden"
        data-oid="4y_rr3:"
      >
        <div
          className="flex items-center justify-between p-6 border-b border-gray-100"
          data-oid="p8_seda"
        >
          <h2
            className="text-lg font-semibold text-gray-900"
            data-oid="izmfoo1"
          >
            {title}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            data-oid="-wh8.90"
          >
            <X className="w-5 h-5" data-oid="-83mwbp" />
          </button>
        </div>

        <div className="p-6" data-oid="j873ykq">
          <div className="flex items-center space-x-4 mb-6" data-oid="-mce_cj">
            <div className="flex-shrink-0" data-oid="-tv1gys">
              {getIcon()}
            </div>
            <div className="flex-1" data-oid="demwujp">
              <p
                className="text-gray-700 text-sm leading-relaxed"
                data-oid="xidjgrw"
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50/50"
          data-oid="n7y.b.:"
        >
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            data-oid="01-l-8e"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2 ${getButtonColor()}`}
            data-oid="d5qra_l"
          >
            {isLoading ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  data-oid="_rcbr7o"
                />

                <span data-oid="-b3qozf">Processing...</span>
              </>
            ) : (
              <span data-oid="rq032fk">{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BinanceConfirmationModal;
