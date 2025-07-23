import React from "react";
import { Wallet, Plus, Minus, Eye, EyeOff, TrendingUp, Shield } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import PaymentStatusListener from "./payment/track_payment";

const WalletSection = ({
  balance,
  isVisible,
  onDeposit,
  onWithdraw,
  onToggleVisibility,
}) => {
  const { t } = useLanguage();

  const formatBalance = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-lg mx-auto  sm:p-6">
      {/* Main Wallet Container */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-zinc via-purple-500 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
        
        {/* Main Card */}
        <div className="relative bg-zinc-900 dark:from-slate-800 dark:via-blue-800 dark:to-indigo-800 rounded-3xl p-6 sm:p-8
         shadow-2xl border border-white/10 overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full 
            bg-[radial-gradient(circle_at_25%_25%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
            <div className="absolute top-0 left-0 w-full h-full 
            bg-[radial-gradient(circle_at_75%_75%,_rgba(255,255,255,0.15)_1px,_transparent_1px)] bg-[length:32px_32px]"></div>
          </div>

          {/* Header Section */}
          <div className="relative z-10 flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 sm:p-4 bg-brand rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-1">
                  {t("walletBalance")}
                </h3>
                <p className="text-blue-200 text-sm font-medium flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>{t("availableFunds")}</span>
                </p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs font-medium hidden sm:block">Active</span>
            </div>
          </div>

          {/* Balance Display Section */}
          <div className="relative z-10 mb-6 sm:mb-8 p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <p className="text-blue-200 text-xs uppercase tracking-wider mb-2 font-semibold">
                  Current Balance
                </p>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                    {isVisible ? formatBalance(balance) : "••••••"}
                  </span>
                  <button
                    onClick={onToggleVisibility}
                    className="p-2 sm:p-3 rounded-full hover:bg-white/10 transition-all duration-200 border border-white/20 backdrop-blur-sm group"
                  >
                    {isVisible ? (
                      <EyeOff className="w-4 h-4 sm:w-6 sm:h-6 text-blue-200 group-hover:text-white transition-colors" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-blue-200 group-hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Payment Status Listener */}
            <PaymentStatusListener />
            
            {/* Balance Change Indicator */}
            <div className="flex items-center space-x-2 mt-3">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <p className="text-sm text-green-300 font-semibold">
                {t("percentChange")}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Deposit Button */}
            <button
              onClick={onDeposit}
              className="group flex items-center justify-center space-x-3 bg-white hover:from-green-600 hover:to-emerald-700 text-zinc-900 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
              <span className="font-bold text-sm sm:text-lg relative z-10">
                {t("deposit")}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>

            {/* Withdraw Button */}
            <button
              onClick={onWithdraw}
              className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Minus className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
              <span className="font-bold text-sm sm:text-lg relative z-10">
                {t("withdraw")}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-6 right-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute bottom-6 left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-white/5 to-transparent"></div>
          
          {/* Subtle Grid Lines */}
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Today</p>
          {/* <p className="text-sm sm:text-base font-bold text-white">+2.5%</p> */}
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">This Week</p>
          {/* <p className="text-sm sm:text-base font-bold text-white">+8.1%</p> */}
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">This Month</p>
          {/* <p className="text-sm sm:text-base font-bold text-white">+15.3%</p> */}
        </div>
      </div>
    </div>
  );
};

export default WalletSection;