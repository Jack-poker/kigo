import React from "react";
import { X, Loader2 } from "lucide-react";

const Modal = ({ title, children, onClose, onSubmit, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      data-oid="n2kemue"
    >
      <div
        className="bg-white  rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl"
        data-oid="u1vh4x."
      >
        <div
          className="flex items-center justify-between p-6 border-b border-gray-100"
          data-oid="o8g5zl6"
        >
          <h2
            className="text-xl font-semibold text-gray-900"
            data-oid="0.q---c"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            data-oid="edzz5wl"
          >
            <X className="w-5 h-5" data-oid="k1.bg04" />
          </button>
        </div>

        <form onSubmit={handleSubmit} data-oid="e0zxuce">
          <div className="p-6 max-h-[60vh] overflow-y-auto" data-oid="dqer5e7">
            {children}
          </div>

          <div
            className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50/50"
            data-oid="wt0zxcb"
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              data-oid="slc827:"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              data-oid="5c8eo3:"
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    data-oid="vjm3tqd"
                  />

                  <span data-oid="smy2qs6">Processing...</span>
                </>
              ) : (
                <span data-oid="af723tl">Confirm</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
