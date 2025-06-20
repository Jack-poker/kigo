import React from 'react';
import { Activity, TrendingUp, TrendingDown, ShoppingCart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const TransactionsSection = ({ transactions, onViewAll }) => {
  const { t } = useLanguage();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'withdraw':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'payment':
        return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type, amount) => {
    if (type === 'deposit') return 'text-green-600';
    if (type === 'withdraw') return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{t('recentTransactions')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('last7Days')}</p>
          </div>
        </div>
        
        <button
          onClick={onViewAll}
          className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
        >
          <span>{t('viewAll')}</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {getTransactionIcon(transaction.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">{transaction.title}</h4>
                <span className={`font-semibold ${getTransactionColor(transaction.type, transaction.amount)}`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{transaction.student || t('wallet')}</span>
                <span>{transaction.date}</span>
              </div>
            </div>
          </div>
        ))}
        
        {transactions.length === 0 && (
          <div className="text-center py-8">
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