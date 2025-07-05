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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { toast } = useToast();
  const [isLoginComplete, setIsLoginComplete] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(0);
  const baseUrl = "http://localhost:8001"; // Updated to match backend

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      !/^(\+250|250|0)?[7][0-9]{8}$/.test(phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid Rwandan phone number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
  }, []);

  // Handle login submission
  async function loginSubmit() {
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

  // Handle login or TOTP verification
  useEffect(() => {
    if (!isSubmitted || !csrfToken) return;

    async function login() {
      try {
        let response;
        if (!isLoginComplete) {
          // First step: Phone and password
          response = await fetch(`${baseUrl}/login/parent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({
              phone_number: phoneNumber,
              password,
              totp_code: "", // Initial request doesn't need TOTP
              csrf_token: csrfToken,
            }),
          });
        } else {
          // Second step: TOTP verification
          response = await fetch(`${baseUrl}/login/parent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({
              phone_number: phoneNumber,
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
              description: "Please enter your OTP code sent to your phone.",
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
              description: "Login successful!",
              action: (
                <ToastAction altText="Go to dashboard" data-oid="k_lxnx-">
                  Go to dashboard
                </ToastAction>
              ),
            });
            window.location.href = "/dashboard";
          }
        } else {
          throw new Error(data.detail || "Login failed");
        }
      } catch (error: any) {
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

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      data-oid="sgjl0w3"
    >
      <div className="flex flex-col items-center mb-0" data-oid="cpf.tcw">
        <img
          src="/assets/white_logo.png"
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
                        data-oid="qorj-9d"
                      >
                        Ntabwo wabonye? Ongera usabe / Didn't receive? Resend
                      </button>
                    </div>
                    <Button
                      type="button"
                      onClick={totpSubmit}
                      className="w-full bg-white hover:bg-white mt-2 text-brand"
                      disabled={isSubmitted}
                      data-oid="u7lx01f"
                    >
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
                        placeholder="Phone number"
                        className="bg-white/10 text-white border-amber-400/50 focus:border-amber-400"
                        required
                        data-oid="l2rp_sy"
                      />
                    </div>
                    <div className="grid gap-2 text-white" data-oid="nu7q0do">
                      <div className="flex items-center" data-oid="lih5x19">
                        <Label htmlFor="password" data-oid="q_ga-.:">
                          Password
                        </Label>
                        <a
                          href="/forgot-password"
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
                    </div>
                    <Button
                      type="button"
                      onClick={loginSubmit}
                      className="w-full bg-white hover:bg-white text-brand"
                      disabled={isSubmitted || !csrfToken}
                      data-oid="wy3oubl"
                    >
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
