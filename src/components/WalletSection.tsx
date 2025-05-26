
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Wallet className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Wallet Balance</h3>
            <p className="text-sm text-gray-500">Available funds</p>
          </div>
        </div>
        
        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-gray-900">
            {isVisible ? formatBalance(balance) : '••••••'}
          </span>
          <button
            onClick={onToggleVisibility}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            {isVisible ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-sm text-green-600 mt-1">
          +2.5% from last month
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onDeposit}
          className="flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Deposit</span>
        </button>
        
        <button
          onClick={onWithdraw}
          className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
        >
          <Minus className="w-4 h-4" />
          <span className="font-medium">Withdraw</span>
        </button>
      </div>
    </div>
  );
};

export default WalletSection;
