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
  const baseurl = "https://api.kaascan.com";

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
      data-oid="dce9d0p"
    >
      <div className="flex justify-center" data-oid="v--3lf2">
        <img
          src="/assets/logo.png"
          alt="kaascan logo"
          className="w-64 h-20 object-contain"
          data-oid="5ms0_r."
        />
      </div>

      <Card className="bg-brand text-white" data-oid="7lxa5fp">
        <CardContent className="grid p-0 md:grid-cols-2" data-oid="-8a5vfi">
          <form className="p-6 md:p-8 w-full" data-oid="e5xv8zv">
            <div className="flex flex-col gap-6" data-oid="l15kwmf">
              <div className="text-center" data-oid="wu.::c2">
                <h1 className="text-2xl font-bold" data-oid="z5uxei:">
                  {isSignupComplete ? "Enter OTP Code" : "Create your account"}
                </h1>
                <p className="text-sm text-muted-foreground" data-oid="9b9fqu0">
                  {isSignupComplete
                    ? "An OTP has been sent to your phone."
                    : "Provide your details to sign up."}
                </p>
              </div>

              {!isSignupComplete ? (
                <>
                  <div className="grid gap-2 " data-oid="yuqp7b_">
                    <Label htmlFor="fullnames" data-oid="td8vuxd">
                      Full names
                    </Label>
                    <Input
                      id="fullnames"
                      value={fullnames}
                      onChange={(e) => setFullnames(e.target.value)}
                      required
                      className="text-zinc-900 placeholder:text-gray-300"
                      placeholder="Enter your full names"
                      data-oid="spjces_"
                    />
                  </div>

                  <div className="grid gap-2" data-oid="w5pzm.l">
                    <Label htmlFor="phone" data-oid="4pj__0o">
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
                      data-oid="4hiqpol"
                    />
                  </div>

                  <div className="grid gap-2" data-oid="z17yna3">
                    <Label htmlFor="password" data-oid="qklimtx">
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
                      data-oid="py44:g8"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={signup_submit}
                    className="w-full bg-amber-500 hover:bg-amber-500"
                    data-oid="omeyfyx"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <div className="grid gap-2" data-oid="6_ugmmn">
                    <Label htmlFor="otp" data-oid="ae:v.3:">
                      OTP Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="6-digit code"
                      maxLength={6}
                      className="text-center tracking-widest"
                      required
                      data-oid=".:iga70"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-500"
                    data-oid="6coxfdx"
                  >
                    Verify OTP
                  </Button>
                </>
              )}
            </div>
          </form>

          <div
            className="relative hidden md:block rounded-xl overflow-hidden"
            data-oid="7durq:s"
          >
            <img
              src="/banner5.png"
              alt="Side visual"
              className="absolute inset-0 object-cover h-full w-full"
              data-oid="tg0_aoc"
            />
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
