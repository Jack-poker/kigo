import React from "react";
import { Wallet, Plus, Minus, Eye, EyeOff, RefreshCw } from "lucide-react";
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
    <div
      className="bg-brand-10 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-200/10 relative overflow-hidden"
      data-oid="436kyys"
    >
      <div
        className="absolute inset-0 opacity-20 bg-[#FFFFFF]"
        style={{
          backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.23) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.38) 1px, transparent 1px)
        `,
          backgroundSize: "24px 24px",
        }}
        data-oid="clgg8v9"
      ></div>
      <div className="relative z-10" data-oid="eqw0dx9">
        <div
          className="flex items-center justify-between mb-8"
          data-oid="ljfv35b"
        >
          <div className="flex items-center space-x-4" data-oid="kz2ax7.">
            <div
              className="p-4 bg-brand rounded-2xl shadow-lg"
              data-oid="p5x1_1g"
            >
              <Wallet className="w-8 h-8 text-white" data-oid="d:y2pwn" />
            </div>
            <div data-oid="joiw5t9">
              <h3
                className="font-bold text-white dark:text-white text-xl"
                data-oid="zjmdtv."
              >
                {t("walletBalance")}
              </h3>
              <p
                className="text-zinc-900 dark:text-gray-400 font-medium"
                data-oid="6ncql9u"
              >
                {t("availableFunds")}
              </p>
            </div>
          </div>
        </div>
        <div
          className="mb-8 p-6 dark:bg-gray-800 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 bg-[#E4E9F0]"
          data-oid="3a7iijb"
        >
          <div className="flex items-center space-x-4" data-oid="-.-7fkz">
            <span
              className="text-4xl font-bold text-brand dark:text-white"
              data-oid="5j0vih2"
            >
              {isVisible ? formatBalance(balance) : "••••••"}
            </span>
            <button
              onClick={onToggleVisibility}
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-600"
              data-oid="ihc-xht"
            >
              {isVisible ? (
                <EyeOff className="w-6 h-6 text-brand" data-oid="yawld0g" />
              ) : (
                <Eye className="w-6 h-6 text-brand" data-oid="mhhsjf1" />
              )}
            </button>
          </div>
          {<PaymentStatusListener data-oid="74dufu9" />}
          <p
            className="text-sm text-zinc-900 mt-2 font-semibold"
            data-oid="f0lr2f6"
          >
            {t("percentChange")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4" data-oid="pbpf-ll">
          <button
            onClick={onDeposit}
            className="group flex items-center justify-center space-x-3 bg-brand text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
            data-oid="gbkl-u6"
          >
            <div
              className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              data-oid="5r8a4mj"
            ></div>
            <Plus className="w-6 h-6 relative z-10" data-oid="44467no" />
            <span
              className="font-bold text-lg relative z-10"
              data-oid="rszz8tl"
            >
              {t("deposit")}
            </span>
          </button>
          <button
            onClick={onWithdraw}
            className="group flex items-center justify-center space-x-3 bg-gradient-to-br from-orange-500 to-red-600 text-white py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
            data-oid="oqf9130"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#1919191A]"
              data-oid="bdfq1i0"
            ></div>
            <Minus className="w-6 h-6 relative z-10" data-oid="g:w04gl" />
            <span
              className="font-bold text-lg relative z-10"
              data-oid="4:.fv4o"
            >
              {t("withdraw")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
