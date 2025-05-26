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
import AdBanner from '../components/AdBanner';
import StudentQRModal from '../components/StudentQRModal';
import { useLanguage } from '../contexts/LanguageContext';

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
  const [selectedStudent, setSelectedStudent] = useState(null);
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
      showToast(`${t('messages.depositSuccess')} ${Number(data.amount)} RWF`);
    } catch (error) {
      showToast(t('messages.error'), 'error');
    }
    setIsLoading(false);
  };

  const handleWithdraw = async (data) => {
    setIsLoading(true);
    try {
      if (Number(data.amount) > balance) {
        throw new Error(t('messages.insufficientBalance'));
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
      showToast(`${t('messages.withdrawSuccess')} ${Number(data.amount)} RWF`);
    } catch (error) {
      showToast(error.message || t('messages.error'), 'error');
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
      showToast(`${t('messages.linkSuccess')} ${data.name}`);
    } catch (error) {
      showToast(t('messages.error'), 'error');
    }
    setIsLoading(false);
  };

  const handleShowQR = (student) => {
    setSelectedStudent(student);
    setActiveModal('studentQR');
  };

  const tabs = [
    { id: 'overview', label: t('navigation.overview'), icon: Home },
    { id: 'wallet', label: t('navigation.wallet'), icon: Wallet },
    { id: 'students', label: t('navigation.students'), icon: Users },
    { id: 'transactions', label: t('navigation.transactions'), icon: Activity }
  ];

  const scrollToSection = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-3 pb-20">
            <VirtualCard 
              balance={balance}
              isVisible={isBalanceVisible}
              onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
            />
            <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-xl p-3 shadow-sm border border-orange-200/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 text-sm">Ibikorwa Byihuse</h3>
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setActiveModal('deposit')}
                  className="p-3 text-center bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-lg transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">{t('actions.deposit')}</span>
                </button>
                <button 
                  onClick={() => setActiveModal('linkStudent')}
                  className="p-3 text-center bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-lg transition-all duration-300"
                >
                  <Users className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">{t('actions.linkStudent')}</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-3 shadow-sm border border-teal-200/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 text-sm">Ukwezi Gushize</h3>
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                  <span className="text-gray-700 font-medium text-xs">{t('labels.totalSpent')}</span>
                  <span className="font-bold text-sm text-red-600">12,500 RWF</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                  <span className="text-gray-700 font-medium text-xs">{t('labels.deposits')}</span>
                  <span className="font-bold text-sm text-green-600">+75,000 RWF</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-xl p-3 shadow-sm border border-purple-200/30">
              <h3 className="font-medium text-gray-900 mb-3 text-sm">Ibikorwa bya Vuba</h3>
              <div className="space-y-2">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-green-500' : 
                        transaction.type === 'withdraw' ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        {transaction.type === 'deposit' ? 
                          <TrendingUp className="w-3 h-3 text-white" /> :
                          transaction.type === 'withdraw' ?
                          <TrendingDown className="w-3 h-3 text-white" /> :
                          <ShoppingCart className="w-3 h-3 text-white" />
                        }
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{transaction.title}</p>
                        <p className="text-xs text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()} RWF
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="space-y-3 pb-20">
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
          <div className="pb-20">
            <StudentsSection 
              students={students}
              onViewTransactions={(student) => setActiveModal('studentTransactions')}
              onSetLimits={(student) => setActiveModal('spendingLimits')}
              onShowQR={handleShowQR}
            />
          </div>
        );
      case 'transactions':
        return (
          <div className="pb-20">
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
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-yellow-50 via-green-50 to-blue-100 flex flex-col">
      <Header onMenuClick={() => {}} />
      
      {/* Welcome Section */}
      <div className="px-4 py-3">
        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-1">
            {t('app.welcome')}
          </h1>
          <p className="text-gray-700 text-sm">{t('app.subtitle')}</p>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="px-4">
        <AdBanner />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-pb z-40">
        <div className="flex justify-around items-center py-2 px-4">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium leading-none">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student QR Modal */}
      {activeModal === 'studentQR' && selectedStudent && (
        <StudentQRModal
          student={selectedStudent}
          onClose={() => {
            setActiveModal(null);
            setSelectedStudent(null);
          }}
        />
      )}

      {/* Enhanced Modals with translations */}
      {activeModal === 'deposit' && (
        <Modal
          title={t('actions.deposit')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleDeposit}
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('labels.phoneNumber')}
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
                {t('labels.amount')}
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
                {t('labels.pin')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'withdraw' && (
        <Modal
          title={t('actions.withdraw')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleWithdraw}
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('labels.phoneNumber')}
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
                {t('labels.amount')}
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
                {t('labels.pin')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'linkStudent' && (
        <Modal
          title={t('actions.linkStudent')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleLinkStudent}
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('labels.studentId')}
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
                {t('labels.studentName')}
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
                  {t('labels.grade')}
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
                  {t('labels.class')}
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
                {t('labels.pin')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Container */}
      <div className="fixed bottom-20 right-4 space-y-2 z-50">
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
