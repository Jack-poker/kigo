import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import process from "process";

interface Ad {
  ad_id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  status: string;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
}

// Custom logger with emojis
const logger = {
  info: (msg: string, ...args: any[]) => console.log(`ℹ️ ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`❌ ${msg}`, ...args),
  success: (msg: string, ...args: any[]) => console.log(`✅ ${msg}`, ...args),
};

// API configuration
const API_CONFIG = {
  BASE_URL: "http://localhost:8001",
  TIMEOUT: 15000, // 15 seconds
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
  TOKEN_REFRESH_INTERVAL: 1000 * 60 * 14, // 14 minutes (assuming 15 min token expiry)
};

const AdManagement: React.FC = () => {
  // State variables
  const [ads, setAds] = useState<Ad[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<Partial<Ad>>({ status: "active" });
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [isFetchingToken, setIsFetchingToken] = useState<boolean>(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showEmptyState, setShowEmptyState] = useState<boolean>(false);

  // Refs
  const tokenRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tokenPromiseRef = useRef<Promise<string | null> | null>(null);
  const retryAttemptsRef = useRef<number>(0);
  const maxRetryAttemptsRef = useRef<number>(API_CONFIG.MAX_RETRIES);

  // Circuit breaker pattern
  const [circuitOpen, setCircuitOpen] = useState<boolean>(false);
  const circuitResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cache
  const cacheRef = useRef<{
    ads?: { data: Ad[]; timestamp: number };
    token?: { value: string; timestamp: number };
  }>({});

  // Constants
  const CACHE_TTL = 60000; // 1 minute cache

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (tokenRefreshTimerRef.current) {
        clearInterval(tokenRefreshTimerRef.current);
      }
      if (circuitResetTimeoutRef.current) {
        clearTimeout(circuitResetTimeoutRef.current);
      }
    };
  }, []);

  // Reset circuit breaker after timeout
  const resetCircuitBreaker = useCallback(() => {
    if (circuitOpen) {
      circuitResetTimeoutRef.current = setTimeout(() => {
        logger.info("Circuit breaker reset");
        setCircuitOpen(false);
        retryAttemptsRef.current = 0;
      }, 30000); // 30 seconds timeout before trying again
    }
  }, [circuitOpen]);

  // Fetch CSRF token with enhanced retry logic and circuit breaker
  const fetchCsrfToken = useCallback(
    async (force: boolean = false): Promise<string | null> => {
      // Check if circuit is open
      if (circuitOpen) {
        logger.error("Circuit breaker open, skipping token fetch");
        setError(
          "API service is currently unavailable. Please try again later.",
        );
        return null;
      }

      // Check cache first if not forcing refresh
      if (
        !force &&
        cacheRef.current.token &&
        Date.now() - cacheRef.current.token.timestamp < CACHE_TTL
      ) {
        logger.info("Using cached CSRF token");
        return cacheRef.current.token.value;
      }

      // If already fetching, return existing promise
      if (isFetchingToken && tokenPromiseRef.current) {
        logger.info("Waiting for existing token fetch");
        return tokenPromiseRef.current;
      }

      setIsFetchingToken(true);
      tokenPromiseRef.current = (async () => {
        const maxRetries = API_CONFIG.MAX_RETRIES;
        const baseDelay = API_CONFIG.RETRY_DELAY;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            logger.info(`Fetching CSRF token (attempt ${attempt})`);

            // Use AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(
              () => controller.abort(),
              API_CONFIG.TIMEOUT,
            );

            const response = await axios.get(
              `${API_CONFIG.BASE_URL}/admin/get-csrf-token`,
              {
                withCredentials: true,
                signal: controller.signal,
              },
            );

            clearTimeout(timeoutId);

            const token = response.data.csrf_token;
            if (!token || typeof token !== "string") {
              throw new Error("Invalid CSRF token received");
            }

            // Update cache
            cacheRef.current.token = {
              value: token,
              timestamp: Date.now(),
            };

            logger.success("CSRF token fetched successfully");
            setCsrfToken(token);
            setError("");
            retryAttemptsRef.current = 0; // Reset retry counter on success

            // Schedule token refresh
            if (tokenRefreshTimerRef.current) {
              clearInterval(tokenRefreshTimerRef.current);
            }

            tokenRefreshTimerRef.current = setInterval(() => {
              logger.info("Background token refresh");
              fetchCsrfToken(true).catch((err) => {
                logger.error("Background token refresh failed:", err);
              });
            }, API_CONFIG.TOKEN_REFRESH_INTERVAL);

            return token;
          } catch (err: any) {
            // Clear timeout if it exists
            clearTimeout(tokenRefreshTimerRef.current!);

            // Handle timeout errors
            if (axios.isCancel(err)) {
              logger.error("CSRF token request timed out");
              const errorMsg =
                "Request timed out. Please check your connection.";
              setError(errorMsg);

              // Increment retry counter
              retryAttemptsRef.current++;

              // Open circuit breaker if too many failures
              if (retryAttemptsRef.current >= maxRetryAttemptsRef.current) {
                logger.error(
                  "Circuit breaker triggered after multiple failures",
                );
                setCircuitOpen(true);
                resetCircuitBreaker();
                return null;
              }

              if (attempt === maxRetries) {
                return null;
              }

              // Exponential backoff
              const delay = baseDelay * Math.pow(2, attempt - 1);
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }

            const errorMsg =
              err.response?.data?.detail || "Failed to fetch CSRF token";
            logger.error(`CSRF token error (attempt ${attempt}):`, errorMsg);

            // Increment retry counter
            retryAttemptsRef.current++;

            // Open circuit breaker if too many failures
            if (retryAttemptsRef.current >= maxRetryAttemptsRef.current) {
              logger.error("Circuit breaker triggered after multiple failures");
              setCircuitOpen(true);
              resetCircuitBreaker();
              setError(
                "API service is currently unavailable. Please try again later.",
              );
              return null;
            }

            if (attempt === maxRetries) {
              setError(errorMsg);
              return null;
            }

            // Exponential backoff
            const delay = baseDelay * Math.pow(2, attempt - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
        return null;
      })();

      try {
        const token = await tokenPromiseRef.current;
        return token;
      } finally {
        setIsFetchingToken(false);
        tokenPromiseRef.current = null;
      }
    },
    [isFetchingToken, circuitOpen, resetCircuitBreaker],
  );

  // Make API call with enhanced token validation
  const makeApiCall = useCallback(
    async (config: any) => {
      // Check if circuit is open
      if (circuitOpen) {
        throw new Error(
          "API service is currently unavailable. Please try again later.",
        );
      }

      let token = csrfToken;
      if (!token) {
        logger.info("No CSRF token, fetching new one");
        token = await fetchCsrfToken();
        if (!token) {
          throw new Error("Unable to obtain CSRF token");
        }
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        "X-CSRF-Token": token,
        ...config.headers,
      };

      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT,
      );

      try {
        const response = await axios({
          ...config,
          headers,
          withCredentials: true,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (err: any) {
        clearTimeout(timeoutId);

        // Handle timeout
        if (axios.isCancel(err)) {
          logger.error("Request timed out");
          throw new Error("Request timed out. Please check your connection.");
        }

        // Handle CSRF token errors
        if (
          err.response?.status === 403 &&
          err.response?.data?.detail?.includes("CSRF")
        ) {
          logger.error("Invalid CSRF token, refreshing");
          setCsrfToken("");
          token = await fetchCsrfToken(true); // Force refresh
          if (!token) {
            throw new Error("Unable to refresh CSRF token");
          }

          const retryHeaders = {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "X-CSRF-Token": token,
            ...config.headers,
          };

          // Use new AbortController for retry
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(
            () => retryController.abort(),
            API_CONFIG.TIMEOUT,
          );

          try {
            const response = await axios({
              ...config,
              headers: retryHeaders,
              withCredentials: true,
              signal: retryController.signal,
            });
            clearTimeout(retryTimeoutId);
            return response;
          } catch (retryErr) {
            clearTimeout(retryTimeoutId);
            throw retryErr;
          }
        }
        throw err;
      }
    },
    [csrfToken, fetchCsrfToken, circuitOpen],
  );

  // Fetch ads with caching
  const fetchAds = useCallback(
    async (skipCache: boolean = false) => {
      try {
        setLoading(true);

        // Check cache first if not skipping
        if (
          !skipCache &&
          cacheRef.current.ads &&
          Date.now() - cacheRef.current.ads.timestamp < CACHE_TTL
        ) {
          logger.info("Using cached ads data");
          setAds(cacheRef.current.ads.data);
          setLoading(false);
          setShowEmptyState(cacheRef.current.ads.data.length === 0);
          return;
        }

        logger.info("Fetching ads");
        const response = await makeApiCall({
          method: "GET",
          url: `${API_CONFIG.BASE_URL}/admin/ads`,
        });

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid ads data received");
        }

        // Update cache
        cacheRef.current.ads = {
          data: response.data,
          timestamp: Date.now(),
        };

        setAds(response.data);
        setShowEmptyState(response.data.length === 0);
        setError("");
        logger.success(`Ads fetched successfully: ${response.data.length} ads`);
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.detail || err.message || "Failed to fetch ads";
        setError(errorMsg);
        logger.error("Ads fetch error:", errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [makeApiCall],
  );

  // Initial CSRF token fetch
  useEffect(() => {
    if (!csrfToken && !isFetchingToken) {
      fetchCsrfToken();
    }
  }, [fetchCsrfToken, csrfToken, isFetchingToken]);

  // Fetch ads when CSRF token is available
  useEffect(() => {
    if (csrfToken) {
      fetchAds();
    }
  }, [csrfToken, fetchAds]);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create or update ad
  const handleCreateOrUpdateAd = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    // Validation
    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date > formData.end_date
    ) {
      setError("End date must be after start date");
      logger.error("Invalid date range");
      return;
    }

    if (
      !formData.title ||
      !formData.cta_text ||
      !formData.cta_link ||
      !formData.image_url ||
      !formData.start_date ||
      !formData.end_date
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      logger.info(editingAdId ? "Updating ad" : "Creating ad");
      const response = await makeApiCall({
        method: editingAdId ? "PUT" : "POST",
        url: editingAdId
          ? `${API_CONFIG.BASE_URL}/admin/ads/${editingAdId}`
          : `${API_CONFIG.BASE_URL}/admin/ads`,
        data: formData,
      });

      if (editingAdId) {
        setAds(
          ads.map((ad: Ad) => (ad.ad_id === editingAdId ? response.data : ad)),
        );
        setEditingAdId(null);
      } else {
        setAds([...ads, response.data]);
      }

      // Update cache
      if (cacheRef.current.ads) {
        cacheRef.current.ads.data = editingAdId
          ? cacheRef.current.ads.data.map((ad: Ad) =>
              ad.ad_id === editingAdId ? response.data : ad,
            )
          : [...cacheRef.current.ads.data, response.data];
      }

      setFormData({ status: "active" });
      setError("");
      setShowEmptyState(false);
      logger.success("Ad saved successfully");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || err.message || "Failed to save ad";
      setError(errorMsg);
      logger.error("Ad save error:", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit ad
  const handleEditAd = (ad: Ad) => {
    setFormData({
      title: ad.title,
      subtitle: ad.subtitle,
      cta_text: ad.cta_text,
      cta_link: ad.cta_link,
      image_url: ad.image_url,
      status: ad.status,
      start_date: ad.start_date.split("T")[0],
      end_date: ad.end_date.split("T")[0],
    });
    setEditingAdId(ad.ad_id);
    logger.info(`Editing ad: ${ad.ad_id}`);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle toggle status with enhanced retry logic
  const handleToggleStatus = async (ad_id: string, currentStatus: string) => {
    if (!ad_id || !ads.some((ad: Ad) => ad.ad_id === ad_id)) {
      setError("Ad not found locally");
      logger.error(`Ad not found locally: ${ad_id}`);
      return;
    }

    if (isTogglingStatus) {
      logger.info(`Toggle status in progress for ad: ${ad_id}`);
      return;
    }

    setIsTogglingStatus(true);
    const newStatus = currentStatus === "active" ? "paused" : "active";
    const retries = API_CONFIG.MAX_RETRIES;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.info(`Toggling status for ad: ${ad_id} (attempt ${attempt})`);

        // Optimistic UI update
        setAds(
          ads.map((ad: Ad) => {
            if (ad.ad_id === ad_id) {
              return { ...ad, status: newStatus };
            }
            return ad;
          }),
        );

        const response = await makeApiCall({
          method: "PUT",
          url: `${API_CONFIG.BASE_URL}/admin/ads/${ad_id}/status`,
          data: { status: newStatus },
        });

        // Update with actual server response
        setAds(ads.map((ad: Ad) => (ad.ad_id === ad_id ? response.data : ad)));

        // Update cache
        if (cacheRef.current.ads) {
          cacheRef.current.ads.data = cacheRef.current.ads.data.map((ad: Ad) =>
            ad.ad_id === ad_id ? response.data : ad,
          );
        }

        setError("");
        logger.success(`Ad status updated to ${newStatus}`);
        break;
      } catch (err: any) {
        // Revert optimistic update on error
        setAds(
          ads.map((ad: Ad) => {
            if (ad.ad_id === ad_id) {
              return { ...ad, status: currentStatus };
            }
            return ad;
          }),
        );

        const errorMsg =
          err.response?.data?.detail ||
          err.message ||
          "Failed to toggle ad status";

        if (err.response?.status === 404 && attempt === retries) {
          setError("Ad not found on server");
          logger.error(`Ad not found on server: ${ad_id}`);
          await fetchAds(true); // Skip cache
          break;
        } else if (attempt === retries) {
          setError(errorMsg);
          logger.error(`Ad status error: ${errorMsg}`);
          break;
        }

        // Exponential backoff
        const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    setIsTogglingStatus(false);
  };

  // Handle delete ad
  const handleDeleteAd = async (ad_id: string) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      logger.info(`Deleting ad: ${ad_id}`);

      // Optimistic UI update
      const previousAds = [...ads];
      setAds(ads.filter((ad: Ad) => ad.ad_id !== ad_id));

      await makeApiCall({
        method: "DELETE",
        url: `${API_CONFIG.BASE_URL}/admin/ads/${ad_id}`,
      });

      // Update cache
      if (cacheRef.current.ads) {
        cacheRef.current.ads.data = cacheRef.current.ads.data.filter(
          (ad: Ad) => ad.ad_id !== ad_id,
        );
      }

      setError("");
      setShowEmptyState(ads.length <= 1); // If we just deleted the last ad
      logger.success("Ad deleted successfully");
    } catch (err: any) {
      // Revert optimistic update on error
      const previousAds = [...ads];
      setAds(previousAds);

      const errorMsg =
        err.response?.data?.detail || err.message || "Failed to delete ad";
      setError(errorMsg);
      logger.error("Ad delete error:", errorMsg);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    logger.info("Refreshing data");
    const token = await fetchCsrfToken(true); // Force refresh token
    if (token) {
      await fetchAds(true); // Skip cache
    }
  };

  // Loader component
  const Loader = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-oid="4dni:t4"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
        data-oid="i.mfbx9"
      >
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"
          data-oid="sc0jrd-"
        ></div>
        <p className="text-gray-700 font-semibold" data-oid="vyklf:9">
          Loading...
        </p>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div
      className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md"
      data-oid="5uldm2i"
    >
      <svg
        className="w-32 h-32 text-green-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        data-oid="h3cl9c4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          data-oid="zw64y.e"
        ></path>
      </svg>
      <h3 className="text-xl font-bold text-gray-800 mb-2" data-oid=".e5uje8">
        No Ads Available
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md" data-oid="dhrfzct">
        You haven't created any ads yet. Create your first ad to start promoting
        your content.
      </p>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        data-oid="589_pz_"
      >
        Create Your First Ad
      </button>
    </div>
  );

  // Error display component
  const ErrorDisplay = ({ message }: { message: string }) => (
    <div
      className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md"
      data-oid="xe0-unz"
    >
      <div className="flex items-center" data-oid="i4anb_f">
        <div className="flex-shrink-0" data-oid=":f26uhr">
          <svg
            className="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            data-oid="-coeej8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              data-oid="fu173qp"
            />
          </svg>
        </div>
        <div className="ml-3" data-oid="wjo5385">
          <p className="text-sm text-red-700" data-oid="byxedms">
            {message}
          </p>
        </div>
        <div className="ml-auto pl-3" data-oid="hujibra">
          <div className="-mx-1.5 -my-1.5" data-oid=":5x-48b">
            <button
              onClick={() => setError("")}
              className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              data-oid="h0lnai6"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                data-oid="wk8jx4n"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                  data-oid="0q82b9o"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="container mx-auto p-4 bg-gray-50 min-h-screen"
      data-oid="sr1_4vd"
    >
      {/* Loading overlay */}
      {loading && <Loader data-oid="0_xqqgw" />}

      {/* Header */}
      <div
        className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md"
        data-oid="wkei5o."
      >
        <div data-oid="3-hluic">
          <h2 className="text-2xl font-bold text-gray-800" data-oid="t_fmjsd">
            Ad Management
          </h2>
          <p className="text-sm text-gray-500" data-oid="d:v:ssl">
            Create and manage your advertising campaigns
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || isFetchingToken}
          className={`flex items-center px-4 py-2 rounded-md transition duration-300 ${loading || isFetchingToken ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
          data-oid="iowvr0w"
        >
          <svg
            className={`w-4 h-4 mr-2 ${loading || isFetchingToken ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-oid="apibck-"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              data-oid="oew:isg"
            ></path>
          </svg>
          Refresh
        </button>
      </div>

      {/* Error display */}
      {error && <ErrorDisplay message={error} data-oid="b3cxpl6" />}

      {/* Ad creation/editing form */}
      <div
        className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300"
        data-oid="r5er:07"
      >
        <h3
          className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2"
          data-oid="9ijg:pr"
        >
          {editingAdId ? "Edit Advertisement" : "Create New Advertisement"}
        </h3>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          data-oid=":u3iqf7"
        >
          <div className="space-y-4" data-oid="bbjp5_:">
            <div data-oid="78e5d46">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="title"
                data-oid="qg3w:tm"
              >
                Title*
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                placeholder="Enter ad title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                data-oid="0ea78ib"
              />
            </div>

            <div data-oid="j1zn2p9">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="subtitle"
                data-oid="1hwas7."
              >
                Subtitle
              </label>
              <input
                id="subtitle"
                type="text"
                name="subtitle"
                value={formData.subtitle || ""}
                onChange={handleInputChange}
                placeholder="Enter ad subtitle"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                data-oid="ek-yyte"
              />
            </div>

            <div data-oid="wogqnnl">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="cta_text"
                data-oid="fu-8ors"
              >
                CTA Text*
              </label>
              <input
                id="cta_text"
                type="text"
                name="cta_text"
                value={formData.cta_text || ""}
                onChange={handleInputChange}
                placeholder="e.g., Learn More, Buy Now"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                data-oid="w5y5a:r"
              />
            </div>

            <div data-oid=".ngwr29">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="cta_link"
                data-oid="1pt:3yk"
              >
                CTA Link*
              </label>
              <input
                id="cta_link"
                type="url"
                name="cta_link"
                value={formData.cta_link || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/landing-page"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                data-oid="m4cv7e-"
              />
            </div>
          </div>

          <div className="space-y-4" data-oid="1up537g">
            <div data-oid="safqar2">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="image_url"
                data-oid="l02pjnq"
              >
                Image URL*
              </label>
              <input
                id="image_url"
                type="url"
                name="image_url"
                value={formData.image_url || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/ad-image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                data-oid="r5vn_kz"
              />
            </div>

            <div className="grid grid-cols-2 gap-4" data-oid="s0dih-:">
              <div data-oid="-_qsnhm">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="start_date"
                  data-oid="4hwwvkc"
                >
                  Start Date*
                </label>
                <input
                  id="start_date"
                  type="date"
                  name="start_date"
                  value={formData.start_date || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  data-oid="c6.30mp"
                />
              </div>

              <div data-oid="4vq:iu2">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="end_date"
                  data-oid="z1n7jn:"
                >
                  End Date*
                </label>
                <input
                  id="end_date"
                  type="date"
                  name="end_date"
                  value={formData.end_date || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  data-oid="yfjfv7r"
                />
              </div>
            </div>

            {editingAdId && (
              <div data-oid="se8w:yd">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="status"
                  data-oid="bp9w51u"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || "active"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  data-oid="s0ee2ih"
                >
                  <option value="active" data-oid="7k1qq3u">
                    Active
                  </option>
                  <option value="paused" data-oid="-yi6x.j">
                    Paused
                  </option>
                  <option value="scheduled" data-oid="bcbgxfh">
                    Scheduled
                  </option>
                </select>
              </div>
            )}

            {formData.image_url && (
              <div className="mt-2" data-oid="341bjg2">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-oid="xd0pz.5"
                >
                  Image Preview
                </label>
                <div
                  className="border rounded-md overflow-hidden h-32 bg-gray-100 flex items-center justify-center"
                  data-oid="mm1srf3"
                >
                  <img
                    src={formData.image_url}
                    alt="Ad preview"
                    className="max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x150?text=Invalid+Image+URL";
                    }}
                    data-oid="phqmdtc"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-3" data-oid="jyg0.wq">
          <button
            onClick={handleCreateOrUpdateAd}
            disabled={isSubmitting}
            className={`flex items-center px-4 py-2 rounded-md transition duration-300 ${isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
            data-oid="wjbkcm9"
          >
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                data-oid="7tj1p00"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  data-oid="n5ohc6a"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  data-oid="r5p9hkw"
                ></path>
              </svg>
            )}
            {editingAdId ? "Update Ad" : "Create Ad"}
          </button>

          {editingAdId && (
            <button
              onClick={() => {
                setFormData({ status: "active" });
                setEditingAdId(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300"
              data-oid="t_gdkig"
            >
              Cancel
            </button>
          )}

          <p className="text-xs text-gray-500 ml-auto" data-oid="s7uj_q-">
            * Required fields
          </p>
        </div>
      </div>

      {/* Ads table or empty state */}
      {!loading &&
        !error &&
        (showEmptyState || ads.length === 0 ? (
          <EmptyState data-oid="f5fjq8l" />
        ) : (
          <div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            data-oid="fkjeqxn"
          >
            <div className="overflow-x-auto" data-oid="wm5qhk6">
              <table
                className="min-w-full divide-y divide-gray-200"
                data-oid="umzf95x"
              >
                <thead className="bg-gray-50" data-oid="izw3_f3">
                  <tr data-oid="bps-3ao">
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      data-oid="ovhff4e"
                    >
                      Ad Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      data-oid="-6ki47b"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      data-oid="xfwpyol"
                    >
                      Performance
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      data-oid="slhgl3l"
                    >
                      Timeline
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      data-oid="gqrqtpq"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="bg-white divide-y divide-gray-200"
                  data-oid="pp9qxbz"
                >
                  {ads.map((ad: Ad) => (
                    <tr
                      key={ad.ad_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                      data-oid="408k-05"
                    >
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        data-oid="pi4l4jb"
                      >
                        <div className="flex items-center" data-oid="pbkz:g1">
                          <div
                            className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden"
                            data-oid="a3vnyfb"
                          >
                            <img
                              className="h-10 w-10 object-cover"
                              src={ad.image_url}
                              alt={ad.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/40?text=Error";
                              }}
                              data-oid="i_6f76w"
                            />
                          </div>
                          <div className="ml-4" data-oid="kzcqcha">
                            <div
                              className="text-sm font-medium text-gray-900"
                              data-oid="xmv:6.:"
                            >
                              {ad.title}
                            </div>
                            <div
                              className="text-sm text-gray-500"
                              data-oid="junpfij"
                            >
                              {ad.subtitle}
                            </div>
                            <div
                              className="text-xs text-blue-500 hover:underline"
                              data-oid="qmcwl-w"
                            >
                              <a
                                href={ad.cta_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-oid="70qmqyk"
                              >
                                {ad.cta_text}
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        data-oid="bb9i5xl"
                      >
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.status === "active" ? "bg-green-100 text-green-800" : ad.status === "paused" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}
                          data-oid="-gxq6u9"
                        >
                          {ad.status.charAt(0).toUpperCase() +
                            ad.status.slice(1)}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        data-oid="14o778s"
                      >
                        <div
                          className="text-sm text-gray-900"
                          data-oid="4qvvolr"
                        >
                          <div className="flex items-center" data-oid="ndknd0i">
                            <svg
                              className="w-4 h-4 text-gray-400 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              data-oid="7b4q1x8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                data-oid=".y825c-"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                data-oid="df.5x61"
                              ></path>
                            </svg>
                            {(ad.impressions || 0).toLocaleString()}
                          </div>
                        </div>
                        <div
                          className="text-sm text-gray-900"
                          data-oid="620qwh."
                        >
                          <div className="flex items-center" data-oid="uu:r:2h">
                            <svg
                              className="w-4 h-4 text-gray-400 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              data-oid=":-y0zh1"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                data-oid="mt3u7r5"
                              ></path>
                            </svg>
                            {(ad.clicks || 0).toLocaleString()}
                          </div>
                        </div>
                        {ad.impressions > 0 && (
                          <div
                            className="text-xs text-gray-500"
                            data-oid="gm9peb2"
                          >
                            CTR:{" "}
                            {((ad.clicks / ad.impressions) * 100).toFixed(2)}%
                          </div>
                        )}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        data-oid="y33.bqb"
                      >
                        <div data-oid="p6cq7ru">
                          Start: {new Date(ad.start_date).toLocaleDateString()}
                        </div>
                        <div data-oid="jwpnvka">
                          End: {new Date(ad.end_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        data-oid="8eym_0a"
                      >
                        <div className="flex space-x-2" data-oid="m-li67x">
                          <button
                            onClick={() => handleEditAd(ad)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-1 rounded-md transition-colors duration-150"
                            title="Edit"
                            data-oid=".ddgx6f"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              data-oid="-l6tj:h"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                data-oid="0-g55ix"
                              ></path>
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(ad.ad_id, ad.status)
                            }
                            disabled={isTogglingStatus}
                            className={`${ad.status === "active" ? "text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100" : "text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100"} p-1 rounded-md transition-colors duration-150`}
                            title={
                              ad.status === "active" ? "Pause" : "Activate"
                            }
                            data-oid="kixj9h0"
                          >
                            {ad.status === "active" ? (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                data-oid="kp84umv"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  data-oid="3wx3rw."
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                data-oid="k3gwvmj"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                  data-oid=":.6:g5y"
                                ></path>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  data-oid="3aj6e3."
                                ></path>
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteAd(ad.ad_id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded-md transition-colors duration-150"
                            title="Delete"
                            data-oid="68ezp95"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              data-oid="m8ad__-"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                data-oid="nkloh0v"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdManagement;
