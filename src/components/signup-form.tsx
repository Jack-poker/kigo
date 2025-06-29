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
      data-oid="zmen6fl"
    >
      <div className="flex justify-center" data-oid="3gebur2">
        <img
          src="/assets/logo.png"
          alt="kaascan logo"
          className="w-64 h-20 object-contain"
          data-oid=":yt.8ns"
        />
      </div>

      <Card className="bg-brand text-white" data-oid="8iq8d1o">
        <CardContent className="grid p-0 md:grid-cols-2" data-oid="35keolj">
          <form className="p-6 md:p-8 w-full" data-oid="-hscel7">
            <div className="flex flex-col gap-6" data-oid="y2rl8ke">
              <div className="text-center" data-oid="urk:z1:">
                <h1 className="text-2xl font-bold" data-oid="_.:w-vo">
                  {isSignupComplete ? "Enter OTP Code" : "Create your account"}
                </h1>
                <p className="text-sm text-muted-foreground" data-oid="oo2j92g">
                  {isSignupComplete
                    ? "An OTP has been sent to your phone."
                    : "Provide your details to sign up."}
                </p>
              </div>

              {!isSignupComplete ? (
                <>
                  <div className="grid gap-2 " data-oid="by8lccs">
                    <Label htmlFor="fullnames" data-oid="rejse:k">
                      Full names
                    </Label>
                    <Input
                      id="fullnames"
                      value={fullnames}
                      onChange={(e) => setFullnames(e.target.value)}
                      required
                      className="text-zinc-900 placeholder:text-gray-300"
                      placeholder="Enter your full names"
                      data-oid="32_.30n"
                    />
                  </div>

                  <div className="grid gap-2" data-oid="e-ngokj">
                    <Label htmlFor="phone" data-oid="mdwl:ej">
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
                      data-oid="kubyimg"
                    />
                  </div>

                  <div className="grid gap-2" data-oid="8biz1tj">
                    <Label htmlFor="password" data-oid="cc-t0ax">
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
                      data-oid="e00ikqx"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={signup_submit}
                    className="w-full bg-amber-500 hover:bg-amber-500"
                    data-oid="fkt.h4f"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <div className="grid gap-2" data-oid="1201au.">
                    <Label htmlFor="otp" data-oid="9dn2pig">
                      OTP Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="6-digit code"
                      maxLength={6}
                      className="text-center tracking-widest"
                      required
                      data-oid="9cq2w0a"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-500"
                    data-oid="p0gnx2u"
                  >
                    Verify OTP
                  </Button>
                </>
              )}
            </div>
          </form>

          <div
            className="relative hidden md:block rounded-xl overflow-hidden"
            data-oid=":de7f_2"
          >
            <img
              src="/banner5.png"
              alt="Side visual"
              className="absolute inset-0 object-cover h-full w-full"
              data-oid="vlm_j29"
            />
          </div>
        </CardContent>
      </Card>

      <p
        className="text-xs text-center text-muted-foreground"
        data-oid="le-8pgk"
      >
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline" data-oid="00i4ym3">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline" data-oid="pn4_1wa">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
