import React, { useState, useEffect } from "react";
import { Save, Shield, Bell, DollarSign, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

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
    platform_name: "StudentPay",
    platform_email: "admin@studentpay.com",
    support_email: "support@studentpay.com",
    max_transaction_amount: 1000,
    min_transaction_amount: 5,
    transaction_fee_percentage: 2.5,
    require_two_factor_auth: true,
    password_min_length: 8,
    session_timeout: 30,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    primary_color: "#059669",
    secondary_color: "#10b981",
  });
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<string>("");

  // Fetch CSRF token with retry logic
  const fetchCsrfToken = async (
    retries = 3,
    delay = 1000,
  ): Promise<string | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(
          "http://localhost:8001/admin/get-csrf-token",
          {
            withCredentials: true, // Send session_id cookie
          },
        );
        console.log("CSRF Token:", response.data.csrf_token); // Debug
        setCsrfToken(response.data.csrf_token);
        setError("");
        return response.data.csrf_token;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.detail || "Failed to fetch CSRF token";
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
      const response = await axios.get("http://localhost:8001/admin/settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true, // Send session_id cookie
      });
      setSettings(response.data);
      setLoading(false);
      setError("");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to fetch settings";
      setError(errorMsg);
      console.error("Settings fetch error:", err);
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
      return "Invalid platform email format";
    }
    if (!emailRegex.test(settings.support_email)) {
      return "Invalid support email format";
    }
    if (settings.max_transaction_amount <= settings.min_transaction_amount) {
      return "Max transaction amount must be greater than min";
    }
    if (settings.min_transaction_amount < 0) {
      return "Min transaction amount cannot be negative";
    }
    if (
      settings.transaction_fee_percentage < 0 ||
      settings.transaction_fee_percentage > 100
    ) {
      return "Transaction fee percentage must be between 0 and 100";
    }
    if (settings.password_min_length < 6) {
      return "Password minimum length must be at least 6";
    }
    if (settings.session_timeout < 5) {
      return "Session timeout must be at least 5 minutes";
    }
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(settings.primary_color)) {
      return "Invalid primary color format (use #RRGGBB)";
    }
    if (!colorRegex.test(settings.secondary_color)) {
      return "Invalid secondary color format (use #RRGGBB)";
    }
    return null;
  };

  // Handle save
  const handleSave = async () => {
    const validationError = validateSettings();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }
    try {
      await axios.put("http://localhost:8001/admin/settings", settings, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true, // Send session_id cookie
      });
      setSuccess("Settings saved successfully");
      setError("");
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3s
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to save settings";
      setError(errorMsg);
      setSuccess("");
      console.error("Settings save error:", err);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
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
    return (
      <div className="text-center p-4" data-oid="s3cmw92">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6" data-oid="5xgi4jj">
      {error && (
        <div className="text-red-500 text-center p-4" data-oid="vpqd2hv">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-500 text-center p-4" data-oid="l-bkbp9">
          {success}
        </div>
      )}
      {/* Platform Settings */}
      <Card data-oid="oa2vgee">
        <CardHeader data-oid="50pm7xf">
          <CardTitle className="flex items-center space-x-2" data-oid="-q4jz:j">
            <Shield className="w-5 h-5 text-emerald-600" data-oid="85m88.-" />
            <span data-oid=".4b0wgw">Platform Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="mmoasi.">
          <div className="grid md:grid-cols-2 gap-4" data-oid="ngyu2zg">
            <div data-oid="wh0twsd">
              <label className="text-sm font-medium" data-oid="-651nxt">
                Platform Name
              </label>
              <Input
                name="platform_name"
                value={settings.platform_name}
                onChange={handleInputChange}
                data-oid="lyd6a2:"
              />
            </div>
            <div data-oid="xjl8rz0">
              <label className="text-sm font-medium" data-oid="_v0pdg7">
                Platform Email
              </label>
              <Input
                type="email"
                name="platform_email"
                value={settings.platform_email}
                onChange={handleInputChange}
                data-oid="6g85y2q"
              />
            </div>
            <div data-oid="bn-zlea">
              <label className="text-sm font-medium" data-oid="kmr2n3b">
                Support Email
              </label>
              <Input
                type="email"
                name="support_email"
                value={settings.support_email}
                onChange={handleInputChange}
                data-oid="j8ou4bz"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Settings */}
      <Card data-oid="br7dmdg">
        <CardHeader data-oid="5maf4kx">
          <CardTitle className="flex items-center space-x-2" data-oid="bq6w8da">
            <DollarSign
              className="w-5 h-5 text-emerald-600"
              data-oid="p5upx0v"
            />

            <span data-oid="p3lme6b">Transaction Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="ont.wwk">
          <div className="grid md:grid-cols-3 gap-4" data-oid="6z3y230">
            <div data-oid="g035lu0">
              <label className="text-sm font-medium" data-oid="hoj-526">
                Max Transaction Amount ($)
              </label>
              <Input
                type="number"
                name="max_transaction_amount"
                value={settings.max_transaction_amount}
                onChange={handleInputChange}
                min={0}
                data-oid="igahai2"
              />
            </div>
            <div data-oid="a1iph2d">
              <label className="text-sm font-medium" data-oid="y_dp--l">
                Min Transaction Amount ($)
              </label>
              <Input
                type="number"
                name="min_transaction_amount"
                value={settings.min_transaction_amount}
                onChange={handleInputChange}
                min={0}
                data-oid="_t.afxk"
              />
            </div>
            <div data-oid="h5-j::1">
              <label className="text-sm font-medium" data-oid="2:pdi8i">
                Transaction Fee (%)
              </label>
              <Input
                type="number"
                step="0.1"
                name="transaction_fee_percentage"
                value={settings.transaction_fee_percentage}
                onChange={handleInputChange}
                min={0}
                max={100}
                data-oid="rfn7wig"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card data-oid="u4e:-f2">
        <CardHeader data-oid="2:zjwip">
          <CardTitle className="flex items-center space-x-2" data-oid="k0bui1.">
            <Bell className="w-5 h-5 text-emerald-600" data-oid="-b4q6p." />
            <span data-oid="zat.hpx">Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="lc_v:b-">
          <div className="grid md:grid-cols-3 gap-4" data-oid="m--wy7t">
            <div className="flex items-center space-x-2" data-oid="o1-jv-s">
              <input
                type="checkbox"
                id="email_notifications"
                name="email_notifications"
                checked={settings.email_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
                data-oid="4-twp1:"
              />

              <label
                htmlFor="email_notifications"
                className="text-sm font-medium"
                data-oid="vp.09k9"
              >
                Email Notifications
              </label>
            </div>
            <div className="flex items-center space-x-2" data-oid="7u9ms.1">
              <input
                type="checkbox"
                id="sms_notifications"
                name="sms_notifications"
                checked={settings.sms_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
                data-oid="me63ma6"
              />

              <label
                htmlFor="sms_notifications"
                className="text-sm font-medium"
                data-oid="0ujk22p"
              >
                SMS Notifications
              </label>
            </div>
            <div className="flex items-center space-x-2" data-oid=".w:p8:9">
              <input
                type="checkbox"
                id="push_notifications"
                name="push_notifications"
                checked={settings.push_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
                data-oid="kl33zxq"
              />

              <label
                htmlFor="push_notifications"
                className="text-sm font-medium"
                data-oid="5v5w3g7"
              >
                Push Notifications
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card data-oid="ix4jv13">
        <CardHeader data-oid="84j8:ze">
          <CardTitle className="flex items-center space-x-2" data-oid="s2cxtpq">
            <Palette className="w-5 h-5 text-emerald-600" data-oid="4o_ut2w" />
            <span data-oid="90nl3ar">Theme Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="f_2bnbv">
          <div className="grid md:grid-cols-2 gap-4" data-oid="17wxse0">
            <div data-oid="6lttikh">
              <label className="text-sm font-medium" data-oid="16udx3f">
                Primary Color
              </label>
              <div className="flex items-center space-x-2" data-oid="5.g60uc">
                <input
                  type="color"
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 rounded border"
                  data-oid="_sm5th3"
                />

                <Input
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  data-oid="_5cmoti"
                />
              </div>
            </div>
            <div data-oid="rix-i2o">
              <label className="text-sm font-medium" data-oid="q27tadx">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2" data-oid="d.j3sd7">
                <input
                  type="color"
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 rounded border"
                  data-oid="78-fnjn"
                />

                <Input
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                  data-oid="q3cswvp"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end" data-oid="68o4t74">
        <Button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700"
          data-oid="2hs552f"
        >
          <Save className="w-4 h-4 mr-2" data-oid="_68mfs2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
