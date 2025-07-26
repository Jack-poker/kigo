import React, { useEffect, useState } from "react";
import {
  Shield,
  Clock,
  MapPin,
  User,
  Heart,
  CheckCircle,
  Search,
  ChevronRight,
  Eye,
  ArrowUp,
  ArrowDown,
  ArrowRightLeft,
} from "lucide-react";

// Define transaction type for TypeScript
interface Transaction {
  transaction_id: string;
  amount: number;
  currency: string;
  description: string;
  student_name: string | null;
  timestamp: string;
  is_deposit: boolean;
  status: string;
  intouch_transaction_id: string;
  type:string;
}

interface TransactionsSectionProps {
  transactions?: Transaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({ transactions = [] }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Inject styles safely
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .transactions-container {
        background-color: var(--background-color, #ffffff);
        border-radius: 1.5rem;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        margin: 0 auto;
        overflow: hidden;
      }
      .transactions-header {
        background-color: var(--header-bg, #18181b);
        padding: 1.5rem;
      }
      .transactions-title {
        color: var(--text-primary, #ffffff);
        font-size: 1.25rem;
        font-weight: bold;
      }
      .transactions-subtitle {
        color: var(--text-secondary, #d4d4d8);
        font-size: 0.875rem;
      }
      .transactions-today {
        background-color: var(--card-bg, #ffffff);
        border-radius: 1rem;
        padding: 1rem;
        margin-bottom: 1rem;
      }
      .transactions-today-title {
        color: var(--text-secondary, #6b7280);
        font-size: 0.875rem;
      }
      .transactions-today-amount {
        color: var(--text-primary, #1f2937);
        font-size: 1.5rem;
        font-weight: bold;
      }
      .transactions-search {
        position: relative;
      }
      .transactions-search-input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        background-color: var(--card-bg, #ffffff);
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 0.75rem;
        color: var(--text-primary, #1f2937);
        font-size: 0.875rem;
      }
      .transactions-search-input:focus {
        outline: none;
        border-color: var(--yellow-400, #facc15);
        box-shadow: 0 0 0 2px var(--yellow-400, #facc15);
      }
      .transactions-search-icon {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary, #9ca3af);
      }
      .transactions-list {
        padding: 1.5rem;
        background-color: var(--header-bg, #18181b);
      }
      .transactions-empty {
        text-align: center;
        padding: 3rem 0;
      }
      .transactions-empty-icon {
        background-color: var(--yellow-400, #facc15);
        border-radius: 9999px;
        width: 5rem;
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
      }
      .transactions-empty-title {
        color: var(--text-primary, #ffffff);
        font-size: 1.125rem;
        font-weight: 600;
      }
      .transactions-empty-subtitle {
        color: var(--text-secondary, #d4d4d8);
        font-size: 0.875rem;
      }
      .transaction-card {
        background-color: var(--card-bg, #ffffff);
        border-radius: 1rem;
        padding: 1rem;
        border: 1px solid var(--border-color, #f3f4f6);
        transition: box-shadow 0.2s ease-in-out;
      }
      .transaction-card:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .transaction-icon {
        background-color: var(--brand-bg, #18181b);
        border-radius: 0.25rem;
        padding: 0.25rem;
      }
      .transaction-amount {
        color: var(--text-primary, #1f2937);
        font-size: 1.125rem;
        font-weight: 600;
      }
      .transaction-status {
        font-size: 0.75rem;
        font-weight: 500;
      }
      .transaction-details {
        color: var(--text-secondary, #6b7280);
        font-size: 0.75rem;
      }
      .transaction-button {
        color: var(--header-bg, #18181b);
        font-size: 0.75rem;
        font-weight: 500;
        transition: color 0.2s ease-in-out;
      }
      .transaction-button:hover {
        color: var(--yellow-400, #facc15);
      }
      .transaction-type {
        color: var(--text-secondary, #6b7280);
        font-size: 0.875rem;
        font-weight: 500;
      }
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        padding: 1rem;
      }
      .modal-content {
        background-color: var(--background-color, #ffffff);
        border-radius: 1.5rem;
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
      }
      .modal-header {
        background-color: var(--header-bg, #18181b);
        padding: 1.5rem;
        color: var(--text-primary, #ffffff);
      }
      .modal-close {
        padding: 0.5rem;
        border-radius: 0.75rem;
        transition: background-color 0.2s ease-in-out;
      }
      .modal-close:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .modal-body {
        padding: 1.5rem;
      }
      .modal-amount {
        background-color: var(--border-color, #f3f4f6);
        border-radius: 1rem;
        padding: 1rem;
        text-align: center;
      }
      .modal-amount-value {
        color: var(--text-primary, #1f2937);
        font-size: 1.875rem;
        font-weight: bold;
      }
      .modal-amount-title {
        color: var(--text-secondary, #6b7280);
        font-size: 0.875rem;
      }
      .modal-info {
        color: var(--text-secondary, #6b7280);
      }
      .modal-info-value {
        color: var(--text-primary, #1f2937);
        font-weight: 500;
      }
      .modal-summary {
        background-color: var(--green-50, #f0fdf4);
        border-radius: 1rem;
        padding: 1rem;
      }
      .modal-summary-title {
        color: var(--text-primary, #1f2937);
        font-weight: 600;
      }
      .modal-close-button {
        width: 100%;
        background-color: var(--header-bg, #18181b);
        color: var(--text-primary, #ffffff);
        padding: 0.75rem;
        border-radius: 0.75rem;
        font-weight: 500;
        transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
      }
      .modal-close-button:hover {
        background-color: var(--header-bg-hover, #27272a);
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(absAmount);
    return amount < 0 ? `-${formatted}` : formatted;
  };

  // Determine transaction type and icon
  const getTransactionType = (transaction: Transaction): { type: string; icon: JSX.Element } => {
    if (transaction.type==="deposit") {
      return { type: "deposit", icon: <ArrowUp className="w-5 h-5 text-white" /> };
    }
    if (transaction.type==="transfer") {
      return { type: "transfer", icon: <ArrowRightLeft className="w-5 h-5 text-white" /> };
    }

     if (transaction.type==="withdrawal") {
      return { type: "withdraw", icon: <ArrowDown className="w-5 h-5 text-white" /> };
    }

     if (transaction.type==="payment") {
    return { type: "payment", icon: <ArrowDown className="w-5 h-5 text-white" /> };
     }
  };

  // Calculate today's spending (negative for outflows)
  const todaySpending = transactions
    // .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => {
      const amount =  (t.status==="transfer") ? 0 : Math.abs(t.amount);
      if(t.status==="transfer"){
        return sum + amount;
      }else{
        return 0;
      }
     
    }, 0);

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(transaction =>
    (transaction.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (transaction.student_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Get spending status for parent peace of mind
  const getSpendingStatus = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount > 5000) return { type: "attention", message: "Higher than usual", color: "text-amber-600" };
    return { type: "normal", message: "Normal range", color: "text-green-600" };
  };

  return (
    <div className="transactions-container">
      {/* Header - Parent-focused summary */}
      <div className="transactions-header">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-yellow-400 rounded-2xl">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="transactions-title">Your Child's Activity</h2>
            <p className="transactions-subtitle">Safe spending monitoring</p>
          </div>
        </div>

        {/* Today's Summary */}
        {/* <div className="transactions-today">
          <div className="flex items-center justify-between">
            <div>
              <p className="transactions-today-title">Today's Spending</p>
              <p className="transactions-today-amount">{formatCurrency(-todaySpending)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">All Safe</span>
            </div>
          </div>
        </div> */}

        {/* Search */}
        <div className="transactions-search">
          <Search className="transactions-search-icon w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="transactions-search-input"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="transactions-empty">
            <div className="transactions-empty-icon">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="transactions-empty-title">No Activity Yet</h3>
            <p className="transactions-empty-subtitle">Your child's transactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.slice(0, 5).map((transaction) => {
              const { type, icon } = getTransactionType(transaction);
              const spendingStatus = getSpendingStatus(transaction.amount);

              return (
                <div
                  key={transaction.transaction_id}
                  className="transaction-card"
                >
                  <div className="flex items-center space-x-4">
                    {/* Safety badge */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xs text-brand font-medium text-center mt-1">SAFE</p>
                    </div>

                    {/* Transaction details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="transaction-amount truncate">
                          {formatCurrency(transaction.amount)}
                        </h3>
                        <span className={`transaction-status ${spendingStatus.color}`}>
                          {spendingStatus.message}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 transaction-details mb-2">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{transaction.student_name || "Your Child"}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 transaction-details">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>School Area</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="transaction-button flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transaction type and description */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="transaction-icon">
                        {icon}
                      </div>
                      <span className="transaction-type">{type}: {transaction.description}</span>
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
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
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
                  className="modal-close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="modal-body space-y-4">
              {/* Amount */}
              <div className="modal-amount">
                <div className="modal-amount-value">
                  {formatCurrency(selectedTransaction.amount)}
                </div>
                <p className="modal-amount-title">{selectedTransaction.description}</p>
              </div>

              {/* Key Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="modal-info">Transaction Type</span>
                  <span className="modal-info-value">{getTransactionType(selectedTransaction).type}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="modal-info">Student</span>
                  <span className="modal-info-value">{selectedTransaction.student_name || "Your Child"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="modal-info">Location</span>
                  <span className="modal-info-value">School Area</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="modal-info">Time</span>
                  <span className="modal-info-value">{new Date(selectedTransaction.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="modal-info">Transaction ID</span>
                  <span className="modal-info-value">{selectedTransaction.intouch_transaction_id}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="modal-info">Safety Status</span>
                  <span className="flex items-center space-x-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Safe</span>
                  </span>
                </div>
              </div>

              {/* Parent Summary */}
              <div className="modal-summary">
                <h4 className="modal-summary-title flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-green-600" />
                  Parent Summary
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Transaction completed safely</li>
                  <li>• Location verified as trusted</li>
                  <li>• Amount within {getSpendingStatus(selectedTransaction.amount).message.toLowerCase()}</li>
                  <li>• Secure payment method used</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="modal-close-button"
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