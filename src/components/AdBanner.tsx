
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
    <div className={`sticky top-0 z-40 transition-all duration-500 ease-in-out ${isScrollHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
      <div className={`relative w-full mx-4 mb-6 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl group ${
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
          <div className={`absolute inset-0 rounded-2xl animate-pulse ${
            isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'
          }`}></div>
        )}

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm group/close ${
            isDark 
              ? 'bg-gray-800/60 text-gray-300 hover:bg-red-600/80 hover:text-white border border-gray-600/30' 
              : 'bg-white/70 text-gray-600 hover:bg-red-500/80 hover:text-white border border-gray-300/30'
          }`}
        >
          <X className="w-4 h-4 group-hover/close:scale-110 transition-transform duration-200" />
        </button>

        {/* Navigation Arrows */}
        {mockAds.length > 1 && (
          <>
            <button
              onClick={prevAd}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm group/nav ${
                isDark 
                  ? 'bg-gray-800/60 text-gray-300 hover:bg-blue-600/80 hover:text-white border border-gray-600/30' 
                  : 'bg-white/70 text-gray-600 hover:bg-blue-500/80 hover:text-white border border-gray-300/30'
              }`}
            >
              <ChevronLeft className="w-5 h-5 group-hover/nav:scale-110 transition-transform duration-200" />
            </button>
            <button
              onClick={nextAd}
              className={`absolute right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm group/nav ${
                isDark 
                  ? 'bg-gray-800/60 text-gray-300 hover:bg-blue-600/80 hover:text-white border border-gray-600/30' 
                  : 'bg-white/70 text-gray-600 hover:bg-blue-500/80 hover:text-white border border-gray-300/30'
              }`}
            >
              <ChevronRight className="w-5 h-5 group-hover/nav:scale-110 transition-transform duration-200" />
            </button>
          </>
        )}

        {/* Ad Content */}
        <div className="relative z-10 p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Ad Image */}
            <div className="flex-shrink-0 w-full sm:w-48 h-28 rounded-xl overflow-hidden shadow-xl relative group/image">
              <img
                src={currentAd.src}
                alt={currentAd.alt}
                onLoad={handleImageLoad}
                className="w-full h-full object-cover transition-all duration-500 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
            </div>

            {/* Ad Text Content */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className={`text-xl lg:text-2xl font-bold mb-2 transition-colors duration-300 ${
                isDark 
                  ? 'text-white' 
                  : 'text-gray-800'
              }`}>
                {currentAd.title}
              </h3>
              {currentAd.subtitle && (
                <p className={`font-medium mb-4 text-sm lg:text-base transition-colors duration-300 ${
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
                  className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/cta ${
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {mockAds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentAdIndex
                    ? `w-6 ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`
                    : `w-2 ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`
                }`}
              />
            ))}
          </div>
        )}

        {/* Decorative Elements */}
        <div className={`absolute top-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-20 ${
          isDark ? 'bg-blue-500' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 ${
          isDark ? 'bg-purple-500' : 'bg-purple-300'
        }`}></div>
      </div>
    </div>
  );
};

export default AdBanner;
