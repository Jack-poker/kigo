
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
    <div className="relative w-full bg-gradient-to-r from-red-50 via-yellow-50 via-green-50 to-blue-50 backdrop-blur-sm border-2 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 rounded-3xl shadow-2xl overflow-hidden mb-6">
      {/* Shimmer Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-yellow-100/30 via-green-100/30 to-blue-100/30 animate-pulse"></div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-3xl"></div>
      )}

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-300 shadow-lg group"
      >
        <X className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Navigation Arrows (only show if multiple ads) */}
      {mockAds.length > 1 && (
        <>
          <button
            onClick={prevAd}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all duration-300 shadow-lg group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button
            onClick={nextAd}
            className="absolute right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all duration-300 shadow-lg group"
          >
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </>
      )}

      {/* Ad Content */}
      <div className="relative z-10 p-6">
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Ad Image */}
          <div className="flex-shrink-0 w-full lg:w-48 h-32 lg:h-24 rounded-2xl overflow-hidden shadow-xl relative">
            <img
              src={currentAd.src}
              alt={currentAd.alt}
              onLoad={handleImageLoad}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Ad Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {currentAd.title}
            </h3>
            {currentAd.subtitle && (
              <p className="text-gray-700 font-medium mb-4 text-sm lg:text-base">
                {currentAd.subtitle}
              </p>
            )}
            {currentAd.ctaText && (
              <button
                onClick={() => currentAd.ctaLink && window.open(currentAd.ctaLink, '_blank')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group"
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {mockAds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentAdIndex
                  ? 'bg-gradient-to-r from-red-500 to-blue-500 w-6'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-red-300/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-300/20 to-transparent rounded-full blur-2xl"></div>
    </div>
  );
};

export default AdBanner;
