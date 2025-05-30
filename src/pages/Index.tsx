import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, 
  Users, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart,
  Eye,
  Home,
  Activity,
  BarChart3,
  PieChart,
  Settings,
  Menu
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import VirtualCard from '../components/VirtualCard';
import WalletSection from '../components/WalletSection';
import StudentsSection from '../components/StudentsSection';
import TransactionsSection from '../components/TransactionsSection';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import AdBanner from '../components/AdBanner';
import SpendingLimitsModal from '../components/SpendingLimitsModal';

const Index = () => {
  const { t } = useLanguage();
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
      todaySpent: 2500,
      allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      allowedHours: { from: '07:00', to: '18:00' }
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
      todaySpent: 1200,
      allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      allowedHours: { from: '07:00', to: '18:00' }
    }
  ]);
  
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'payment',
      title: t('cafeteriaPurchase'),
      student: 'Alice Uwimana',
      amount: -2500,
      date: '2 minutes ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'deposit',
      title: t('mobileMoneyDeposit'),
      student: null,
      amount: 50000,
      date: '1 hour ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'payment',
      title: t('stationeryPurchase'),
      student: 'Bob Nkurunziza',
      amount: -1200,
      date: '3 hours ago',
      status: 'completed'
    }
  ]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for smooth scrolling
  const overviewRef = useRef(null);
  const walletRef = useRef(null);
  const studentsRef = useRef(null);
  const transactionsRef = useRef(null);

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

  // Smooth scroll function
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle tab change with smooth scrolling
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Small delay to ensure content is rendered before scrolling
    setTimeout(() => {
      switch (tabId) {
        case 'overview':
          scrollToSection(overviewRef);
          break;
        case 'wallet':
          scrollToSection(walletRef);
          break;
        case 'students':
          scrollToSection(studentsRef);
          break;
        case 'transactions':
          scrollToSection(transactionsRef);
          break;
      }
    }, 100);
  };

  const handleDeposit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBalance(prev => prev + Number(data.amount));
      const newTransaction = {
        id: Date.now().toString(),
        type: 'deposit',
        title: t('mobileMoneyDeposit'),
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
        todaySpent: 0,
        allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        allowedHours: { from: '07:00', to: '18:00' }
      };
      setStudents(prev => [...prev, newStudent]);
      setActiveModal(null);
      showToast(`Successfully linked ${data.name}`);
    } catch (error) {
      showToast('Failed to link student. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const handleSetLimits = (student) => {
    setSelectedStudent(student);
    setActiveModal('spendingLimits');
  };

  const handleSaveLimits = async (limits) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStudents(prev => prev.map(student => 
        student.id === selectedStudent.id 
          ? { ...student, ...limits }
          : student
      ));
      setActiveModal(null);
      setSelectedStudent(null);
      showToast(`Spending limits updated for ${selectedStudent.name}`);
    } catch (error) {
      showToast('Failed to update limits. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const tabs = [
    { id: 'overview', label: t('overview'), icon: BarChart3 },
    { id: 'wallet', label: t('wallet'), icon: Wallet },
    { id: 'students', label: t('students'), icon: Users },
    { id: 'transactions', label: t('transactions'), icon: Activity }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div ref={overviewRef} className="space-y-6">
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Balance</p>
                    <p className="text-white text-2xl font-bold">
                      {isBalanceVisible ? `${balance.toLocaleString()} RWF` : '••••••'}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Wallet className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-green-500 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+2.5% from last month</span>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Students</p>
                    <p className="text-white text-2xl font-bold">{students.length}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-blue-500 text-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Ready to link more</span>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">This Month Spent</p>
                    <p className="text-white text-2xl font-bold">12,500 RWF</p>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-orange-500 text-sm">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span>-15% vs last month</span>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Today's Activity</p>
                    <p className="text-white text-2xl font-bold">3</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-purple-500 text-sm">
                  <PieChart className="w-4 h-4 mr-1" />
                  <span>Transactions today</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Virtual Card */}
              <div className="lg:col-span-1">
                <VirtualCard 
                  balance={balance}
                  isVisible={isBalanceVisible}
                  onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
                />
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-full">
                  <h3 className="text-white font-semibold text-lg mb-6">{t('quickActions')}</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setActiveModal('deposit')}
                      className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">{t('deposit')}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveModal('withdraw')}
                      className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg transition-colors"
                    >
                      <TrendingDown className="w-5 h-5" />
                      <span className="font-medium">{t('withdraw')}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveModal('linkStudent')}
                      className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg transition-colors"
                    >
                      <Users className="w-5 h-5" />
                      <span className="font-medium">{t('linkStudent')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-full">
                  <h3 className="text-white font-semibold text-lg mb-6">{t('recentActivity')}</h3>
                  <div className="space-y-4">
                    {transactions.slice(0, 4).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === 'deposit' ? 'bg-green-500/10' : 
                            transaction.type === 'withdraw' ? 'bg-red-500/10' : 'bg-blue-500/10'
                          }`}>
                            {transaction.type === 'deposit' ? 
                              <TrendingUp className={`w-5 h-5 ${transaction.type === 'deposit' ? 'text-green-500' : 'text-blue-500'}`} /> :
                              transaction.type === 'withdraw' ?
                              <TrendingDown className="w-5 h-5 text-red-500" /> :
                              <ShoppingCart className="w-5 h-5 text-blue-500" />
                            }
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{transaction.title}</p>
                            <p className="text-gray-400 text-xs">{transaction.date}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()} RWF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div ref={walletRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div ref={studentsRef}>
            <StudentsSection 
              students={students}
              onViewTransactions={(student) => setActiveModal('studentTransactions')}
              onSetLimits={handleSetLimits}
            />
          </div>
        );
      case 'transactions':
        return (
          <div ref={transactionsRef}>
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
    <div className="min-h-screen bg-black flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-white font-bold text-xl">iKaramu</h1>
            <div className="hidden md:flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-yellow-500 text-black'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isBalanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'text-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'deposit' && (
        <Modal
          title={t('depositFunds')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleDeposit}
          isLoading={isLoading}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('phoneNumber')}
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                placeholder="078XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('amount')}
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1000"
                className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                placeholder="10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('pin')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                placeholder="****"
              />
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'withdraw' && (
        <Modal
          title={t('withdrawFunds')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleWithdraw}
          isLoading={isLoading}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('phoneNumber')}
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                placeholder="078XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('amount')}
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1000"
                max={balance}
                className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                placeholder="10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('pin')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                placeholder="****"
              />
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'linkStudent' && (
        <Modal
          title={t('linkNewStudent')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleLinkStudent}
          isLoading={isLoading}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('studentId')}
              </label>
              <input
                type="text"
                name="studentId"
                required
                className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                placeholder="STU003"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('studentName')}
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                placeholder="Full Name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {t('grade')}
                </label>
                <input
                  type="text"
                  name="grade"
                  required
                  className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                  placeholder="Grade 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {t('class')}
                </label>
                <input
                  type="text"
                  name="class"
                  required
                  className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                  placeholder="10A"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('pinForPurchases')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl"
                placeholder="****"
              />
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'spendingLimits' && selectedStudent && (
        <SpendingLimitsModal
          student={selectedStudent}
          onClose={() => {
            setActiveModal(null);
            setSelectedStudent(null);
          }}
          onSave={handleSaveLimits}
          isLoading={isLoading}
        />
      )}

      {/* Toast Container */}
      <div className="fixed bottom-20 md:bottom-4 right-4 space-y-2 z-50">
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
