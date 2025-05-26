
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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

const mockAds: AdContent[] = [
  {
    id: '1',
    type: 'image',
    src: '/api/placeholder/400/120',
    alt: 'School Lunch Program',
    title: 'Ifunguro Gishya Nziza! 🍎',
    subtitle: 'Ifunguro rivugurura ritangira icyumweru gitaha',
    ctaText: 'Menya Byinshi',
    ctaLink: '#'
  },
  {
    id: '2',
    type: 'image',
    src: '/api/placeholder/400/120',
    alt: 'Parent Meeting',
    title: 'Inama ya Ababyeyi-Abarimu 📚',
    subtitle: 'Gena inama yawe uyu munsi',
    ctaText: 'Gena Ubu',
    ctaLink: '#'
  }
];

const AdBanner = () => {
  const { t } = useLanguage();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const currentAd = mockAds[currentAdIndex];

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
    <div className="relative w-full bg-gradient-to-r from-red-50 via-yellow-50 to-blue-50 rounded-2xl shadow-md overflow-hidden mb-4">
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        title={t('ads.close')}
        className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Navigation buttons for mobile */}
      {mockAds.length > 1 && (
        <>
          <button
            onClick={prevAd}
            title={t('ads.previous')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextAd}
            title={t('ads.next')}
            className="absolute right-12 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-2xl"></div>
      )}

      {/* Ad Content - Mobile Optimized */}
      <div className="relative z-10 p-4">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Ad Image - Mobile Responsive */}
          <div className="flex-shrink-0 w-full sm:w-32 h-20 sm:h-16 rounded-lg overflow-hidden shadow-md">
            <img
              src={currentAd.src}
              alt={currentAd.alt}
              onLoad={handleImageLoad}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Ad Text Content - Mobile Optimized */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-blue-600 bg-clip-text text-transparent mb-1 leading-tight">
              {currentAd.title}
            </h3>
            {currentAd.subtitle && (
              <p className="text-gray-700 font-medium mb-2 text-xs sm:text-sm leading-snug">
                {currentAd.subtitle}
              </p>
            )}
            {currentAd.ctaText && (
              <button
                onClick={() => currentAd.ctaLink && window.open(currentAd.ctaLink, '_blank')}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 text-xs sm:text-sm"
              >
                {currentAd.ctaText}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicators - Mobile Friendly */}
      {mockAds.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {mockAds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentAdIndex
                  ? 'bg-gradient-to-r from-red-500 to-blue-500 w-6'
                  : 'bg-white/60 hover:bg-white/80 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdBanner;
