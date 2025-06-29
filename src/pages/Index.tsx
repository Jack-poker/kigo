import React, { useState, useEffect, useRef } from "react";
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
  LogOut,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import VirtualCard from "../components/VirtualCard";
import WalletSection from "../components/WalletSection";
import StudentsSection from "../components/StudentsSection";
import TransactionsSection from "../components/TransactionsSection";
import VercelModal from "../components/VercelModal";
import VercelToast from "../components/VercelToast";
import BinanceLoader from "../components/BinanceLoader";
import ProfileModal from "../components/ProfileModal";
import AdBanner from "../components/AdBanner";
import SpendingLimitsModal from "../components/SpendingLimitsModal";
import PaymentStatusListener from "../components/payment/track_payment";
import TransactionTracker from "../components/payment/Transaction_tracker";
import AddStudent from "@/components/admin/addStudent";
import AddStudentModal from "@/components/admin/addStudent";

const Index = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("wallet");
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const overviewRef = useRef(null);
  const walletRef = useRef(null);
  const studentsRef = useRef(null);
  const transactionsRef = useRef(null);

  const [showTracker, setShowTracker] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);

  const handleStartTransaction = () => {
    setShowTracker(true);
    setTransactionComplete(false);
  };

  const handleTransactionComplete = () => {
    setTransactionComplete(true);
    setTimeout(() => {
      setShowTracker(false);
      setTransactionComplete(false);
    }, 3000);
  };

  const handleReset = () => {
    setShowTracker(false);
    setTransactionComplete(false);
  };

  if (showTracker) {
    return (
      <TransactionTracker
        onComplete={handleTransactionComplete}
        transactionAmount="$25.99"
        merchantName="Kid's Store"
        data-oid="9p0l:c2"
      />
    );
  }

  const API_URL = "http://localhost:8001";

  // Global variable to store parent's phone number
  const [parentPhone, setParentPhone] = useState("");

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Extract phone_number and set as global state
      if (response.data.profile?.phone_number) {
        setParentPhone(response.data.profile.phone_number);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      showToast(t("profileError"), "error");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
    fetchCsrfToken();
  }, []);

  const showToast = (message, type = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setTimeout(() => {
      switch (tabId) {
        case "overview":
          scrollToSection(overviewRef);
          break;
        case "wallet":
          scrollToSection(walletRef);
          break;
        case "students":
          scrollToSection(studentsRef);
          break;
        case "transactions":
          scrollToSection(transactionsRef);
          break;
      }
    }, 100);
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-csrf-token`);
      setCsrfToken(response.data.csrf_token);
      return response.data.csrf_token;
    } catch (err) {
      console.error("Failed to fetch CSRF token:", err);
      showToast(t("serverError"), "error");
    }
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch wallet balance
      const balanceResponse = await axios.get(`${API_URL}/wallet/balance`, {
        headers,
      });
      setBalance(balanceResponse.data.balance);

      // Fetch linked students
      const studentsResponse = await axios.get(`${API_URL}/students/linked`, {
        headers,
      });
      setStudents(
        studentsResponse.data.students.map((student) => ({
          id: student.student_id,
          name: student.student_name,
          studentId: student.student_id,
          grade: student.grade || "N/A",
          class: student.class || "N/A",
          photo: "/api/placeholder/48/48",
          dailyLimit: student.spending_limit || 0,
          weeklyLimit: (student.spending_limit || 0) * 7,
          monthlyLimit: (student.spending_limit || 0) * 30,
          todaySpent: student.spent_amount || 0,
          allowedDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          allowedHours: { from: "07:00", to: "18:00" },
        })),
      );

      // Fetch recent transactions
      const transactionsResponse = await axios.get(
        `${API_URL}/transactions/recent`,
        { headers },
      );
      setTransactions(
        transactionsResponse.data.transactions.map((tx) => ({
          id: tx.transaction_id,
          type: tx.is_deposit ? "deposit" : "payment",
          title: tx.description || t("unknownTransaction"),
          student: tx.student_name || null,
          amount: tx.is_deposit ? tx.amount : -tx.amount,
          date: new Date(tx.timestamp).toLocaleString(),
          status: "completed",
        })),
      );
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        showToast(t("serverError"), "error");
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
      const token = localStorage.getItem("token");
      const csrf = csrfToken || (await fetchCsrfToken());
      const response = await axios.post(
        `${API_URL}/wallet/deposit`,
        {
          amount: Number(data.amount),
          phone_number: data.phone,
          pin: data.pin,
          csrf_token: csrf,
        },
        { headers: { Authorization: `Bearer ${token}`, "X-CSRF-Token": csrf } },
      );

      const txToken = response.data?.transaction_id;
      await fetchDashboardData();
      setActiveModal(null);
      showToast(response.data?.message || `Deposit request initiated`);
      if (txToken) {
        navigate(`/payment-status?txid=${encodeURIComponent(txToken)}`);
      }
    } catch (err) {
      console.error("Deposit failed:", err);
      showToast(err.response?.data?.detail || t("depositError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const csrf = csrfToken || (await fetchCsrfToken());
      await axios.post(
        `${API_URL}/wallet/withdraw`,
        {
          amount: Number(data.amount),
          phone_number: data.phone,
          pin: data.pin,
          csrf_token: csrf,
        },
        { headers: { Authorization: `Bearer ${token}`, "X-CSRF-Token": csrf } },
      );
      await fetchDashboardData();
      setActiveModal(null);
      showToast(`Successfully withdrew ${Number(data.amount)} RWF`);
    } catch (err) {
      console.error("Withdraw failed:", err);
      showToast(err.response?.data?.detail || t("withdrawError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkStudent = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const csrf = csrfToken || (await fetchCsrfToken());
      await axios.post(
        `${API_URL}/link-student`,
        {
          student_id: data.studentId,
          student_name: data.name,
          grade: data.grade,
          class_name: data.class,
          pin: data.pin,
          csrf_token: csrf,
        },
        { headers: { Authorization: `Bearer ${token}`, "X-CSRF-Token": csrf } },
      );
      await fetchDashboardData();
      setActiveModal(null);
      showToast(`Successfully linked ${data.name}`);
    } catch (err) {
      console.error("Link student failed:", err);
      showToast(err.response?.data?.detail || t("linkStudentError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetLimits = (student) => {
    setSelectedStudent(student);
    setActiveModal("spendingLimits");
  };

  const handleSaveLimits = async (limits) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const csrf = csrfToken || (await fetchCsrfToken());
      await axios.post(
        `${API_URL}/set-spending-limit`,
        {
          student_id: selectedStudent.id,
          spending_limit: Number(limits.dailyLimit) || 0,
          limit_period_days: 1,
          csrf_token: csrf,
        },
        { headers: { Authorization: `Bearer ${token}`, "X-CSRF-Token": csrf } },
      );
      await fetchDashboardData();
      setActiveModal(null);
      setSelectedStudent(null);
      showToast(`Spending limits updated for ${selectedStudent.name}`);
    } catch (err) {
      console.error("Set limits failed:", err);
      showToast(err.response?.data?.detail || t("setLimitsError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  const tabs = [
    { id: "wallet", label: t("wallet"), icon: Wallet },
    { id: "overview", label: t("overview"), icon: BarChart3 },
    { id: "students", label: t("students"), icon: Users },
    { id: "transactions", label: t("transactions"), icon: Activity },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div ref={overviewRef} className="space-y-8" data-oid="p9u0ud:">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              data-oid="cwikib:"
            >
              <div
                className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                data-oid="xnvia4i"
              >
                <div
                  className="flex items-center justify-between"
                  data-oid="9rkcqi8"
                >
                  <div data-oid="j2hts5i">
                    <p
                      className="text-brand dark:text-brand text-sm font-medium"
                      data-oid=":nswiy_"
                    >
                      {t("totalBalance")}
                    </p>
                    <p
                      className="text-white-950 dark:text-white text-2xl font-bold mt-1"
                      data-oid="qjkwhj7"
                    >
                      {isBalanceVisible
                        ? `${balance.toLocaleString()} RWF`
                        : "••••••"}
                    </p>
                  </div>
                  <div
                    className="p-3 bg-brand dark:bg-green-900/30 rounded-xl"
                    data-oid="ipdrcq6"
                  >
                    <Wallet
                      className="w-6 h-6 text-white dark:text-brand"
                      data-oid=":qf25my"
                    />
                  </div>
                </div>
                <div
                  className="flex items-center mt-4 text-green-600 dark:text-brand text-sm font-medium"
                  data-oid="sxgo-1b"
                >
                  <TrendingUp className="w-4 h-4 mr-1" data-oid="bysr0qc" />
                  <span data-oid="22ic8_-">+2.5% {t("fromLastMonth")}</span>
                </div>
              </div>
              <div
                className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                data-oid="f:xljl6"
              >
                <div
                  className="flex items-center justify-between"
                  data-oid="i56lwew"
                >
                  <div data-oid="s97ncy7">
                    <p
                      className="text-brand0 dark:text-brand text-sm font-medium"
                      data-oid="l4hrtxd"
                    >
                      {t("activeStudents")}
                    </p>
                    <p
                      className="text-white-950 dark:text-white text-2xl font-bold mt-1"
                      data-oid="_fj1._x"
                    >
                      {students.length}
                    </p>
                  </div>
                  <div
                    className="p-3 bg-bland dark:bg-brand rounded-xl"
                    data-oid="5cs8r52"
                  >
                    <Users
                      className="w-6 h-6 text-white dark:text-white"
                      data-oid="czfnd02"
                    />
                  </div>
                </div>
                <div
                  className="flex items-center mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium"
                  data-oid="onme-8b"
                >
                  <Plus className="w-4 h-4 mr-1" data-oid="k5c6cr-" />
                  <span data-oid="naffxwt">{t("readyToLink")}</span>
                </div>
              </div>
              <div
                className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                data-oid="4iz_1m5"
              >
                <div
                  className="flex items-center justify-between"
                  data-oid="olww49r"
                >
                  <div data-oid="8w1kt2_">
                    <p
                      className="text-brand0 dark:text-brand text-sm font-medium"
                      data-oid="g:-i5tx"
                    >
                      {t("thisMonthSpent")}
                    </p>
                    <p
                      className="text-white-950 dark:text-white text-2xl font-bold mt-1"
                      data-oid="3unu09j"
                    >
                      {isBalanceVisible
                        ? `${students.reduce((sum, s) => sum + s.todaySpent, 0).toLocaleString()} RWF`
                        : "••••••"}
                    </p>
                  </div>
                  <div
                    className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl"
                    data-oid="ei76jvy"
                  >
                    <ShoppingCart
                      className="w-6 h-6 text-orange-600 dark:text-orange-400"
                      data-oid="4o5426n"
                    />
                  </div>
                </div>
                <div
                  className="flex items-center mt-4 text-orange-600 dark:text-orange-400 text-sm font-medium"
                  data-oid="x1.3je8"
                >
                  <TrendingDown className="w-4 h-4 mr-1" data-oid="35ywlyh" />
                  <span data-oid="cbzjk_1">-15% {t("vsLastMonth")}</span>
                </div>
              </div>
              <div
                className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                data-oid="6l_p6mc"
              >
                <div
                  className="flex items-center justify-between"
                  data-oid="b_s5.np"
                >
                  <div data-oid="p28dr-y">
                    <p
                      className="text-brand0 dark:text-brand text-sm font-medium"
                      data-oid="vxn5san"
                    >
                      {t("todayActivity")}
                    </p>
                    <p
                      className="text-white-950 dark:text-white text-2xl font-bold mt-1"
                      data-oid="4:cgkej"
                    >
                      {transactions.length}
                    </p>
                  </div>
                  <div
                    className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl"
                    data-oid="y8n82tl"
                  >
                    <Activity
                      className="w-6 h-6 text-purple-600 dark:text-purple-400"
                      data-oid="_huuown"
                    />
                  </div>
                </div>
                <div
                  className="flex items-center mt-4 text-purple-600 dark:text-purple-400 text-sm font-medium"
                  data-oid=".bwxis4"
                >
                  <PieChart className="w-4 h-4 mr-1" data-oid="3l0.-ln" />
                  <span data-oid="0-oisat">{t("transactionsToday")}</span>
                </div>
              </div>
            </div>
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-auto top-auto right-auto bottom-auto left-auto static h-[1004px]"
              data-oid="cybpcdm"
            >
              <div className="lg:col-span-1" data-oid="yytwbox">
                <VirtualCard
                  balance={balance}
                  isVisible={isBalanceVisible}
                  onToggleVisibility={() =>
                    setIsBalanceVisible(!isBalanceVisible)
                  }
                  data-oid="de3ao8."
                />
              </div>
              <div className="lg:col-span-1" data-oid="wvjyluw">
                <div
                  className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 h-full"
                  data-oid="gpopm4v"
                >
                  <h3
                    className="text-white-950 dark:text-white font-semibold text-lg mb-6"
                    data-oid="p_okful"
                  >
                    {t("quickActions")}
                  </h3>
                  <div className="space-y-3" data-oid="doa01:r">
                    <button
                      onClick={() => setActiveModal("deposit")}
                      className="w-full flex items-center justify-center space-x-3 bg-brand hover:bg-brand text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                      data-oid="_fe04:5"
                    >
                      <Plus className="w-5 h-5" data-oid="v7qx-op" />
                      <span data-oid="6rteiec">{t("deposit")}</span>
                    </button>
                    <button
                      onClick={() => setActiveModal("withdraw")}
                      className="w-full flex items-center justify-center space-x-3 bg-orange-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                      data-oid="i.bnijm"
                    >
                      <TrendingDown className="w-5 h-5" data-oid="fxcienb" />
                      <span data-oid="b8rj20v">{t("withdraw")}</span>
                    </button>
                    <button
                      onClick={() => setActiveModal("linkStudent")}
                      className="w-full flex items-center justify-center space-x-3 bg-zinc-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                      data-oid="1wd8-5w"
                    >
                      <Users className="w-5 h-5" data-oid="kp1qagm" />
                      <span data-oid="ire57c4">{t("linkStudent")}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1" data-oid="vlib:0g">
                <div
                  className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 h-full"
                  data-oid="s4z9g4w"
                >
                  <h3
                    className="text-white-950 dark:text-white font-semibold text-lg mb-6"
                    data-oid="rj.la:z"
                  >
                    {t("recentActivity")}
                  </h3>
                  <div className="space-y-4" data-oid="7rs.5d7">
                    {transactions.slice(0, 4).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between"
                        data-oid="6ezzhmr"
                      >
                        <div
                          className="flex items-center space-x-3"
                          data-oid="6we-ao8"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              transaction.type === "deposit"
                                ? "bg-brand dark:bg-green-900/30"
                                : transaction.type === "withdraw"
                                  ? "bg-red-50 dark:bg-red-900/30"
                                  : "bg-blue-50 dark:bg-blue-900/30"
                            }`}
                            data-oid="uas.p_5"
                          >
                            {transaction.type === "deposit" ? (
                              <TrendingUp
                                className="w-5 h-5 text-green-600 dark:text-brand"
                                data-oid="x9vrm34"
                              />
                            ) : transaction.type === "withdraw" ? (
                              <TrendingDown
                                className="w-5 h-5 text-red-600 dark:text-red-400"
                                data-oid="wbkz3y2"
                              />
                            ) : (
                              <ShoppingCart
                                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                data-oid="i6r.goe"
                              />
                            )}
                          </div>
                          <div data-oid="gibgkyf">
                            <p
                              className="text-white-950 dark:text-white text-sm font-medium"
                              data-oid="k6sj:4d"
                            >
                              {transaction.title}
                            </p>
                            <p
                              className="text-brand0 dark:text-brand text-xs"
                              data-oid="abf0p0e"
                            >
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            transaction.amount > 0
                              ? "text-green-600 dark:text-brand"
                              : "text-red-600 dark:text-red-400"
                          }`}
                          data-oid="1l:j-7m"
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {Math.abs(transaction.amount).toLocaleString()} RWF
                        </span>
                      </div>
                    ))}
                    {transactions.slice(0, 4).length === 0 && (
                      <>
                        <div
                          className={`flex flex-col items-center justify-center text-center text-sm ${isDark ? "text-emerald-200" : "text-emerald-600"}`}
                          data-oid="dqtd5uq"
                        >
                          <div
                            className="w-52 h-52 mx-auto mb-2"
                            data-oid="kt4esg0"
                          >
                            <img
                              src="/assets/Credit card-bro.svg"
                              alt="No transactions illustration"
                              className="w-full h-full object-contain"
                              draggable={false}
                              data-oid="erjmxl."
                            />
                          </div>
                          {t("noTransactions" as any)}
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

      case "wallet":
        return (
          <div
            ref={walletRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            data-oid="xz-dc_-"
          >
            <VirtualCard
              balance={balance}
              isVisible={isBalanceVisible}
              onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
              data-oid="zjsom.2"
            />

            <WalletSection
              balance={balance}
              isVisible={isBalanceVisible}
              onDeposit={() => setActiveModal("deposit")}
              onWithdraw={() => setActiveModal("withdraw")}
              onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
              data-oid="7hkx-lc"
            />
          </div>
        );

      case "students":
        return (
          <div ref={studentsRef} data-oid="byn79-9">
            <StudentsSection
              students={students}
              onViewTransactions={(student) => {
                setSelectedStudent(student);
                setActiveModal("studentTransactions");
              }}
              onSetLimits={handleSetLimits}
              data-oid=":tfap1-"
            />
          </div>
        );

      case "transactions":
        return (
          <div ref={transactionsRef} data-oid="ecki:tt">
            <TransactionsSection
              transactions={transactions}
              onViewAll={() => setActiveModal("allTransactions")}
              data-oid="-9kt69v"
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
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
      data-oid="-l1lu1r"
    >
      <div
        className="sticky top-0 z-50 bg-white dark:bg-white-950 border-b border-brand shadow-sm"
        data-oid="5o56cev"
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          data-oid="gmzpdhl"
        >
          <div className="flex items-center space-x-6" data-oid="2q-cod1">
            <div className="flex items-center space-x-3" data-oid="bk7vtao">
              <img
                src="/assets/logo.png"
                alt="kaascan Logo"
                className="w-40 rounded-lg object-contain"
                data-oid="fg7hezl"
              />
            </div>
            <div
              className="hidden md:flex items-center space-x-1 bg-brand dark:bg-brand rounded-lg p-1"
              data-oid="v-f9z8i"
            >
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-brand text-white-950 dark:text-white shadow-sm"
                        : "text-white dark:text-white hover:text-white-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-green-600/50"
                    }`}
                    data-oid="mnvfco2"
                  >
                    <IconComponent className="w-4 h-4" data-oid="nzba.kt" />
                    <span data-oid="gzr.if.">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-3" data-oid="-95yiki">
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="p-2 text-brand dark:text-brand hover:text-white-950 dark:hover:text-white hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
              data-oid="rt4njr:"
            >
              {isBalanceVisible ? (
                <Eye className="w-5 h-5" data-oid="3ecyq41" />
              ) : (
                <EyeOff className="w-5 h-5" data-oid="ku8u4jd" />
              )}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-brand dark:text-brand hover:text-white-950 dark:hover:text-white hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
              data-oid="y5_u-uo"
            >
              {isDark ? (
                <Sun className="w-5 h-5" data-oid="fvf7311" />
              ) : (
                <Moon className="w-5 h-5" data-oid="dq:9i-b" />
              )}
            </button>
            <div className="relative" data-oid="-mja7:5">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 p-2 text-brand dark:text-brand hover:text-white-950 dark:hover:text-white hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
                data-oid="-ghoo_g"
              >
                <Globe className="w-5 h-5" data-oid="wgzg8di" />
                <span className="text-sm font-medium" data-oid="jc0lf6:">
                  {currentLanguage?.flag}
                </span>
              </button>
              {showLanguageDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-white-950 rounded-xl shadow-lg border border-brand dark:border-brand py-2 z-50"
                  data-oid="ft_sk0k"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-brand dark:hover:bg-brand transition-all duration-200 font-medium flex items-center space-x-3 ${
                        language === lang.code
                          ? "bg-brand dark:bg-brand text-yellow-600 dark:text-yellow-400"
                          : "text-brand dark:text-green-300"
                      }`}
                      data-oid="vu92du1"
                    >
                      <span className="text-lg" data-oid="n.9pyoe">
                        {lang.flag}
                      </span>
                      <span data-oid="yo1usg-">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" data-oid="7h1rx6:">
              <button
                onClick={() =>
                  setShowNotificationDropdown(!showNotificationDropdown)
                }
                className="relative p-2 text-brand dark:text-brand hover:text-white-950 dark:hover:text-white hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
                data-oid="omffv5w"
              >
                <Bell className="w-5 h-5 " data-oid="33w0l2e" />
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  data-oid="4v6gwbi"
                ></span>
              </button>
              {showNotificationDropdown && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-white-950 rounded-xl shadow-lg border border-brand dark:border-brand z-50"
                  data-oid="3rbr44."
                >
                  <div
                    className="p-4 border-b border-brand dark:border-brand"
                    data-oid="b42avx9"
                  >
                    <h3
                      className="font-semibold text-white-950 dark:text-white"
                      data-oid="yp5:sdd"
                    >
                      {t("notifications")}
                    </h3>
                  </div>
                  <div className="p-4 space-y-3" data-oid="zk7juwy">
                    <div
                      className="p-3 bg-brand dark:bg-brand rounded-lg"
                      data-oid="nn6e1wl"
                    >
                      <p
                        className="text-sm font-medium text-brand dark:text-green-200"
                        data-oid="cch3zux"
                      >
                        {t("alicePurchase")}
                      </p>
                      <p
                        className="text-xs text-green-600 dark:text-brand"
                        data-oid="hsio:rb"
                      >
                        {t("twoMinutesAgo")}
                      </p>
                    </div>
                    <div
                      className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
                      data-oid="zatqeqc"
                    >
                      <p
                        className="text-sm font-medium text-blue-800 dark:text-blue-200"
                        data-oid="e3sqwvy"
                      >
                        {t("bobLimitReminder")}
                      </p>
                      <p
                        className="text-xs text-blue-600 dark:text-blue-400"
                        data-oid="rs61-r1"
                      >
                        {t("oneHourAgo")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" data-oid="8:w8uf-">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 hover:bg-green-100 dark:hover:bg-brand rounded-lg transition-all duration-200"
                data-oid="-73zjne"
              >
                <div
                  className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                  data-oid="v_v:cwh"
                >
                  <User className="w-4 h-4 text-white" data-oid="fytp7x9" />
                </div>
              </button>
              {showProfileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-white-950 rounded-xl shadow-lg border border-brand dark:border-brand py-2 z-50"
                  data-oid="mfrfff1"
                >
                  <div
                    className="px-4 py-3 border-b border-brand dark:border-brand"
                    data-oid="epl_ptu"
                  >
                    <div
                      className="flex items-center space-x-3"
                      data-oid="w06i_m:"
                    >
                      <div
                        className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                        data-oid="72jpgo."
                      >
                        <User
                          className="w-6 h-6 text-white"
                          data-oid="4v.zihu"
                        />
                      </div>
                      <div data-oid="onn6h0a">
                        <p
                          className="font-medium text-white-950 dark:text-white"
                          data-oid="t48wh3e"
                        >
                          {t("lovingParent")}
                        </p>
                        <p
                          className="text-sm text-brand0 dark:text-brand"
                          data-oid="4e174_1"
                        >
                          parent@example.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2" data-oid="c.ssdzl">
                    <button
                      onClick={() => {
                        setActiveModal("profile");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-brand dark:text-green-300 hover:bg-brand dark:hover:bg-brand transition-all duration-200"
                      data-oid="rdsjf.p"
                    >
                      <User className="w-4 h-4" data-oid="i-.9yv6" />
                      <span data-oid="v45ge8.">{t("profileSettings")}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal("settings");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-brand dark:text-green-300 hover:bg-brand dark:hover:bg-brand transition-all duration-200"
                      data-oid="jq3b41d"
                    >
                      <Settings className="w-4 h-4" data-oid="lym::po" />
                      <span data-oid="vjz_l.:">{t("settings")}</span>
                    </button>
                    <hr
                      className="my-2 border-brand dark:border-brand"
                      data-oid="e_w:0f."
                    />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                      data-oid="_3q5mp9"
                    >
                      <LogOut className="w-4 h-4" data-oid="83s94n9" />
                      <span data-oid="plcwqlr">{t("signOut")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AdBanner data-oid="m51tkfe" />
      <div
        className="flex-1 p-6 w-[573px] h-[1730px] top-auto right-auto bottom-auto left-auto static"
        data-oid="ypwbxfn"
      >
        <div className="max-w-7xl mx-auto" data-oid="ufq37p7" key="olk-SsqB">
          {renderTabContent()}
        </div>
      </div>
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-white-950 border-t border-brand dark:border-brand z-50"
        data-oid="2ktjkvs"
      >
        <div
          className="flex items-center justify-around py-2"
          data-oid="x3ai:_5"
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-brand0 dark:text-brand hover:text-white-950 dark:hover:text-white"
                }`}
                data-oid="5r78enc"
              >
                <IconComponent className="w-5 h-5" data-oid="m1vvnpq" />
                <span className="text-xs font-medium" data-oid="mq:khzf">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {activeModal === "profile" && (
        <ProfileModal onClose={() => setActiveModal(null)} data-oid="7o2v1ye" />
      )}
      {activeModal === "deposit" && (
        <VercelModal
          title={t("depositFunds")}
          onClose={() => setActiveModal(null)}
          onSubmit={handleDeposit}
          isLoading={isLoading}
          data-oid="32wc7nm"
        >
          <div className="space-y-6" data-oid="phw_871">
            <div data-oid="wtrq4f4">
              {<PaymentStatusListener data-oid="6g.jofp" />}

              <label
                className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
                data-oid="lyz.jx4"
              >
                {t("phoneNumber")}
              </label>
              <input
                type="tel"
                name="phone"
                value={parentPhone}
                required
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="078XXXXXXX"
                disabled
                data-oid="vd_83-a"
              />
            </div>
            <div data-oid="tjza9o5">
              <label
                className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
                data-oid="21jhtgm"
              >
                {t("amount")}
              </label>
              <input
                type="number"
                name="amount"
                required
                min="100"
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="10,000"
                data-oid="n6a:bi4"
              />
            </div>
            {/* <div>
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
            </div> */}
          </div>
        </VercelModal>
      )}
      {activeModal === "withdraw" && (
        <VercelModal
          title={t("withdraw")}
          onClose={() => setActiveModal(null)}
          onSubmit={handleWithdraw}
          isLoading={isLoading}
          data-oid="mgdvjyn"
        >
          <div className="space-y-6" data-oid="2k:rufc">
            <div data-oid="dbahuii">
              <label
                className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
                data-oid="eklgr2y"
              >
                {t("phoneNumber")}
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="078XXXXXXX"
                data-oid="hue6der"
              />
            </div>
            <div data-oid="igp99kr">
              <label
                className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
                data-oid=".uzgf5j"
              >
                {t("amount")}
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1000"
                max={balance}
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="10,000"
                data-oid="dif7zki"
              />
            </div>
            <div data-oid="5mqyncn">
              <label
                className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
                data-oid="_n9.8qg"
              >
                {t("pin")}
              </label>
              <input
                type="password"
                name="pin"
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
                data-oid="2703ki4"
              />
            </div>
          </div>
        </VercelModal>
      )}
      {activeModal === "linkStudent" && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
          data-oid="-q7zqi_"
        >
          <div className="w-full bg-zinc-900 " data-oid="bznhm3h">
            <AddStudentModal
              onSubmit={handleLinkStudent}
              isLoading={isLoading}
              csrfToken={csrfToken}
              parentPhone={parentPhone}
              onClose={() => setActiveModal(null)}
              data-oid="hsffl85"
            />
          </div>
        </div>
      )}
      {activeModal === "settings" && (
        <VercelModal
          title={t("settings")}
          onClose={() => setActiveModal(null)}
          onSubmit={() => setActiveModal(null)}
          isLoading={false}
          data-oid="p733m77"
        >
          <div className="space-y-6" data-oid="8.vy9v5">
            <div
              className="flex items-center justify-between"
              data-oid="yonekmv"
            >
              <div data-oid="8h79a.p">
                <h4
                  className="text-sm font-medium text-white-950 dark:text-white"
                  data-oid="_6u8d.9"
                >
                  {t("notifications")}
                </h4>
                <p
                  className="text-sm text-brand0 dark:text-brand"
                  data-oid="wqi.ju:"
                >
                  {t("receiveAlerts")}
                </p>
              </div>
              <button
                className="w-12 h-6 bg-blue-600 rounded-full relative"
                data-oid="fccal3q"
              >
                <div
                  className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"
                  data-oid="5:.63q3"
                ></div>
              </button>
            </div>
            <div
              className="flex items-center justify-between"
              data-oid="gfpsym."
            >
              <div data-oid="dptkdjx">
                <h4
                  className="text-sm font-medium text-white-950 dark:text-white"
                  data-oid="wycy-t:"
                >
                  {t("darkMode")}
                </h4>
                <p
                  className="text-sm text-brand0 dark:text-brand"
                  data-oid="bk:2-g5"
                >
                  {t("switchTheme")}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? "bg-blue-600" : "bg-green-300"}`}
                data-oid="7t0dv.5"
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isDark ? "right-0.5" : "left-0.5"}`}
                  data-oid="d:o4aov"
                ></div>
              </button>
            </div>
            <div className="border-t dark:border-brand pt-4" data-oid="lo1uqc1">
              <h4
                className="text-sm font-medium text-white-950 dark:text-white mb-2"
                data-oid="s:ixt6i"
              >
                {t("language")}
              </h4>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white rounded-lg"
                data-oid="wn8c-ym"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} data-oid="5.z3cmv">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </VercelModal>
      )}
      {activeModal === "spendingLimits" && selectedStudent && (
        <SpendingLimitsModal
          student={selectedStudent}
          onClose={() => {
            setActiveModal(null);
            setSelectedStudent(null);
          }}
          onSave={handleSaveLimits}
          isLoading={isLoading}
          data-oid=":-lcn6d"
        />
      )}
      {activeModal === "studentTransactions" && selectedStudent && (
        <VercelModal
          title={`${selectedStudent.name}'s Transactions`}
          onClose={() => {
            setActiveModal(null);
            setSelectedStudent(null);
          }}
          onSubmit={() => {}}
          isLoading={false}
          hideSubmit
          data-oid="re580ni"
        >
          <div className="space-y-4" data-oid="5et_q-8">
            {transactions
              .filter((tx) => tx.student === selectedStudent.name)
              .map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-brand dark:bg-green-900/30"
                  data-oid="d_:d6c2"
                >
                  <div data-oid="vepi7hs">
                    <p
                      className="text-sm font-medium text-brand dark:text-green-200"
                      data-oid="okf3n:a"
                    >
                      {tx.title}
                    </p>
                    <p
                      className="text-xs text-green-600 dark:text-brand"
                      data-oid="8ugc7sh"
                    >
                      {tx.date}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${tx.amount > 0 ? "text-green-600 dark:text-brand" : "text-red-600 dark:text-red-400"}`}
                    data-oid="6efc4e9"
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {Math.abs(tx.amount).toLocaleString()} RWF
                  </span>
                </div>
              ))}
            {transactions.filter((tx) => tx.student === selectedStudent.name)
              .length === 0 && (
              <p
                className="text-center text-gray-500 dark:text-gray-400"
                data-oid="lp1nt6j"
              >
                {t("noTransactions")}
              </p>
            )}
          </div>
        </VercelModal>
      )}
      {activeModal === "allTransactions" && (
        <VercelModal
          title={t("allTransactions")}
          onClose={() => setActiveModal(null)}
          onSubmit={() => {}}
          isLoading={false}
          hideSubmit
          data-oid="j8i9lgn"
        >
          <div className="space-y-4" data-oid="twiy99y">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg bg-brand dark:bg-green-900/30"
                data-oid="j_hi.zz"
              >
                <div data-oid="_skajwq">
                  <p
                    className="text-sm font-medium text-brand dark:text-green-200"
                    data-oid="vj7izdt"
                  >
                    {tx.title}
                  </p>
                  <p
                    className="text-xs text-green-600 dark:text-brand"
                    data-oid="y_5fdtj"
                  >
                    {tx.date}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${tx.amount > 0 ? "text-green-600 dark:text-brand" : "text-red-600 dark:text-red-400"}`}
                  data-oid="uld0ha3"
                >
                  {tx.amount > 0 ? "+" : ""}
                  {Math.abs(tx.amount).toLocaleString()} RWF
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p
                className="text-center text-gray-500 dark:text-gray-400"
                data-oid="u8pljaq"
              >
                {t("noTransactions")}
              </p>
            )}
          </div>
        </VercelModal>
      )}
      <div className="fixed top-20 right-4 space-y-2 z-50" data-oid="a3.1orv">
        {toasts.map((toast) => (
          <VercelToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            data-oid="lseh:-r"
          />
        ))}
      </div>
      {isLoading && <BinanceLoader data-oid="w41iq3:" />}
    </div>
  );
};

export default Index;
