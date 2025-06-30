import React from "react";

const BinanceLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100] bg-[#EAB600]"
      data-oid="xsl_zvk"
    >
      <div className="flex flex-col items-center space-y-4" data-oid="sw7f-jx">
        {/* Binance-style loader */}
        <div className="relative" data-oid="sk7oot4">
          <div
            className="w-16 h-16 border-4 border-gray-200 rounded-full"
            data-oid="i2yu6nf"
          ></div>
          <div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"
            data-oid="5ee4ajq"
          ></div>
        </div>

        {/* Loading dots animation */}
        <div className="flex items-center space-x-1" data-oid="j8m.4cg">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            data-oid="55w4nph"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
            data-oid="gcasu-1"
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
            data-oid="7ys1iqu"
          ></div>
        </div>

        <p className="text-gray-600 font-medium" data-oid="jv8byjr">
          Processing...
        </p>
      </div>
    </div>
  );
};

export default BinanceLoader;
