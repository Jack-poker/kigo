import React from "react";

interface BinanceLoaderProps {
  message?: string;
}

const BinanceLoader: React.FC<BinanceLoaderProps> = ({ message = "Processing" }) => {
  const getDeviceLogo = (): string => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) return "/assets/ios.png";
      if (/android/.test(ua)) return "/assets/android.png";
    }
    return "/assets/web.png";
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-6">
        <img
          src={getDeviceLogo()}
          alt="Platform Logo"
          className="h-20 w-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Spinner */}
      {/* <div className="relative mb-6">
        <div className="w-20 h-20 border-4 border-gray-300 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div> */}

      {/* Loading Dots */}
      <div className="flex items-center space-x-1 mb-3">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-brand rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>

      {/* Message */}
      <p className="text-zinc-400 text-base font-medium tracking-wide text-center">
        {message}...
      </p>
    </div>
  );
};

export default BinanceLoader;
