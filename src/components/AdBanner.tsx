
import React, { useState, useEffect } from 'react';

interface AdData {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const mockAds: AdData[] = [
  {
    src: "/placeholder.svg",
    alt: "Premium Service",
    title: "Discover Premium Features",
    subtitle: "Unlock the full potential of our platform",
    ctaText: "Get Started",
    ctaLink: "#"
  },
  {
    src: "/placeholder.svg", 
    alt: "Special Offer",
    title: "Limited Time Offer",
    subtitle: "Save 50% on all premium plans",
    ctaText: "Claim Offer",
    ctaLink: "#"
  }
];

const AdBanner = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentAd = mockAds[currentAdIndex];

  // Auto-rotate ads
  useEffect(() => {
    if (mockAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % mockAds.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  // Scroll detection for hide/show
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollHidden(currentScrollY > lastScrollY && currentScrollY > 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={`sticky top-0 z-40 transition-all duration-500 ease-in-out px-2 sm:px-4 ${isScrollHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
      <div className={`relative w-full max-w-7xl mx-auto mb-4 sm:mb-6 rounded-3xl sm:rounded-[2rem] overflow-hidden backdrop-blur-xl transition-all duration-300 hover:shadow-2xl group ${
        isDark 
          ? 'bg-emerald-900/20 border border-emerald-600/30 shadow-emerald-500/20' 
          : 'bg-white/70 border border-emerald-100 shadow-emerald-200/50'
      }`}>
        
        {/* Enhanced Glass Effect Background */}
        <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-br from-emerald-50/30 via-white/40 to-emerald-100/30"></div>
        
        {/* Animated Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>

        {/* Glass Reflections */}
        <div className="absolute -inset-[400px] bg-gradient-radial from-emerald-200/20 via-transparent to-transparent blur-2xl transform rotate-45"></div>

        {/* Content Container with Enhanced Glass Effect */}
        <div className="relative z-10 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Enhanced Image Container */}
            <div className="flex-shrink-0 w-full sm:w-48 md:w-56 h-24 sm:h-32 md:h-36 rounded-2xl overflow-hidden shadow-xl relative group/image">
              <img
                src={currentAd.src}
                alt={currentAd.alt}
                onLoad={handleImageLoad}
                className="w-full h-full object-cover transition-all duration-700 group-hover/image:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent opacity-60"></div>
            </div>

            {/* Enhanced Text Content */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 ${
                isDark ? 'text-emerald-50' : 'text-emerald-800'
              }`}>
                {currentAd.title}
              </h3>
              {currentAd.subtitle && (
                <p className={`font-medium mb-4 sm:mb-5 text-sm sm:text-base lg:text-lg ${
                  isDark ? 'text-emerald-200' : 'text-emerald-600'
                }`}>
                  {currentAd.subtitle}
                </p>
              )}
              {currentAd.ctaText && (
                <button
                  onClick={() => currentAd.ctaLink && window.open(currentAd.ctaLink, '_blank')}
                  className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    isDark 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-emerald-500/25' 
                      : 'bg-gradient-to-r from-emerald-400 to-green-300 text-white shadow-emerald-300/25'
                  }`}
                >
                  <span className="relative z-10">{currentAd.ctaText}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Progress Indicators */}
        {mockAds.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {mockAds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${
                  index === currentAdIndex
                    ? `w-8 sm:w-10 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`
                    : `w-2 sm:w-3 ${isDark ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-emerald-200 hover:bg-emerald-300'}`
                }`}
              />
            ))}
          </div>
        )}

        {/* Enhanced Decorative Elements */}
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-20 bg-emerald-300"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 bg-green-300"></div>
      </div>
    </div>
  );
};

export default AdBanner;