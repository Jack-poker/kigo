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
  Loader2,
  Moon,
  Sun,
  Globe,
  User,
  Bell,
  LogOut
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import VirtualCard from '../components/VirtualCard';
import WalletSection from '../components/WalletSection';
import StudentsSection from '../components/StudentsSection';
import TransactionsSection from '../components/TransactionsSection';
import VercelModal from '../components/VercelModal';
import VercelToast from '../components/VercelToast';
import BinanceLoader from '../components/BinanceLoader';
import ProfileModal from '../components/ProfileModal';
import AdBanner from '../components/AdBanner';
import SpendingLimitsModal from '../components/SpendingLimitsModal';

const Index = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('wallet');
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  const overviewRef = useRef(null);
  const walletRef = useRef(null);
  const studentsRef = useRef(null);
  const transactionsRef = useRef(null);

  const API_URL = 'https://wallet.kaascan.com';

  const showToast = (message, type = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setTimeout(() => {
      switch (tabId) {
        case 'overview': scrollToSection(overviewRef); break;
        case 'wallet': scrollToSection(walletRef); break;
        case 'students': scrollToSection(studentsRef); break;
        case 'transactions': scrollToSection(transactionsRef); break;
      }
    }, 100);
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-csrf-token`);
      setCsrfToken(response.data.csrf_token);
      return response.data.csrf_token;
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
      showToast(t('serverError'), 'error');
    }
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch wallet balance
      const balanceResponse = await axios.get(`${API_URL}/wallet/balance`, { headers });
      setBalance(balanceResponse.data.balance);

      // Fetch linked students
      const studentsResponse = await axios.get(`${API_URL}/students/linked`, { headers });
      setStudents(studentsResponse.data.students.map(student => ({
        id: student.student_id,
        name: student.student_name,
        studentId: student.student_id,
        grade: student.grade || 'N/A',
        class: student.class || 'N/A',
        photo: '/api/placeholder/48/48',
        dailyLimit: student.spending_limit || 0,
        weeklyLimit: (student.spending_limit || 0) * 7,
        monthlyLimit: (student.spending_limit || 0) * 30,
        todaySpent: student.spent_amount || 0,
        allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        allowedHours: { from: '07:00', to: '18:00' }
      })));

      // Fetch recent transactions
      const transactionsResponse = await axios.get(`${API_URL}/transactions/recent`, { headers });
      setTransactions(transactionsResponse.data.transactions.map(tx => ({
        id: tx.transaction_id,
        type: tx.is_deposit ? 'deposit' : 'payment',
        title: tx.description || t('unknownTransaction'),
        student: tx.student_name || null,
        amount: tx.is_deposit ? tx.amount : -tx.amount,
        date: new Date(tx.timestamp).toLocaleString(),
        status: 'completed'
      })));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        showToast(t('serverError'), 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchCsrfToken();
  }, []);

  const handleDeposit = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const csrf = csrfToken || await fetchCsrfToken();
      await axios.post(
        `${API_URL}/wallet/deposit`,
        {
          amount: Number(data.amount),
          phone_number: data.phone,
          pin: data.pin,
          csrf_token: csrf
        },
        { headers: { Authorization: `Bearer ${token}`, 'X-CSRF-Token': csrf } }
      );
      await fetchDashboardData();
      setActiveModal(null);
      showToast(`Successfully deposited ${Number(data.amount)} RWF`);
    } catch (err) {
      console.error('Deposit failed:', err);
      showToast(err.response?.data?.detail || t('depositError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const csrf = csrfToken || await fetchCsrfToken();
      await axios.post(
        `${API_URL}/wallet/withdraw`,
        {
          amount: Number(data.amount),
          phone_number: data.phone,
          pin: data.pin,
          csrf_token: csrf
        },
        { headers: { Authorization: `Bearer ${token}`, 'X-CSRF-Token': csrf } }
      );
      await fetchDashboardData();
      setActiveModal(null);
      showToast(`Successfully withdrew ${Number(data.amount)} RWF`);
    } catch (err) {
      console.error('Withdraw failed:', err);
      showToast(err.response?.data?.detail || t('withdrawError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkStudent = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const csrf = csrfToken || await fetchCsrfToken();
      await axios.post(
        `${API_URL}/link-student`,
        {
          student_id: data.studentId,
          student_name: data.name,
          grade: data.grade,
          class_name: data.class,
          pin: data.pin,
          csrf_token: csrf
        },
        { headers: { Authorization: `Bearer ${token}`, 'X-CSRF-Token': csrf } }
      );
      await fetchDashboardData();
      setActiveModal(null);
      showToast(`Successfully linked ${data.name}`);
    } catch (err) {
      console.error('Link student failed:', err);
      showToast(err.response?.data?.detail || t('linkStudentError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetLimits = (student) => {
    setSelectedStudent(student);
    setActiveModal('spendingLimits');
  };

  const handleSaveLimits = async (limits) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const csrf = csrfToken || await fetchCsrfToken();
      await axios.post(
        `${API_URL}/set-spending-limit`,
        {
          student_id: selectedStudent.id,
          spending_limit: Number(limits.dailyLimit) || 0,
          limit_period_days: 1,
          csrf_token: csrf
        },
        { headers: { Authorization: `Bearer ${token}`, 'X-CSRF-Token': csrf } }
      );
      await fetchDashboardData();
      setActiveModal(null);
      setSelectedStudent(null);
      showToast(`Spending limits updated for ${selectedStudent.name}`);
    } catch (err) {
      console.error('Set limits failed:', err);
      showToast(err.response?.data?.detail || t('setLimitsError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const tabs = [
      { id: 'wallet', label: t('wallet'), icon: Wallet },
    { id: 'overview', label: t('overview'), icon: BarChart3 },
    { id: 'students', label: t('students'), icon: Users },
    { id: 'transactions', label: t('transactions'), icon: Activity }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div ref={overviewRef} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand dark:text-brand text-sm font-medium">{t('totalBalance')}</p>
                    <p className="text-white-950 dark:text-white text-2xl font-bold mt-1">
                      {isBalanceVisible ? `${balance.toLocaleString()} RWF` : '••••••'}
                    </p>
                  </div>
                  <div className="p-3 bg-brand dark:bg-green-900/30 rounded-xl">
                    <Wallet className="w-6 h-6 text-white dark:text-brand" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-green-600 dark:text-brand text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+2.5% {t('fromLastMonth')}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand0 dark:text-brand text-sm font-medium">{t('activeStudents')}</p>
                    <p className="text-white-950 dark:text-white text-2xl font-bold mt-1">{students.length}</p>
                  </div>
                  <div className="p-3 bg-bland dark:bg-brand rounded-xl">
                    <Users className="w-6 h-6 text-white dark:text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <Plus className="w-4 h-4 mr-1" />
                  <span>{t('readyToLink')}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand0 dark:text-brand text-sm font-medium">{t('thisMonthSpent')}</p>
                    <p className="text-white-950 dark:text-white text-2xl font-bold mt-1">
                      {isBalanceVisible ? `${students.reduce((sum, s) => sum + s.todaySpent, 0).toLocaleString()} RWF` : '••••••'}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                    <ShoppingCart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-orange-600 dark:text-orange-400 text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span>-15% {t('vsLastMonth')}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand0 dark:text-brand text-sm font-medium">{t('todayActivity')}</p>
                    <p className="text-white-950 dark:text-white text-2xl font-bold mt-1">{transactions.length}</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                    <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-purple-600 dark:text-purple-400 text-sm font-medium">
                  <PieChart className="w-4 h-4 mr-1" />
                  <span>{t('transactionsToday')}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <VirtualCard
                  balance={balance}
                  isVisible={isBalanceVisible}
                  onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
                />
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 h-full">
                  <h3 className="text-white-950 dark:text-white font-semibold text-lg mb-6">{t('quickActions')}</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveModal('deposit')}
                      className="w-full flex items-center justify-center space-x-3 bg-brand hover:bg-brand text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      <span>{t('deposit')}</span>
                    </button>
                    <button
                      onClick={() => setActiveModal('withdraw')}
                      className="w-full flex items-center justify-center space-x-3 bg-orange-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                    >
                      <TrendingDown className="w-5 h-5" />
                      <span>{t('withdraw')}</span>
                    </button>
                    <button
                      onClick={() => setActiveModal('linkStudent')}
                      className="w-full flex items-center justify-center space-x-3 bg-zinc-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Users className="w-5 h-5" />
                      <span>{t('linkStudent')}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 h-full">
                  <h3 className="text-white-950 dark:text-white font-semibold text-lg mb-6">{t('recentActivity')}</h3>
                  <div className="space-y-4">
                    {transactions.slice(0, 4).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            transaction.type === 'deposit' ? 'bg-brand dark:bg-green-900/30' :
                            transaction.type === 'withdraw' ? 'bg-red-50 dark:bg-red-900/30' : 'bg-blue-50 dark:bg-blue-900/30'
                          }`}>
                            {transaction.type === 'deposit' ?
                              <TrendingUp className="w-5 h-5 text-green-600 dark:text-brand" /> :
                              transaction.type === 'withdraw' ?
                              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" /> :
                              <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            }
                          </div>
                          <div>
                            <p className="text-white-950 dark:text-white text-sm font-medium">{transaction.title}</p>
                            <p className="text-brand0 dark:text-brand text-xs">{transaction.date}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-green-600 dark:text-brand' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()} RWF
                        </span>
                      </div>
                    ))}
                    {transactions.slice(0, 4).length === 0 && (
                      <>
                        <div className={`flex flex-col items-center justify-center text-center text-sm ${isDark ? 'text-emerald-200' : 'text-emerald-600'}`}>
                          <div className="w-52 h-52 mx-auto mb-2">
                            <img
                              src="/assets/Credit card-bro.svg"
                              alt="No transactions illustration"
                              className="w-full h-full object-contain"
                              draggable={false}
                            />
                          </div>
                          {t('noTransactions' as any)}
                        </div>
                        {/* <p className="text-center text-gray-500 dark:text-gray-400">{t('noTransactions' as any)}</p> */}
                      </>
                    )}
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
              onViewTransactions={(student) => {
                setSelectedStudent(student);
                setActiveModal('studentTransactions');
              }}
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
    // bg-gradient-to-br from-brand via-white to-brand0 
    <div
      className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-200"
      style={{
      backgroundImage: "url('/assets/background.png')",
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto'
      }}
    >
      <div className="sticky top-0 z-50 bg-white dark:bg-white-950 border-b border-brand shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img src="/assets/logo.png" alt="kaascan Logo" className="w-40 rounded-lg object-contain" />
            </div>
            <div className="hidden md:flex items-center space-x-1 bg-brand dark:bg-brand rounded-lg p-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-brand text-white-950 dark:text-white shadow-sm'
                        : 'text-white dark:text-white hover:text-white-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-green-600/50'
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
              className="p-2 text-brand dark:text-brand hover:text-white-950 dark:hover:text-white hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
            >
              {isBalanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-brand dark:text-brand hover:text-white-950 dark:hover:text-white hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 p-2 text-brand dark:text-brand hover:text-white-950 dark:hover:text-white hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{currentLanguage?.flag}</span>
              </button>
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-white-950 rounded-xl shadow-lg border border-brand dark:border-brand py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-brand dark:hover:bg-brand transition-all duration-200 font-medium flex items-center space-x-3 ${
                        language === lang.code ? 'bg-brand dark:bg-brand text-yellow-600 dark:text-yellow-400' : 'text-brand dark:text-green-300'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="relative p-2 text-brand dark:text-brand hover:text-white-950 dark:hover:text-white hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
              >
                <Bell className="w-5 h-5 " />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-white-950 rounded-xl shadow-lg border border-brand dark:border-brand z-50">
                  <div className="p-4 border-b border-brand dark:border-brand">
                    <h3 className="font-semibold text-white-950 dark:text-white">{t('notifications')}</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="p-3 bg-brand dark:bg-brand rounded-lg">
                      <p className="text-sm font-medium text-brand dark:text-green-200">{t('alicePurchase')}</p>
                      <p className="text-xs text-green-600 dark:text-brand">{t('twoMinutesAgo')}</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{t('bobLimitReminder')}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">{t('oneHourAgo')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-white-950 rounded-xl shadow-lg border border-brand dark:border-brand py-2 z-50">
                  <div className="px-4 py-3 border-b border-brand dark:border-brand">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white-950 dark:text-white">{t('lovingParent')}</p>
                        <p className="text-sm text-brand0 dark:text-brand">parent@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setActiveModal('profile');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-brand dark:text-green-300 hover:bg-brand dark:hover:bg-brand transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('profileSettings')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal('settings');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-brand dark:text-green-300 hover:bg-brand dark:hover:bg-brand transition-all duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span>{t('settings')}</span>
                    </button>
                    <hr className="my-2 border-brand dark:border-brand" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('signOut')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AdBanner />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">{renderTabContent()}</div>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-white-950 border-t border-brand dark:border-brand z-50">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-brand0 dark:text-brand hover:text-white-950 dark:hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {activeModal === 'profile' && <ProfileModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'deposit' && (
        <VercelModal
          title={t('depositFunds')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleDeposit}
          isLoading={isLoading}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                {t('phoneNumber')}
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="078XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                {t('amount')}
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1000"
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                {t('pin')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </VercelModal>
      )}
      {activeModal === 'withdraw' && (
        <VercelModal
          title={t('withdraw')}
          onClose={() => setActiveModal(null)}
          onSubmit={handleWithdraw}
          isLoading={isLoading}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                {t('phoneNumber')}
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="078XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                {t('amount')}
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1000"
                max={balance}
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                {t('pin')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                {t('studentId')}
              </label>
              <input
                type="text"
                name="studentId"
                required
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="STU003"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                {t('studentName')}
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Full Name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                  {t('grade')}
                </label>
                <input
                  type="text"
                  name="grade"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Grade 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                  {t('class')}
                </label>
                <input
                  type="text"
                  name="class"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="10A"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand dark:text-green-300 mb-2">
                {t('pinForPurchases')}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
              />
            </div>
          </div>
        </VercelModal>
      )}
      {activeModal === 'settings' && (
        <VercelModal
          title={t('settings')}
          onClose={() => setActiveModal(null)}
          onSubmit={() => setActiveModal(null)}
          isLoading={false}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white-950 dark:text-white">{t('notifications')}</h4>
                <p className="text-sm text-brand0 dark:text-brand">{t('receiveAlerts')}</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white-950 dark:text-white">{t('darkMode')}</h4>
                <p className="text-sm text-brand0 dark:text-brand">{t('switchTheme')}</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? 'bg-blue-600' : 'bg-green-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isDark ? 'right-0.5' : 'left-0.5'}`}></div>
              </button>
            </div>
            <div className="border-t dark:border-brand pt-4">
              <h4 className="text-sm font-medium text-white-950 dark:text-white mb-2">{t('language')}</h4>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white rounded-lg"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
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
      {activeModal === 'studentTransactions' && selectedStudent && (
        <VercelModal
          title={`${selectedStudent.name}'s Transactions`}
          onClose={() => {
            setActiveModal(null);
            setSelectedStudent(null);
          }}
          onSubmit={() => {}}
          isLoading={false}
          hideSubmit
        >
          <div className="space-y-4">
            {transactions
              .filter(tx => tx.student === selectedStudent.name)
              .map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-brand dark:bg-green-900/30">
                  <div>
                    <p className="text-sm font-medium text-brand dark:text-green-200">{tx.title}</p>
                    <p className="text-xs text-green-600 dark:text-brand">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-600 dark:text-brand' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount).toLocaleString()} RWF
                  </span>
                </div>
              ))}
            {transactions.filter(tx => tx.student === selectedStudent.name).length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">{t('noTransactions')}</p>
            )}
          </div>
        </VercelModal>
      )}
      {activeModal === 'allTransactions' && (
        <VercelModal
          title={t('allTransactions')}
          onClose={() => setActiveModal(null)}
          onSubmit={() => {}}
          isLoading={false}
          hideSubmit
        >
          <div className="space-y-4">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-brand dark:bg-green-900/30">
                <div>
                  <p className="text-sm font-medium text-brand dark:text-green-200">{tx.title}</p>
                  <p className="text-xs text-green-600 dark:text-brand">{tx.date}</p>
                </div>
                <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-600 dark:text-brand' : 'text-red-600 dark:text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount).toLocaleString()} RWF
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">{t('noTransactions')}</p>
            )}
          </div>
        </VercelModal>
      )}
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
      {isLoading && <BinanceLoader />}
    </div>
  );
};

export default Index;