import React, { useState } from 'react';
import { Globe, User, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'fr', name: t('french'), flag: '🇫🇷' },
    { code: 'rw', name: t('kinyarwanda'), flag: '🇷🇼' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-red-50 via-yellow-50 via-green-50 to-blue-50 backdrop-blur-xl border-b-4 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 sticky top-0 z-50 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-yellow-100/30 via-green-100/30 to-blue-100/30 animate-pulse"></div>
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, #ef4444 1px, transparent 1px),
          radial-gradient(circle at 75% 25%, #eab308 1px, transparent 1px),
          radial-gradient(circle at 25% 75%, #22c55e 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className={`relative w-14 h-14 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 ${shimmerClass}`}>
              <span className="text-white font-black text-xl drop-shadow-lg">iW</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
                {t('appName')}
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600 font-bold">{t('tagline')}</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button className={`relative p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}>
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75"></div>
              </button>
              <div className="absolute top-full right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">{t('recentNotifications')}</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-xl border border-brand">
                      <p className="text-sm font-semibold text-green-800">{t('alicePurchase')}</p>
                      <p className="text-xs text-green-600">{t('twoMinutesAgo')}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm font-semibold text-blue-800">{t('bobLimitReminder')}</p>
                      <p className="text-xs text-blue-600">{t('oneHourAgo')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm font-bold border-2 border-gray-200 hover:border-blue-300 ${shimmerClass}`}
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm">{currentLanguage?.flag} {currentLanguage?.name}</span>
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-100 py-3 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 font-semibold flex items-center space-x-3 ${
                        language === lang.code ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-2xl hover:bg-white/60 transition-all duration-300 backdrop-blur-sm ${shimmerClass}`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-bold text-gray-900">{t('lovingParent')}</p>
                  <p className="text-xs text-gray-600 font-medium">{t('alwaysCaring')}</p>
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 py-4 z-50">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{t('lovingParent')}</p>
                        <p className="text-sm text-gray-600">parent@example.com</p>
                        <p className="text-xs text-green-600 font-semibold">{t('trustedGuardian')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <button
                      onClick={() => {
                        onMenuClick();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 font-semibold"
                    >
                      <User className="w-5 h-5 text-blue-500" />
                      <span>{t('profileSettings')}</span>
                    </button>
                    <button className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 font-semibold">
                      <Settings className="w-5 h-5 text-purple-500" />
                      <span>{t('accountSettings')}</span>
                    </button>
                    <hr className="my-3 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-200 font-semibold"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{t('signOut')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-2 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 py-6 space-y-6 bg-white/60 backdrop-blur-xl rounded-b-3xl">
            <div className="flex items-center space-x-4 px-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{t('lovingParent')}</p>
                <p className="text-sm text-gray-600">parent@example.com</p>
                <p className="text-xs text-green-600 font-semibold">{t('trustedGuardian')}</p>
              </div>
            </div>
            <div className="space-y-3 px-6">
              <button className="w-full flex items-center space-x-4 py-4 text-left bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl px-4 font-semibold">
                <Bell className="w-6 h-6 text-blue-500" />
                <span>{t('notifications')}</span>
                <span className="ml-auto w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              </button>
              <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-4 py-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="w-6 h-6 text-green-500" />
                  <span className="font-semibold">{t('language')}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        language === lang.code
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-green-100'
                      }`}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  onMenuClick();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full space-x-4 py-4 rounded-2xl px-4 bg-gradient-to-r from-blue-50 to-cyan-50 font-semibold text-left"
              >
                <User className="w-6 h-6 text-blue-500" />
                <span>{t('profileSettings')}</span>
              </button>
              <button className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-purple-50 to-pink-50 font-semibold text-left">
                <Settings className="w-6 h-6 text-purple-500" />
                <span>{t('settings')}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 font-semibold text-left"
              >
                <LogOut className="w-6 h-6" />
                <span>{t('signOut')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 animate-pulse"></div>
    </header>
  );
};

export default Header;