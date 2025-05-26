
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
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl transform group-hover:scale-105 transition-all duration-300">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1">
            <p className="text-white/80 text-sm font-medium">Virtual Card</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {isVisible ? formatBalance(balance) : '••••••'}
              </span>
              <button
                onClick={onToggleVisibility}
                className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white/80" />
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-8">
          <p className="text-2xl font-mono tracking-wider">
            •••• •••• •••• 1234
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Card Holder</p>
            <p className="font-semibold">PARENT USER</p>
          </div>
          
          <div className="text-right">
            <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Expires</p>
            <p className="font-semibold">12/28</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
      </div>
    </div>
  );
};

export default VirtualCard;
