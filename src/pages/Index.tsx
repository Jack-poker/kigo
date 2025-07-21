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
import WithdrawModal from "@/components/withdrawModal";
import ModernNavbar from "@/components/ModernNavBar";

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

  const txid = new URLSearchParams(window.location.search).get("txid");
  const amount = new URLSearchParams(window.location.search).get("amount_data");

  if (showTracker) {
    return (
      <TransactionTracker
        onComplete={handleTransactionComplete}
        transactionAmount={amount}
        merchantName="Payment"
        data-oid=":gbaucl"
      />
    );
  }

  const API_URL = "https://api.kaascan.com";

  // Global variable to store parent's phone number
  const [parentPhone, setParentPhone] = useState("");
  const [parentId,setParentId] = useState("");
  

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
       navigate(`/payment-status?txid=${encodeURIComponent(txToken)}&amount_data=${Number(data.amount)}`);
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
          <div ref={overviewRef} className="space-y-8" data-oid="ai8jw.m">

            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              data-oid="i5tpunj"
            >
              <div className="lg:col-span-1" data-oid="opt-kjx">
                <VirtualCard
                  balance={balance}
                  isVisible={isBalanceVisible}
                  onToggleVisibility={() =>
                    setIsBalanceVisible(!isBalanceVisible)
                  }
                  data-oid="38-pxsi"
                />
              </div>
              <div className="lg:col-span-1 h-[326px]" data-oid="2tkp5sm">
                <div
                  className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 h-[318px] bg-white"
                  data-oid="b6_76fw"
                >
                  <h3
                    className="text-zin-900 dark:text-white font-semibold text-lg mb-6"
                    data-oid="pzcjg1f"
                  >
                    {t("quickActions")}
                  </h3>
                  <div className="space-y-3" data-oid="cwh5npe">
                    <button
                      onClick={() => setActiveModal("deposit")}
                      className="w-full flex items-center justify-center space-x-3 bg-white text-zinc-900
                       border border-zinc-900 py-4 px-6 rounded-xl transition-all duration-200 font-medium bg-[#341E5A]"
                      data-oid="knajrgr"
                    >
                      <Plus className="w-5 h-5" data-oid="2vc2jh_" />
                      <span data-oid="z69qdlw">{t("deposit")}</span>
                    </button>
                    <button
                      onClick={() => setActiveModal("withdraw")}
                      className="w-full flex items-center justify-center space-x-3 bg-yellow-400 0 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                      data-oid="y_8w67u"
                    >
                      <TrendingDown className="w-5 h-5" data-oid="85devot" />
                      <span data-oid="fem_b_e">{t("withdraw")}</span>
                    </button>
                    <button
                      onClick={() => setActiveModal("linkStudent")}
                      className="w-full flex items-center justify-center space-x-3 bg-zinc-900 hover:bg-blue-700 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium"
                      data-oid="hfrp7o4"
                    >
                      <Users className="w-5 h-5" data-oid="md9vf_p" />
                      <span data-oid="cwip9g1">{t("linkStudent")}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1" data-oid="z_t67o1">
                <div
                  className="bg-zinc-900 dark:bg-white-950  dark:border-gray-700 rounded-2xl p-6 h-full shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                  data-oid="u_0:xyp"
                >
                  <div
                    className="flex items-center justify-between mb-6"
                    data-oid="g0ny.0n"
                  >
                    <h3
                      className="text-white dark:text-white font-semibold text-lg"
                      data-oid="668zz85"
                    >
                      {t("recentActivity")}
                    </h3>
                    <button
                      onClick={() => setActiveModal("allTransactions")}
                      className="text-sm text-yellow-400  dark:hover:text-blue-300 font-medium transition-colors duration-200 text-[#000000]"
                      data-oid="n6qqzx_"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3" data-oid="n0hkxhk">
                    {transactions.slice(0, 4).map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className="group flex border-6 items-center
                         justify-between p-4 rounded-xl bg-white 
                         transition-all duration-200 border-2 hover:border-gray-200 dark:hover:border-gray-600 bg-[#4C2F7C]"
                        data-oid="_c6tgk2"
                      >
                        <div
                          className="flex items-center space-x-4"
                          data-oid="0sq3hbe"
                        >
                          <div
                            className={`w-12 h-12 rounded-full border-2 flex items-center
                               justify-center shadow-sm ${
                              transaction.type === "deposit"
                                ? "bg-zinc-900 dark:bg-yellow-400 text-brand dark:text-brand"
                                : transaction.type === "withdraw"
                                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                  : "bg-yellow-400 dark:bg-blue-900/30 text-yellow-400 dark:text-blue-400"
                            }`}
                            data-oid="pg11t:p"
                          >
                            {transaction.type === "deposit" ? (
                              <TrendingUp
                                className="w-5 h-5 bg-[#00000000] text-yellow-400"
                                data-oid="d_w3v6y"
                              />
                            ) : transaction.type === "withdraw" ? (
                              <TrendingDown
                                className="w-5 h-5"
                                data-oid="s72xnhb"
                              />
                            ) : (
                              <ShoppingCart
                                className="w-5 h-5"
                                data-oid="9wsu9r3"
                              />
                            )}
                          </div>
                          <div className="flex-1" data-oid="0o7k9yq">
                            <p
                              className="dark:text-white text-sm font-semibold mb-1 text-zinc-900"
                              data-oid="5kn15q0"
                            >
                              {transaction.title}
                            </p>
                            <div
                              className="flex items-center space-x-2"
                              data-oid="mo4e7bw"
                            >
                              <p
                                className="text-brand/400 dark:text-gray-400 text-xs"
                                data-oid="o_hr1yg"
                              >
                                {transaction.date}
                              </p>
                              {transaction.student && (
                                <>
                                  <span
                                    className="text-gray-300 dark:text-gray-600"
                                    data-oid="j86p5vm"
                                  >
                                    •
                                  </span>
                                  <p
                                    className="text-gray-500 dark:text-gray-400 text-xs"
                                    data-oid="rpsp2e:"
                                  >
                                    {transaction.student}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right" data-oid="_ozdpwo">
                          <span
                            className={`text-sm font-bold ${
                              transaction.amount > 0
                                ? "text-zinc-900 dark:text-yellow-400"
                                : "text-zinc-900 dark:text-white-400"
                            }`}
                            data-oid="oqecucc"
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {Math.abs(transaction.amount).toLocaleString()} RWF
                          </span>
                          <div
                            className="flex items-center justify-end mt-1"
                            data-oid="ogq9:t."
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                transaction.status === "completed"
                                  ? "bg-green-500"
                                  : transaction.status === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              data-oid="3bt-x3v"
                            ></div>
                            <span
                              className="text-xs text-zinc-900 dark:text-gray-500 ml-1 capitalize"
                              data-oid="cldy9ly"
                            >
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {transactions.slice(0, 4).length === 0 && (
                      <div
                        className="flex flex-col items-center justify-center py-12 text-center"
                        data-oid="5:l45hz"
                      >
                        {/* <div
                          className="w-24 h-24 mx-auto mb-4 bg-brand dark:bg-brand rounded-full flex items-center justify-center"
                          data-oid="h62c5vx"
                        > */}

<img
  src="/assets/Coins-rafiki.svg"
  alt="Activity Icon"
  className="w-80 h-80"
/>


                        {/* </div> */}
                        <h4
                          className="text-gray-900 dark:text-white font-medium mb-2"
                          data-oid="n8pu683"
                        >
                          No Recent Activity
                        </h4>
                        <p
                          className="text-gray-500 dark:text-gray-400 text-sm max-w-xs"
                          data-oid="6pma4x_"
                        >
                          {t("noTransactions" as any)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
              <div className="h-100"></div>
            </div>
            {/* <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              data-oid="hztznsj"
            >
              <div
                className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
                data-oid="u1_v26w"
              >
                <div
                  className="flex items-center justify-between"
                  data-oid="2qzy7vf"
                >
                  <div data-oid="1-x672g">
                    <p
                      className="text-brand dark:text-brand text-sm font-medium"
                      data-oid="pg6je2."
                    >
                      {t("totalBalance")}
                    </p>
                    <p
                      className="text-brand dark:text-white text-2xl font-bold mt-1"
                      data-oid="gubp03n"
                    >
                      {isBalanceVisible
                        ? `${balance.toLocaleString()} RWF`
                        : "••••••"}
                    </p>
                  </div>
                  <div
                    className="p-3 bg-brand dark:bg-green-900/30 rounded-xl"
                    data-oid="iuf3zsv"
                  >
                    <Wallet
                      className="w-6 h-6 text-white dark:text-brand"
                      data-oid="n2k.:t-"
                    />
                  </div>
                </div>
                <div
                  className="flex items-center mt-4 text-green-600 dark:text-brand text-sm font-medium"
                  data-oid="_c1rr-f"
                >
                  <TrendingUp className="w-4 h-4 mr-1" data-oid="0jdwjjq" />
                  <span data-oid=".olb1:a">+2.5% {t("fromLastMonth")}</span>
                </div>
              </div>
              <div
                className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
                data-oid="2ouz29j"
              >
                <div
                  className="flex items-center justify-between"
                  data-oid="w.h.x2i"
                >
                  <div data-oid="k02aixm">
                    <p
                      className="text-brand dark:text-brand text-sm font-medium"
                      data-oid="4y2uxz0"
                    >
                      {t("activeStudents")}
                    </p>
                    <p
                      className="text-brand dark:text-white text-2xl font-bold mt-1"
                      data-oid="w5qn-vb"
                    >
                      {students.length}
                    </p>
                  </div>
                  <div
                    className="p-3 bg-bland dark:bg-brand rounded-xl"
                    data-oid="bf2z7g:"
                  >
                    <Users
                      className="w-6 h-6 text-white dark:text-white"
                      data-oid="3ai-z6w"
                    />
                  </div>
                </div>
                <div
                  className="flex items-center mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium"
                  data-oid="kt72b6z"
                >
                  <Plus className="w-4 h-4 mr-1" data-oid="xv-oc3m" />
                  <span data-oid="em:ju04">{t("readyToLink")}</span>
                </div>
              </div>
              <div
                className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
                data-oid="wnz.x6e"
              >
                <div
                  className="flex items-center justify-between"
                  data-oid="cb69ytf"
                >
                  <div data-oid="btpj8w7">
                    <p
                      className="text-brand dark:text-brand text-sm font-medium"
                      data-oid=":uhoz7y"
                    >
                      {t("thisMonthSpent")}
                    </p>
                    <p
                      className="text-brand dark:text-white text-2xl font-bold mt-1"
                      data-oid="4ze3k:e"
                    >
                      {isBalanceVisible
                        ? `${students.reduce((sum, s) => sum + s.todaySpent, 0).toLocaleString()} RWF`
                        : "••••••"}
                    </p>
                  </div>
                  <div
                    className="p-3 dark:bg-brand rounded-xl bg-brand"
                    data-oid="6yn3qjf"
                  >
                    <ShoppingCart
                      className="w-6 h-6 dark:text-orange-400 text-[#FAF6F6]"
                      data-oid="xec6xx5"
                    />
                  </div>
                </div>
                <div
                  className="flex items-center mt-4 text-orange-600 dark:text-orange-400 text-sm font-medium"
                  data-oid=".g50:dq"
                >
                  <TrendingDown className="w-4 h-4 mr-1" data-oid="j37hh56" />
                  <span data-oid="roxgefp">-15% {t("vsLastMonth")}</span>
                </div>
              </div>
              <div
                className="bg-white dark:bg-white-950 border border-brand dark:border-brand rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
                data-oid="z00ju-n"
              >
                <div
                  className="flex items-center justify-between"
                  data-oid="ubmmnn."
                >
                  <div data-oid="0ypla18">
                    <p
                      className="text-brand dark:text-brand text-sm font-medium"
                      data-oid="q6:1q9_"
                    >
                      {t("todayActivity")}
                    </p>
                    <p
                      className="text-brand dark:text-white text-2xl font-bold mt-1"
                      data-oid="fr3wwb7"
                    >
                      {transactions.length}
                    </p>
                  </div>
                  <div
                    className="p-3 dark:bg-purple-900/30 rounded-xl bg-[#00000000]"
                    data-oid="o0kwiif"
                  >
                    <Activity
                      className="w-6 h-6 dark:text-purple-400 text-[#F3EFEF]"
                      data-oid="1-t8iaa"
                    />
                  </div>
                </div>
                <div
                  className="flex items-center mt-4 text-purple-600 dark:text-purple-400 text-sm font-medium"
                  data-oid="ud:yqur"
                >
                  <PieChart className="w-4 h-4 mr-1" data-oid=":t4zlal" />
                  <span data-oid="pko9g9h">{t("transactionsToday")}</span>
                </div>
              </div>
              <div class="h-200">

              </div>
            </div> */}
            {/* hhx */}
          </div>
        );

      case "wallet":
        return (
          <div
            ref={walletRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            data-oid="j2s6j6a"
          >
            <VirtualCard
              balance={balance}
              isVisible={isBalanceVisible}
              onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
              data-oid="95z4wt6"
            />

            <WalletSection
              balance={balance}
              isVisible={isBalanceVisible}
              onDeposit={() => setActiveModal("deposit")}
              onWithdraw={() => setActiveModal("withdraw")}
              onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
              data-oid="g1jx2-c"
            />
          </div>
        );

      case "students":
        return (
          <div ref={studentsRef} data-oid="_a8e:x7">
            <StudentsSection
              students={students}
              onViewTransactions={(student) => {
                setSelectedStudent(student);
                setActiveModal("studentTransactions");
              }}
              onSetLimits={handleSetLimits}
              data-oid="hi20rb:"
            />
          </div>
        );

      case "transactions":
        return (
          <div ref={transactionsRef} data-oid="xf__xff">
            <TransactionsSection
              transactions={transactions}
              onViewAll={() => setActiveModal("allTransactions")}
              data-oid="mb:d58n"
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
      // style={{
      //   backgroundImage: "url('/assets/background.png')",
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "cover",
      // }}
      style={{
        backgroundImage:
          "linear-gradient(45deg, rgba(4, 0, 255, 0.81) 0%, rgb(5, 9, 255) 24%,rgb(26, 26, 230) 24%, rgb(19, 19, 230) 28%,rgb(21, 0, 255) 28%, rgb(0, 21, 255) 40%,rgb(8, 0, 255) 40%, rgb(0, 0, 255) 84%,rgb(17, 0, 255) 84%, rgb(30, 0, 255) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
        backgroundBlendMode: "overlay,overlay,overlay,normal",
      }}
      data-oid="953wnnr"
    >
      <div
        className="sticky top-0 z-50 bg-white dark:bg-white-950 border-b border-brand shadow-sm"
        data-oid="bekm7eo"
      >
        <ModernNavbar
  tabs={tabs}
  activeTab={activeTab}
  handleTabChange={handleTabChange}
  isBalanceVisible={isBalanceVisible}
  setIsBalanceVisible={setIsBalanceVisible}
  isDark={isDark}
  toggleTheme={toggleTheme}
  currentLanguage={currentLanguage}
  languages={languages}
  language={language}
  setLanguage={setLanguage}
  showLanguageDropdown={showLanguageDropdown}
  setShowLanguageDropdown={setShowLanguageDropdown}
  showNotificationDropdown={showNotificationDropdown}
  setShowNotificationDropdown={setShowNotificationDropdown}
  showProfileDropdown={showProfileDropdown}
  setShowProfileDropdown={setShowProfileDropdown}
  setActiveModal={setActiveModal}
  handleLogout={handleLogout}
  t={t}
/>
      </div>
      <AdBanner data-oid="x000t0." />

      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-white-950 border-t border-brand dark:border-brand z-50"
        data-oid="okxz-u0"
      >
      
<div className="relative flex items-center justify-around py-3 px-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-200/20 dark:border-gray-700/20 shadow-lg">
  {/* Background Glow Effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-t-3xl"></div>
  
  {/* Active Tab Indicator */}
  <div 
    className="absolute top-0 h-1 bg-zinc-900 rounded-full transition-all duration-500 ease-out"
    style={{
      width: `${100 / tabs.length}%`,
      left: `${(tabs.findIndex(tab => tab.id === activeTab) * 100) / tabs.length}%`,
      transform: 'translateX(0%)'
    }}
  ></div>

  {tabs.map((tab, index) => {
    const IconComponent = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <button
        key={tab.id}
        onClick={() => handleTabChange(tab.id)}
        className={`relative flex flex-col items-center space-y-1.5 py-2.5 px-3 rounded-2xl transition-all duration-300 transform group ${
          isActive
            ? "text-blue-600 dark:text-blue-400 scale-110"
            : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 hover:scale-105 active:scale-95"
        }`}
        style={{
          minWidth: '60px',
          touchAction: 'manipulation'
        }}
      >
        {/* Active Background */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl animate-pulse"></div>
        )}
        
        {/* Icon Container with Animation */}
        <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
          isActive 
            ? "bg-zinc-900 shadow-lg shadow-blue-500/25" 
            : "group-hover:bg-gray-100 dark:group-hover:bg-gray-800/50"
        }`}>
          <IconComponent 
            className={`w-5 h-5 transition-all duration-300 ${
              isActive 
                ? "text-white" 
                : "group-hover:scale-110"
            }`}
          />
        </div>
        
        {/* Label with Slide Animation */}
        <span className={`relative z-10 text-xs font-semibold transition-all duration-300 ${
          isActive 
            ? "text-zinc-900 dark:text-blue-400 font-bold" 
            : "group-hover:text-blue-500 dark:group-hover:text-blue-300"
        }`}>
          {tab.label}
        </span>
        
        {/* Active Dot Indicator */}
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></div>
        )}
        
        {/* Ripple Effect on Touch */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 rounded-2xl scale-0 group-active:scale-100 transition-transform duration-200 ease-out"></div>
        </div>
      </button>
    );
  })}
  
  {/* Floating Action Button (Optional) */}
  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
    <button className="w-12 h-12 bg-zinc-900 rounded-full shadow-lg shadow-blue-500/25 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</div>
      </div>
      {activeModal === "profile" && (
        <ProfileModal onClose={() => setActiveModal(null)} data-oid="vw-3ij8" />
      )}
      {activeModal === "deposit" && (
        <VercelModal
          title={t("depositFunds")}
          onClose={() => setActiveModal(null)}
          onSubmit={handleDeposit}
          isLoading={isLoading}
          data-oid="a8b4xb5"
        >
          <div className="space-y-6" data-oid="4f-xl:1">
            <div data-oid="xkhailp">
              {<PaymentStatusListener data-oid="dovsag5" />}

              <label
                className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
                data-oid="br.huzj"
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
                data-oid="2lsyidp"
              />
            </div>
            <div data-oid="eblbe7n">
              <label
                className="block text-sm font-medium text-brand dark:text-green-300 mb-2"
                data-oid="5m9dd:7"
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
                data-oid="zacwkpj"
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
        <WithdrawModal
          data-oid="l5kt-j6"
          t={t}
          setActiveModal={setActiveModal}
          handleWithdraw={handleWithdraw}
          isLoading={isLoading}
          balance={balance}
        />
      )}
      {activeModal === "linkStudent" && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
          data-oid="nwcu6qr"
        >
          <div className="w-full bg-zinc-900 " data-oid="mxoomki">
            <AddStudentModal
              onSubmit={handleLinkStudent}
              isLoading={isLoading}
              csrfToken={csrfToken}
              parentPhone={parentPhone}
              onClose={() => setActiveModal(null)}
              data-oid="0yfu5rk"
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
          data-oid="vn_xcam"
        >
          <div className="space-y-6" data-oid="6f-72_p">
            <div
              className="flex items-center justify-between"
              data-oid="ynq21i8"
            >
              <div data-oid="tjk0d39">
                <h4
                  className="text-sm font-medium text-white-950 dark:text-white"
                  data-oid="uk-l_44"
                >
                  {t("notifications")}
                </h4>
                <p
                  className="text-sm text-brand0 dark:text-brand"
                  data-oid="lemr7qh"
                >
                  {t("receiveAlerts")}
                </p>
              </div>
              <button
                className="w-12 h-6 bg-blue-600 rounded-full relative"
                data-oid="d:8v0z."
              >
                <div
                  className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"
                  data-oid="y3-3e1r"
                ></div>
              </button>
            </div>
            <div
              className="flex items-center justify-between"
              data-oid="83rp64f"
            >
              <div data-oid="8c7rmwz">
                <h4
                  className="text-sm font-medium text-white-950 dark:text-white"
                  data-oid="fr:v3lj"
                >
                  {t("darkMode")}
                </h4>
                <p
                  className="text-sm text-brand0 dark:text-brand"
                  data-oid="etm9o09"
                >
                  {t("switchTheme")}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? "bg-blue-600" : "bg-green-300"}`}
                data-oid="5:_lkw_"
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isDark ? "right-0.5" : "left-0.5"}`}
                  data-oid="saj4su-"
                ></div>
              </button>
            </div>
            <div className="border-t dark:border-brand pt-4" data-oid="p6fm13k">
              <h4
                className="text-sm font-medium text-white-950 dark:text-white mb-2"
                data-oid="cyi-i2a"
              >
                {t("language")}
              </h4>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 border border-brand dark:border-brand bg-white dark:bg-white-950 text-white-950 dark:text-white rounded-lg"
                data-oid="ymjse9t"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} data-oid="t8pqd7t">
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
          data-oid="6t3wciu"
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
          data-oid="0455-w1"
        >
          <div
            className="max-h-96 overflow-y-auto space-y-3"
            data-oid="algmbvy"
          >
            {transactions
              .filter((tx) => tx.student === selectedStudent.name)
              .map((tx) => (
                <div
                  key={tx.id}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  data-oid="w8814tf"
                >
                  <div
                    className="flex items-center space-x-4"
                    data-oid="mwu4l2n"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                        tx.type === "deposit"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : tx.type === "withdraw"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      }`}
                      data-oid="xzcepq5"
                    >
                      {tx.type === "deposit" ? (
                        <TrendingUp className="w-5 h-5" data-oid="yolqn5v" />
                      ) : tx.type === "withdraw" ? (
                        <TrendingDown className="w-5 h-5" data-oid="k:w1c8d" />
                      ) : (
                        <ShoppingCart className="w-5 h-5" data-oid="um5_o8a" />
                      )}
                    </div>
                    <div className="flex-1" data-oid="tp3xj0p">
                      <p
                        className="text-gray-900 dark:text-white text-sm font-semibold mb-1"
                        data-oid="wjlrgq0"
                      >
                        {tx.title}
                      </p>
                      <p
                        className="text-gray-500 dark:text-gray-400 text-xs"
                        data-oid="ri49c0g"
                      >
                        {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right" data-oid="ii7v:bw">
                    <span
                      className={`text-sm font-bold ${tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      data-oid="18prrt4"
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {Math.abs(tx.amount).toLocaleString()} RWF
                    </span>
                    <div
                      className="flex items-center justify-end mt-1"
                      data-oid="odkpnnt"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          tx.status === "completed"
                            ? "bg-green-500"
                            : tx.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        data-oid="lh5p:rx"
                      ></div>
                      <span
                        className="text-xs text-gray-400 dark:text-gray-500 ml-1 capitalize"
                        data-oid="bhc4bz-"
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            {transactions.filter((tx) => tx.student === selectedStudent.name)
              .length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-12 text-center"
                data-oid="r8kxn0c"
              >
                <div
                  className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
                  data-oid=".7bm0_0"
                >
                  <Activity
                    className="w-8 h-8 text-gray-400 dark:text-gray-500"
                    data-oid="o6vox02"
                  />
                </div>
                <h4
                  className="text-gray-900 dark:text-white font-medium mb-2"
                  data-oid="7jptmto"
                >
                  No Transactions Found
                </h4>
                <p
                  className="text-gray-500 dark:text-gray-400 text-sm max-w-xs"
                  data-oid="-cejlyu"
                >
                  {t("noTransactions")}
                </p>
              </div>
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
          data-oid="0:hl2lf"
        >
          <div
            className="max-h-96 overflow-y-auto space-y-3"
            data-oid="iiliyij"
          >
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                data-oid="e8qs2a3"
              >
                <div className="flex items-center space-x-4" data-oid="ksbsbm2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                      tx.type === "deposit"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : tx.type === "withdraw"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    }`}
                    data-oid="5.35:dr"
                  >
                    {tx.type === "deposit" ? (
                      <TrendingUp className="w-5 h-5" data-oid="vb-0ff-" />
                    ) : tx.type === "withdraw" ? (
                      <TrendingDown className="w-5 h-5" data-oid="91ypfrc" />
                    ) : (
                      <ShoppingCart className="w-5 h-5" data-oid=":4wmlzp" />
                    )}
                  </div>
                  <div className="flex-1" data-oid="l854xe8">
                    <p
                      className="text-gray-900 dark:text-white text-sm font-semibold mb-1"
                      data-oid="zc19gr_"
                    >
                      {tx.title}
                    </p>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="2pj1vgy"
                    >
                      <p
                        className="text-gray-500 dark:text-gray-400 text-xs"
                        data-oid="y-f-lp4"
                      >
                        {tx.date}
                      </p>
                      {tx.student && (
                        <>
                          <span
                            className="text-gray-300 dark:text-gray-600"
                            data-oid="wlm5jbi"
                          >
                            •
                          </span>
                          <p
                            className="text-gray-500 dark:text-gray-400 text-xs"
                            data-oid="ug0onzz"
                          >
                            {tx.student}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right" data-oid="oav3edl">
                  <span
                    className={`text-sm font-bold ${tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    data-oid="qents:i"
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {Math.abs(tx.amount).toLocaleString()} RWF
                  </span>
                  <div
                    className="flex items-center justify-end mt-1"
                    data-oid="sb5hynd"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tx.status === "completed"
                          ? "bg-green-500"
                          : tx.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      data-oid="b7vmb5b"
                    ></div>
                    <span
                      className="text-xs text-gray-400 dark:text-gray-500 ml-1 capitalize"
                      data-oid="ukf.tic"
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-12 text-center"
                data-oid="rd0o5p."
              >
                <div
                  className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
                  data-oid="fjz:0-2"
                >
                  <Activity
                    className="w-8 h-8 text-gray-400 dark:text-gray-500"
                    data-oid="6frhgnj"
                  />
                </div>
                <h4
                  className="text-gray-900 dark:text-white font-medium mb-2"
                  data-oid="ghzfyua"
                >
                  No Transactions Found
                </h4>
                <p
                  className="text-gray-500 dark:text-gray-400 text-sm max-w-xs"
                  data-oid="po_5-58"
                >
                  {t("noTransactions")}
                </p>
              </div>
            )}
          </div>
        </VercelModal>
      )}
      <div className="fixed top-20 right-4 space-y-2 z-50" data-oid="4j3z-p9">
        {toasts.map((toast) => (
          <VercelToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            data-oid="4vmn_-k"
          />
        ))}
      </div>
      <div
        className="flex-1 p-6 pb-24 md:pb-6"
        data-oid="c1pazjp"
        key="olk-rcLk"
      >
        <div className="max-w-7xl mx-auto" data-oid="b8-w:d1">
          {renderTabContent()}
        </div>
      </div>
      {isLoading && <BinanceLoader data-oid="hs8grxk" />}
    </div>
  );
};
export default Index;
function useAppContext(): { setParentPhone2: any; } {
  throw new Error("Function not implemented.");
}

