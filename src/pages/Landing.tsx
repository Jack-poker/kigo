
import React, { useEffect, useState } from 'react';
import { Smartphone, CreditCard, Wallet, Users, TrendingUp, Star, Shield, Clock, Globe, ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import VirtualCard from '../components/VirtualCard';

const Landing = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-red-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
              {t('appName')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('tagline')} - The future of student financial management in Rwanda
            </p>
            <div className="flex justify-center items-center space-x-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-300 ml-2 text-lg">Trusted by parents nationwide</span>
            </div>
          </div>

          {/* Main 3D Mockup Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            {/* Phone Mockup */}
            <div className={`relative transition-all duration-1500 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative mx-auto w-80 h-[640px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  {/* Screen */}
                  <div className="w-full h-full bg-gradient-to-br from-red-100 via-yellow-50 via-green-50 to-blue-100 rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-2 text-xs text-gray-700">
                      <span className="font-semibold">9:41 AM</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-gray-700 rounded-sm"></div>
                        <div className="w-1 h-2 bg-gray-700 rounded-sm"></div>
                        <div className="w-6 h-2 bg-green-500 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Content Preview */}
                    <div className="px-4 py-2">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                          {t('welcome')}
                        </h3>
                      </div>
                      
                      {/* Mini Virtual Card */}
                      <div className="relative group perspective-1000 mb-4">
                        <div className="relative bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl p-4 text-white shadow-xl transform group-hover:scale-105 transition-all duration-300">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-xs font-bold opacity-90">iKaramu Wallet</p>
                              <p className="text-lg font-bold">125,000 RWF</p>
                            </div>
                            <div className="w-8 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-4 h-4" />
                            </div>
                          </div>
                          <p className="text-sm font-mono tracking-wider mb-2">•••• •••• •••• 1234</p>
                          <div className="flex justify-between text-xs">
                            <span>PARENT USER</span>
                            <span>SECURE</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl p-3 text-center">
                          <Wallet className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs font-bold">{t('deposit')}</span>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl p-3 text-center">
                          <Users className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs font-bold">{t('students')}</span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                          <span className="text-xs text-gray-700">{t('currentBalance')}</span>
                          <span className="text-xs font-bold text-blue-600">125,000 RWF</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                          <span className="text-xs text-gray-700">{t('linkedStudents')}</span>
                          <span className="text-xs font-bold text-green-600">2 {t('students_plural')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className={`space-y-8 transition-all duration-1500 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Secure. Smart. Simple.
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Empower your children with financial responsibility while maintaining complete control and oversight.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Virtual Wallet</h3>
                    <p className="text-gray-300">Beautiful, secure virtual cards with knitted textile design patterns</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Spending Controls</h3>
                    <p className="text-gray-300">Set daily, weekly, and monthly limits with time restrictions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Real-time Tracking</h3>
                    <p className="text-gray-300">Monitor all transactions instantly with detailed analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Multi-language</h3>
                    <p className="text-gray-300">Available in English, French, and Kinyarwanda</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-8">
                <button className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 text-white py-4 px-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-lg">
                  <span>Get Started</span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-sm text-white py-4 px-8 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 font-bold text-lg">
                  <Play className="w-6 h-6" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent mb-2">10K+</div>
              <div className="text-gray-300">Happy Parents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent mb-2">25K+</div>
              <div className="text-gray-300">Students Connected</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">500M+</div>
              <div className="text-gray-300">RWF Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-16 text-center">
          <div className="text-gray-300 mb-4">
            Made with ❤️ for Rwandan families
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 iKaramu. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
