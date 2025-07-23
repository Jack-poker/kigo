import React, { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

const ModernNavbar = ({
  tabs,
  activeTab,
  handleTabChange,
  isBalanceVisible,
  setIsBalanceVisible,
  isDark,
  toggleTheme,
  currentLanguage,
  languages,
  language,
  setLanguage,
  showLanguageDropdown,
  setShowLanguageDropdown,
  showNotificationDropdown,
  setShowNotificationDropdown,
  showProfileDropdown,
  setShowProfileDropdown,
  setActiveModal,
  handleLogout,
  t
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Main Navbar */}
      <div className="bg-white backdrop-blur-xl border-b border-gray-200/20 border-gray-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                 <img
      src={
        typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent)
          ? "/assets/ios.png"
          : typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
          ? "/assets/android.png"
          : "/assets/web.png"
      }
      alt="kaascan Logo"
      className="h-14 sm:h-14 w-auto object-contain"
    />
              </div>
              
              {/* Desktop Navigation Tabs */}
              <div className="hidden lg:flex items-center space-x-1
               bg-zinc-900 rounded-2xl p-1 shadow-inner">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                        activeTab === tab.id
                          ? "bg-white text-gray-900 shadow-lg scale-105"
                          : "text-white/90 hover:text-white hover:bg-white/10 hover:scale-102"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden xl:block">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              
              {/* Balance Toggle */}
              <button
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 group"
              >
                {isBalanceVisible ? (
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                ) : (
                  <EyeOff className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl transition-all duration-200 group"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 group-hover:scale-110 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </button>

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-2 p-2.5 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all duration-200 group"
                >
                  <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-lg">{currentLanguage?.flag}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 font-medium flex items-center space-x-3 ${
                          language === lang.code
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 group"
                >
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
                </button>
                
                {showNotificationDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/20">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {t("notifications")}
                      </h3>
                    </div>
                    <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                      <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200/20 dark:border-green-700/20">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          {t("alicePurchase")}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {t("twoMinutesAgo")}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200/20 dark:border-blue-700/20">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          {t("bobLimitReminder")}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {t("oneHourAgo")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 group"
                >
                  <img
                    src="/assets/young-boy.png"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-slate-700"
                  />
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-200/20 dark:border-gray-700/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {t("lovingParent")}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            parent account
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setActiveModal("profile");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span>{t("profileSettings")}</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveModal("settings");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        <span>{t("settings")}</span>
                      </button>
                      <hr className="my-2 border-gray-200/20 dark:border-gray-700/20" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t("signOut")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 rounded-full border border-gray-200 dark:border-slate-700 hover:ring-2 hover:ring-brand transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-white" />
                ) : (
                  <img
                    src="/assets/young-boy.png"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 shadow-2xl z-40 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-6 space-y-4 max-h-[80vh] bg-zinc-900 overflow-y-auto">
            
            {/* Mobile Navigation Tabs */}
            <div className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-zinc-900 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-4 border-t border-gray-200/20 dark:border-gray-700/20 space-y-4">
              <button
                onClick={() => {
                  setIsBalanceVisible(!isBalanceVisible);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200"
              >
                {isBalanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                <span>{isBalanceVisible ? "Hide Balance" : "Show Balance"}</span>
              </button>
              
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>

              {/* Mobile Language Selection */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300">
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">Language</span>
                </div>
                <div className="pl-4 space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                        language === lang.code
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Notifications */}
              {/* <div className="space-y-2">
                <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300">
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">{t("notifications")}</span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-auto"></span>
                </div>
                <div className="pl-4 space-y-2">
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      {t("alicePurchase")}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {t("twoMinutesAgo")}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {t("bobLimitReminder")}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {t("oneHourAgo")}
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Mobile Profile Options */}
              <div className="pt-4 border-t border-gray-200/20 dark:border-gray-700/20 space-y-2">
                <button
                  onClick={() => {
                    setActiveModal("profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>{t("profileSettings")}</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveModal("settings");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  <span>{t("settings")}</span>
                </button>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t("signOut")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ModernNavbar;