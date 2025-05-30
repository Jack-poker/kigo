import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, 
  Users, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart,
  Eye,
  EyeOff,
  Home,
  Activity,
  BarChart3,
  PieChart,
  Settings,
  Menu,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import VirtualCard from '../components/VirtualCard';
import WalletSection from '../components/WalletSection';
import StudentsSection from '../components/StudentsSection';
import TransactionsSection from '../components/TransactionsSection';
import VercelModal from '../components/VercelModal';
import VercelToast from '../components/VercelToast';
import BinanceLoader from '../components/BinanceLoader';
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

  // Toast function
  const showToast = (message, type = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
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

  const handleSettings = () => {
    setActiveModal('settings');
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
          <div ref={overviewRef} className="space-y-8">
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Balance</p>
                    <p className="text-gray-900 text-2xl font-bold mt-1">
                      {isBalanceVisible ? `${balance.toLocaleString()} RWF` : '••••••'}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+2.5% from last month</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Active Students</p>
                    <p className="text-gray-900 text-2xl font-bold mt-1">{students.length}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-blue-600 text-sm font-medium">
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Ready to link more</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">This Month Spent</p>
                    <p className="text-gray-900 text-2xl font-bold mt-1">12,500 RWF</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-orange-600 text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span>-15% vs last month</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Today's Activity</p>
                    <p className="text-gray-900 text-2xl font-bold mt-1">3</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-purple-600 text-sm font-medium">
                  <PieChart className="w-4 h-4 mr-1" />
                  <span>Transactions today</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
                  <h3 className="text-gray-900 font-semibold text-lg mb-6">{t('quickActions')}</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveModal('deposit')}
                      className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      <span>{t('deposit')}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveModal('withdraw')}
                      className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                    >
                      <TrendingDown className="w-5 h-5" />
                      <span>{t('withdraw')}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveModal('linkStudent')}
                      className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Users className="w-5 h-5" />
                      <span>{t('linkStudent')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
                  <h3 className="text-gray-900 font-semibold text-lg mb-6">{t('recentActivity')}</h3>
                  <div className="space-y-4">
                    {transactions.slice(0, 4).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            transaction.type === 'deposit' ? 'bg-green-50' : 
                            transaction.type === 'withdraw' ? 'bg-red-50' : 'bg-blue-50'
                          }`}>
                            {transaction.type === 'deposit' ? 
                              <TrendingUp className={`w-5 h-5 ${transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'}`} /> :
                              transaction.type === 'withdraw' ?
                              <TrendingDown className="w-5 h-5 text-red-600" /> :
                              <ShoppingCart className="w-5 h-5 text-blue-600" />
                            }
                          </div>
                          <div>
                            <p className="text-gray-900 text-sm font-medium">{transaction.title}</p>
                            <p className="text-gray-500 text-xs">{transaction.date}</p>
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
          </div>
        );
      case 'wallet':
        return (
          <div ref={walletRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <h1 className="text-gray-900 font-bold text-xl">iKaramu</h1>
            <div className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isBalanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleSettings}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
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
        <VercelModal
          title={t('depositFunds')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleDeposit}
          isLoading={isLoading}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phoneNumber')}
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="078XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('amount')}
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1000"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pin')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </VercelModal>
      )}

      {activeModal === 'withdraw' && (
        <VercelModal
          title={t('withdrawFunds')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleWithdraw}
          isLoading={isLoading}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phoneNumber')}
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="078XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('amount')}
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1000"
                max={balance}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pin')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </VercelModal>
      )}

      {activeModal === 'linkStudent' && (
        <VercelModal
          title={t('linkNewStudent')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleLinkStudent}
          isLoading={isLoading}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('studentId')}
              </label>
              <input
                type="text"
                name="studentId"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="STU003"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('studentName')}
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Full Name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('grade')}
                </label>
                <input
                  type="text"
                  name="grade"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Grade 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('class')}
                </label>
                <input
                  type="text"
                  name="class"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="10A"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pinForPurchases')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </VercelModal>
      )}

      {activeModal === 'settings' && (
        <VercelModal
          title="Settings"
          onClose={() => setActiveModal(null)}
          onSubmit={() => setActiveModal(null)}
          isLoading={false}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
                <p className="text-sm text-gray-500">Receive transaction alerts</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                <p className="text-sm text-gray-500">Switch to dark theme</p>
              </div>
              <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </button>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Language</h4>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>English</option>
                <option>Kinyarwanda</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </VercelModal>
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
      <div className="fixed top-20 right-4 space-y-2 z-50">
        {toasts.map(toast => (
          <VercelToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>

      {/* Global Loader */}
      {isLoading && <BinanceLoader />}
    </div>
  );
};

export default Index;
