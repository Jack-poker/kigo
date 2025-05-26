
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
        // Scrolling down - hide banner
        setIsScrollHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show banner
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
    <div className={`sticky top-0 z-40 transition-transform duration-300 ${isScrollHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="relative w-full bg-gradient-to-r from-red-50 via-yellow-50 via-green-50 to-blue-50 backdrop-blur-sm border-2 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden mb-2 sm:mb-6 mx-0 sm:mx-4">
        {/* Shimmer Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-yellow-100/30 via-green-100/30 to-blue-100/30 animate-pulse"></div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-none sm:rounded-3xl"></div>
        )}

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-6 h-6 sm:w-8 sm:h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-300 shadow-lg group"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
        </button>

        {/* Navigation Arrows (only show if multiple ads) */}
        {mockAds.length > 1 && (
          <>
            <button
              onClick={prevAd}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all duration-300 shadow-lg group"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              onClick={nextAd}
              className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all duration-300 shadow-lg group"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </>
        )}

        {/* Ad Content */}
        <div className="relative z-10 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row lg:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
            {/* Ad Image */}
            <div className="flex-shrink-0 w-full sm:w-32 lg:w-48 h-24 sm:h-20 lg:h-24 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl relative">
              <img
                src={currentAd.src}
                alt={currentAd.alt}
                onLoad={handleImageLoad}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Ad Text Content */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                {currentAd.title}
              </h3>
              {currentAd.subtitle && (
                <p className="text-gray-700 font-medium mb-2 sm:mb-4 text-xs sm:text-sm lg:text-base">
                  {currentAd.subtitle}
                </p>
              )}
              {currentAd.ctaText && (
                <button
                  onClick={() => currentAd.ctaLink && window.open(currentAd.ctaLink, '_blank')}
                  className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group text-sm sm:text-base"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{currentAd.ctaText}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Indicators (only show if multiple ads) */}
        {mockAds.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
            {mockAds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentAdIndex
                    ? 'bg-gradient-to-r from-red-500 to-blue-500 w-4 sm:w-6'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-br from-red-300/20 to-transparent rounded-full blur-xl sm:blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-tl from-blue-300/20 to-transparent rounded-full blur-xl sm:blur-2xl"></div>
      </div>
    </div>
  );
};

export default AdBanner;
