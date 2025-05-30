
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface AdContent {
  id: string;
  type: 'image' | 'gif' | 'svg';
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

// Mock admin ads data - in real app this would come from admin panel
const mockAds: AdContent[] = [
  {
    id: '1',
    type: 'image',
    src: '/api/placeholder/800/200',
    alt: 'School Lunch Program',
    title: 'New Healthy Lunch Menu! 🍎',
    subtitle: 'Nutritious meals starting next week',
    ctaText: 'Learn More',
    ctaLink: '#'
  },
  {
    id: '2',
    type: 'image',
    src: '/api/placeholder/800/200',
    alt: 'Parent Meeting',
    title: 'Parent-Teacher Conference 📚',
    subtitle: 'Schedule your meeting today',
    ctaText: 'Book Now',
    ctaLink: '#'
  }
];

const AdBanner = () => {
  const { isDark } = useTheme();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const currentAd = mockAds[currentAdIndex];

  // Auto-rotate ads every 8 seconds
  useEffect(() => {
    if (mockAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % mockAds.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, []);

  // Handle scroll to hide/show banner
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsScrollHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrollHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const nextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % mockAds.length);
  };

  const prevAd = () => {
    setCurrentAdIndex((prev) => (prev - 1 + mockAds.length) % mockAds.length);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!isVisible || mockAds.length === 0) return null;

  return (
    <div className={`sticky top-0 z-40 transition-all duration-500 ease-in-out px-2 sm:px-4 ${isScrollHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
      <div className={`relative w-full max-w-7xl mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl group ${
        isDark 
          ? 'bg-gray-900/40 border border-gray-700/50 shadow-xl' 
          : 'bg-white/60 border border-gray-200/50 shadow-lg'
      }`}>
        
        {/* Animated Background Gradient */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${
          isDark 
            ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20' 
            : 'bg-gradient-to-br from-blue-50/60 via-purple-50/60 to-indigo-50/60'
        }`}></div>
        
        {/* Shimmer Effect */}
        <div className={`absolute inset-0 opacity-30 ${
          isDark 
            ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' 
            : 'bg-gradient-to-r from-transparent via-white/40 to-transparent'
        } animate-shimmer`}></div>

        {/* Loading State */}
        {isLoading && (
          <div className={`absolute inset-0 rounded-xl sm:rounded-2xl animate-pulse ${
            isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'
          }`}></div>
        )}

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm group/close ${
            isDark 
              ? 'bg-gray-800/60 text-gray-300 hover:bg-red-600/80 hover:text-white border border-gray-600/30' 
              : 'bg-white/70 text-gray-600 hover:bg-red-500/80 hover:text-white border border-gray-300/30'
          }`}
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4 group-hover/close:scale-110 transition-transform duration-200" />
        </button>

        {/* Navigation Arrows - Hidden on mobile */}
        {mockAds.length > 1 && (
          <>
            <button
              onClick={prevAd}
              className={`hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm group/nav ${
                isDark 
                  ? 'bg-gray-800/60 text-gray-300 hover:bg-blue-600/80 hover:text-white border border-gray-600/30' 
                  : 'bg-white/70 text-gray-600 hover:bg-blue-500/80 hover:text-white border border-gray-300/30'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover/nav:scale-110 transition-transform duration-200" />
            </button>
            <button
              onClick={nextAd}
              className={`hidden sm:flex absolute right-10 sm:right-16 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm group/nav ${
                isDark 
                  ? 'bg-gray-800/60 text-gray-300 hover:bg-blue-600/80 hover:text-white border border-gray-600/30' 
                  : 'bg-white/70 text-gray-600 hover:bg-blue-500/80 hover:text-white border border-gray-300/30'
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/nav:scale-110 transition-transform duration-200" />
            </button>
          </>
        )}

        {/* Ad Content */}
        <div className="relative z-10 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
            {/* Ad Image */}
            <div className="flex-shrink-0 w-full sm:w-40 md:w-48 h-20 sm:h-24 md:h-28 rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl relative group/image">
              <img
                src={currentAd.src}
                alt={currentAd.alt}
                onLoad={handleImageLoad}
                className="w-full h-full object-cover transition-all duration-500 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
            </div>

            {/* Ad Text Content */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 transition-colors duration-300 leading-tight ${
                isDark 
                  ? 'text-white' 
                  : 'text-gray-800'
              }`}>
                {currentAd.title}
              </h3>
              {currentAd.subtitle && (
                <p className={`font-medium mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base transition-colors duration-300 leading-tight ${
                  isDark 
                    ? 'text-gray-300' 
                    : 'text-gray-600'
                }`}>
                  {currentAd.subtitle}
                </p>
              )}
              {currentAd.ctaText && (
                <button
                  onClick={() => currentAd.ctaLink && window.open(currentAd.ctaLink, '_blank')}
                  className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/cta ${
                    isDark 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{currentAd.ctaText}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        {mockAds.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
            {mockAds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentAdIndex
                    ? `w-4 sm:w-6 ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`
                    : `w-1.5 sm:w-2 ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`
                }`}
              />
            ))}
          </div>
        )}

        {/* Decorative Elements - Smaller on mobile */}
        <div className={`absolute top-0 left-0 w-16 h-16 sm:w-32 sm:h-32 rounded-full blur-xl sm:blur-2xl opacity-20 ${
          isDark ? 'bg-blue-500' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute bottom-0 right-0 w-16 h-16 sm:w-32 sm:h-32 rounded-full blur-xl sm:blur-2xl opacity-20 ${
          isDark ? 'bg-purple-500' : 'bg-purple-300'
        }`}></div>
      </div>
    </div>
  );
};

export default AdBanner;
