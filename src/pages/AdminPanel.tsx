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

  const API_BASE_URL = "http://localhost:8002";
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
      data-oid="-e:k9kh"
    >
      <div className="relative" data-oid="qs45-cx">
        <div
          className="h-24 w-24 rounded-full border-t-4 border-b-4 border-green-500 animate-spin"
          data-oid="o::38xq"
        ></div>
        <div
          className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-300 animate-spin absolute top-4 left-4"
          data-oid="p.mbywd"
        ></div>
        <div
          className="h-8 w-8 rounded-full border-t-4 border-b-4 border-green-100 animate-spin absolute top-8 left-8"
          data-oid="ltk2xo7"
        ></div>
      </div>
      <div className="ml-4" data-oid="5unp_dw">
        <p className="text-green-700 font-medium text-lg" data-oid="ek.cmv2">
          Loading
        </p>
        <p className="text-green-600/70 text-sm" data-oid="bk.3po-">
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
      data-oid="o57:6v9"
    >
      <Alert
        className="bg-red-50 border border-red-200 text-red-800"
        data-oid=":a55wpq"
      >
        <AlertTriangle className="h-4 w-4 mr-2" data-oid="-tzrd25" />
        <AlertTitle className="font-semibold" data-oid="z5dhbyl">
          Error
        </AlertTitle>
        <AlertDescription data-oid="n0-6de2">{message}</AlertDescription>
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
      data-oid="hcwxx9b"
    >
      <Card
        className="bg-white shadow-sm border border-green-100 hover:shadow-md transition-all overflow-hidden"
        data-oid="p6uo5e3"
      >
        <div
          className="absolute top-0 right-0 h-20 w-20 bg-green-50 rounded-bl-full opacity-30"
          data-oid="eo9yr8h"
        />

        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2"
          data-oid="au2i_f6"
        >
          <CardTitle
            className="text-sm font-medium text-green-700"
            data-oid="c7c5ymu"
          >
            {title}
          </CardTitle>
          <div
            className="h-8 w-8 rounded-full bg-green-100/80 flex items-center justify-center"
            data-oid="-r8.mx2"
          >
            {icon}
          </div>
        </CardHeader>
        <CardContent data-oid="6efucq2">
          <div className="text-2xl font-bold text-green-800" data-oid="s89b.7f">
            {value}
          </div>
          <div className="flex items-center justify-between" data-oid="kekojai">
            <p className="text-xs text-green-600/70" data-oid="4gbh0p5">
              {subtitle}
            </p>
            {trend !== 0 && (
              <div
                className={`flex items-center text-xs ${trend > 0 ? "text-emerald-600" : "text-amber-600"}`}
                data-oid="nrryx.w"
              >
                <ChevronUp
                  className={`h-3 w-3 ${trend < 0 ? "rotate-180" : ""}`}
                  data-oid="_:v2m85"
                />

                <span data-oid="9.27s9e">{Math.abs(trend)}%</span>
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
        data-oid="9htk:ft"
      >
        <Alert
          className="max-w-md bg-red-50 border border-red-200 text-red-800"
          data-oid="nq2zcuv"
        >
          <AlertDescription className="text-center py-4" data-oid="lfns16v">
            Please log in to access the admin panel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <TokenContext.Provider
      value={{ csrfToken, apiRequest, refreshToken }}
      data-oid="f_hpynu"
    >
      <div
        className="min-h-screen bg-gradient-to-b from-white to-green-50/30 p-6"
        data-oid="qjs.0d5"
      >
        <AnimatePresence data-oid="db-4zb1">
          {loading && !refreshing && <Loader data-oid="ltic15a" />}
        </AnimatePresence>
        <div className="max-w-7xl mx-auto" data-oid="zmm1hu-">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-center"
            data-oid="aig5_me"
          >
            <div data-oid="2:7uhcx">
              <h1
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent"
                data-oid="-y-r7:6"
              >
                Admin Panel
              </h1>
              <p className="text-xl text-green-700/70" data-oid="hdyz32e">
                Manage your student money transfer platform
              </p>
            </div>
            <div className="flex items-center space-x-4" data-oid="knbed_o">
              <Button
                onClick={handleRefresh}
                className="bg-green-600 hover:bg-green-700 text-white transition-all shadow-sm hover:shadow"
                disabled={refreshing || loading}
                data-oid="1pcwg3n"
              >
                {refreshing ? (
                  <RefreshCw
                    className="w-4 h-4 mr-2 animate-spin"
                    data-oid="8_c1arx"
                  />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" data-oid="5vo2kgb" />
                )}
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <DropdownMenu data-oid="088mfnc">
                <DropdownMenuTrigger asChild data-oid="gjuc9yn">
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    data-oid="9i85.af"
                  >
                    <Avatar
                      className="h-10 w-10 border-2 border-green-100 ring-2 ring-green-500/20"
                      data-oid="nz520ue"
                    >
                      <AvatarImage
                        src={adminAvatar}
                        alt={adminName}
                        data-oid="u_6lwyt"
                      />

                      <AvatarFallback
                        className="bg-green-100 text-green-800"
                        data-oid="o33kyzd"
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
                  data-oid="43d0sfj"
                >
                  <div
                    className="flex flex-col space-y-1 p-2"
                    data-oid="kcmlg2a"
                  >
                    <p
                      className="text-sm font-medium text-gray-900"
                      data-oid="2u0rn6l"
                    >
                      {adminName}
                    </p>
                    <p className="text-xs text-gray-500" data-oid="lont.l5">
                      Administrator
                    </p>
                  </div>
                  <DropdownMenuSeparator data-oid="z9mzray" />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/admin/profile")}
                    data-oid="v-i:kyt"
                  >
                    <User className="mr-2 h-4 w-4" data-oid="gdye17c" />
                    <span data-oid="xr9i88s">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/admin/settings")}
                    data-oid="rbcqp:7"
                  >
                    <Settings className="mr-2 h-4 w-4" data-oid="sr.6hkf" />
                    <span data-oid=":1nrx_n">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator data-oid="8ry4yhg" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={handleLogout}
                    data-oid="x:c:6lm"
                  >
                    <LogOut className="mr-2 h-4 w-4" data-oid="wsqx29b" />
                    <span data-oid="fxau9lg">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
          <AnimatePresence data-oid="8_c9p3q">
            {error && <ErrorDisplay message={error} data-oid="1m:3be3" />}
          </AnimatePresence>
          <div className="grid md:grid-cols-4 gap-6 mb-8" data-oid="ylc9vlh">
            {refreshing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-4 text-center py-12 bg-green-50/50 border border-green-100 rounded-lg shadow-inner"
                data-oid="w2a8_nd"
              >
                <RefreshCw
                  className="h-8 w-8 text-green-600 mx-auto animate-spin mb-4"
                  data-oid="5j0zxwh"
                />

                <p className="text-green-700" data-oid="kf2h7v_">
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
                      data-oid="a0qydtt"
                    />
                  }
                  subtitle="Parents & Students"
                  trend={stats.growth_rate || 0}
                  data-oid="ugu4ahc"
                />

                <StatCard
                  title="Transactions"
                  value={stats.total_transactions}
                  icon={
                    <DollarSign
                      className="h-4 w-4 text-green-600"
                      data-oid="iyl_egq"
                    />
                  }
                  subtitle="This month"
                  trend={3.2}
                  data-oid="pd3uhmy"
                />

                <StatCard
                  title="Revenue"
                  value={`$${stats.total_revenue}`}
                  icon={
                    <BarChart3
                      className="h-4 w-4 text-green-600"
                      data-oid="h3ps6zl"
                    />
                  }
                  subtitle="Total revenue"
                  trend={7.4}
                  data-oid="zjc8k68"
                />

                <StatCard
                  title="Active Ads"
                  value={stats.active_ads}
                  icon={
                    <MessageSquare
                      className="h-4 w-4 text-green-600"
                      data-oid="5b7c4hv"
                    />
                  }
                  subtitle="Currently running"
                  trend={-2.5}
                  data-oid="a7d8kq5"
                />
              </>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            data-oid="1j-2grg"
          >
            <Tabs defaultValue="users" className="space-y-6" data-oid="nm8hujf">
              <TabsList
                className="grid w-full grid-cols-5 bg-green-50 p-1 rounded-lg shadow-sm"
                data-oid="m5o29fk"
              >
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="qyddk8a"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="ugkj9ke"
                  >
                    <Users className="w-4 h-4" data-oid="ixif-0x" />
                    <span data-oid="f--xc8q">Users</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="9es-vwn"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="isqxk4k"
                  >
                    <DollarSign className="w-4 h-4" data-oid="d:oibp5" />
                    <span data-oid="d4uuobt">Transactions</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="ads"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="onud92w"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="nbqr4.v"
                  >
                    <MessageSquare className="w-4 h-4" data-oid=".xl3vof" />
                    <span data-oid="y6fj99h">Ads</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="shop"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="1y9imef"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="nz1lion"
                  >
                    <ShoppingBag className="w-4 h-4" data-oid="5pn:gw9" />
                    <span data-oid="1e5um8_">Shop</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all"
                  data-oid="w-w5-ty"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="f.q7ko."
                  >
                    <Settings className="w-4 h-4" data-oid="bjnk9ys" />
                    <span data-oid="yztf3cs">Settings</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              <div
                className="bg-white border border-green-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
                data-oid=".oarld_"
              >
                <TabsContent value="users" data-oid="4_3d9_s">
                  <UserManagement data-oid="hcr7_9p" />
                </TabsContent>
                <TabsContent value="transactions" data-oid="vwupv1e">
                  <TransactionManagement data-oid="dx04902" />
                </TabsContent>
                <TabsContent value="ads" data-oid="e8uprt4">
                  <AdManagement data-oid="rmf2p-:" />
                </TabsContent>
                <TabsContent value="shop" data-oid="ai3lefd">
                  <ShopManagement data-oid="emeg3wb" />
                </TabsContent>
                <TabsContent value="settings" data-oid="pmyt7z8">
                  <AdminSettings data-oid="d7f99fc" />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
        <AnimatePresence data-oid="g-z24it">
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all z-50"
              data-oid="xrfv8iq"
            >
              <ChevronUp className="h-6 w-6" data-oid=":qefz2e" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </TokenContext.Provider>
  );
};

export default AdminPanel;
