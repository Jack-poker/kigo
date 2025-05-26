
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

// Mock admin ads data
const mockAds: AdContent[] = [
  {
    id: '1',
    type: 'image',
    src: '/api/placeholder/800/200',
    alt: 'School Lunch Program',
    title: 'Ifunguro Gishya Nziza! 🍎',
    subtitle: 'Ifunguro rivugurura ritangira icyumweru gitaha',
    ctaText: 'Menya Byinshi',
    ctaLink: '#'
  },
  {
    id: '2',
    type: 'image',
    src: '/api/placeholder/800/200',
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

  // Auto-rotate ads every 10 seconds (slower for elderly users)
  useEffect(() => {
    if (mockAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % mockAds.length);
      }, 10000);
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
      {/* Enhanced accessibility - larger close button for elderly users */}
      <button
        onClick={() => setIsVisible(false)}
        title={t('ads.close')}
        className="absolute top-4 right-4 z-20 w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-2xl group text-lg font-bold"
      >
        <X className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Enhanced navigation for elderly users - larger buttons */}
      {mockAds.length > 1 && (
        <>
          <button
            onClick={prevAd}
            title={t('ads.previous')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-2xl group"
          >
            <ChevronLeft className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button
            onClick={nextAd}
            title={t('ads.next')}
            className="absolute right-20 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-2xl group"
          >
            <ChevronRight className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-3xl"></div>
      )}

      {/* Ad Content */}
      <div className="relative z-10 p-8">
        <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Ad Image */}
          <div className="flex-shrink-0 w-full lg:w-64 h-40 lg:h-32 rounded-2xl overflow-hidden shadow-xl relative">
            <img
              src={currentAd.src}
              alt={currentAd.alt}
              onLoad={handleImageLoad}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Ad Text Content - Enhanced for readability */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-relaxed">
              {currentAd.title}
            </h3>
            {currentAd.subtitle && (
              <p className="text-gray-700 font-semibold mb-6 text-lg lg:text-xl leading-relaxed">
                {currentAd.subtitle}
              </p>
            )}
            {currentAd.ctaText && (
              <button
                onClick={() => currentAd.ctaLink && window.open(currentAd.ctaLink, '_blank')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg"
              >
                {currentAd.ctaText}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Progress Indicators - larger for elderly users */}
      {mockAds.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {mockAds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`h-4 rounded-full transition-all duration-300 ${
                index === currentAdIndex
                  ? 'bg-gradient-to-r from-red-500 to-blue-500 w-12'
                  : 'bg-white/60 hover:bg-white/80 w-4'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdBanner;
