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
          "https://api.kaascan.com/admin/get-csrf-token",
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
      const response = await axios.get(
        "https://api.kaascan.com/admin/settings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true, // Send session_id cookie
        },
      );
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
      await axios.put("https://api.kaascan.com/admin/settings", settings, {
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
      <div className="text-center p-4" data-oid="c.y_ggt">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6" data-oid="6hryv4y">
      {error && (
        <div className="text-red-500 text-center p-4" data-oid="n74rk_-">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-500 text-center p-4" data-oid="94-ezz3">
          {success}
        </div>
      )}
      {/* Platform Settings */}
      <Card data-oid="tepqt0o">
        <CardHeader data-oid="6.ez1ho">
          <CardTitle className="flex items-center space-x-2" data-oid="upxq9rw">
            <Shield className="w-5 h-5 text-emerald-600" data-oid="ljzeulr" />
            <span data-oid="as:c3al">Platform Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid=".osahfh">
          <div className="grid md:grid-cols-2 gap-4" data-oid="tihusht">
            <div data-oid="ci2kce8">
              <label className="text-sm font-medium" data-oid=":ahcsaq">
                Platform Name
              </label>
              <Input
                name="platform_name"
                value={settings.platform_name}
                onChange={handleInputChange}
                data-oid="iip:2c2"
              />
            </div>
            <div data-oid="9m69v9k">
              <label className="text-sm font-medium" data-oid="xee6ggx">
                Platform Email
              </label>
              <Input
                type="email"
                name="platform_email"
                value={settings.platform_email}
                onChange={handleInputChange}
                data-oid="0r-.1lu"
              />
            </div>
            <div data-oid="ayrki01">
              <label className="text-sm font-medium" data-oid="qyse7r-">
                Support Email
              </label>
              <Input
                type="email"
                name="support_email"
                value={settings.support_email}
                onChange={handleInputChange}
                data-oid="qgq2iki"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Settings */}
      <Card data-oid="tl1v.lm">
        <CardHeader data-oid="t_1x_t4">
          <CardTitle className="flex items-center space-x-2" data-oid="bvukbbb">
            <DollarSign
              className="w-5 h-5 text-emerald-600"
              data-oid="4ltz53w"
            />

            <span data-oid=".j7:ka_">Transaction Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="o_480kg">
          <div className="grid md:grid-cols-3 gap-4" data-oid="brvvd1c">
            <div data-oid="rj831.x">
              <label className="text-sm font-medium" data-oid="mq1ta-y">
                Max Transaction Amount ($)
              </label>
              <Input
                type="number"
                name="max_transaction_amount"
                value={settings.max_transaction_amount}
                onChange={handleInputChange}
                min={0}
                data-oid="qqnyjpt"
              />
            </div>
            <div data-oid="y8fxbw1">
              <label className="text-sm font-medium" data-oid="u17d701">
                Min Transaction Amount ($)
              </label>
              <Input
                type="number"
                name="min_transaction_amount"
                value={settings.min_transaction_amount}
                onChange={handleInputChange}
                min={0}
                data-oid=".3tr0oq"
              />
            </div>
            <div data-oid="h2gy__2">
              <label className="text-sm font-medium" data-oid="af:0twm">
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
                data-oid="v2qvbc1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card data-oid="iehetcq">
        <CardHeader data-oid="3p_d0x6">
          <CardTitle className="flex items-center space-x-2" data-oid="ldq3bxg">
            <Bell className="w-5 h-5 text-emerald-600" data-oid="m6onizk" />
            <span data-oid="9a53w_t">Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="6d-2c4h">
          <div className="grid md:grid-cols-3 gap-4" data-oid="0axgydq">
            <div className="flex items-center space-x-2" data-oid="r6gkmsa">
              <input
                type="checkbox"
                id="email_notifications"
                name="email_notifications"
                checked={settings.email_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
                data-oid="-v1e7f2"
              />

              <label
                htmlFor="email_notifications"
                className="text-sm font-medium"
                data-oid="nw4adfm"
              >
                Email Notifications
              </label>
            </div>
            <div className="flex items-center space-x-2" data-oid=":ytni0:">
              <input
                type="checkbox"
                id="sms_notifications"
                name="sms_notifications"
                checked={settings.sms_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
                data-oid="jpzg9vj"
              />

              <label
                htmlFor="sms_notifications"
                className="text-sm font-medium"
                data-oid="ds1dt88"
              >
                SMS Notifications
              </label>
            </div>
            <div className="flex items-center space-x-2" data-oid="2mzawbq">
              <input
                type="checkbox"
                id="push_notifications"
                name="push_notifications"
                checked={settings.push_notifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-emerald-600"
                data-oid="011qwnz"
              />

              <label
                htmlFor="push_notifications"
                className="text-sm font-medium"
                data-oid="3ki3y8:"
              >
                Push Notifications
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card data-oid="to3763w">
        <CardHeader data-oid="z:2t_kr">
          <CardTitle className="flex items-center space-x-2" data-oid="mvth41-">
            <Palette className="w-5 h-5 text-emerald-600" data-oid="g.0ztyo" />
            <span data-oid="hid6g40">Theme Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="xbtsuq5">
          <div className="grid md:grid-cols-2 gap-4" data-oid="1seehb4">
            <div data-oid="afj1_51">
              <label className="text-sm font-medium" data-oid="v1nlcvs">
                Primary Color
              </label>
              <div className="flex items-center space-x-2" data-oid="v.842ia">
                <input
                  type="color"
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 rounded border"
                  data-oid="q..cido"
                />

                <Input
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  data-oid="6no5vn9"
                />
              </div>
            </div>
            <div data-oid="focd8mn">
              <label className="text-sm font-medium" data-oid=".loh-hh">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2" data-oid="gucq8rb">
                <input
                  type="color"
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 rounded border"
                  data-oid="zs:qbde"
                />

                <Input
                  name="secondary_color"
                  value={settings.secondary_color}
                  onChange={handleInputChange}
                  data-oid="wzvc-e6"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end" data-oid="8s0u5wf">
        <Button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700"
          data-oid="k5s3z5v"
        >
          <Save className="w-4 h-4 mr-2" data-oid="a6n_c61" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
