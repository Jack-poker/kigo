import React from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const TransactionsSection = ({ transactions, onViewAll }) => {
  const { t } = useLanguage();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return (
          <TrendingUp className="w-5 h-5 text-green-600" data-oid="j:9etp9" />
        );

      case "withdraw":
        return (
          <TrendingDown className="w-5 h-5 text-red-600" data-oid="2d-8i86" />
        );

      case "payment":
        return (
          <ShoppingCart className="w-5 h-5 text-blue-600" data-oid=":bpzkbz" />
        );

      default:
        return (
          <Activity className="w-5 h-5 text-gray-600" data-oid="cz041p9" />
        );
    }
  };

  const getTransactionColor = (type, amount) => {
    if (type === "deposit") return "text-green-600";
    if (type === "withdraw") return "text-red-600";
    return "text-blue-600";
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      data-oid="tcgl4jz"
    >
      <div
        className="flex items-center justify-between mb-6"
        data-oid="kezo9s:"
      >
        <div className="flex items-center space-x-3" data-oid="cd3-2.5">
          <div className="p-3 bg-blue-100 rounded-xl" data-oid="5t9ewz8">
            <Activity className="w-6 h-6 text-blue-600" data-oid="xse7brs" />
          </div>
          <div data-oid="264hg1a">
            <h3
              className="font-semibold text-gray-900 dark:text-white"
              data-oid="y62usdj"
            >
              {t("recentTransactions")}
            </h3>
            <p
              className="text-sm text-gray-500 dark:text-gray-400"
              data-oid="tgx9gwy"
            >
              {t("last7Days")}
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          data-oid="c5w8n7k"
        >
          <span data-oid="pyersna">{t("viewAll")}</span>
          <ExternalLink className="w-4 h-4" data-oid="3fob99l" />
        </button>
      </div>

      <div className="space-y-4" data-oid="4lfdc:n">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
            data-oid="o23hukz"
          >
            <div
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              data-oid="wdogtlr"
            >
              {getTransactionIcon(transaction.type)}
            </div>

            <div className="flex-1 min-w-0" data-oid="a732jfa">
              <div
                className="flex items-center justify-between mb-1"
                data-oid="ngt2ixr"
              >
                <h4
                  className="font-medium text-gray-900 dark:text-white truncate"
                  data-oid="0_s8wyp"
                >
                  {transaction.title}
                </h4>
                <span
                  className={`font-semibold ${getTransactionColor(transaction.type, transaction.amount)}`}
                  data-oid="dfr0m2v"
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>

              <div
                className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
                data-oid="r58upa."
              >
                <span data-oid="tmj6:r4">
                  {transaction.student || t("wallet")}
                </span>
                <span data-oid="eer:q-:">{transaction.date}</span>
              </div>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-center py-8" data-oid="t9p05ym">
            {/* <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" /> */}

            {/* <p className="text-gray-500 dark:text-gray-400">{t('noTransactions')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-400">{t('transactionHistory')}</p> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsSection;
