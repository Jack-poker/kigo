
import React from 'react';
import { Eye, EyeOff, CreditCard } from 'lucide-react';

const VirtualCard = ({ balance, isVisible, onToggleVisibility }) => {
  const formatBalance = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="relative group perspective-1000">
      {/* Card Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
      
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-emerald-500 via-green-400 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl transform group-hover:scale-105 transition-all duration-500 overflow-hidden">
        {/* Knitted Texture Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, white 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, white 2px, transparent 2px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 0, 0 0, 0 0'
        }}></div>
        
        {/* Stitching Pattern */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/30" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 8px, white 8px, white 12px)',
        }}></div>
        <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-white/30" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 8px, white 8px, white 12px)',
        }}></div>
        <div className="absolute top-4 bottom-4 left-4 w-0.5 bg-white/30" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 8px, white 8px, white 12px)',
        }}></div>
        <div className="absolute top-4 bottom-4 right-4 w-0.5 bg-white/30" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 8px, white 8px, white 12px)',
        }}></div>

        {/* Card Header */}
        <div className="relative z-10 flex justify-between items-start mb-8">
          <div className="space-y-2">
            <p className="text-white/90 text-sm font-bold tracking-wide uppercase">ikaramu Wallet</p>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold drop-shadow-lg">
                {isVisible ? formatBalance(balance) : '••••••'}
              </span>
              <button
                onClick={onToggleVisibility}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
              >
                {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Brand Logo Area */}
          <div className="w-16 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <div className="w-8 h-8 bg-gradient-to-br from-white/80 to-white/60 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-700" />
            </div>
          </div>
        </div>

        {/* Card Number */}
        <div className="relative z-10 mb-8">
          <p className="text-2xl font-mono tracking-[0.2em] drop-shadow-lg font-bold">
            •••• •••• •••• 1234
          </p>
        </div>

        {/* Card Footer */}
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <p className="text-white/80 text-xs uppercase tracking-wider mb-1 font-semibold">Card Holder</p>
            <p className="font-bold text-lg drop-shadow-md">PARENT USER</p>
          </div>
          
          <div className="text-right">
            <p className="text-white/80 text-xs uppercase tracking-wider mb-1 font-semibold">Secure</p>
            <p className="font-bold text-lg drop-shadow-md">WALLET</p>
          </div>
        </div>

        {/* Decorative Knitted Elements */}
        <div className="absolute top-8 right-8 w-24 h-24 rounded-full opacity-10" style={{
          background: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '8px 8px'
        }}></div>
        <div className="absolute bottom-8 left-8 w-20 h-20 rounded-full opacity-10" style={{
          background: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '6px 6px'
        }}></div>
        
        {/* Yarn Thread Effect */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform rotate-12"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform -rotate-12"></div>
      </div>
    </div>
  );
};

export default VirtualCard;