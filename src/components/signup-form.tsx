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
  const baseurl = "http://localhost:8001";

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
      data-oid="dce9d0p"
    >
      {/* Logo Section */}
      <div className="flex justify-center mb-8" data-oid="v--3lf2">
        <div className="relative" data-oid="7_b90if">
          <img
            src="/assets/white_logo.png"
            alt="kaascan logo"
            className="w-64 h-20 object-contain drop-shadow-lg"
            data-oid="5ms0_r."
          />

          <div
            className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse"
            data-oid="lzf-25k"
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
        data-oid="7lxa5fp"
      >
        <CardContent className="grid p-0 md:grid-cols-2" data-oid="-8a5vfi">
          <form
            className="p-8 md:p-10 w-full bg-brand dark:bg-brand"
            data-oid="e5xv8zv"
          >
            <div className="flex flex-col gap-6" data-oid="l15kwmf">
              {/* Header */}
              <div className="text-center mb-6" data-oid="wu.::c2">
                <div className="flex justify-center mb-4" data-oid="dh6xn4e">
                  <div
                    className="p-4 bg-white text-brand rounded-full shadow-lg"
                    data-oid="1169b3n"
                  >
                    {isSignupComplete ? (
                      <Shield
                        className="w-8 h-8 text-white"
                        data-oid="p9urkcm"
                      />
                    ) : (
                      <User className="w-8 h-8 text-brand" data-oid="sckmk5w" />
                    )}
                  </div>
                </div>
                <h1
                  className="text-3xl font-bold text-white dark:text-white mb-2"
                  data-oid="z5uxei:"
                >
                  {isSignupComplete ? "Verify Your Phone" : "Join Our Family"}
                </h1>
                <p className="text-white dark:text-white" data-oid="9b9fqu0">
                  {isSignupComplete
                    ? "We've sent a 6-digit code to your phone number"
                    : "Create your account to start managing your children's finances safely"}
                </p>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-center space-x-3"
                  data-oid="-p:wr9n"
                >
                  <div
                    className="p-1 bg-red-500 rounded-full"
                    data-oid="avq7.1h"
                  >
                    <CheckCircle
                      className="w-4 h-4 text-white"
                      data-oid="de0nfao"
                    />
                  </div>
                  <p
                    className="text-red-700 dark:text-red-400 text-sm"
                    data-oid="9:dtl:9"
                  >
                    {errors.general}
                  </p>
                </div>
              )}

              {!isSignupComplete ? (
                <>
                  {/* Full Name Field */}
                  <div className="space-y-2" data-oid="yuqp7b_">
                    <Label
                      htmlFor="fullnames"
                      className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2"
                      data-oid="td8vuxd"
                    >
                      <User className="w-4 h-4" data-oid="2840i5i" />
                      <span data-oid="mnsuw:7">Full Name</span>
                    </Label>
                    <div className="relative" data-oid="mwnh:h-">
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
                        data-oid="spjces_"
                      />

                      <User
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        data-oid="1cjjqp6"
                      />
                    </div>
                    {errors.fullnames && (
                      <p
                        className="text-red-500 text-sm flex items-center space-x-1"
                        data-oid="h3y-qll"
                      >
                        <span data-oid="ehlv8mz">⚠️</span>
                        <span data-oid="xvyesm5">{errors.fullnames}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-2" data-oid="w5pzm.l">
                    <Label
                      htmlFor="phone"
                      className="text-white font-medium flex items-center space-x-2"
                      data-oid="4pj__0o"
                    >
                      <Phone className="w-4 h-4" data-oid="pn60653" />
                      <span data-oid="1jw7.65">Phone Number</span>
                    </Label>
                    <div className="relative" data-oid="78cu8f0">
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
                        data-oid="4hiqpol"
                      />

                      <Phone
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        data-oid="a0gryou"
                      />

                      <div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs bg-blue-100 dark:bg-brand text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                        data-oid="axodf3:"
                      >
                        🇷🇼 Rwanda
                      </div>
                    </div>
                    {errors.phonenumber && (
                      <p
                        className="text-red-500 text-sm flex items-center space-x-1"
                        data-oid="rqridny"
                      >
                        <span data-oid="drnp0-l">⚠️</span>
                        <span data-oid="cp:panu">{errors.phonenumber}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2" data-oid="z17yna3">
                    <Label
                      htmlFor="password"
                      className="text-white font-medium flex items-center space-x-2"
                      data-oid="qklimtx"
                    >
                      <Lock className="w-4 h-4" data-oid="nzzp.ut" />
                      <span data-oid="xm2n:u5">Password</span>
                    </Label>
                    <div className="relative" data-oid="q54dmxt">
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
                        data-oid="py44:g8"
                      />

                      <Lock
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        data-oid="031sdkj"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        data-oid="1bpn_2h"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" data-oid="0ewakrt" />
                        ) : (
                          <Eye className="w-5 h-5" data-oid="pqe.wk1" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-2" data-oid="xzxj440">
                        <div
                          className="flex items-center space-x-2"
                          data-oid="k:x-ukb"
                        >
                          <div
                            className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2"
                            data-oid="uhlqxlf"
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
                              data-oid="vbvs9.a"
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
                            data-oid="_:2q.oq"
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
                        data-oid="l9oohep"
                      >
                        <span data-oid="m57h:15">⚠️</span>
                        <span data-oid="sbilqv7">{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="button"
                    onClick={signup_submit}
                    disabled={isLoading}
                    className="w-full h-12 bg-white text-brand hover:bg-brand font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    data-oid="omeyfyx"
                  >
                    {isLoading ? (
                      <div
                        className="flex items-center space-x-2"
                        data-oid="347lbv."
                      >
                        <Loader2
                          className="w-5 h-5 animate-spin"
                          data-oid="f21xwz_"
                        />

                        <span data-oid="tqzp6dg">Creating Account...</span>
                      </div>
                    ) : (
                      <div
                        className="flex items-center space-x-2"
                        data-oid="s2cqzr-"
                      >
                        <Star className="w-5 h-5" data-oid="._lib1y" />
                        <span data-oid="vyth:nd">Create My Account</span>
                      </div>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* OTP Field */}
                  <div className="space-y-4" data-oid="6_ugmmn">
                    <Label
                      htmlFor="otp"
                      className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2"
                      data-oid="ae:v.3:"
                    >
                      <Shield className="w-4 h-4" data-oid="ss6:i.n" />
                      <span data-oid="yznwdqm">Verification Code</span>
                    </Label>
                    <div className="relative" data-oid="cnxqiyv">
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
                        data-oid=".:iga70"
                      />
                    </div>
                    <div className="text-center" data-oid="75_w2dk">
                      <p
                        className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                        data-oid="cjlve18"
                      >
                        Code sent to:{" "}
                        <span className="font-semibold" data-oid="c4z1u4x">
                          {phonenumber}
                        </span>
                      </p>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                        data-oid="pmz0ily"
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
                    data-oid="6coxfdx"
                  >
                    <div
                      className="flex items-center space-x-2"
                      data-oid="cq:f298"
                    >
                      <CheckCircle className="w-5 h-5" data-oid=".bo1q74" />
                      <span data-oid=".o.s934">Verify & Continue</span>
                    </div>
                  </Button>
                </>
              )}
            </div>
          </form>

          {/* Side Image */}
          <div
            className="relative hidden md:block bg-brand overflow-hidden"
            data-oid="7durq:s"
          >
            <div className="absolute inset-0 bg-brand" data-oid="uz-1bg_"></div>
            <img
              src="/banner5.png"
              alt="Happy family managing finances"
              className="absolute inset-0 object-cover h-full w-full opacity-80"
              data-oid="tg0_aoc"
            />

            <div
              className="absolute inset-0 flex flex-col justify-center items-center text-white p-8"
              data-oid="10y_sf7"
            >
              <div className="text-center space-y-6" data-oid="1:z6b:b">
                <h2 className="text-3xl font-bold" data-oid="de1g02.">
                  Trusted by 10,000+ Parents
                </h2>
                <p className="text-lg opacity-90" data-oid="w7gduma">
                  Join families across Rwanda who trust us with their children's
                  financial education
                </p>
                <div
                  className="flex items-center justify-center space-x-1"
                  data-oid="f11p3iw"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 fill-yellow-400 text-yellow-400"
                      data-oid="gk9q_qw"
                    />
                  ))}
                  <span
                    className="ml-2 text-lg font-semibold"
                    data-oid="-9fad9r"
                  >
                    4.9/5
                  </span>
                </div>
                <div
                  className="grid grid-cols-2 gap-4 text-center"
                  data-oid="flgiyqj"
                >
                  <div
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-4"
                    data-oid="r87ysyq"
                  >
                    <CreditCard
                      className="w-8 h-8 mx-auto mb-2"
                      data-oid="d.hz0xt"
                    />

                    <p className="text-sm font-medium" data-oid="7kk_01k">
                      Secure Payments
                    </p>
                  </div>
                  <div
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-4"
                    data-oid="ca5sl4n"
                  >
                    <Users
                      className="w-8 h-8 mx-auto mb-2"
                      data-oid="zspsfk1"
                    />

                    <p className="text-sm font-medium" data-oid="x06vzw0">
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
        className="text-xs text-center text-muted-foreground"
        data-oid="l707lyp"
      >
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline" data-oid="pp5hxa0">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline" data-oid="19:jnfq">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
