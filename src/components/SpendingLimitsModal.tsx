
import React, { useState } from 'react';
import { X, Settings, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SpendingLimitsModalProps {
  student: any;
  onClose: () => void;
  onSave: (limits: any) => void;
  isLoading: boolean;
}

const SpendingLimitsModal: React.FC<SpendingLimitsModalProps> = ({
  student,
  onClose,
  onSave,
  isLoading
}) => {
  const { t } = useLanguage();
  const [limits, setLimits] = useState({
    dailyLimit: student.dailyLimit || 5000,
    weeklyLimit: student.weeklyLimit || 25000,
    monthlyLimit: student.monthlyLimit || 100000,
    allowedDays: student.allowedDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    allowedHours: student.allowedHours || { from: '07:00', to: '18:00' }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(limits);
  };

  const toggleDay = (day: string) => {
    setLimits(prev => ({
      ...prev,
      allowedDays: prev.allowedDays.includes(day)
        ? prev.allowedDays.filter(d => d !== day)
        : [...prev.allowedDays, day]
    }));
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('setSpendingLimits')}</h2>
                <p className="text-sm text-gray-600">{student.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Spending Limits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Spending Limits</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dailyLimit')}
                </label>
                <input
                  type="number"
                  value={limits.dailyLimit}
                  onChange={(e) => setLimits(prev => ({ ...prev, dailyLimit: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="0"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="0"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Time Restrictions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>{t('timeRestrictions')}</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('allowedDays')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      limits.allowedDays.includes(day)
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t(day as keyof typeof t)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('allowedHours')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t('from')}
                  </label>
                  <input
                    type="time"
                    value={limits.allowedHours.from}
                    onChange={(e) => setLimits(prev => ({
                      ...prev,
                      allowedHours: { ...prev.allowedHours, from: e.target.value }
                    }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t('to')}
                  </label>
                  <input
                    type="time"
                    value={limits.allowedHours.to}
                    onChange={(e) => setLimits(prev => ({
                      ...prev,
                      allowedHours: { ...prev.allowedHours, to: e.target.value }
                    }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpendingLimitsModal;
