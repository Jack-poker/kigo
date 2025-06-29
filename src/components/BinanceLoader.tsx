import React from "react";

const BinanceLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-brand/80 backdrop-blur-sm flex items-center justify-center z-[100]"
      data-oid="9y0_d6q"
    >
      <div className="flex flex-col items-center space-y-4" data-oid="-.txfu0">
        {/* Binance-style loader */}
        <div className="relative" data-oid="fp_p94u">
          <div
            className="w-16 h-16 border-4 border-gray-200 rounded-full"
            data-oid="_mpnzc3"
          ></div>
          <div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"
            data-oid="vpvnazw"
          ></div>
        </div>

        {/* Loading dots animation */}
        <div className="flex items-center space-x-1" data-oid="s59dggq">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            data-oid="vfr.9ol"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
            data-oid="ursdevi"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
            data-oid="nj4xmth"
          ></div>
        </div>

        <p className="text-gray-600 font-medium" data-oid="8v5j2p1">
          Processing...
        </p>
      </div>
    </div>
  );
};

export default BinanceLoader;
