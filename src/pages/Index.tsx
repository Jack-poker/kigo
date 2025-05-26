
import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  CreditCard, 
  Users, 
  Plus, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart,
  Settings,
  Eye,
  EyeOff,
  Globe,
  User,
  LogOut,
  Bell,
  Search,
  X,
  Check,
  AlertCircle,
  Home,
  Activity
} from 'lucide-react';
import Header from '../components/Header';
import VirtualCard from '../components/VirtualCard';
import WalletSection from '../components/WalletSection';
import StudentsSection from '../components/StudentsSection';
import TransactionsSection from '../components/TransactionsSection';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const Index = () => {
  const [balance, setBalance] = useState(125000);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([
    {
      id: '1',
      name: 'Alice Uwimana',
      studentId: 'STU001',
      grade: 'Grade 9',
      class: '9A',
      photo: '/api/placeholder/48/48',
      dailyLimit: 5000,
      weeklyLimit: 25000,
      monthlyLimit: 100000,
      todaySpent: 2500
    },
    {
      id: '2',
      name: 'Bob Nkurunziza',
      studentId: 'STU002',
      grade: 'Grade 11',
      class: '11B',
      photo: '/api/placeholder/48/48',
      dailyLimit: 7000,
      weeklyLimit: 35000,
      monthlyLimit: 140000,
      todaySpent: 1200
    }
  ]);
  
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'payment',
      title: 'Cafeteria Purchase',
      student: 'Alice Uwimana',
      amount: -2500,
      date: '2 minutes ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'deposit',
      title: 'Mobile Money Deposit',
      student: null,
      amount: 50000,
      date: '1 hour ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Stationery Purchase',
      student: 'Bob Nkurunziza',
      amount: -1200,
      date: '3 hours ago',
      status: 'completed'
    }
  ]);

  const [activeModal, setActiveModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    const toast = {
      id: Date.now(),
      message,
      type
    };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4000);
  };

  const handleDeposit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBalance(prev => prev + Number(data.amount));
      const newTransaction = {
        id: Date.now().toString(),
        type: 'deposit',
        title: 'Mobile Money Deposit',
        student: null,
        amount: Number(data.amount),
        date: 'Just now',
        status: 'completed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setActiveModal(null);
      showToast(`Successfully deposited ${Number(data.amount)} RWF`);
    } catch (error) {
      showToast('Deposit failed. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const handleWithdraw = async (data) => {
    setIsLoading(true);
    try {
      if (Number(data.amount) > balance) {
        throw new Error('Insufficient balance');
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBalance(prev => prev - Number(data.amount));
      const newTransaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        title: 'Mobile Money Withdrawal',
        student: null,
        amount: -Number(data.amount),
        date: 'Just now',
        status: 'completed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setActiveModal(null);
      showToast(`Successfully withdrew ${Number(data.amount)} RWF`);
    } catch (error) {
      showToast(error.message || 'Withdrawal failed. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const handleLinkStudent = async (data) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newStudent = {
        id: Date.now().toString(),
        name: data.name,
        studentId: data.studentId,
        grade: data.grade,
        class: data.class,
        photo: '/api/placeholder/48/48',
        dailyLimit: 5000,
        weeklyLimit: 25000,
        monthlyLimit: 100000,
        todaySpent: 0
      };
      setStudents(prev => [...prev, newStudent]);
      setActiveModal(null);
      showToast(`Successfully linked ${data.name}`);
    } catch (error) {
      showToast('Failed to link student. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: Activity }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="space-y-6">
              <VirtualCard 
                balance={balance}
                isVisible={isBalanceVisible}
                onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                  <Plus className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveModal('deposit')}
                    className="p-4 text-center bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors duration-200"
                  >
                    <Plus className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-indigo-900">Deposit</span>
                  </button>
                  <button 
                    onClick={() => setActiveModal('linkStudent')}
                    className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200"
                  >
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-green-900">Link Student</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">This Month</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold text-lg">12,500 RWF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Deposits</span>
                    <span className="font-semibold text-lg text-green-600">+75,000 RWF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Balance</span>
                    <span className="font-semibold text-lg text-blue-600">
                      {isBalanceVisible ? `${balance.toLocaleString()} RWF` : '••••••'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-green-100' : 
                          transaction.type === 'withdraw' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {transaction.type === 'deposit' ? 
                            <TrendingUp className="w-4 h-4 text-green-600" /> :
                            transaction.type === 'withdraw' ?
                            <TrendingDown className="w-4 h-4 text-red-600" /> :
                            <ShoppingCart className="w-4 h-4 text-blue-600" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.title}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()} RWF
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <VirtualCard 
              balance={balance}
              isVisible={isBalanceVisible}
              onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
            />
            <WalletSection 
              balance={balance}
              isVisible={isBalanceVisible}
              onDeposit={() => setActiveModal('deposit')}
              onWithdraw={() => setActiveModal('withdraw')}
              onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
            />
          </div>
        );
      case 'students':
        return (
          <div className="h-full">
            <StudentsSection 
              students={students}
              onViewTransactions={(student) => setActiveModal('studentTransactions')}
              onSetLimits={(student) => setActiveModal('spendingLimits')}
            />
          </div>
        );
      case 'transactions':
        return (
          <div className="h-full">
            <TransactionsSection 
              transactions={transactions}
              onViewAll={() => setActiveModal('allTransactions')}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
      <Header onMenuClick={() => {}} />
      
      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, Parent!</h1>
          <p className="text-gray-600">Manage your children's school finances with ease</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 flex items-center justify-center space-x-2 py-4 px-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 container mx-auto px-4 pb-6">
        <div className="h-full">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'deposit' && (
        <Modal
          title="Deposit Funds"
          onClose={() => setActiveModal(null)}
          onSubmit={handleDeposit}
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="078XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (RWF)
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'withdraw' && (
        <Modal
          title="Withdraw Funds"
          onClose={() => setActiveModal(null)}
          onSubmit={handleWithdraw}
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="078XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (RWF)
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1000"
                max={balance}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'linkStudent' && (
        <Modal
          title="Link New Student"
          onClose={() => setActiveModal(null)}
          onSubmit={handleLinkStudent}
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                name="studentId"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="STU003"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Full Name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Grade 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <input
                  type="text"
                  name="class"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="10A"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN for Student Purchases
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
