import React from "react";

const BinanceLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100] bg-brand"
      data-oid="dj186x5"
    >
      <div className="flex flex-col items-center space-y-4" data-oid="p80nyq.">
        {/* Binance-style loader */}
        <div className="relative" data-oid="r.xi6pp">
          <div
            className="w-16 h-16 border-4 border-gray-200 rounded-full"
            data-oid="n_uiifj"
          ></div>
          <div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"
            data-oid="k76hbao"
          ></div>
        </div>

        {/* Loading dots animation */}
        <div className="flex items-center space-x-1" data-oid="5.c2psm">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            data-oid="hr-t22i"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
            data-oid="bh0hg5m"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
            data-oid="9h3j9w_"
          ></div>
        </div>

        <p className="text-white font-medium" data-oid="t8oh6j2">
          Processing...
        </p>
      </div>
    </div>
  );
};

export default BinanceLoader;
