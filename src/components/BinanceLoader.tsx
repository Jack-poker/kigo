
import React from 'react';

const BinanceLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center space-y-4">
        {/* Binance-style loader */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading dots animation */}
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        <p className="text-gray-600 font-medium">Processing...</p>
      </div>
    </div>
  );
};

export default BinanceLoader;
