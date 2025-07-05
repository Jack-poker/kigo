import React, { useState, useEffect } from "react";
import axios from "axios";

interface AdData {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const AdBanner: React.FC = () => {
  const [ads, setAds] = useState<AdData[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const currentAd = ads[currentAdIndex];

  // Fetch CSRF token with retry logic
  const fetchCsrfToken = async (
    retries = 3,
    delay = 1000,
  ): Promise<string | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(
          "http://localhost:8002/admin/get-csrf-token",
          {
            withCredentials: true, // Send session_id cookie
          },
        );
        console.log("CSRF Token:", response.data.csrf_token); // Debug
        setCsrfToken(response.data.csrf_token);
        setError("");
        return response.data.csrf_token;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.detail || "Failed to fetch CSRF token";
        console.error(`CSRF token error (attempt ${attempt}):`, err);
        if (attempt === retries) {
          setError(errorMsg);
          return null;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return null;
  };

  // Fetch active ads
  const fetchAds = async () => {
    if (!csrfToken) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8002/admin/ads/active",
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true, // Send session_id cookie
        },
      );
      // Map backend Ad to AdData
      const mappedAds: AdData[] = response.data.map((ad: any) => ({
        src: ad.image_url,
        alt: ad.title,
        title: ad.title,
        subtitle: ad.subtitle,
        ctaText: ad.cta_text,
        ctaLink: ad.cta_link,
      }));
      setAds(mappedAds);
      setLoading(false);
      setError("");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to fetch ads";
      setError(errorMsg);
      console.error("Ads fetch error:", err);
      setLoading(false);
    }
  };

  // Initial CSRF token fetch
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  // Fetch ads when CSRF token is available
  useEffect(() => {
    if (csrfToken) {
      fetchAds();
    }
  }, [csrfToken]);

  // Auto-rotate ads
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  // Scroll detection for hide/show
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollHidden(currentScrollY > lastScrollY && currentScrollY > 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    const token = await fetchCsrfToken();
    if (token) {
      await fetchAds();
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className={`sticky top-0 z-40 transition-all duration-500 ease-in-out px-2 sm:px-4 ${isScrollHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
      data-oid="6x17sla"
    >
      <div
        className={`relative w-full max-w-7xl mx-auto mb-4 sm:mb-6 rounded-3xl sm:rounded-[2rem] overflow-hidden backdrop-blur-xl transition-all duration-300 group ${
          isDark
            ? "bg-brand border border-emerald-600/30 shadow-emerald-500/20"
            : "bg-orange"
        }`}
        data-oid="zb:m.n5"
      >
        {/* Enhanced Glass Effect Background */}
        <div className="absolute inset-0 " data-oid="5wnc6ry"></div>

        {/* Animated Shimmer Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
          data-oid="l98royw"
        ></div>

        {/* Glass Reflections */}
        <div
          className="absolute -inset-[400px] bg-gradient-radial from-emerald-200/20 via-transparent to-transparent blur-2xl transform rotate-45"
          data-oid="xka.n48"
        ></div>

        {/* Content Container with Enhanced Glass Effect */}
        <div className="relative z-10 p-4 sm:p-8" data-oid="wsyd5pm">
          {error ? (
            <div
              className={`text-center text-sm ${isDark ? "text-red-400" : "text-red-500"}`}
              data-oid="ninj8b0"
            >
              {error}
            </div>
          ) : loading ? (
            <div
              className={`text-center text-sm ${isDark ? "text-emerald-200" : "text-emerald-600"}`}
              data-oid=":_yy0z3"
            >
              Loading ads...
            </div>
          ) : ads.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center text-center text-sm ${isDark ? "text-emerald-200" : "text-emerald-600"}`}
              data-oid="cw68x-i"
            >
              <div className="w-32 h-32 mx-auto mb-2" data-oid="5iu0mzg">
                <img
                  src="/assets/Wallet-bro.svg"
                  alt="No ads illustration"
                  className="w-full h-full object-contain"
                  draggable={false}
                  data-oid="ha4304x"
                />
              </div>
              No active ads
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-2" data-oid="74p723_">
                <button
                  onClick={handleRefresh}
                  className={`inline-flex items-center px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    isDark ? "bg-brand text-white" : "bg-brand text-white"
                  }`}
                  data-oid="xf5jx4j"
                >
                  Refresh Ads
                </button>
              </div>
              <div
                className="flex flex-col sm:flex-row items-center gap-6"
                data-oid="0-fj4t7"
              >
                {/* Enhanced Image Container */}
                <div
                  className="flex-shrink-0 w-full sm:w-48 md:w-56 h-24 sm:h-32 md:h-36 rounded-2xl overflow-hidden shadow-xl relative group/image"
                  data-oid="fv6q26t"
                >
                  <img
                    src={currentAd.src}
                    alt={currentAd.alt}
                    onLoad={handleImageLoad}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/224x144?text=Ad+Image";
                    }}
                    className="w-full h-full object-cover transition-all duration-700 group-hover/image:scale-110"
                    data-oid="271wk1p"
                  />

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent opacity-60"
                    data-oid="mt5kqu9"
                  ></div>
                </div>

                {/* Enhanced Text Content */}
                <div
                  className="flex-1 text-center sm:text-left min-w-0"
                  data-oid="1-b8h:1"
                >
                  <h3
                    className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 ${
                      isDark ? "text-white" : "text-white"
                    }`}
                    data-oid="l98.j_z"
                  >
                    {currentAd.title}
                  </h3>
                  {currentAd.subtitle && (
                    <p
                      className={`font-medium mb-4 sm:mb-5 text-sm sm:text-base lg:text-lg ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                      data-oid=".0sssin"
                    >
                      {currentAd.subtitle}
                    </p>
                  )}
                  {currentAd.ctaText && (
                    <button
                      onClick={() =>
                        currentAd.ctaLink &&
                        window.open(currentAd.ctaLink, "_blank")
                      }
                      className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                        isDark ? "bg-brand text-white" : "bg-brand text-white"
                      }`}
                      data-oid="26y13v7"
                    >
                      <span className="relative z-10" data-oid="2:2p:3:">
                        {currentAd.ctaText}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Progress Indicators */}
        {ads.length > 1 && !loading && !error && ads.length > 0 && (
          <div
            className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20"
            data-oid="do-r053"
          >
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${
                  index === currentAdIndex
                    ? `w-8 sm:w-10 ${isDark ? "bg-emerald-400" : "bg-emerald-500"}`
                    : `w-2 sm:w-3 ${isDark ? "bg-emerald-700 hover:bg-emerald-600" : "bg-emerald-200 hover:bg-emerald-300"}`
                }`}
                data-oid="822b7z1"
              />
            ))}
          </div>
        )}

        {/* Enhanced Decorative Elements */}
        <div
          className="absolute top-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-20 bg-emerald-300"
          data-oid="q6hnjo-"
        ></div>
        <div
          className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 bg-green-300"
          data-oid="h-_oc57"
        ></div>
      </div>
    </div>
  );
};

export default AdBanner;
