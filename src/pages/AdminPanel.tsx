import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Users,
  DollarSign,
  MessageSquare,
  RefreshCw,
  Settings,
  BarChart3,
  ShoppingBag,
  LogOut,
  User,
  AlertTriangle,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserManagement from "@/components/admin/UserManagement";
import TransactionManagement from "@/components/admin/TransactionManagement";
import AdManagement from "@/components/admin/AdManagement";
import AdminSettings from "@/components/admin/AdminSettings";
import ShopManagement from "@/components/admin/ShopManagement";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface Stats {
  total_users: number;
  total_transactions: number;
  total_revenue: number;
  active_ads: number;
  growth_rate?: number;
  recent_activity?: number;
}

interface TokenContextType {
  csrfToken: string;
  apiRequest: (
    method: string,
    endpoint: string,
    data?: any,
    options?: any,
  ) => Promise<any>;
  refreshToken: () => Promise<void>;
}

export const TokenContext = createContext<TokenContextType | null>(null);

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_transactions: 0,
    total_revenue: 0,
    active_ads: 0,
    growth_rate: 0,
    recent_activity: 0,
  });
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>("Admin User");
  const [adminAvatar, setAdminAvatar] = useState<string>("/admin-avatar.png");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const tokenExpiryTime = useRef<number | null>(null);
  const tokenRefreshInterval = useRef<NodeJS.Timeout | null>(null);
  const statsCache = useRef<{ data: Stats | null; timestamp: number | null }>({
    data: null,
    timestamp: null,
  });
  const tokenPromise = useRef<Promise<string | null> | null>(null);

  const API_BASE_URL = "https://api.kaascan.com";
  const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes
  const STATS_CACHE_TTL = 60 * 1000; // 1 minute

  // Check token validity
  const checkTokenValidity = useCallback(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return false;
    }

    try {
      const payload = token.split(".")[1];
      if (!payload) return false;
      const decodedPayload = JSON.parse(atob(payload));
      const expiryTime = decodedPayload.exp * 1000;
      tokenExpiryTime.current = expiryTime;

      if (Date.now() >= expiryTime) {
        toast({
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        localStorage.removeItem("adminToken");
        navigate("/login");
        return false;
      }

      const timeUntilRefresh = expiryTime - Date.now() - TOKEN_REFRESH_BUFFER;
      if (timeUntilRefresh > 0) {
        if (tokenRefreshInterval.current)
          clearTimeout(tokenRefreshInterval.current);
        tokenRefreshInterval.current = setTimeout(
          () => refreshToken(),
          timeUntilRefresh,
        );
      } else {
        refreshToken();
      }

      return true;
    } catch (err) {
      console.error("Error parsing token:", err);
      localStorage.removeItem("adminToken");
      navigate("/login");
      return false;
    }
  }, [navigate, toast]);

  // Fetch CSRF token
  const fetchCsrfToken = useCallback(async (): Promise<string | null> => {
    if (tokenPromise.current) {
      return tokenPromise.current;
    }

    tokenPromise.current = (async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/admin/get-csrf-token`,
          {
            withCredentials: true,
            timeout: 5000,
          },
        );
        const token = response.data.csrf_token;
        if (!token || typeof token !== "string")
          throw new Error("Invalid CSRF token");
        setCsrfToken(token);
        setError("");
        return token;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.detail || "Failed to fetch CSRF token";
        setError(`Authentication error: ${errorMsg}`);
        console.error("CSRF token error:", err);
        return null;
      } finally {
        tokenPromise.current = null;
      }
    })();

    return tokenPromise.current;
  }, [API_BASE_URL]);

  // Refresh auth token
  const refreshToken = useCallback(async () => {
    const currentToken = localStorage.getItem("adminToken");
    if (!currentToken || !checkTokenValidity()) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
          timeout: 5000,
        },
      );
      if (response.data?.token) {
        localStorage.setItem("adminToken", response.data.token);
        checkTokenValidity();
        const newCsrfToken = await fetchCsrfToken();
        if (!newCsrfToken) {
          throw new Error("Failed to fetch new CSRF token after refresh");
        }
      } else {
        throw new Error("Invalid token response");
      }
    } catch (err: any) {
      console.error("Token refresh failed:", err);
      toast({
        title: "Authentication Failed",
        description: "Please log in again.",
        variant: "destructive",
      });
      localStorage.removeItem("adminToken");
      navigate("/login");
    }
  }, [
    API_BASE_URL,
    csrfToken,
    navigate,
    toast,
    checkTokenValidity,
    fetchCsrfToken,
  ]);

  // API request wrapper
  const apiRequest = useCallback(
    async (
      method: string,
      endpoint: string,
      data: any = null,
      options: any = {},
    ) => {
      if (!checkTokenValidity()) return null;
      const token = localStorage.getItem("adminToken");
      if (!token || !csrfToken) {
        const newToken = await fetchCsrfToken();
        if (!newToken) return null;
      }

      try {
        const config = {
          method,
          url: `${API_BASE_URL}${endpoint}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
          timeout: options.timeout || 8000,
          ...options,
        };
        if (data && ["post", "put"].includes(method.toLowerCase()))
          config.data = data;
        const response = await axios(config);
        return response.data;
      } catch (err: any) {
        if (
          err.response?.status === 403 &&
          err.response?.data?.detail?.includes("CSRF")
        ) {
          const newToken = await fetchCsrfToken();
          if (newToken) {
            return apiRequest(method, endpoint, data, options);
          }
        }
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast({
            title: "Authentication Error",
            description: "Session expired.",
            variant: "destructive",
          });
          localStorage.removeItem("adminToken");
          navigate("/login");
        }
        throw err;
      }
    },
    [
      API_BASE_URL,
      csrfToken,
      checkTokenValidity,
      navigate,
      toast,
      fetchCsrfToken,
    ],
  );

  // Fetch admin profile
  const fetchAdminProfile = useCallback(async () => {
    if (!csrfToken) return;
    try {
      const profileData = await apiRequest("get", "/admin/profile");
      if (profileData) {
        setAdminName(profileData.name || "Admin User");
        if (profileData.avatar) setAdminAvatar(profileData.avatar);
      }
    } catch (err) {
      console.error("Failed to fetch admin profile:", err);
    }
  }, [csrfToken, apiRequest]);

  // Fetch stats
  const fetchStats = useCallback(
    async (forceRefresh = false) => {
      if (!csrfToken) return;
      try {
        const now = Date.now();
        if (
          !forceRefresh &&
          statsCache.current.data &&
          statsCache.current.timestamp &&
          now - statsCache.current.timestamp < STATS_CACHE_TTL
        ) {
          setStats(statsCache.current.data);
          setLoading(false);
          setRefreshing(false);
          return;
        }
        setLoading(true);
        const statsData = await apiRequest("get", "/admin/stats");
        if (statsData) {
          const enhancedStats = {
            ...statsData,
            growth_rate: statsData.growth_rate || Math.random() * 15,
            recent_activity:
              statsData.recent_activity || Math.floor(Math.random() * 60),
          };
          setStats(enhancedStats);
          statsCache.current = { data: enhancedStats, timestamp: Date.now() };
          setError("");
        } else {
          throw new Error("Invalid stats data");
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || "Failed to fetch stats";
        setError(errorMsg);
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [csrfToken, apiRequest],
  );

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize CSRF token
  useEffect(() => {
    if (!checkTokenValidity()) return;
    if (!csrfToken && !tokenPromise.current) {
      fetchCsrfToken();
    }
    return () => {
      if (tokenRefreshInterval.current)
        clearTimeout(tokenRefreshInterval.current);
    };
  }, [checkTokenValidity, fetchCsrfToken, csrfToken]);

  // Fetch data when CSRF token is available
  useEffect(() => {
    if (csrfToken) {
      fetchStats();
      fetchAdminProfile();
    }
  }, [csrfToken, fetchStats, fetchAdminProfile]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    const token = await fetchCsrfToken();
    if (token) await fetchStats(true);
  };

  // Handle logout
  const handleLogout = () => {
    if (tokenRefreshInterval.current)
      clearTimeout(tokenRefreshInterval.current);
    localStorage.removeItem("adminToken");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  // Loader component
  const Loader = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
      data-oid="ei1eo0f"
    >
      <div className="relative" data-oid="1s4sh8t">
        <div
          className="h-24 w-24 rounded-full border-t-4 border-b-4 border-green-500 animate-spin"
          data-oid="2w87ueq"
        ></div>
        <div
          className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-300 animate-spin absolute top-4 left-4"
          data-oid="zc9_7i6"
        ></div>
        <div
          className="h-8 w-8 rounded-full border-t-4 border-b-4 border-green-100 animate-spin absolute top-8 left-8"
          data-oid="sdp:ebh"
        ></div>
      </div>
      <div className="ml-4" data-oid="85rhb:d">
        <p className="text-green-700 font-medium text-lg" data-oid=":q0nlti">
          Loading
        </p>
        <p className="text-green-600/70 text-sm" data-oid="u3fajti">
          Preparing your dashboard...
        </p>
      </div>
    </motion.div>
  );

  // Error display
  const ErrorDisplay = ({ message }: { message: string }) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
      data-oid="obe2:rl"
    >
      <Alert
        className="bg-red-50 border border-red-200 text-red-800"
        data-oid="4qluwxw"
      >
        <AlertTriangle className="h-4 w-4 mr-2" data-oid="f.4noh:" />
        <AlertTitle className="font-semibold" data-oid="z77md27">
          Error
        </AlertTitle>
        <AlertDescription data-oid="vguf44b">{message}</AlertDescription>
      </Alert>
    </motion.div>
  );

  // Stat card
  const StatCard = ({
    title,
    value,
    icon,
    subtitle,
    trend = 0,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle: string;
    trend?: number;
  }) => (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      data-oid="ef96vgu"
    >
      <Card
        className="bg-white shadow-sm border border-green-100 hover:shadow-md transition-all overflow-hidden"
        data-oid="xapx097"
      >
        <div
          className="absolute top-0 right-0 h-20 w-20 bg-green-50 rounded-bl-full opacity-30"
          data-oid="y97jr8b"
        />

        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2"
          data-oid="ymhcw8_"
        >
          <CardTitle
            className="text-sm font-medium text-green-700"
            data-oid="9plu0gd"
          >
            {title}
          </CardTitle>
          <div
            className="h-8 w-8 rounded-full bg-green-100/80 flex items-center justify-center"
            data-oid="eu3ztt8"
          >
            {icon}
          </div>
        </CardHeader>
        <CardContent data-oid="mc-fdtb">
          <div className="text-2xl font-bold text-green-800" data-oid="1fo:ycs">
            {value}
          </div>
          <div className="flex items-center justify-between" data-oid="e_-sd:f">
            <p className="text-xs text-green-600/70" data-oid="ubhz45t">
              {subtitle}
            </p>
            {trend !== 0 && (
              <div
                className={`flex items-center text-xs ${trend > 0 ? "text-emerald-600" : "text-amber-600"}`}
                data-oid="fs0_7-5"
              >
                <ChevronUp
                  className={`h-3 w-3 ${trend < 0 ? "rotate-180" : ""}`}
                  data-oid="jkv-:ee"
                />

                <span data-oid="30na63:">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (!localStorage.getItem("adminToken")) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        data-oid="xvs8cht"
      >
        <Alert
          className="max-w-md bg-red-50 border border-red-200 text-red-800"
          data-oid="p9pwwv1"
        >
          <AlertDescription className="text-center py-4" data-oid="6zenxm:">
            Please log in to access the admin panel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <TokenContext.Provider
      value={{ csrfToken, apiRequest, refreshToken }}
      data-oid="wfx2i6j"
    >
      <div
        className="min-h-screen bg-gradient-to-b from-white to-green-50/30 p-6"
        data-oid=":a.v.sn"
      >
        <AnimatePresence data-oid="1pqj59a">
          {loading && !refreshing && <Loader data-oid="tbfoufu" />}
        </AnimatePresence>
        <div className="max-w-7xl mx-auto" data-oid="6vid5oe">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-center"
            data-oid="ub0xun-"
          >
            <div data-oid=".e6e:mj">
              <h1
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent"
                data-oid="ak3n6h8"
              >
                Admin Panel
              </h1>
              <p className="text-xl text-green-700/70" data-oid="_s69..w">
                Manage your student money transfer platform
              </p>
            </div>
            <div className="flex items-center space-x-4" data-oid="z0molz0">
              <Button
                onClick={handleRefresh}
                className="bg-green-600 hover:bg-green-700 text-white transition-all shadow-sm hover:shadow"
                disabled={refreshing || loading}
                data-oid="d.0zijk"
              >
                {refreshing ? (
                  <RefreshCw
                    className="w-4 h-4 mr-2 animate-spin"
                    data-oid="2zd9n83"
                  />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" data-oid="1aog7-:" />
                )}
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <DropdownMenu data-oid="mbatuq1">
                <DropdownMenuTrigger asChild data-oid="_8aeva9">
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    data-oid="hpckusa"
                  >
                    <Avatar
                      className="h-10 w-10 border-2 border-green-100 ring-2 ring-green-500/20"
                      data-oid="p591_fw"
                    >
                      <AvatarImage
                        src={adminAvatar}
                        alt={adminName}
                        data-oid="7dmc2jg"
                      />

                      <AvatarFallback
                        className="bg-green-100 text-green-800"
                        data-oid="umyl67:"
                      >
                        {adminName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  forceMount
                  data-oid="4:ksegb"
                >
                  <div
                    className="flex flex-col space-y-1 p-2"
                    data-oid="edhchw4"
                  >
                    <p
                      className="text-sm font-medium text-gray-900"
                      data-oid="yxaiv72"
                    >
                      {adminName}
                    </p>
                    <p className="text-xs text-gray-500" data-oid="xy:eavk">
                      Administrator
                    </p>
                  </div>
                  <DropdownMenuSeparator data-oid="v5x:j4k" />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/admin/profile")}
                    data-oid="..iefek"
                  >
                    <User className="mr-2 h-4 w-4" data-oid="swdp1k0" />
                    <span data-oid="a879ijm">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/admin/settings")}
                    data-oid="68uazs-"
                  >
                    <Settings className="mr-2 h-4 w-4" data-oid="6znaxp-" />
                    <span data-oid="wiyaib-">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator data-oid="p3:6mv9" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={handleLogout}
                    data-oid="tg0j0gm"
                  >
                    <LogOut className="mr-2 h-4 w-4" data-oid="3yuva8n" />
                    <span data-oid="l785f9n">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
          <AnimatePresence data-oid="8tgzizg">
            {error && <ErrorDisplay message={error} data-oid="pp19fe:" />}
          </AnimatePresence>
          <div className="grid md:grid-cols-4 gap-6 mb-8" data-oid="mcxf8u1">
            {refreshing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-4 text-center py-12 bg-green-50/50 border border-green-100 rounded-lg shadow-inner"
                data-oid="6ejeljz"
              >
                <RefreshCw
                  className="h-8 w-8 text-green-600 mx-auto animate-spin mb-4"
                  data-oid="fh6kmbm"
                />

                <p className="text-green-700" data-oid="4ys_hj7">
                  Refreshing dashboard statistics...
                </p>
              </motion.div>
            ) : (
              <>
                <StatCard
                  title="Total Users"
                  value={stats.total_users}
                  icon={
                    <Users
                      className="h-4 w-4 text-green-600"
                      data-oid="gn050a9"
                    />
                  }
                  subtitle="Parents & Students"
                  trend={stats.growth_rate || 0}
                  data-oid="sk__-fs"
                />

                <StatCard
                  title="Transactions"
                  value={stats.total_transactions}
                  icon={
                    <DollarSign
                      className="h-4 w-4 text-green-600"
                      data-oid="4p4ngs5"
                    />
                  }
                  subtitle="This month"
                  trend={3.2}
                  data-oid="78.5au7"
                />

                <StatCard
                  title="Revenue"
                  value={`$${stats.total_revenue}`}
                  icon={
                    <BarChart3
                      className="h-4 w-4 text-green-600"
                      data-oid="0.xa5pz"
                    />
                  }
                  subtitle="Total revenue"
                  trend={7.4}
                  data-oid="e:xy:z7"
                />

                <StatCard
                  title="Active Ads"
                  value={stats.active_ads}
                  icon={
                    <MessageSquare
                      className="h-4 w-4 text-green-600"
                      data-oid="8idgh5e"
                    />
                  }
                  subtitle="Currently running"
                  trend={-2.5}
                  data-oid="7vmveof"
                />
              </>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            data-oid="q2hizyg"
          >
            <Tabs defaultValue="users" className="space-y-6" data-oid="t25ouj4">
              <TabsList
                className="grid w-full grid-cols-5 bg-green-50 p-1 rounded-lg shadow-sm"
                data-oid="3i0gkdr"
              >
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid=".c2uan_"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="rdr-kfw"
                  >
                    <Users className="w-4 h-4" data-oid="qkh1132" />
                    <span data-oid="vjm8nbv">Users</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="cav53se"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="lzhit1t"
                  >
                    <DollarSign className="w-4 h-4" data-oid="d_va48v" />
                    <span data-oid="_ikove8">Transactions</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="ads"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="r6h34.a"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="o77p3po"
                  >
                    <MessageSquare className="w-4 h-4" data-oid="2y12-ps" />
                    <span data-oid="_mfd6p.">Ads</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="shop"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="cqcw:uy"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="y_u-d2o"
                  >
                    <ShoppingBag className="w-4 h-4" data-oid="trj6o77" />
                    <span data-oid="qv401ar">Shop</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="woswjni"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid=":56a8gj"
                  >
                    <Settings className="w-4 h-4" data-oid="yj0239e" />
                    <span data-oid="ah9xneq">Settings</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              <div
                className="bg-white border border-green-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
                data-oid="jml3hc8"
              >
                <TabsContent value="users" data-oid="tsm9rpy">
                  <UserManagement data-oid="ymi5s8y" />
                </TabsContent>
                <TabsContent value="transactions" data-oid="483k1o0">
                  <TransactionManagement data-oid="2:yel-4" />
                </TabsContent>
                <TabsContent value="ads" data-oid="8hvl1no">
                  <AdManagement data-oid="ft8fclg" />
                </TabsContent>
                <TabsContent value="shop" data-oid="lue0a2c">
                  <ShopManagement data-oid="ysuo4im" />
                </TabsContent>
                <TabsContent value="settings" data-oid="d0bfty9">
                  <AdminSettings data-oid="ze6ceev" />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
        <AnimatePresence data-oid="vbrmp:c">
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all z-50"
              data-oid="ktitr5e"
            >
              <ChevronUp className="h-6 w-6" data-oid="xo67b0i" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </TokenContext.Provider>
  );
};

export default AdminPanel;
