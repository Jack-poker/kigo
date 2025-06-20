import React, { useState, useEffect } from 'react';
import { Save, Shield, Bell, DollarSign, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

interface Settings {
  platform_name: string;
  platform_email: string;
  support_email: string;
  max_transaction_amount: number;
  min_transaction_amount: number;
  transaction_fee_percentage: number;
  require_two_factor_auth: boolean;
  password_min_length: number;
  session_timeout: number;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  primary_color: string;
  secondary_color: string;
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    platform_name: 'StudentPay',
    platform_email: 'admin@studentpay.com',
    support_email: 'support@studentpay.com',
    max_transaction_amount: 1000,
    min_transaction_amount: 5,
    transaction_fee_percentage: 2.5,
    require_two_factor_auth: true,
    password_min_length: 8,
    session_timeout: 30,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    primary_color: '#059669',
    secondary_color: '#10b981',
  });
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<string>('');

  // Fetch CSRF token with retry logic
  const fetchCsrfToken = async (retries = 3, delay = 1000): Promise<string | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get('https://api.kaascan.com/admin/get-csrf-token', {
          withCredentials: true, // Send session_id cookie
        });
        console.log('CSRF Token:', response.data.csrf_token); // Debug
        setCsrfToken(response.data.csrf_token);
        setError('');
        return response.data.csrf_token;
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || 'Failed to fetch CSRF token';
        console.error(`CSRF token error (attempt ${attempt}):`, err);
        if (attempt === retries) {
          setError(errorMsg);
          return null;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return null;
  };

  // Fetch settings
  const fetchSettings = async () => {
    if (!csrfToken) return;
    try {
      setLoading(true);
      const response = await axios.get('https://api.kaascan.com/admin/settings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true, // Send session_id cookie
      });
      setSettings(response.data);
      setLoading(false);
      setError('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch settings';
      setError(errorMsg);
      console.error('Settings fetch error:', err);
      setLoading(false);
    }
  };

  // Initial CSRF token fetch
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  // Fetch settings when CSRF token is available
  useEffect(() => {
    if (csrfToken) {
      fetchSettings();
    }
  }, [csrfToken]);

  // Validate settings
  const validateSettings = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.platform_email)) {
      return 'Invalid platform email format';
    }
    if (!emailRegex.test(settings.support_email)) {
      return 'Invalid support email format';
    }
    if (settings.max_transaction_amount <= settings.min_transaction_amount) {
      return 'Max transaction amount must be greater than min';
    }
    if (settings.min_transaction_amount < 0) {
      return 'Min transaction amount cannot be negative';
    }
    if (settings.transaction_fee_percentage < 0 || settings.transaction_fee_percentage > 100) {
      return 'Transaction fee percentage must be between 0 and 100';
    }
    if (settings.password_min_length < 6) {
      return 'Password minimum length must be at least 6';
    }
    if (settings.session_timeout < 5) {
      return 'Session timeout must be at least 5 minutes';
    }
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(settings.primary_color)) {
      return 'Invalid primary color format (use #RRGGBB)';
    }
    if (!colorRegex.test(settings.secondary_color)) {
      return 'Invalid secondary color format (use #RRGGBB)';
    }
    return null;
  };

  // Handle save
  const handleSave = async () => {
    const validationError = validateSettings();
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }
    try {
      await axios.put('https://api.kaascan.com/admin/settings', settings, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true, // Send session_id cookie
      });
      setSuccess('Settings saved successfully');
      setError('');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3s
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to save settings';
      setError(errorMsg);
      setSuccess('');
      console.error('Settings save error:', err);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  if (loading) {
    return <div className="text-center p-4">Loading settings...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {error && <div className="text-red-500 text-center p-4">{error}</div>}
      {success && <div className="text-green-500 text-center p-4">{success}</div>}
      {/* Platform Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Platform Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Platform Name</label>
              <Input
                name="platform_name"
                value={settings.platform_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Platform Email</label>
              <Input
                type="email"
                name="platform_email"
                value={settings.platform_email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Support Email</label>
              <Input
                type="email"
                name="support_email"
                value={settings.support_email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>Transaction Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Max Transaction Amount ($)</label>
              <Input
                type="number"
                name="max_transaction_amount"
                value={settings.max_transaction_amount}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min Transaction Amount ($)</label>
              <Input
                type="number"
                name="min_transaction_amount"
                value={settings.min_transaction_amount}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Transaction Fee (%)</label>
              <Input
                type="number"
                step="0.1"
                name="transaction_fee_percentage"
                value={settings.transaction_fee_percentage}
                onChange={handleInputChange}
                min={0}
                max={100}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="email_notifications"
                name="email_notifications"
                checked={settings.email_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
              />
              <label htmlFor="email_notifications" className="text-sm font-medium">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sms_notifications"
                name="sms_notifications"
                checked={settings.sms_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
              />
              <label htmlFor="sms_notifications" className="text-sm font-medium">
                SMS Notifications
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="push_notifications"
                name="push_notifications"
                checked={settings.push_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
              />
              <label htmlFor="push_notifications" className="text-sm font-medium">
                Push Notifications
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-emerald-600" />
            <span>Theme Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;