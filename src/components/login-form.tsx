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
                <ToastAction altText="Go to dashboard" data-oid="g45-4n1">
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
      data-oid="009fb95"
    >
      <div className="flex flex-col items-center mb-0" data-oid="lqs3z_:">
        <img
          src="/assets/logo.png"
          alt="kigo logo"
          className="object-contain bg-[rgba(0,_0,_0,_0)] w-[290px] h-[126px] bg-none"
          data-oid="9.dkd9e"
        />
      </div>
      <Card className="overflow-hidden bg-brand" data-oid="l4v:vqo">
        <CardContent className="grid p-0 md:grid-cols-2" data-oid="a1t4bh1">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => e.preventDefault()}
            data-oid="gw41prh"
          >
            <div className="flex flex-col gap-6" data-oid="vex9ix0">
              <div
                className="flex flex-col items-center text-center"
                data-oid="_o0rzs3"
              >
                <h1
                  className="text-2xl font-bold text-white"
                  data-oid="d:mp:bc"
                >
                  {isLoginComplete ? "Enter OTP Code" : "Welcome back"}
                </h1>
                <p className="text-balance text-white" data-oid=":c-qqgi">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-4" data-oid="bpc0sc7">
                {isLoginComplete ? (
                  <>
                    <div className="text-center text-white" data-oid="k0xlme0">
                      <p className="text-sm mb-1" data-oid="0kypty7">
                        Andika code yawe ya OTP / Enter your OTP code
                      </p>
                      <p className="text-xs opacity-75" data-oid=".n8o.3e">
                        Twayohereje kuri WhatsApp na SMS / Sent via WhatsApp and
                        SMS
                      </p>
                    </div>
                    <div
                      className="flex justify-center gap-3"
                      data-oid="ak3k9ul"
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
                          data-oid="7:p8wq:"
                        />
                      ))}
                    </div>
                    <div className="text-center" data-oid="erdf4d_">
                      <button
                        type="button"
                        className="text-amber-400 text-sm hover:underline mt-2"
                        onClick={() => {
                          setIsLoginComplete(false);
                          setSubmitted(true);
                        }}
                        data-oid="ysa21x3"
                      >
                        Ntabwo wabonye? Ongera usabe / Didn't receive? Resend
                      </button>
                    </div>
                    <Button
                      type="button"
                      onClick={totpSubmit}
                      className="w-full bg-amber-400 hover:bg-amber-500 mt-2"
                      disabled={isSubmitted}
                      data-oid="etv61pm"
                    >
                      Emeza / Verify
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="grid gap-2 text-white" data-oid="ob3e2-z">
                      <Label htmlFor="phone" data-oid="wbkonf6">
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
                        data-oid="jdq5.o_"
                      />
                    </div>
                    <div className="grid gap-2 text-white" data-oid="t-qsbhc">
                      <div className="flex items-center" data-oid="w933po-">
                        <Label htmlFor="password" data-oid="0_ikl7.">
                          Password
                        </Label>
                        <a
                          href="/forgot-password"
                          className="ml-auto text-sm text-amber-400 hover:underline"
                          data-oid="jjxw9b1"
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
                        data-oid="11ei_u8"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={loginSubmit}
                      className="w-full bg-amber-400 hover:bg-amber-500"
                      disabled={isSubmitted || !csrfToken}
                      data-oid="alv9jx_"
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>
              <div
                className="text-center text-sm text-white"
                data-oid="ei4_0pn"
              >
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="underline underline-offset-4 text-amber-400 hover:text-amber-500"
                  data-oid="z_6lks5"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div
            className="relative hidden bg-white h-full md:block"
            data-oid="r3epkt9"
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"
              data-oid="sij..57"
            ></div>
            <img
              src="/banner5.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
              data-oid="x0f:ugc"
            />

            <div
              className="absolute bottom-8 left-8 right-8 z-20 text-white"
              data-oid=".04tm3m"
            >
              <h2 className="text-3xl font-bold mb-2" data-oid="-e1c5nq">
                Welcome to Kaascan Parent Portal
              </h2>
              <p className="text-lg opacity-90" data-oid="nnp7fsl">
                Empowering parents with real-time insights into their children's
                educational journey. Stay connected, stay informed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div
        className="text-balance text-center text-xs text-white [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary"
        data-oid="7x:d4xy"
      >
        By clicking continue, you agree to our{" "}
        <a href="#" data-oid="ccps3nx">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" data-oid="fxjayr5">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
