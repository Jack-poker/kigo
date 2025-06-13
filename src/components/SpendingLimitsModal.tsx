import React, { useState } from 'react';
import { X, Clock, Calendar, DollarSign, Save, Info, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SpendingLimitsModal = ({ student, onClose, onSave, isLoading }) => {
  const { t } = useLanguage();
  
  const [limits, setLimits] = useState({
    dailyLimit: student?.dailyLimit || '',
    weeklyLimit: student?.weeklyLimit || '',
    monthlyLimit: student?.monthlyLimit || '',
    allowedDays: student?.allowedDays || [],
    allowedHours: student?.allowedHours || { from: '', to: '' }
  });

  const [showGuide, setShowGuide] = useState({
    spending: false,
    time: false,
    days: false
  });

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up empty values
    const cleanedLimits = {
      dailyLimit: limits.dailyLimit ? Number(limits.dailyLimit) : null,
      weeklyLimit: limits.weeklyLimit ? Number(limits.weeklyLimit) : null,
      monthlyLimit: limits.monthlyLimit ? Number(limits.monthlyLimit) : null,
      allowedDays: limits.allowedDays.length > 0 ? limits.allowedDays : null,
      allowedHours: (limits.allowedHours.from && limits.allowedHours.to) ? limits.allowedHours : null
    };
    
    onSave(cleanedLimits);
  };

  const handleDayToggle = (day) => {
    setLimits(prev => ({
      ...prev,
      allowedDays: prev.allowedDays.includes(day)
        ? prev.allowedDays.filter(d => d !== day)
        : [...prev.allowedDays, day]
    }));
  };

  const toggleGuide = (section) => {
    setShowGuide(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const days = [
    { key: 'monday', label: t('monday') },
    { key: 'tuesday', label: t('tuesday') },
    { key: 'wednesday', label: t('wednesday') },
    { key: 'thursday', label: t('thursday') },
    { key: 'friday', label: t('friday') },
    { key: 'saturday', label: t('saturday') },
    { key: 'sunday', label: t('sunday') }
  ];

  const GuideCard = ({ title, content, isVisible }) => (
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
      isVisible ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Info className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-800 mb-2">{title}</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Modal Container with Glass Effect */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-md max-h-[90vh] shadow-2xl border border-emerald-100/50 overflow-hidden">
        {/* Glass Effect Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white/60 to-emerald-100/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-200/20 rounded-full blur-xl"></div>
        
        {/* Header with Emerald Gradient */}
        <div className="relative z-10 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 rounded-t-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold drop-shadow-sm">{t('spendingLimits')}</h2>
              <p className="text-emerald-100 text-sm font-medium">{student?.name || 'Student'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative z-10 max-h-[calc(90vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Spending Limits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-emerald-100/80 rounded-xl backdrop-blur-sm">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-emerald-800">{t('spendingLimits')}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggleGuide('spending')}
                  className="p-2 hover:bg-emerald-100/50 rounded-lg transition-all duration-200"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                </button>
              </div>

              <GuideCard
                title="How Spending Limits Work"
                content="Set maximum amounts for daily, weekly, or monthly spending. Leave blank for unlimited spending. When a limit is reached, transactions will be blocked until the period resets."
                isVisible={showGuide.spending}
              />
              
              <div className="grid grid-cols-1 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    {t('dailyLimit')} <span className="text-emerald-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={limits.dailyLimit}
                    onChange={(e) => setLimits(prev => ({ ...prev, dailyLimit: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200/60 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-700 group-hover:border-emerald-300"
                    placeholder="Leave empty for no daily limit"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    {t('weeklyLimit')} <span className="text-emerald-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={limits.weeklyLimit}
                    onChange={(e) => setLimits(prev => ({ ...prev, weeklyLimit: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200/60 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-700 group-hover:border-emerald-300"
                    placeholder="Leave empty for no weekly limit"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    {t('monthlyLimit')} <span className="text-emerald-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={limits.monthlyLimit}
                    onChange={(e) => setLimits(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200/60 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-700 group-hover:border-emerald-300"
                    placeholder="Leave empty for no monthly limit"
                  />
                </div>
              </div>
            </div>

            {/* Time Restrictions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100/80 rounded-xl backdrop-blur-sm">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-emerald-800">{t('timeRestrictions')}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggleGuide('time')}
                  className="p-2 hover:bg-emerald-100/50 rounded-lg transition-all duration-200"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                </button>
              </div>

              <GuideCard
                title="How Time Restrictions Work"
                content="Set specific hours when spending is allowed. Transactions outside these hours will be blocked. Leave both fields empty to allow spending at any time."
                isVisible={showGuide.time}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    {t('from')} <span className="text-emerald-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="time"
                    value={limits.allowedHours.from}
                    onChange={(e) => setLimits(prev => ({
                      ...prev,
                      allowedHours: { ...prev.allowedHours, from: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200/60 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-700 group-hover:border-emerald-300"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    {t('to')} <span className="text-emerald-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="time"
                    value={limits.allowedHours.to}
                    onChange={(e) => setLimits(prev => ({
                      ...prev,
                      allowedHours: { ...prev.allowedHours, to: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200/60 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-700 group-hover:border-emerald-300"
                  />
                </div>
              </div>
            </div>

            {/* Allowed Days */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-emerald-100/80 rounded-xl backdrop-blur-sm">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-emerald-800">{t('allowedDays')}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggleGuide('days')}
                  className="p-2 hover:bg-emerald-100/50 rounded-lg transition-all duration-200"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                </button>
              </div>

              <GuideCard
                title="How Day Restrictions Work"
                content="Select specific days when spending is allowed. Transactions on unselected days will be blocked. Leave all days unselected to allow spending on any day."
                isVisible={showGuide.days}
              />
              
              <div className="grid grid-cols-2 gap-2">
                {days.map((day) => (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => handleDayToggle(day.key)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 backdrop-blur-sm shadow-sm transform hover:scale-105 ${
                      limits.allowedDays.includes(day.key)
                        ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-lg scale-105 animate-pulse'
                        : 'bg-white/80 text-emerald-700 hover:bg-emerald-50/80 border border-emerald-200/60 hover:border-emerald-300'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              
              {limits.allowedDays.length === 0 && (
                <div className="text-center py-2">
                  <p className="text-sm text-emerald-600 animate-fade-in">
                    No restrictions - spending allowed on all days
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer with Save Button */}
        <div className="relative z-10 p-6 border-t border-emerald-100/60 bg-gradient-to-r from-emerald-50/40 to-green-50/40">
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-4 px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{t('saveChanges')}</span>
              </>
            )}
          </button>
        </div>
        
        {/* Additional Glass Reflections */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default SpendingLimitsModal;