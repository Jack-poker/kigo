import React, { useState } from 'react';
import { Save, Shield, Bell, DollarSign, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Platform Settings
    platformName: 'StudentPay',
    platformEmail: 'admin@studentpay.com',
    supportEmail: 'support@studentpay.com',
    
    // Transaction Settings
    maxTransactionAmount: 1000,
    minTransactionAmount: 5,
    transactionFeePercentage: 2.5,
    
    // Security Settings
    requireTwoFactorAuth: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Theme Settings
    primaryColor: '#059669',
    secondaryColor: '#10b981'
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Here you would typically save to your backend
  };

  return (
    <div className="space-y-6">
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
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Platform Email</label>
              <Input
                type="email"
                value={settings.platformEmail}
                onChange={(e) => setSettings({ ...settings, platformEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Support Email</label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
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
                value={settings.maxTransactionAmount}
                onChange={(e) => setSettings({ ...settings, maxTransactionAmount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min Transaction Amount ($)</label>
              <Input
                type="number"
                value={settings.minTransactionAmount}
                onChange={(e) => setSettings({ ...settings, minTransactionAmount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Transaction Fee (%)</label>
              <Input
                type="number"
                step="0.1"
                value={settings.transactionFeePercentage}
                onChange={(e) => setSettings({ ...settings, transactionFeePercentage: Number(e.target.value) })}
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
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-4 h-4 text-emerald-600"
              />
              <label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="smsNotifications"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="w-4 h-4 text-emerald-600"
              />
              <label htmlFor="smsNotifications" className="text-sm font-medium">SMS Notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="pushNotifications"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                className="w-4 h-4 text-emerald-600"
              />
              <label htmlFor="pushNotifications" className="text-sm font-medium">Push Notifications</label>
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
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
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
