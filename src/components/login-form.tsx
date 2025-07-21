import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Phone,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  Heart,
  Star,
  Users,
  CreditCard,
  ArrowRight,
  RefreshCw,
  Home,
  AlertCircle,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoginComplete, setIsLoginComplete] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [totpCode, setTotpCode] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(0);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const isPasswordReset = params.get("resetPassword") === "true";
  const baseUrl = "https://api.kaascan.com";

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    const cleanedPhone = phoneNumber;
    if (!cleanedPhone) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!isPasswordReset && !isLoginComplete) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 5) {
        newErrors.password = "Password must be at least 5 characters";
      }
    }

    if (isPasswordReset && isLoginComplete) {
      if (!newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters";
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Fetch CSRF token on component mount
  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const response = await fetch(`${baseUrl}/get-csrf-token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.status === "success") {
          setCsrfToken(data.csrf_token);
        } else {
          throw new Error("Failed to fetch CSRF token");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch CSRF token. Please try again.",
        });
      }
    }
    fetchCsrfToken();
  }, [toast]);

  // Handle login submission
  async function loginSubmit() {
    if (!validateForm()) return;
    if (!phoneNumber || !password || !csrfToken) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      });
      return;
    }
    setSubmitted(true);
  }

  // Handle TOTP submission
  async function totpSubmit() {
    const fullTotpCode = totpCode.join("");
    if (fullTotpCode.length !== 4 || !/^\d{4}$/.test(fullTotpCode)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 4-digit OTP code.",
      });
      return;
    }
    setSubmitted(true);
  }

  // Handle password reset submission
  async function handleResetSubmit() {
    if (!validateForm()) return;
    const fullTotpCode = totpCode.join("");
    if (fullTotpCode.length !== 4 || !/^\d{4}$/.test(fullTotpCode)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 4-digit OTP code.",
      });
      return;
    }
    setSubmitted(true);

    try {
      const cleanedPhone = phoneNumber.replace("+250", "").replace("250", "").replace(" ", "");
      const response = await fetch(`${baseUrl}/password-reset/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          phone_number: cleanedPhone,
          otp_code: fullTotpCode,
          new_password: newPassword,
          csrf_token: csrfToken,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        toast({
          title: "Success",
          description: data.message,
          action: (
            <ToastAction altText="Go to login" data-oid="k_lxnx-">
              Go to login
            </ToastAction>
          ),
        });
        setPhoneNumber("");
        setNewPassword("");
        setConfirmPassword("");
        setTotpCode(["", "", "", ""]);
        setIsLoginComplete(false);
        navigate("/login");
      } else {
        throw new Error(data.detail || "Failed to reset password");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
      });
    } finally {
      setSubmitted(false);
    }
  }

  // Handle login or TOTP verification
  useEffect(() => {
    if (!isSubmitted || !csrfToken) return;

    async function login() {
      try {
        let response;
        const cleanedPhone = phoneNumber.replace("+250", "").replace("250", "").replace(" ", "");
        if (!isLoginComplete) {
          response = await fetch(`${baseUrl}/login/parent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({
              phone_number: cleanedPhone,
              password,
              totp_code: "",
              csrf_token: csrfToken,
            }),
          });
        } else if (!isPasswordReset) {
          response = await fetch(`${baseUrl}/login/parent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({
              phone_number: cleanedPhone,
              password,
              totp_code: totpCode.join(""),
              csrf_token: csrfToken,
            }),
          });
        }

        const data = await response.json();

        if (response.status === 200 && data.status === "success") {
          if (!isLoginComplete) {
            setIsLoginComplete(true);
            setSubmitted(false);
            toast({
              title: "Success",
              description: data.message || "Please enter your OTP code sent to your phone.",
            });
          } else {
            localStorage.setItem("token", data.token);
            setPhoneNumber("");
            setPassword("");
            setTotpCode(["", "", "", ""]);
            setSubmitted(false);
            setIsLoginComplete(false);
            toast({
              title: "Success",
              description: data.message || "Login successful!",
              action: (
                <ToastAction altText="Go to dashboard" data-oid="k_lxnx-">
                  Go to dashboard
                </ToastAction>
              ),
            });
            navigate("/dashboard");
          }
        } else {
          throw new Error(data.detail || "Login failed");
        }
      } catch (error) {
        setSubmitted(false);
        setTotpCode(["", "", "", ""]);
        if (isLoginComplete) setIsLoginComplete(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Login failed. Please try again.",
        });
      }
    }
    login();
  }, [
    isSubmitted,
    phoneNumber,
    password,
    totpCode,
    csrfToken,
    isLoginComplete,
    isPasswordReset,
    toast,
    navigate,
  ]);

  // Handle TOTP input changes
  const handleTotpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newTotpCode = [...totpCode];
    newTotpCode[index] = value;
    setTotpCode(newTotpCode);
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  async function handleRequestOtp(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    if (!validateForm()) return;
    const cleanedPhone = phoneNumber.replace("+250", "").replace("250", "").replace(" ", "");
    if (!cleanedPhone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your phone number.",
      });
      return;
    }
    setSubmitted(true);
    try {
      const response = await fetch(`${baseUrl}/password-reset/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ phone_number: cleanedPhone, csrf_token: csrfToken }),
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setIsLoginComplete(true);
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        throw new Error(data.detail || "Failed to send OTP.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send OTP.",
      });
    } finally {
      setSubmitted(false);
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      data-oid="sgjl0w3"
    >
      <div className="flex flex-col items-center mb-0" data-oid="cpf.tcw">
        <img
          src="/assets/alllogo.png"
          alt="kigo logo"
          className="object-contain bg-[rgba(0,_0,_0,_0)] w-[290px] h-[126px] bg-none"
          data-oid="sb_-o-p"
        />
      </div>
      <Card
        className="overflow-hidden bg-brand border-brand"
        data-oid="5r_1xii"
      >
        <CardContent className="grid p-0 md:grid-cols-2" data-oid="kg9b5.r">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => e.preventDefault()}
            data-oid="43z0rt:"
          >
            {isPasswordReset ? (
              <div className="flex flex-col gap-6" data-oid="_-1zw7:">
                <div className="flex flex-col items-center text-center" data-oid="8a7cu3w">
                  <h1 className="text-2xl font-bold text-white" data-oid="sgckd8p">
                    {isLoginComplete ? "Andika Code / Enter Code" : "Reset Password"}
                  </h1>
                  <p className="text-balance text-white" data-oid="tglvch7">
                    {isLoginComplete
                      ? "Twakohereje code yo kugusubiza ijambo banga / OTP sent to reset your password"
                      : "Shyiramo nimero ya telefone kugira ngo usubize ijambo banga / Enter your phone to reset password"}
                  </p>
                </div>
                <div className="grid gap-4" data-oid="rbkqrru">
                  {isLoginComplete ? (
                    <>
                      <div className="text-center text-white" data-oid="b:_0yax">
                        <p className="text-sm mb-1" data-oid="9ovby23">
                          Andika code ya OTP / Enter your OTP code
                        </p>
                        <p className="text-xs opacity-75" data-oid="n0jd4y9">
                          Twayohereje kuri WhatsApp na SMS / Sent via WhatsApp and SMS
                        </p>
                      </div>
                      <div className="flex justify-center gap-3" data-oid="uk_rqz-">
                        {[0, 1, 2, 3].map((index) => (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            className="w-12 h-12 text-center text-xl font-bold bg-white/10 text-white border-amber-400/50 focus:border-amber-400"
                            type="text"
                            maxLength={1}
                            pattern="\d"
                            inputMode="numeric"
                            value={totpCode[index]}
                            onChange={(e) => handleTotpChange(index, e.target.value)}
                            required
                            data-oid="ivy.vj6"
                          />
                        ))}
                      </div>
                      <div className="grid gap-2 text-white" data-oid="newpassblock">
                        <Label htmlFor="newPassword" data-oid="passlbl1">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="bg-white/10 text-white border-amber-400/50 focus:border-amber-400"
                          required
                          data-oid="newpassinput"
                        />
                        {errors.newPassword && (
                          <p className="text-red-400 text-sm" data-oid="newpasserror">
                            {errors.newPassword}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2 text-white" data-oid="confirmpassblock">
                        <Label htmlFor="confirmPassword" data-oid="passlbl2">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="bg-white/10 text-white border-amber-400/50 focus:border-amber-400"
                          required
                          data-oid="confirmpassinput"
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-400 text-sm" data-oid="confirmpasserror">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={handleResetSubmit}
                        className="w-full bg-white hover:bg-white text-brand mt-2"
                        disabled={isSubmitted}
                        data-oid="submitbtn"
                      >
                        {isSubmitted ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Emeza Ijambo Banga / Confirm Password
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-2 text-white" data-oid="9mmn_k2">
                        <Label htmlFor="phone" data-oid="71o_7z4">
                          Phone number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g., 0781234567"
                          className="bg-white/10 text-white border-amber-400/50 focus:border-amber-400"
                          required
                          data-oid="l2rp_sy"
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-400 text-sm" data-oid="phoneerror">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={handleRequestOtp}
                        className="w-full bg-white hover:bg-white text-brand"
                        disabled={isSubmitted}
                        data-oid="otpbtn"
                      >
                        {isSubmitted ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Ohereza Code / Send OTP
                      </Button>
                    </>
                  )}
                </div>
                <div className="text-center text-sm text-white" data-oid="lp0trcv">
                  <a
                    href="/login"
                    className="underline underline-offset-4 text-amber-400 hover:text-amber-500"
                    data-oid="backtologin"
                  >
                    Subira kuri Login / Back to Login
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6" data-oid="_-1zw7:">
                <div
                  className="flex flex-col items-center text-center"
                  data-oid="8a7cu3w"
                >
                  <h1
                    className="text-2xl font-bold text-white"
                    data-oid="sgckd8p"
                  >
                    {isLoginComplete ? "Enter OTP Code" : "Welcome back"}
                  </h1>
                  <p className="text-balance text-white" data-oid="tglvch7">
                    Login to your kaascan account
                  </p>
                </div>
                <div className="grid gap-4" data-oid="rbkqrru">
                  {isLoginComplete ? (
                    <>
                      <div className="text-center text-white" data-oid="b:_0yax">
                        <p className="text-sm mb-1" data-oid="9ovby23">
                          Andika code yawe ya OTP / Enter your OTP code
                        </p>
                        <p className="text-xs opacity-75" data-oid="n0jd4y9">
                          Twayohereje kuri WhatsApp na SMS / Sent via WhatsApp and
                          SMS
                        </p>
                      </div>
                      <div
                        className="flex justify-center gap-3"
                        data-oid="uk_rqz-"
                      >
                        {[0, 1, 2, 3].map((index) => (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            className="w-12 h-12 text-center text-xl font-bold bg-white/10 text-white border-amber-400/50 focus:border-amber-400"
                            type="text"
                            maxLength={1}
                            pattern="\d"
                            inputMode="numeric"
                            value={totpCode[index]}
                            onChange={(e) =>
                              handleTotpChange(index, e.target.value)
                            }
                            required
                            data-oid="ivy.vj6"
                          />
                        ))}
                      </div>
                      <div className="text-center" data-oid="q7_lle3">
                        <button
                          type="button"
                          className="text-amber-400 text-sm hover:underline mt-2"
                          onClick={() => {
                            setIsLoginComplete(false);
                            setSubmitted(true);
                          }}
                          disabled={resendCooldown > 0}
                          data-oid="qorj-9d"
                        >
                          {resendCooldown > 0
                            ? `Resend in ${resendCooldown}s`
                            : "Ntabwo wabonye? Ongera usabe / Didn't receive? Resend"}
                        </button>
                      </div>
                      <Button
                        type="button"
                        onClick={totpSubmit}
                        className="w-full bg-white hover:bg-white mt-2 text-brand"
                        disabled={isSubmitted}
                        data-oid="u7lx01f"
                      >
                        {isSubmitted ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Emeza / Verify
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-2 text-white" data-oid="9mmn_k2">
                        <Label htmlFor="phone" data-oid="71o_7z4">
                          Phone number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g., 0781234567"
                          className="bg-white/10 text-white border-amber-400/50 focus:border-amber-400"
                          required
                          data-oid="l2rp_sy"
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-400 text-sm" data-oid="phoneerror">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2 text-white" data-oid="nu7q0do">
                        <div className="flex items-center" data-oid="lih5x19">
                          <Label htmlFor="password" data-oid="q_ga-.:">
                            Password
                          </Label>
                          <a
                            href="/forgot-password?resetPassword=true"
                            className="ml-auto text-sm text-amber-400 hover:underline"
                            data-oid="k-o3c4t"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="bg-white/10 text-white border-amber-400/50 focus:border-amber-400"
                          required
                          data-oid="gc.7hq2"
                        />
                        {errors.password && (
                          <p className="text-red-400 text-sm" data-oid="passerror">
                            {errors.password}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={loginSubmit}
                        className="w-full bg-white hover:bg-white text-brand"
                        disabled={isSubmitted || !csrfToken}
                        data-oid="wy3oubl"
                      >
                        {isSubmitted ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Login
                      </Button>
                    </>
                  )}
                </div>
                <div
                  className="text-center text-sm text-white"
                  data-oid="lp0trcv"
                >
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="underline underline-offset-4 text-amber-400 hover:text-amber-500"
                    data-oid="ggf:c-u"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            )}
          </form>
          <div
            className="relative hidden bg-white h-full md:block"
            data-oid="qi31bs5"
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"
              data-oid="p.1xf0k"
            ></div>
            <img
              src="/banner5.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
              data-oid="mcufbap"
            />
            <div
              className="absolute bottom-8 left-8 right-8 z-20 text-white"
              data-oid="53fuhl8"
            >
              <h2 className="text-3xl font-bold mb-2" data-oid="k8nc5o9">
                Welcome to Kaascan Parent Portal
              </h2>
              <p className="text-lg opacity-90" data-oid="_xss1m7">
                Empowering parents with real-time insights into their children's
                educational journey. Stay connected, stay informed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div
        className="text-balance text-center text-xs text-white [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary"
        data-oid="1ot2c0o"
      >
        By clicking continue, you agree to our{" "}
        <a href="#" data-oid="8gn6lg0">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" data-oid="b9zoaio">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}