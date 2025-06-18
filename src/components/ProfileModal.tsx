import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Edit3, Save, Camera } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    about: '',
    linked_students: 0,
    total_transactions: 0,
    days_active: 0
  });
  const [csrfToken, setCsrfToken] = useState('');

  const API_URL = 'http://localhost:8000';

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-csrf-token`);
      setCsrfToken(response.data.csrf_token);
      return response.data.csrf_token;
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
      setError(t('serverError'));
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.profile);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(t('profileError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCsrfToken();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      setIsLoading(true);
      const csrf = csrfToken || await fetchCsrfToken();
      await axios.put(
        `${API_URL}/profile`,
        {
          fullnames: profile.full_name,
          email: profile.email || null,
          address: profile.address || null,
          about: profile.about || null,
          csrf_token: csrf
        },
        { headers: { Authorization: `Bearer ${token}`, 'X-CSRF-Token': csrf } }
      );
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(t('profileUpdateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('profileSettings')}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-200 font-medium"
              disabled={isLoading}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditing ? t('save') : t('edit')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
            <button onClick={() => setError('')} className="ml-2 text-red-900">X</button>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl">
                <User className="w-12 h-12 text-white" />
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.full_name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('trustedGuardian')}</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">{t('activeAccount')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  {t('fullName')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{profile.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  {t('emailAddress')}
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{profile.email || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {t('phoneNumber')}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone_number}
                    onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{profile.phone_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t('address')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{profile.address || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('about')}
            </label>
            {isEditing ? (
              <textarea
                value={profile.about}
                onChange={(e) => setProfile({...profile, about: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{profile.about || 'N/A'}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{profile.linked_students}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('linkedStudents')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{profile.total_transactions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalTransactions')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile.days_active}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('daysActive')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;