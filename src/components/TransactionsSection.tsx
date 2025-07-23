import React, { useState } from "react";
import {
  Shield,
  Clock,
  MapPin,
  User,
  Heart,
  CheckCircle,
  AlertTriangle,
  Search,
  ChevronRight,
  Eye,
  Utensils,
  Book,
  Bus,
  Coffee,
  ShoppingCart
} from "lucide-react";

const TransactionsSection = ({ transactions = [] }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const iconMap = {
      "food": <Utensils className="w-5 h-5 text-white" />,
      "books": <Book className="w-5 h-5 text-white" />,
      "transport": <Bus className="w-5 h-5 text-white" />,
      "snacks": <Coffee className="w-5 h-5 text-white" />,
      "default": <ShoppingCart className="w-5 h-5 text-white" />
    };
    return iconMap[category?.toLowerCase()] || iconMap.default;
  };

  // Calculate today's spending
  const todaySpending = transactions
    .filter(t => new Date(t.date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(transaction =>
    transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.student?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get spending status for parent peace of mind
  const getSpendingStatus = (amount) => {
    if (amount > 5000) return { type: "attention", message: "Higher than usual", color: "text-amber-600" };
    return { type: "normal", message: "Normal range", color: "text-green-600" };
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-md mx-auto">
      {/* Header - Parent-focused summary */}
      <div className="bg-zinc-900 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-yellow-400 rounded-2xl">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Your Child's Activity</h2>
            <p className="text-gray-300 text-sm">Safe spending monitoring</p>
          </div>
        </div>

        {/* Today's Summary - Clean and simple */}
        {/* <div className="bg-white rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Spending</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(todaySpending)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">All Safe</span>
            </div>
          </div>
        </div> */}

        {/* Simple search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Transaction List - Simplified and parent-friendly */}
      <div className="p-6 bg-zinc-900">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
            <p className="text-gray-400 text-sm">Your child's transactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.slice(0, 5).map((transaction) => {
              const spendingStatus = getSpendingStatus(Math.abs(transaction.amount));
              
              return (
                <div
                  key={transaction.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {/* Safety badge - most prominent */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xs text-brand font-medium text-center mt-1">SAFE</p>
                    </div>

                    {/* Transaction details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {formatCurrency(transaction.amount)}
                        </h3>
                        <span className={`text-xs font-medium ${spendingStatus.color}`}>
                          {spendingStatus.message}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{transaction.student || "Your Child"}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{transaction.location || "School Area"}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(transaction.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </span>
                        </div>
                        
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="flex items-center space-x-1 text-zinc-900 hover:text-yellow-600 text-xs font-medium"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Category and title */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-zinc-900 rounded">
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{transaction.title}</span>
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more button */}
        {filteredTransactions.length > 5 && (
          <div className="text-center mt-6">
            {/* <button className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-xl font-medium transition-colors mx-auto">
              <span>View All Transactions</span>
              <ChevronRight className="w-4 h-4" />
            </button> */}
          </div>
        )}
      </div><div></div>

      {/* Simple Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-zinc-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-xl">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Transaction Details</h3>
                    <p className="text-gray-300 text-sm">Safe & Verified</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Amount */}
              <div className="text-center bg-gray-50 rounded-2xl p-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(selectedTransaction.amount)}
                </div>
                <p className="text-gray-600 text-sm">{selectedTransaction.title}</p>
              </div>

              {/* Key Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Student</span>
                  <span className="font-medium">{selectedTransaction.student || "Your Child"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{selectedTransaction.location || "School Area"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{new Date(selectedTransaction.date).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Safety Status</span>
                  <span className="flex items-center space-x-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Safe</span>
                  </span>
                </div>
              </div>

              {/* Parent Peace of Mind */}
              <div className="bg-green-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-green-600" />
                  Parent Summary
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Transaction completed safely</li>
                  <li>• Location verified as trusted</li>
                  <li>• Amount within normal range</li>
                  <li>• Secure payment method used</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-full bg-zinc-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsSection;





