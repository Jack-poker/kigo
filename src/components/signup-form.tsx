"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const baseurl = "https://wallet.kaascan.com"

  const [isSubmitted, setSubmitted] = useState(false)
  const [isSignupComplete, setSignupComplete] = useState(false)
  const [fullnames, setFullnames] = useState("")
  const [phonenumber, setPhonenumber] = useState("")
  const [password, setPassword] = useState("")
  const [csrfToken, setCsrfToken] = useState("")

  function signup_submit() {
    setSubmitted(true)
  }

  useEffect(() => {
    if (!isSubmitted) return

    async function signup() {
      try {
        // Step 1: fetch CSRF token
        const csrfRes = await fetch(`${baseurl}/get-csrf-token`)
        const csrfJson = await csrfRes.json()

        if (!csrfJson?.csrf_token) {
          throw new Error("CSRF token fetch failed")
        }

        const token = csrfJson.csrf_token
        setCsrfToken(token)

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
        })

        const data = await signupRes.json()

        if (data.status === "success") {
          localStorage.setItem("token", data.token)
          setSignupComplete(true)
          console.log("[✅] Signup successful")
        } else {
          console.error("[❌] Signup failed:", data.detail || data.message)
        }
      } catch (err) {
        console.error("[❌] Unexpected signup error:", err)
      } finally {
        setSubmitted(false)
      }
    }

    signup()
  }, [isSubmitted])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex justify-center">
        <img src="/assets/logo.png" alt="kaascan logo" className="w-64 h-20 object-contain" />
      </div>

      <Card className="bg-brand text-white">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 w-full">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold">
                  {isSignupComplete ? "Enter OTP Code" : "Create your account"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isSignupComplete
                    ? "An OTP has been sent to your phone."
                    : "Provide your details to sign up."}
                </p>
              </div>

              {!isSignupComplete ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="fullnames">Full names</Label>
                    <Input
                      id="fullnames"
                      value={fullnames}
                      onChange={(e) => setFullnames(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={signup_submit}
                    className="w-full bg-amber-500 hover:bg-amber-500"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="otp">OTP Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="6-digit code"
                      maxLength={6}
                      className="text-center tracking-widest"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-amber-400 hover:bg-amber-500">
                    Verify OTP
                  </Button>
                </>
              )}
            </div>
          </form>

            <div className="relative hidden md:block rounded-xl overflow-hidden">
            <img
              src="/banner5.png"
              alt="Side visual"
              className="absolute inset-0 object-cover h-full w-full"
            />
            </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">Terms of Service</a> and{" "}
        <a href="#" className="underline">Privacy Policy</a>.
      </p>
    </div>
  )
}