import React from "react";
import { X } from "lucide-react";
import BinanceLoader from "./BinanceLoader";

interface VercelModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const VercelModal: React.FC<VercelModalProps> = ({
  title,
  children,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50"
      data-oid="983:so9"
    >
      {/* Modal Container with Glass Effect */}
      <div
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl max-w-md w-full shadow-2xl border border-brand overflow-hidden"
        data-oid="3qvg2y9"
      >
        {/* Glass Effect Background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white/60 to-emerald-100/40"
          data-oid="2sta28-"
        ></div>

        {/* Decorative Elements */}
        <div
          className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl"
          data-oid="oy9gs2a"
        ></div>
        <div
          className="absolute bottom-0 left-0 w-24 h-24 bg-green-200/20 rounded-full blur-xl"
          data-oid="m53_n4g"
        ></div>

        {/* Header */}
        <div
          className="relative z-10 flex items-center justify-between p-6 border-brand border-emerald-100/60"
          data-oid="87xoqq7"
        >
          <h2
            className="text-xl font-bold text-brand drop-shadow-sm"
            data-oid="2bvfl9o"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-white bg-brand hover:bg-brand rounded-xl transition-all duration-200 backdrop-blur-sm"
            data-oid="xmv.o4-"
          >
            <X className="w-5 h-5" data-oid="bghwqgp" />
          </button>
        </div>

        <form onSubmit={handleSubmit} data-oid="qj-7y.a">
          {/* Content */}
          <div className="relative z-10 p-6 text-gray-700" data-oid="1xficns">
            {children}
          </div>

          {/* Footer */}
          <div
            className="relative z-10 flex items-center justify-end space-x-3 p-6 border-t border-emerald-100/60 bg-gradient-to-r from-emerald-50/40 to-green-50/40"
            data-oid="cc49re5"
          >
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-emerald-700 bg-white/80 border border-emerald-200 rounded-xl hover:bg-emerald-50/80 transition-all duration-200 font-semibold backdrop-blur-sm shadow-sm"
              data-oid="os_dows"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-brand text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              data-oid="mn4ex5c"
            >
              {isLoading ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    data-oid="s6djpdj"
                  />

                  <span data-oid="zp0psi8">Processing...</span>
                </>
              ) : (
                <span data-oid="-_:f:l.">Confirm</span>
              )}
            </button>
          </div>
        </form>

        {/* Additional Glass Reflections */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none"
          data-oid="-5gi-9n"
        ></div>
      </div>
    </div>
  );
};

export default VercelModal;
