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
  Activity
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
    { id: 'overview', label: t('overview'), icon: Home },
    { id: 'wallet', label: t('wallet'), icon: Wallet },
    { id: 'students', label: t('students'), icon: Users },
    { id: 'transactions', label: t('transactions'), icon: Activity }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div ref={overviewRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="space-y-8">
              <VirtualCard 
                balance={balance}
                isVisible={isBalanceVisible}
                onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
              />
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-xl">{t('quickActions')}</h3>
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <button 
                      onClick={() => setActiveModal('deposit')}
                      className="group p-8 text-center bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-400 hover:to-teal-500 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/20 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Plus className="w-10 h-10 mx-auto mb-4 relative z-10" />
                      <span className="text-sm font-bold relative z-10">{t('deposit')}</span>
                    </button>
                    <button 
                      onClick={() => setActiveModal('linkStudent')}
                      className="group p-8 text-center bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/20 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Users className="w-10 h-10 mx-auto mb-4 relative z-10" />
                      <span className="text-sm font-bold relative z-10">{t('linkStudent')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-white text-xl">{t('thisMonth')}</h3>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-2xl flex items-center justify-center border border-green-400/30">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="text-gray-300 font-medium">{t('totalSpent')}</span>
                      <span className="font-bold text-2xl text-red-400">12,500 RWF</span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="text-gray-300 font-medium">{t('deposits')}</span>
                      <span className="font-bold text-2xl text-green-400">+75,000 RWF</span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="text-gray-300 font-medium">{t('currentBalance')}</span>
                      <span className="font-bold text-2xl text-blue-400">
                        {isBalanceVisible ? `${balance.toLocaleString()} RWF` : '••••••'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="font-bold text-white mb-8 text-xl">{t('recentActivity')}</h3>
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 ${
                            transaction.type === 'deposit' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 
                            transaction.type === 'withdraw' ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                          }`}>
                            {transaction.type === 'deposit' ? 
                              <TrendingUp className="w-7 h-7 text-white" /> :
                              transaction.type === 'withdraw' ?
                              <TrendingDown className="w-7 h-7 text-white" /> :
                              <ShoppingCart className="w-7 h-7 text-white" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{transaction.title}</p>
                            <p className="text-xs text-gray-400">{transaction.date}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
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
          <div ref={walletRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
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
          <div ref={studentsRef} className="h-full">
            <StudentsSection 
              students={students}
              onViewTransactions={(student) => setActiveModal('studentTransactions')}
              onSetLimits={handleSetLimits}
            />
          </div>
        );
      case 'transactions':
        return (
          <div ref={transactionsRef} className="h-full">
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
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Aceternity-style animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-cyan-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-violet-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10">
        <Header onMenuClick={() => {}} />
        
        <AdBanner />
        
        {/* Welcome Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
              {t('welcome')}
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl font-medium">{t('subtitle')}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4">
          <div className="bg-black/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 mb-8 overflow-hidden">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex-1 min-w-0 flex items-center justify-center space-x-3 py-6 px-4 text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                      activeTab === tab.id
                        ? 'text-white bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 container mx-auto px-4 pb-8">
          <div className="h-full">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-40 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-2xl transition-all duration-300 min-w-0 flex-1 ${
                    activeTab === tab.id
                      ? 'text-white bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 shadow-lg transform scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-xs font-bold truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
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
