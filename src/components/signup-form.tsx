"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Lock,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Heart,
  Star,
  Users,
  CreditCard,
} from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const baseurl = "https://api.kaascan.com";

  const [isSubmitted, setSubmitted] = useState(false);
  const [isSignupComplete, setSignupComplete] = useState(false);
  const [fullnames, setFullnames] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors = {};

    if (!fullnames.trim()) {
      newErrors.fullnames = "Full name is required";
    } else if (fullnames.trim().length < 2) {
      newErrors.fullnames = "Name must be at least 2 characters";
    }

    if (!phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required";
    } else if (
      !/^(\+250|250|0)?[7][0-9]{8}$/.test(phonenumber.replace(/\s/g, ""))
    ) {
      newErrors.phonenumber = "Please enter a valid Rwandan phone number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  function signup_submit() {
    if (validateForm()) {
      setIsLoading(true);
      setSubmitted(true);
    }
  }

  useEffect(() => {
    if (!isSubmitted) return;

    async function signup() {
      try {
        // Step 1: fetch CSRF token
        const csrfRes = await fetch(`${baseurl}/get-csrf-token`);
        const csrfJson = await csrfRes.json();

        if (!csrfJson?.csrf_token) {
          throw new Error("CSRF token fetch failed");
        }

        const token = csrfJson.csrf_token;
        setCsrfToken(token);

        // Step 2: submit signup
        const signupRes = await fetch(`${baseurl}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": token,
          },
          body: JSON.stringify({
            fullnames,
            phone_number: phonenumber,
            password,
            csrf_token: token,
          }),
        });

        const data = await signupRes.json();

        if (data.status === "success") {
          localStorage.setItem("token", data.token);
          setSignupComplete(true);
          console.log("[✅] Signup successful");
        } else {
          console.error("[❌] Signup failed:", data.detail || data.message);
          setErrors({
            general: data.detail || data.message || "Signup failed",
          });
        }
      } catch (err) {
        console.error("[❌] Unexpected signup error:", err);
        setErrors({ general: "Network error. Please try again." });
      } finally {
        setSubmitted(false);
        setIsLoading(false);
      }
    }

    signup();
  }, [isSubmitted]);

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      data-oid="1wqbflh"
    >
      {/* Logo Section */}
      <div className="flex justify-center mb-8" data-oid=".c6wgxd">
        <div className="relative" data-oid="wp:oi23">
          <img
            src="/assets/alllogo.png"
            alt="kaascan logo"
            className="w-64 h-20 object-contain drop-shadow-lg"
            data-oid="pch6y9-"
          />

          <div
            className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse"
            data-oid="upwdu8d"
          >
            For Parents
          </div>
        </div>
      </div>

      {/* Benefits Banner */}
      {/* <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                  data-oid="nm06:re"
                 >
                  <div
                    className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700"
                    data-oid="u3doe48"
                  >
                    <div className="p-2 bg-green-500 rounded-lg" data-oid="cwvt87.">
                      <Shield className="w-5 h-5 text-white" data-oid=":il2tuu" />
                    </div>
                    <div data-oid="-dldapz">
                      <h3
                        className="font-semibold text-green-800 dark:text-green-300 text-sm"
                        data-oid="wwghd.9"
                      >
                        Secure Payments
                      </h3>
                      <p
                        className="text-green-600 dark:text-green-400 text-xs"
                        data-oid="3i-k352"
                      >
                        Bank-level security
                      </p>
                    </div>
                  </div>
                   <div
                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700"
                    data-oid="nd_mp4c"
                  >
                    <div className="p-2 bg-blue-500 rounded-lg" data-oid=".r_xnfg">
                      <Users className="w-5 h-5 text-white" data-oid="glgp5ow" />
                    </div>
                    <div data-oid="tu61zae">
                      <h3
                        className="font-semibold text-blue-800 dark:text-blue-300 text-sm"
                        data-oid="sfthb0d"
                      >
                        Family Control
                      </h3>
                      <p
                        className="text-blue-600 dark:text-blue-400 text-xs"
                        data-oid="t-yr7ri"
                      >
                        Monitor spending
                      </p>
                    </div>
                  </div>
                   <div
                    className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700"
                    data-oid="z02j7qb"
                  >
                    <div className="p-2 bg-purple-500 rounded-lg" data-oid="y4c8dao">
                      <Heart className="w-5 h-5 text-white" data-oid="gyyqdo7" />
                    </div>
                    <div data-oid="_y1h9k6">
                      <h3
                        className="font-semibold text-purple-800 dark:text-purple-300 text-sm"
                        data-oid="bf6.o-v"
                      >
                        Peace of Mind
                      </h3>
                      <p
                        className="text-purple-600 dark:text-purple-400 text-xs"
                        data-oid="lfff0mj"
                      >
                        Real-time alerts
                      </p>
                    </div>
                  </div>
                 </div> */}

      <Card
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border-0 overflow-hidden"
        data-oid="6tiv-3_"
      >
        <CardContent className="grid p-0 md:grid-cols-2" data-oid="xxwhrbc">
          <form
            className="p-8 md:p-10 w-full bg-brand dark:bg-brand"
            data-oid="z4p5wxf"
          >
            <div className="flex flex-col gap-6" data-oid="ao..h0s">
              {/* Header */}
              <div className="text-center mb-6" data-oid="3kx0fx6">
                <div className="flex justify-center mb-4" data-oid="bwq-kxz">
                  <div
                    className="p-4 bg-white text-brand rounded-full shadow-lg"
                    data-oid="l998qo-"
                  >
                    {isSignupComplete ? (
                      <Shield
                        className="w-8 h-8 text-white"
                        data-oid=".u5ze29"
                      />
                    ) : (
                      <User className="w-8 h-8 text-brand" data-oid=".u-ajl1" />
                    )}
                  </div>
                </div>
                <h1
                  className="text-3xl font-bold text-white dark:text-white mb-2"
                  data-oid="dlfzk6a"
                >
                  {isSignupComplete ? "Verify Your Phone" : "Join Our Family"}
                </h1>
                <p className="text-white dark:text-white" data-oid="zloscb6">
                  {isSignupComplete
                    ? "We've sent a 6-digit code to your phone number"
                    : "Create your account to start managing your children's finances safely"}
                </p>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-center space-x-3"
                  data-oid="9vg_rsk"
                >
                  <div
                    className="p-1 bg-red-500 rounded-full"
                    data-oid="y5mur8d"
                  >
                    <CheckCircle
                      className="w-4 h-4 text-white"
                      data-oid="qbai9lx"
                    />
                  </div>
                  <p
                    className="text-red-700 dark:text-red-400 text-sm"
                    data-oid="qg:9j7m"
                  >
                    {errors.general}
                  </p>
                </div>
              )}

              {!isSignupComplete ? (
                <>
                  {/* Full Name Field */}
                  <div className="space-y-2" data-oid="x4b0rps">
                    <Label
                      htmlFor="fullnames"
                      className="text-white dark:text-gray-300 font-medium flex items-center space-x-2"
                      data-oid="impoozi"
                    >
                      <User className="w-4 h-4" data-oid="_.clhh1" />
                      <span data-oid="f7tlfnu">Full Name</span>
                    </Label>
                    <div className="relative" data-oid="2:8qfvg">
                      <Input
                        id="fullnames"
                        value={fullnames}
                        onChange={(e) => {
                          setFullnames(e.target.value);
                          if (errors.fullnames)
                            setErrors({ ...errors, fullnames: null });
                        }}
                        required
                        className={`pl-12 h-12 text-brand dark:text-white bg-white dark:bg-white  transition-all duration-200 ${
                          errors.fullnames
                            ? "border-red-500 focus:border-red-500"
                            : "border-brand dark:border-gray-600 focus:border-blue-500"
                        }`}
                        placeholder="Enter your full name"
                        data-oid="k-wjris"
                      />

                      <User
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        data-oid="a:yt4i0"
                      />
                    </div>
                    {errors.fullnames && (
                      <p
                        className="text-red-500 text-sm flex items-center space-x-1"
                        data-oid="yizgruq"
                      >
                        <span data-oid="j-8:xry">⚠️</span>
                        <span data-oid="_bn4qt2">{errors.fullnames}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-2" data-oid="xx_w1md">
                    <Label
                      htmlFor="phone"
                      className="text-white font-medium flex items-center space-x-2"
                      data-oid="7h3okku"
                    >
                      <Phone className="w-4 h-4" data-oid="omx:kn3" />
                      <span data-oid="6uwnh3w">Phone Number</span>
                    </Label>
                    <div className="relative" data-oid="7z1127b">
                      <Input
                        id="phone"
                        type="tel"
                        value={phonenumber}
                        onChange={(e) => {
                          setPhonenumber(e.target.value);
                          if (errors.phonenumber)
                            setErrors({ ...errors, phonenumber: null });
                        }}
                        className={`pl-12 h-12  text-brand dark:text-white bg-white dark:bg-white border-brand transition-all duration-200 ${
                          errors.phonenumber
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 dark:border-gray-600 focus:border-blue-500"
                        }`}
                        placeholder="078XXXXXXX"
                        required
                        data-oid="f::-35m"
                      />

                      <Phone
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        data-oid="awc9ypj"
                      />

                      <div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs bg-blue-100 dark:bg-brand text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                        data-oid="a.-e.na"
                      >
                        🇷🇼 Rwanda
                      </div>
                    </div>
                    {errors.phonenumber && (
                      <p
                        className="text-red-500 text-sm flex items-center space-x-1"
                        data-oid="8px23-:"
                      >
                        <span data-oid=":j4awjq">⚠️</span>
                        <span data-oid="wx9cs62">{errors.phonenumber}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2" data-oid=".:my8t8">
                    <Label
                      htmlFor="password"
                      className="text-white font-medium flex items-center space-x-2"
                      data-oid="0_ckxz4"
                    >
                      <Lock className="w-4 h-4" data-oid="cd1g44-" />
                      <span data-oid="uzfa44r">Password</span>
                    </Label>
                    <div className="relative" data-oid="-v7et_z">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password)
                            setErrors({ ...errors, password: null });
                        }}
                        className={`pl-12 pr-12 h-12  text-brand dark:text-white bg-white dark:bg-white border-2 transition-all duration-200 ${
                          errors.password
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 dark:border-gray-600 focus:border-blue-500"
                        }`}
                        placeholder="Create a secure password"
                        required
                        data-oid="n:tl5ak"
                      />

                      <Lock
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        data-oid="_60.lz7"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        data-oid="hbgd57."
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" data-oid="-gr3alw" />
                        ) : (
                          <Eye className="w-5 h-5" data-oid="v:eo9dm" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-2" data-oid="35ny0a0">
                        <div
                          className="flex items-center space-x-2"
                          data-oid="21itml7"
                        >
                          <div
                            className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2"
                            data-oid="3mob_:1"
                          >
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength < 50
                                  ? "bg-red-500"
                                  : passwordStrength < 75
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                              data-oid="ghd70lu"
                            />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength < 50
                                ? "text-red-500"
                                : passwordStrength < 75
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }`}
                            data-oid=":mkqr3-"
                          >
                            {passwordStrength < 50
                              ? "Weak"
                              : passwordStrength < 75
                                ? "Good"
                                : "Strong"}
                          </span>
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p
                        className="text-red-500 text-sm flex items-center space-x-1"
                        data-oid="oe.0rhu"
                      >
                        <span data-oid="dl748_w">⚠️</span>
                        <span data-oid="ed-8gok">{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="button"
                    onClick={signup_submit}
                    disabled={isLoading}
                    className="w-full h-12 bg-white text-brand hover:bg-brand font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    data-oid="rkb6d9h"
                  >
                    {isLoading ? (
                      <div
                        className="flex items-center space-x-2"
                        data-oid="ym1_v25"
                      >
                        <Loader2
                          className="w-5 h-5 animate-spin"
                          data-oid="-qxi1s0"
                        />

                        <span data-oid="sph8iun">Creating Account...</span>
                      </div>
                    ) : (
                      <div
                        className="flex items-center space-x-2"
                        data-oid="f84y.du"
                      >
                        <Star className="w-5 h-5" data-oid="v52i80u" />
                        <span data-oid="up12oz-">Create My Account</span>
                      </div>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* OTP Field */}
                  <div className="space-y-4" data-oid="bw256jk">
                    <Label
                      htmlFor="otp"
                      className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2"
                      data-oid="c9vk_87"
                    >
                      <Shield className="w-4 h-4" data-oid="c7b1zj8" />
                      <span data-oid="lwbv.:_">Verification Code</span>
                    </Label>
                    <div className="relative" data-oid="wua2934">
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="000000"
                        maxLength={6}
                        className="text-center tracking-[0.5em] text-2xl font-bold h-16 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500"
                        required
                        data-oid="0f28ifn"
                      />
                    </div>
                    <div className="text-center" data-oid="-2n_cyu">
                      <p
                        className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                        data-oid="4xjcjyj"
                      >
                        Code sent to:{" "}
                        <span className="font-semibold" data-oid="r9d9fck">
                          {phonenumber}
                        </span>
                      </p>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                        data-oid="4xof2z."
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>

                  {/* Verify Button */}
                  <Button
                    type="submit"
                    disabled={otp.length !== 6}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-oid="hk480bn"
                  >
                    <div
                      className="flex items-center space-x-2"
                      data-oid="gxsuzf-"
                    >
                      <CheckCircle className="w-5 h-5" data-oid="5202vp-" />
                      <span data-oid="v.a_5ce">Verify & Continue</span>
                    </div>
                  </Button>
                </>
              )}
            </div>
          </form>

          {/* Side Image */}
          <div
            className="relative hidden md:block bg-brand overflow-hidden"
            data-oid="t4vt4tr"
          >
            <div className="absolute inset-0 bg-brand" data-oid="l89ccii"></div>
            <img
              src="/banner5.png"
              alt="Happy family managing finances"
              className="absolute inset-0 object-cover h-full w-full opacity-80"
              data-oid="jo-3let"
            />

            <div
              className="absolute inset-0 flex flex-col justify-center items-center text-white p-8"
              data-oid="3hv4w.7"
            >
              <div className="text-center space-y-6" data-oid="7vankly">
                <h2 className="text-3xl font-bold" data-oid="faqs-aq">
                  Trusted by 10,000+ Parents
                </h2>
                <p className="text-lg opacity-90" data-oid="novot3d">
                  Join families across Rwanda who trust us with their children's
                  financial education
                </p>
                <div
                  className="flex items-center justify-center space-x-1"
                  data-oid="zjz247s"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 fill-yellow-400 text-yellow-400"
                      data-oid="i_94ddv"
                    />
                  ))}
                  <span
                    className="ml-2 text-lg font-semibold"
                    data-oid="z-x8_r."
                  >
                    4.9/5
                  </span>
                </div>
                <div
                  className="grid grid-cols-2 gap-4 text-center"
                  data-oid="nra:zg."
                >
                  <div
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-4"
                    data-oid="z4:dqrw"
                  >
                    <CreditCard
                      className="w-8 h-8 mx-auto mb-2"
                      data-oid="402hld3"
                    />

                    <p className="text-sm font-medium" data-oid="0n1yep9">
                      Secure Payments
                    </p>
                  </div>
                  <div
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-4"
                    data-oid="dhhp63j"
                  >
                    <Users
                      className="w-8 h-8 mx-auto mb-2"
                      data-oid="szrt9vo"
                    />

                    <p className="text-sm font-medium" data-oid="sd9yg:o">
                      Family Control
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p
        className="text-xs text-center text-white"
        data-oid="7k0plsv"
      >
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline" data-oid=".rcz:rb">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline" data-oid="et461dc">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
