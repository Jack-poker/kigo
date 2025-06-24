import React from 'react';
import { Wallet, Plus, Minus, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PaymentStatusListener from './payment/track_payment';

const WalletSection = ({ balance, isVisible, onDeposit, onWithdraw, onToggleVisibility }) => {
  const { t } = useLanguage();

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-brand-10 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-200/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.23) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.38) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px'
      }}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-brand rounded-2xl shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white dark:text-white text-xl">{t('walletBalance')}</h3>
              <p className="text-zinc-900 dark:text-gray-400 font-medium">{t('availableFunds')}</p>
            </div>
          </div>
        </div>
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-brand dark:text-white">
              {isVisible ? formatBalance(balance) : '••••••'}
            </span>
            <button
              onClick={onToggleVisibility}
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-600"
            >
              {isVisible ? (
                <EyeOff className="w-6 h-6 text-brand" />
              ) : (
                <Eye className="w-6 h-6 text-brand" />
              )}
            </button>
          </div>
                 {<PaymentStatusListener />}
          <p className="text-sm text-zinc-900 mt-2 font-semibold">
      
            {t('percentChange')}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onDeposit}
            className="group flex items-center justify-center space-x-3 bg-brand text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="w-6 h-6 relative z-10" />
            <span className="font-bold text-lg relative z-10">{t('deposit')}</span>
          </button>
          <button
            onClick={onWithdraw}
            className="group flex items-center justify-center space-x-3 bg-gradient-to-br from-orange-500 to-red-600 text-white py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Minus className="w-6 h-6 relative z-10" />
            <span className="font-bold text-lg relative z-10">{t('withdraw')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;