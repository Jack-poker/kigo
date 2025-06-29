import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

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
  const baseUrl = "http://localhost:8001"; // Updated to match backend

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
                <ToastAction altText="Go to dashboard" data-oid="cu.r7lm">
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
      data-oid="_kpb:_3"
    >
      <div className="flex flex-col items-center mb-0" data-oid="nr:87g2">
        <img
          src="/assets/logo.png"
          alt="kigo logo"
          className="object-contain bg-[rgba(0,_0,_0,_0)] w-[290px] h-[126px] bg-none"
          data-oid="7pg:hh8"
        />
      </div>
      <Card className="overflow-hidden bg-brand" data-oid="hj:fcs2">
        <CardContent className="grid p-0 md:grid-cols-2" data-oid="f8ycyzd">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => e.preventDefault()}
            data-oid="7_wjr:."
          >
            <div className="flex flex-col gap-6" data-oid="wq:.tyn">
              <div
                className="flex flex-col items-center text-center"
                data-oid="mii4mx3"
              >
                <h1
                  className="text-2xl font-bold text-white"
                  data-oid="vrrs0r9"
                >
                  {isLoginComplete ? "Enter OTP Code" : "Welcome back"}
                </h1>
                <p className="text-balance text-white" data-oid="4p60bs3">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-4" data-oid="td_.4y3">
                {isLoginComplete ? (
                  <>
                    <div className="text-center text-white" data-oid="0dg5qxd">
                      <p className="text-sm mb-1" data-oid="q7urhlj">
                        Andika code yawe ya OTP / Enter your OTP code
                      </p>
                      <p className="text-xs opacity-75" data-oid="ye1c_9r">
                        Twayohereje kuri WhatsApp na SMS / Sent via WhatsApp and
                        SMS
                      </p>
                    </div>
                    <div
                      className="flex justify-center gap-3"
                      data-oid="qmx0trd"
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
                          data-oid="ek596e2"
                        />
                      ))}
                    </div>
                    <div className="text-center" data-oid="5sre9sw">
                      <button
                        type="button"
                        className="text-amber-400 text-sm hover:underline mt-2"
                        onClick={() => {
                          setIsLoginComplete(false);
                          setSubmitted(true);
                        }}
                        data-oid="0ya1yij"
                      >
                        Ntabwo wabonye? Ongera usabe / Didn't receive? Resend
                      </button>
                    </div>
                    <Button
                      type="button"
                      onClick={totpSubmit}
                      className="w-full bg-amber-400 hover:bg-amber-500 mt-2"
                      disabled={isSubmitted}
                      data-oid="v4bs:fp"
                    >
                      Emeza / Verify
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="grid gap-2 text-white" data-oid="ur7ewx9">
                      <Label htmlFor="phone" data-oid="7rs-ouf">
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
                        data-oid="lrwizs7"
                      />
                    </div>
                    <div className="grid gap-2 text-white" data-oid=":vgtwfe">
                      <div className="flex items-center" data-oid="baaqtyz">
                        <Label htmlFor="password" data-oid="b9mjmpc">
                          Password
                        </Label>
                        <a
                          href="/forgot-password"
                          className="ml-auto text-sm text-amber-400 hover:underline"
                          data-oid="l33lkqj"
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
                        data-oid="uxl-0z_"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={loginSubmit}
                      className="w-full bg-amber-400 hover:bg-amber-500"
                      disabled={isSubmitted || !csrfToken}
                      data-oid="s1yqfit"
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>
              <div
                className="text-center text-sm text-white"
                data-oid="2q3lc_."
              >
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="underline underline-offset-4 text-amber-400 hover:text-amber-500"
                  data-oid="d2ru6t3"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div
            className="relative hidden bg-white h-full md:block"
            data-oid="1m-yayx"
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"
              data-oid=".msl-my"
            ></div>
            <img
              src="/banner5.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
              data-oid="bt3avy-"
            />

            <div
              className="absolute bottom-8 left-8 right-8 z-20 text-white"
              data-oid="31f3if8"
            >
              <h2 className="text-3xl font-bold mb-2" data-oid="j82950j">
                Welcome to Kaascan Parent Portal
              </h2>
              <p className="text-lg opacity-90" data-oid=".elteum">
                Empowering parents with real-time insights into their children's
                educational journey. Stay connected, stay informed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div
        className="text-balance text-center text-xs text-white [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary"
        data-oid="ww9:._m"
      >
        By clicking continue, you agree to our{" "}
        <a href="#" data-oid="0.-py5r">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" data-oid="0dsa:k:">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
