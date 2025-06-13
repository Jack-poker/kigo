import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [is_LoginComplete] =  useState(false)

  return (
    
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
     
        <div className="flex flex-col items-center mb-0">
          <img src="/assets/logo.png" alt="kigo logo" className="w-64  h-50 object-contain " />
        </div>
    
      <Card className="overflow-hidden bg-[hsl(var(--primary))] ">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
               {is_LoginComplete ? (
                 <h1 className="text-2xl font-bold">Enter Otp Code</h1>
               ):( <h1 className="text-2xl font-bold">Welcome back</h1>)}
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>
                {is_LoginComplete ? (
                <>
                  <div className="grid gap-2">
                  <Label htmlFor="otp">Enter OTP Code</Label>
                  <Input
                    className="bg-zinc-900 text-white text-center text-lg tracking-widest"
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    pattern="\d{6}"
                    required
                  />
                  </div>
                  <Button type="submit" className="w-full bg-amber-400 hover:bg-amber-400">
                  Verify OTP
                  </Button>
                </>
                ) : (
                <>
                  <div className="grid gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    className="bg-white-900 text-white"
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    required
                  />
                  </div>
                  <div className="grid gap-2">
                  <div className="flex items-center ">
                    <Label htmlFor="password">Password</Label>
                    <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                    Forgot your password?
                    </a>
                  </div>
                  <Input className="bg-white-900 text-white" placeholder="Password" id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full bg-amber-400 hover:bg-amber-400">
                  Login
                  </Button>
                </>
                )}
             
              <div className="grid grid-cols-3 gap-4">
              
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
            <div className="relative hidden h-full bg-white  md:block">
            <img
              src="/assets/side.png"
              alt="Image"
              className="absolute inset-0  object-cover dark:brightness-[1]"
            />
            </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
