import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {


  const baseurl = "https://auto.kaascan.com/webhook"
  const [is_SignupComplete] =  useState(false)
  const  [isSubmitted,setSubmitted] = useState(false)
  const  [phonenumber,setPhonenumber] = useState("")
  const  [password,setPassword] = useState("")



  function signup_submit()
  {
    setSubmitted(true)
  }

  useEffect(()=>{

  if (!isSubmitted) return

   async function signup()
    {
      const signupreq = await fetch(`${baseurl}/signup`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
         body:JSON.stringify({

          "phonenumber":phonenumber,
          "password":password
          
        })
       
      })

      const response = await signupreq.json()


        console.log(phonenumber)

      if(response.status==false)
      {
        is_SignupComplete(false);
        setSubmitted(false)
        setPhonenumber("")
        setPassword("")
     
        console.log("[❌] Login Failed");

      }else if(response.status==true){

        is_SignupComplete(true)
        setSubmitted(false)
        setPhonenumber("")
        setPassword("")
        console.log("[✅] Login Successfull");

      }

     




      
    }

    


    signup()

  },[isSubmitted,phonenumber,password])

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
               {is_SignupComplete ? (
                 <h1 className="text-2xl font-bold">Enter Otp Code</h1>
               ):( <h1 className="text-2xl font-bold">Welcome back</h1>)}
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>
                {is_SignupComplete ? (
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
                    value={phonenumber}
                    onChange={(e)=>setPhonenumber(e.target.value)}
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
                  <Input className="bg-white-900 text-white" value={password}
                    onChange={(e)=>setPassword(e.target.value)} placeholder="Password" id="password" type="password" required />
                  </div>
                  <Button type="button" onClick={(e)=>signup_submit()} className="w-full bg-amber-400 hover:bg-amber-400">
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
