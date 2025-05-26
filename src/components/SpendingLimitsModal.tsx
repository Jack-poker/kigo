
import React, { useState } from 'react';
import { X, Clock, Calendar, DollarSign, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SpendingLimitsModal = ({ student, onClose, onSave, isLoading }) => {
  const { t } = useLanguage();
  
  const [limits, setLimits] = useState({
    dailyLimit: student?.dailyLimit || 5000,
    weeklyLimit: student?.weeklyLimit || 25000,
    monthlyLimit: student?.monthlyLimit || 100000,
    allowedDays: student?.allowedDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    allowedHours: student?.allowedHours || { from: '07:00', to: '18:00' }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(limits);
  };

  const handleDayToggle = (day) => {
    setLimits(prev => ({
      ...prev,
      allowedDays: prev.allowedDays.includes(day)
        ? prev.allowedDays.filter(d => d !== day)
        : [...prev.allowedDays, day]
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-3xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{t('spendingLimits')}</h2>
              <p className="text-blue-100 text-sm">{student?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Spending Limits */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">{t('spendingLimits')}</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dailyLimit')}
                </label>
                <input
                  type="number"
                  value={limits.dailyLimit}
                  onChange={(e) => setLimits(prev => ({ ...prev, dailyLimit: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5,000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('weeklyLimit')}
                </label>
                <input
                  type="number"
                  value={limits.weeklyLimit}
                  onChange={(e) => setLimits(prev => ({ ...prev, weeklyLimit: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25,000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('monthlyLimit')}
                </label>
                <input
                  type="number"
                  value={limits.monthlyLimit}
                  onChange={(e) => setLimits(prev => ({ ...prev, monthlyLimit: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100,000"
                />
              </div>
            </div>
          </div>

          {/* Time Restrictions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">{t('timeRestrictions')}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('from')}
                </label>
                <input
                  type="time"
                  value={limits.allowedHours.from}
                  onChange={(e) => setLimits(prev => ({
                    ...prev,
                    allowedHours: { ...prev.allowedHours, from: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('to')}
                </label>
                <input
                  type="time"
                  value={limits.allowedHours.to}
                  onChange={(e) => setLimits(prev => ({
                    ...prev,
                    allowedHours: { ...prev.allowedHours, to: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Allowed Days */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">{t('allowedDays')}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {days.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => handleDayToggle(day.key)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    limits.allowedDays.includes(day.key)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
        </form>
      </div>
    </div>
  );
};

export default SpendingLimitsModal;
