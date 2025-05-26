
import React from 'react';
import { Home, Wallet, Users, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ScrollNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'overview', label: t('navigation.overview'), icon: Home },
    { id: 'wallet', label: t('navigation.wallet'), icon: Wallet },
    { id: 'students', label: t('navigation.students'), icon: Users },
    { id: 'transactions', label: t('navigation.transactions'), icon: Activity }
  ];

  const scrollToSection = (tabId: string) => {
    onTabChange(tabId);
    
    // Auto-scroll to section after a brief delay
    setTimeout(() => {
      const element = document.getElementById(`section-${tabId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-white/40 mb-8 overflow-hidden">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`flex-1 min-w-0 flex items-center justify-center space-x-3 py-8 px-6 text-base font-bold transition-all duration-300 relative overflow-hidden ${
                activeTab === tab.id
                  ? 'text-white bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-red-50 hover:via-yellow-50 hover:via-green-50 hover:to-blue-50'
              }`}
            >
              <IconComponent className="w-7 h-7" />
              <span className="hidden sm:inline text-lg">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollNavigation;
