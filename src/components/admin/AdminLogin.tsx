import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TokenContext } from "@/pages/AdminPanel"; // Adjust path as needed

export function AdminLogin({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { toast } = useToast();
  const [isSubmitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localCsrfToken, setLocalCsrfToken] = useState("");
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const tokenContext = useContext(TokenContext);
  const tokenPromise = useRef<Promise<string | null> | null>(null);
  const baseUrl = "http://localhost:8002";

  // Prioritize TokenContext CSRF token, fallback to local
  const effectiveCsrfToken = tokenContext?.csrfToken || localCsrfToken;

  // Fetch CSRF token locally with retry logic
  const fetchCsrfToken = useCallback(
    async (retries = 3, delay = 1000): Promise<string | null> => {
      if (isFetchingToken) {
        return tokenPromise.current;
      }

      setIsFetchingToken(true);
      tokenPromise.current = (async () => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const response = await fetch(`${baseUrl}/admin/get-csrf-token`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
            const data = await response.json();
            if (data.status === "success" && data.csrf_token) {
              setLocalCsrfToken(data.csrf_token);
              return data.csrf_token;
            }
            throw new Error("Invalid CSRF token response");
          } catch (error) {
            console.error(
              `CSRF token fetch error (attempt ${attempt}/${retries}):`,
              error,
            );
            if (attempt === retries) {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch CSRF token. Please try again.",
              });
              return null;
            }
            // Exponential backoff with jitter
            const jitter = Math.random() * 300;
            await new Promise((resolve) =>
              setTimeout(resolve, delay * Math.pow(1.5, attempt - 1) + jitter),
            );
          }
        }
        return null;
      })();

      try {
        const token = await tokenPromise.current;
        return token;
      } finally {
        setIsFetchingToken(false);
        tokenPromise.current = null;
      }
    },
    [isFetchingToken, toast],
  );

  // Fetch CSRF token if not provided by TokenContext
  useEffect(() => {
    if (!effectiveCsrfToken && !isFetchingToken && !tokenContext) {
      fetchCsrfToken();
    }
  }, [effectiveCsrfToken, isFetchingToken, fetchCsrfToken, tokenContext]);

  // Handle login submission
  const handleSubmit = async () => {
    if (!email || !password || !effectiveCsrfToken) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      });
      return;
    }
    setSubmitted(true);
  };

  // Handle login request
  useEffect(() => {
    if (!isSubmitted || !effectiveCsrfToken) return;

    async function login() {
      try {
        const response = await fetch(`${baseUrl}/admin/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": effectiveCsrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
            csrf_token: effectiveCsrfToken,
          }),
        });

        const data = await response.json();

        if (response.status === 200 && data.status === "success") {
          localStorage.setItem("adminToken", data.access_token);
          setEmail("");
          setPassword("");
          setSubmitted(false);
          toast({
            title: "Success",
            description: "Login successful!",
            action: (
              <ToastAction altText="Go to dashboard" data-oid="lnje2mx">
                Go to dashboard
              </ToastAction>
            ),
          });
          window.location.href = "/admin/dashboard";
        } else {
          throw new Error(data.detail || "Login failed");
        }
      } catch (error: any) {
        setSubmitted(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Login failed. Please try again.",
        });
      }
    }
    login();
  }, [isSubmitted, email, password, effectiveCsrfToken, toast]);

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center ",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(45deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
        backgroundBlendMode: "overlay,overlay,overlay,normal",
      }}
      {...props}
      data-oid="x4kzbst"
    >
      <div className="w-full max-w-4xl flex flex-col gap-6" data-oid="9x84:id">
        <div className="flex justify-center mb-4" data-oid="sq.3yeb">
          <img
            src="/assets/white_logo.png"
            alt="Kaascan logo"
            className="w-48 sm:w-56 md:w-64 h-auto object-contain"
            data-oid="_k9i-63"
          />
        </div>
        <Card
          className="overflow-hidden bg-brand shadow-lg w-full mx-auto border-brand"
          data-oid="p6:rexw"
        >
          <CardContent className="grid p-0 md:grid-cols-2" data-oid="f4e2y14">
            <form
              className="p-4 sm:p-6 md:p-8"
              onSubmit={(e) => e.preventDefault()}
              data-oid="yucq97q"
            >
              <div className="flex flex-col gap-6" data-oid="0htyl2d">
                <div
                  className="flex flex-col items-center text-center"
                  data-oid="ve_p3_k"
                >
                  <h1
                    className="text-xl sm:text-2xl font-bold text-white"
                    data-oid="u7o34oj"
                  >
                    Admin Login
                  </h1>
                  <p
                    className="text-sm sm:text-base text-white/90"
                    data-oid="dhi-w_r"
                  >
                    Login to your Kaascan Admin account
                  </p>
                </div>
                {isFetchingToken && !effectiveCsrfToken && (
                  <p
                    className="text-center text-sm text-white/90"
                    data-oid="bddf49b"
                  >
                    Fetching token...
                  </p>
                )}
                <div className="grid gap-4" data-oid="z1yxycn">
                  <div className="grid gap-2 text-white" data-oid="27k0fro">
                    <Label htmlFor="email" data-oid="rdg6rny">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="bg-white/10 text-white border-amber-400/50 focus:border-amber-400 text-sm sm:text-base"
                      required
                      data-oid="t.xkbuu"
                    />
                  </div>
                  <div className="grid gap-2 text-white" data-oid="ovla18u">
                    <div
                      className="flex items-center justify-between"
                      data-oid="yprfc7b"
                    >
                      <Label htmlFor="password" data-oid="oav:3a1">
                        Password
                      </Label>
                      <a
                        href="/admin/forgot-password"
                        className="text-xs sm:text-sm text-amber-400 hover:underline"
                        data-oid="uo3:vhh"
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
                      className="bg-white/10 text-white border-amber-400/50 focus:border-amber-400 text-sm sm:text-base"
                      required
                      data-oid="wxyku27"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-white text-brand hover:bg-white font-medium text-sm sm:text-base py-2 sm:py-3"
                    disabled={isSubmitted || isFetchingToken}
                    aria-label="Login to admin dashboard"
                    data-oid="dn7qpy9"
                  >
                    {isSubmitted ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div
                  className="text-center text-xs sm:text-sm text-white/90"
                  data-oid="qmxp8lh"
                >
                  Need assistance?{" "}
                  <a
                    href="/support"
                    className="text-amber-400 hover:text-amber-500 underline underline-offset-4"
                    data-oid="ltg:_4e"
                  >
                    Contact support
                  </a>
                </div>
              </div>
            </form>
            <div
              className="relative hidden md:block bg-white h-full"
              data-oid=".njzfuj"
            >
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"
                data-oid="jaw1jz5"
              ></div>
              <img
                src="/banner5.png"
                alt="Kaascan Admin Portal"
                className="absolute inset-0 h-full w-full object-cover"
                data-oid="13l4sfu"
              />

              <div
                className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-20 text-white"
                data-oid="2um_r29"
              >
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2"
                  data-oid="97fy8_4"
                >
                  Welcome to Kaascan Admin Portal
                </h2>
                <p
                  className="text-sm sm:text-base md:text-lg opacity-90"
                  data-oid="06n5_if"
                >
                  Manage school payments, ads, and parent accounts with ease and
                  security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div
          className="text-center text-xs sm:text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary"
          data-oid="k2k7lr8"
        >
          By clicking continue, you agree to our{" "}
          <a href="#" data-oid="3tl46ns">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" data-oid="8i6ywl5">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
