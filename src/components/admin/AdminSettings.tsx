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
          "http://localhost:8002/admin/get-csrf-token",
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
      const response = await axios.get("http://localhost:8002/admin/settings", {
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
      await axios.put("http://localhost:8002/admin/settings", settings, {
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
      <div className="text-center p-4" data-oid="1:z6sgq">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6" data-oid="yk:r.cl">
      {error && (
        <div className="text-red-500 text-center p-4" data-oid="2nc3qbf">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-500 text-center p-4" data-oid="-5krf_6">
          {success}
        </div>
      )}
      {/* Platform Settings */}
      <Card data-oid="62r4igy">
        <CardHeader data-oid="ft1-o0q">
          <CardTitle className="flex items-center space-x-2" data-oid="p5dwfi9">
            <Shield className="w-5 h-5 text-emerald-600" data-oid=":6-e2nk" />
            <span data-oid="3l7yh-a">Platform Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="w4y_qsy">
          <div className="grid md:grid-cols-2 gap-4" data-oid=":0uay_l">
            <div data-oid="0f-s7wl">
              <label className="text-sm font-medium" data-oid="0rg5z3g">
                Platform Name
              </label>
              <Input
                name="platform_name"
                value={settings.platform_name}
                onChange={handleInputChange}
                data-oid="_4x-b0d"
              />
            </div>
            <div data-oid="wrwi-r5">
              <label className="text-sm font-medium" data-oid="seo9wvo">
                Platform Email
              </label>
              <Input
                type="email"
                name="platform_email"
                value={settings.platform_email}
                onChange={handleInputChange}
                data-oid="_bgnov2"
              />
            </div>
            <div data-oid="p-8-f96">
              <label className="text-sm font-medium" data-oid="rqval8u">
                Support Email
              </label>
              <Input
                type="email"
                name="support_email"
                value={settings.support_email}
                onChange={handleInputChange}
                data-oid="wyq:k22"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Settings */}
      <Card data-oid="qc2rd50">
        <CardHeader data-oid="7..9t01">
          <CardTitle className="flex items-center space-x-2" data-oid="cjjm1nd">
            <DollarSign
              className="w-5 h-5 text-emerald-600"
              data-oid="26-gblo"
            />

            <span data-oid="f23plvn">Transaction Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="72ku5ly">
          <div className="grid md:grid-cols-3 gap-4" data-oid="_.t2fwz">
            <div data-oid="0m:v8iw">
              <label className="text-sm font-medium" data-oid="q1967a2">
                Max Transaction Amount ($)
              </label>
              <Input
                type="number"
                name="max_transaction_amount"
                value={settings.max_transaction_amount}
                onChange={handleInputChange}
                min={0}
                data-oid="6v65em2"
              />
            </div>
            <div data-oid="yw3-4wg">
              <label className="text-sm font-medium" data-oid="vsggl2:">
                Min Transaction Amount ($)
              </label>
              <Input
                type="number"
                name="min_transaction_amount"
                value={settings.min_transaction_amount}
                onChange={handleInputChange}
                min={0}
                data-oid="-p7u26:"
              />
            </div>
            <div data-oid=".k5mdae">
              <label className="text-sm font-medium" data-oid="njsp839">
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
                data-oid="hv_0ncf"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card data-oid="yaj648r">
        <CardHeader data-oid="a564.he">
          <CardTitle className="flex items-center space-x-2" data-oid="jgoi4xt">
            <Bell className="w-5 h-5 text-emerald-600" data-oid="jc5ewx_" />
            <span data-oid="oqr-lgy">Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="d:i8qr_">
          <div className="grid md:grid-cols-3 gap-4" data-oid="tl1p201">
            <div className="flex items-center space-x-2" data-oid="k:gpgs7">
              <input
                type="checkbox"
                id="email_notifications"
                name="email_notifications"
                checked={settings.email_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
                data-oid="s5fmo1l"
              />

              <label
                htmlFor="email_notifications"
                className="text-sm font-medium"
                data-oid="bq9voql"
              >
                Email Notifications
              </label>
            </div>
            <div className="flex items-center space-x-2" data-oid="i-y:nc2">
              <input
                type="checkbox"
                id="sms_notifications"
                name="sms_notifications"
                checked={settings.sms_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
                data-oid="pdxxrxs"
              />

              <label
                htmlFor="sms_notifications"
                className="text-sm font-medium"
                data-oid="r2b9epw"
              >
                SMS Notifications
              </label>
            </div>
            <div className="flex items-center space-x-2" data-oid=":f0wxuw">
              <input
                type="checkbox"
                id="push_notifications"
                name="push_notifications"
                checked={settings.push_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
                data-oid="o9xe0d6"
              />

              <label
                htmlFor="push_notifications"
                className="text-sm font-medium"
                data-oid="gxh9ri0"
              >
                Push Notifications
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card data-oid="hy5x2b8">
        <CardHeader data-oid="bez41e8">
          <CardTitle className="flex items-center space-x-2" data-oid="fd3ei6o">
            <Palette className="w-5 h-5 text-emerald-600" data-oid="fg0q2wf" />
            <span data-oid="tgc.pjb">Theme Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="s2lryym">
          <div className="grid md:grid-cols-2 gap-4" data-oid="c70bybe">
            <div data-oid="t7aj86o">
              <label className="text-sm font-medium" data-oid="p2i7zw7">
                Primary Color
              </label>
              <div className="flex items-center space-x-2" data-oid="tkxh81d">
                <input
                  type="color"
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 rounded border"
                  data-oid="peki14f"
                />

                <Input
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  data-oid="tpfnqnt"
                />
              </div>
            </div>
            <div data-oid="j-67af0">
              <label className="text-sm font-medium" data-oid="wrbmlk:">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2" data-oid="3k6ntgp">
                <input
                  type="color"
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 rounded border"
                  data-oid="f:::1jh"
                />

                <Input
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                  data-oid="2sne:2."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end" data-oid="q7i.7y_">
        <Button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700"
          data-oid="3k4jwrp"
        >
          <Save className="w-4 h-4 mr-2" data-oid="fq-1c.8" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
