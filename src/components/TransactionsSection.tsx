import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Shield,
  Eye,
  Calendar,
  User,
  Building,
  ChevronRight,
  Star,
  Heart,
  Coffee,
  Book,
  Gamepad2,
  Utensils,
  Bus,
  Gift,
  MoreHorizontal,
  Filter,
  Search,
  Download,
  Bell,
  Info
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const TransactionsSection = ({ transactions, onViewAll }) => {
  const { t } = useLanguage();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      "food": <Utensils className="w-5 h-5" />,
      "books": <Book className="w-5 h-5" />,
      "transport": <Bus className="w-5 h-5" />,
      "entertainment": <Gamepad2 className="w-5 h-5" />,
      "snacks": <Coffee className="w-5 h-5" />,
      "gifts": <Gift className="w-5 h-5" />,
      "default": <ShoppingCart className="w-5 h-5 text-yellow-400 " />
    };
    return iconMap[category?.toLowerCase()] || iconMap.default;
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      "food": "from-orange-400 to-red-500",
      "books": "from-blue-400 to-indigo-500",
      "transport": "from-brand to-emerald-500",
      "entertainment": "from-purple-400 to-pink-500",
      "snacks": "from-amber-400 to-orange-500",
      "gifts": "from-rose-400 to-pink-500",
      "default": "from-orange-400 to-red-500"
    };
    return colorMap[category?.toLowerCase()] || colorMap.default;
  };

  const getSpendingInsight = (amount, category) => {
    if (amount > 5000) return { type: "high", message: "Higher than usual spending" };
    if (amount > 2000) return { type: "medium", message: "Moderate spending" };
    return { type: "low", message: "Normal spending range" };
  };

  const getTimeOfDay = (date) => {
    const hour = new Date(date).getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filterType === "all" || transaction.type === filterType;
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.student?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const todaySpending = transactions
    .filter(t => new Date(t.date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const weeklySpending = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return transactionDate >= weekAgo;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl  dark:border-gray-700 overflow-hidden">
      {/* Beautiful Header with Insights */}
      <div className="bg-zinc-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 p-6  dark:border-gray-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white dark:text-white">
                Your Child's Activity
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Stay connected with their spending habits
              </p>
            </div>
          </div>
          <button
            onClick={onViewAll}
            className="flex items-center space-x-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 font-medium shadow-sm"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Insights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-5 h-5 text-yellow-400 dark:text-brand" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Today's Spending</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(todaySpending)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 dark:bg-blue-900/30 rounded-xl">
                <Calendar className="w-5 h-5 text-white dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(weeklySpending)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand dark:bg-purple-900/30 rounded-xl">
                <Shield className="w-5 h-5 text-white dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Security</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-brand">
                  All Safe
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-900" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
          >
            <option value="all">All Transactions</option>
            <option value="payment">Purchases</option>
            <option value="deposit">Money Added</option>
            <option value="withdraw">Money Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-6 bg-zinc-900">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 ">
            <div className="w-24 h-24 bg-zinc-900 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Transactions Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Your child's spending activity will appear here. You'll be able to track their purchases and ensure their safety.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredTransactions.slice(0, 5).map((transaction, index) => {
              const insight = getSpendingInsight(Math.abs(transaction.amount), transaction.category);
              const timeOfDay = getTimeOfDay(transaction.date);
              
              return (
                <div
                  key={transaction.id}
                  className="group bg-white dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-zinc-500 dark:border-gray-600 
                  hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      {/* Left Side - Icon and Details */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`p-3 bg-zinc-900 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {getCategoryIcon(transaction.category)}
                          <div className="text-white">
                            {/* Icon is rendered above */}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {transaction.title}
                            </h3>
                            {transaction.status === "completed" && (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{transaction.student || "Main Account"}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{timeOfDay}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>School Area</span>
                            </span>
                          </div>
                          
                          {/* Spending Insight */}
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              insight.type === "high" 
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                : insight.type === "medium"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }`}>
                              {insight.type === "high" && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {insight.type === "medium" && <Info className="w-3 h-3 mr-1" />}
                              {insight.type === "low" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {insight.message}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Amount and Action */}
                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold mb-1 ${
                          transaction.amount > 0 
                            ? "text-zinc-900 dark:text-brand" 
                            : "text-gray-900 dark:text-white"
                        }`}>
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Location and Security */}
                  <div className="bg-zinc-900 dark:bg-gray-600/50 px-5 py-3 border-t border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-white dark:text-gray-300">
                          {transaction.location || "School Store"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified Safe
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white dark:text-gray-400">Trusted</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View More Button */}
        {filteredTransactions.length > 5 && (
          <div className="text-center mt-6">
            <button
              onClick={onViewAll}
              className="inline-flex items-center space-x-2 bg-brand hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>View All {transactions.length} Transactions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className={`bg-gradient-to-br ${getCategoryColor(selectedTransaction.category)} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    {getCategoryIcon(selectedTransaction.category)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Transaction Details</h3>
                    <p className="text-white/80 text-sm">Complete information for parents</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Amount Display */}
              <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <div className={`text-4xl font-bold mb-2 ${
                  selectedTransaction.amount > 0 ? "text-zinc-900" : "text-gray-900 dark:text-white"
                }`}>
                  {selectedTransaction.amount > 0 ? "+" : ""}
                  {formatCurrency(selectedTransaction.amount)}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedTransaction.title}
                </p>
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Student</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedTransaction.student || "Main Account"}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-zinc-900 dark:text-brand" />
                    <span className="font-medium text-gray-900 dark:text-white">Date & Time</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(selectedTransaction.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getTimeOfDay(selectedTransaction.date)}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Location</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedTransaction.location || "School Store"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Safe & Verified
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Security</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Secure Payment
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PIN + Biometric
                  </p>
                </div>
              </div>

              {/* Parent Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Parent Insights
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    • This purchase was made during school hours
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    • Location is verified as safe and trusted
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    • Amount is within normal spending range
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    • Payment method was secure and authenticated
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsSection;
