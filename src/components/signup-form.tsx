"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

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

  function signup_submit() {
    setSubmitted(true);
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
        }
      } catch (err) {
        console.error("[❌] Unexpected signup error:", err);
      } finally {
        setSubmitted(false);
      }
    }

    signup();
  }, [isSubmitted]);

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      data-oid="udgca8q"
    >
      <div className="flex justify-center" data-oid="g:xe1xt">
        <img
          src="/assets/logo.png"
          alt="kaascan logo"
          className="w-64 h-20 object-contain"
          data-oid="e.s42d:"
        />
      </div>

      <Card className="bg-brand text-white" data-oid="ypzwa-3">
        <CardContent className="grid p-0 md:grid-cols-2" data-oid="ao3y5:c">
          <form className="p-6 md:p-8 w-full" data-oid="-odjaga">
            <div className="flex flex-col gap-6" data-oid="-a.h42_">
              <div className="text-center" data-oid="0k93xrt">
                <h1 className="text-2xl font-bold" data-oid="aoo:1wl">
                  {isSignupComplete ? "Enter OTP Code" : "Create your account"}
                </h1>
                <p className="text-sm text-muted-foreground" data-oid="8k6ylgl">
                  {isSignupComplete
                    ? "An OTP has been sent to your phone."
                    : "Provide your details to sign up."}
                </p>
              </div>

              {!isSignupComplete ? (
                <>
                  <div className="grid gap-2 " data-oid="k9.dtbm">
                    <Label htmlFor="fullnames" data-oid="feodxx4">
                      Full names
                    </Label>
                    <Input
                      id="fullnames"
                      value={fullnames}
                      onChange={(e) => setFullnames(e.target.value)}
                      required
                      className="text-zinc-900 placeholder:text-gray-300"
                      placeholder="Enter your full names"
                      data-oid="l9395d0"
                    />
                  </div>

                  <div className="grid gap-2" data-oid="4:07yky">
                    <Label htmlFor="phone" data-oid="ky9p_d5">
                      Phone number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                      className="text-zinc-900 placeholder:text-gray-300"
                      placeholder="Enter your phonenumber"
                      required
                      data-oid="9m6z4wr"
                    />
                  </div>

                  <div className="grid gap-2" data-oid="ymj.fhh">
                    <Label htmlFor="password" data-oid="budm.qy">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-zinc-900 placeholder:text-gray-300"
                      placeholder="Create Password"
                      required
                      data-oid="s8:.wmk"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={signup_submit}
                    className="w-full bg-amber-500 hover:bg-amber-500"
                    data-oid="wz20fm7"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <div className="grid gap-2" data-oid="nyy_5_t">
                    <Label htmlFor="otp" data-oid="1k_k..l">
                      OTP Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="6-digit code"
                      maxLength={6}
                      className="text-center tracking-widest"
                      required
                      data-oid="qsuajl2"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-500"
                    data-oid="7gtaix_"
                  >
                    Verify OTP
                  </Button>
                </>
              )}
            </div>
          </form>

          <div
            className="relative hidden md:block rounded-xl overflow-hidden"
            data-oid="a:a:9zz"
          >
            <img
              src="/banner5.png"
              alt="Side visual"
              className="absolute inset-0 object-cover h-full w-full"
              data-oid=":qn1nk_"
            />
          </div>
        </CardContent>
      </Card>

      <p
        className="text-xs text-center text-muted-foreground"
        data-oid="fil_j32"
      >
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline" data-oid="l:x5jun">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline" data-oid="ir9n7p:">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
