import React from "react";

const BinanceLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-brand/80 backdrop-blur-sm flex items-center justify-center z-[100]"
      data-oid="_1_k_os"
    >
      <div className="flex flex-col items-center space-y-4" data-oid="4lwcr6f">
        {/* Binance-style loader */}
        <div className="relative" data-oid="j21j:cv">
          <div
            className="w-16 h-16 border-4 border-gray-200 rounded-full"
            data-oid="8mww29b"
          ></div>
          <div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"
            data-oid="mn36cp4"
          ></div>
        </div>

        {/* Loading dots animation */}
        <div className="flex items-center space-x-1" data-oid="kf4:q46">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            data-oid="7dljgd5"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
            data-oid="z_8z3ya"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
            data-oid="jt77hrc"
          ></div>
        </div>

        <p className="text-gray-600 font-medium" data-oid="3yknczd">
          Processing...
        </p>
      </div>
    </div>
  );
};

export default BinanceLoader;
