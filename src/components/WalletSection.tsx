
import React from 'react';
import { Wallet, Plus, Minus, Eye, EyeOff, RefreshCw } from 'lucide-react';

const WalletSection = ({ balance, isVisible, onDeposit, onWithdraw, onToggleVisibility }) => {
  const formatBalance = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-blue-200/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, #06b6d4 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px'
      }}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl">Wallet Balance</h3>
              <p className="text-gray-600 font-medium">Available funds</p>
            </div>
          </div>
          
          <button className="p-3 text-gray-400 hover:text-blue-600 transition-colors duration-200 hover:bg-white/50 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-8 p-6 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/40">
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-gray-900">
              {isVisible ? formatBalance(balance) : '••••••'}
            </span>
            <button
              onClick={onToggleVisibility}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
            >
              {isVisible ? (
                <EyeOff className="w-6 h-6 text-gray-400" />
              ) : (
                <Eye className="w-6 h-6 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-sm text-green-600 mt-2 font-semibold">
            +2.5% from last month
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onDeposit}
            className="group flex items-center justify-center space-x-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="w-6 h-6 relative z-10" />
            <span className="font-bold text-lg relative z-10">Deposit</span>
          </button>
          
          <button
            onClick={onWithdraw}
            className="group flex items-center justify-center space-x-3 bg-gradient-to-br from-orange-500 to-red-600 text-white py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Minus className="w-6 h-6 relative z-10" />
            <span className="font-bold text-lg relative z-10">Withdraw</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
