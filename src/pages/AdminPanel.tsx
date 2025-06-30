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
      data-oid="ltwusfb"
    >
      <div className="relative" data-oid="8qr3-xa">
        <div
          className="h-24 w-24 rounded-full border-t-4 border-b-4 border-green-500 animate-spin"
          data-oid=":svw9-r"
        ></div>
        <div
          className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-300 animate-spin absolute top-4 left-4"
          data-oid="rb:l0:q"
        ></div>
        <div
          className="h-8 w-8 rounded-full border-t-4 border-b-4 border-green-100 animate-spin absolute top-8 left-8"
          data-oid="jw.tv3t"
        ></div>
      </div>
      <div className="ml-4" data-oid="n148::0">
        <p className="text-green-700 font-medium text-lg" data-oid="egidfci">
          Loading
        </p>
        <p className="text-green-600/70 text-sm" data-oid="nj1v-gc">
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
      data-oid="hj77d4s"
    >
      <Alert
        className="bg-red-50 border border-red-200 text-red-800"
        data-oid="yod:b0l"
      >
        <AlertTriangle className="h-4 w-4 mr-2" data-oid="2v8bkjz" />
        <AlertTitle className="font-semibold" data-oid="9nr91zy">
          Error
        </AlertTitle>
        <AlertDescription data-oid="_rglrt1">{message}</AlertDescription>
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
      data-oid="f5o:sd1"
    >
      <Card
        className="bg-white shadow-sm border border-green-100 hover:shadow-md transition-all overflow-hidden"
        data-oid="m6ab7zi"
      >
        <div
          className="absolute top-0 right-0 h-20 w-20 bg-green-50 rounded-bl-full opacity-30"
          data-oid="k:b:2zg"
        />

        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2"
          data-oid="av8b_7m"
        >
          <CardTitle
            className="text-sm font-medium text-green-700"
            data-oid="394w9kt"
          >
            {title}
          </CardTitle>
          <div
            className="h-8 w-8 rounded-full bg-green-100/80 flex items-center justify-center"
            data-oid="2duaymy"
          >
            {icon}
          </div>
        </CardHeader>
        <CardContent data-oid="w5ow3ou">
          <div className="text-2xl font-bold text-green-800" data-oid="_x-t48i">
            {value}
          </div>
          <div className="flex items-center justify-between" data-oid="jyp2dvn">
            <p className="text-xs text-green-600/70" data-oid="8gccpp_">
              {subtitle}
            </p>
            {trend !== 0 && (
              <div
                className={`flex items-center text-xs ${trend > 0 ? "text-emerald-600" : "text-amber-600"}`}
                data-oid="pebyd0g"
              >
                <ChevronUp
                  className={`h-3 w-3 ${trend < 0 ? "rotate-180" : ""}`}
                  data-oid="mvb91ko"
                />

                <span data-oid="l483r09">{Math.abs(trend)}%</span>
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
        data-oid="7_n0td0"
      >
        <Alert
          className="max-w-md bg-red-50 border border-red-200 text-red-800"
          data-oid="3nstk2u"
        >
          <AlertDescription className="text-center py-4" data-oid="wwqnngt">
            Please log in to access the admin panel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <TokenContext.Provider
      value={{ csrfToken, apiRequest, refreshToken }}
      data-oid="rcvly0:"
    >
      <div
        className="min-h-screen bg-gradient-to-b from-white to-green-50/30 p-6"
        data-oid="b7dg.dm"
      >
        <AnimatePresence data-oid="5cld9mb">
          {loading && !refreshing && <Loader data-oid="6w767r." />}
        </AnimatePresence>
        <div className="max-w-7xl mx-auto" data-oid="riy8p_g">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-center"
            data-oid="00g_hmo"
          >
            <div data-oid="yxarwn_">
              <h1
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent"
                data-oid="43iwxnm"
              >
                Admin Panel
              </h1>
              <p className="text-xl text-green-700/70" data-oid="zmnyvv3">
                Manage your student money transfer platform
              </p>
            </div>
            <div className="flex items-center space-x-4" data-oid="fz.wrcf">
              <Button
                onClick={handleRefresh}
                className="bg-green-600 hover:bg-green-700 text-white transition-all shadow-sm hover:shadow"
                disabled={refreshing || loading}
                data-oid="lvu1g41"
              >
                {refreshing ? (
                  <RefreshCw
                    className="w-4 h-4 mr-2 animate-spin"
                    data-oid="9z2t7kz"
                  />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" data-oid="w7h_di-" />
                )}
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <DropdownMenu data-oid="3z_wx0g">
                <DropdownMenuTrigger asChild data-oid="6isc5mh">
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    data-oid="kxrsh0z"
                  >
                    <Avatar
                      className="h-10 w-10 border-2 border-green-100 ring-2 ring-green-500/20"
                      data-oid="j-u7ui8"
                    >
                      <AvatarImage
                        src={adminAvatar}
                        alt={adminName}
                        data-oid="49.d3.g"
                      />

                      <AvatarFallback
                        className="bg-green-100 text-green-800"
                        data-oid="52d1w8k"
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
                  data-oid="rcu_5uf"
                >
                  <div
                    className="flex flex-col space-y-1 p-2"
                    data-oid="b3dlqn:"
                  >
                    <p
                      className="text-sm font-medium text-gray-900"
                      data-oid="dfgcxuo"
                    >
                      {adminName}
                    </p>
                    <p className="text-xs text-gray-500" data-oid="ffgt3u1">
                      Administrator
                    </p>
                  </div>
                  <DropdownMenuSeparator data-oid="f-i47f2" />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/admin/profile")}
                    data-oid="xf0s_px"
                  >
                    <User className="mr-2 h-4 w-4" data-oid="q5bx.ok" />
                    <span data-oid="f89i9y3">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/admin/settings")}
                    data-oid="3a1.947"
                  >
                    <Settings className="mr-2 h-4 w-4" data-oid="p090_lu" />
                    <span data-oid="p16ype7">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator data-oid="apxh9ez" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={handleLogout}
                    data-oid="v:c.tke"
                  >
                    <LogOut className="mr-2 h-4 w-4" data-oid="wj9rrju" />
                    <span data-oid="kpbeb-e">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
          <AnimatePresence data-oid="fu3o-v7">
            {error && <ErrorDisplay message={error} data-oid="d0.t1e9" />}
          </AnimatePresence>
          <div className="grid md:grid-cols-4 gap-6 mb-8" data-oid="s3k:.ll">
            {refreshing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-4 text-center py-12 bg-green-50/50 border border-green-100 rounded-lg shadow-inner"
                data-oid="wcf04kj"
              >
                <RefreshCw
                  className="h-8 w-8 text-green-600 mx-auto animate-spin mb-4"
                  data-oid="7:pp6ac"
                />

                <p className="text-green-700" data-oid=":ufkd1i">
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
                      data-oid="u86yh.5"
                    />
                  }
                  subtitle="Parents & Students"
                  trend={stats.growth_rate || 0}
                  data-oid="w1.4snb"
                />

                <StatCard
                  title="Transactions"
                  value={stats.total_transactions}
                  icon={
                    <DollarSign
                      className="h-4 w-4 text-green-600"
                      data-oid="bukp8u7"
                    />
                  }
                  subtitle="This month"
                  trend={3.2}
                  data-oid="tluutuk"
                />

                <StatCard
                  title="Revenue"
                  value={`$${stats.total_revenue}`}
                  icon={
                    <BarChart3
                      className="h-4 w-4 text-green-600"
                      data-oid="r1vy09d"
                    />
                  }
                  subtitle="Total revenue"
                  trend={7.4}
                  data-oid="d:qe173"
                />

                <StatCard
                  title="Active Ads"
                  value={stats.active_ads}
                  icon={
                    <MessageSquare
                      className="h-4 w-4 text-green-600"
                      data-oid="ziv49w."
                    />
                  }
                  subtitle="Currently running"
                  trend={-2.5}
                  data-oid="0e.d4fq"
                />
              </>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            data-oid="wacee9p"
          >
            <Tabs defaultValue="users" className="space-y-6" data-oid="_v5tb3b">
              <TabsList
                className="grid w-full grid-cols-5 bg-green-50 p-1 rounded-lg shadow-sm"
                data-oid="wjjnnsg"
              >
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="_vx75.8"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="1401gjp"
                  >
                    <Users className="w-4 h-4" data-oid="l5b::5t" />
                    <span data-oid="51jy83o">Users</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="qg.9p--"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="shlop2e"
                  >
                    <DollarSign className="w-4 h-4" data-oid="-kruc.6" />
                    <span data-oid="e.ujzlx">Transactions</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="ads"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="o-ohidt"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="43_u8ii"
                  >
                    <MessageSquare className="w-4 h-4" data-oid="pqbtvhu" />
                    <span data-oid=":oy1grc">Ads</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="shop"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="zmh:6f2"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="nmrvecd"
                  >
                    <ShoppingBag className="w-4 h-4" data-oid="c_s50qu" />
                    <span data-oid="pbhq1r_">Shop</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid=":3pm5:6"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="o5kfh:9"
                  >
                    <Settings className="w-4 h-4" data-oid="vl4c5mk" />
                    <span data-oid="xj09lqx">Settings</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              <div
                className="bg-white border border-green-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
                data-oid="7pcny4-"
              >
                <TabsContent value="users" data-oid="413pn.6">
                  <UserManagement data-oid="2sl4xgi" />
                </TabsContent>
                <TabsContent value="transactions" data-oid="5aatf6w">
                  <TransactionManagement data-oid="y84mkta" />
                </TabsContent>
                <TabsContent value="ads" data-oid="z7obrjx">
                  <AdManagement data-oid="16gqhbk" />
                </TabsContent>
                <TabsContent value="shop" data-oid="48vd23j">
                  <ShopManagement data-oid="0f4t:m3" />
                </TabsContent>
                <TabsContent value="settings" data-oid="dh4f6eo">
                  <AdminSettings data-oid="e851z1s" />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
        <AnimatePresence data-oid="-i6xqjk">
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all z-50"
              data-oid="bv:kvoc"
            >
              <ChevronUp className="h-6 w-6" data-oid="iuotylg" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </TokenContext.Provider>
  );
};

export default AdminPanel;
