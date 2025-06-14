import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Toast } from "@radix-ui/react-toast"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  var [is_LoginComplete,setISlogin] =  useState(false)
  const [isSubmitted,setSubmitted] = useState(false)
  const [] = useState()

  const baseUrl = "https://auto.kaascan.com/webhook"
  const [phonenumber,setPhonenumber] = useState("")
  const [password,setPassword] = useState("")

  
  function login_submit()
  {
    setSubmitted(true)
    console.log(`Data submited`,isSubmitted)
  }
  
  useEffect(()=>{

    if(!isSubmitted) return

    async function login()
    {
      const LoginReq = await fetch(baseUrl+"/login",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            "phonenumber":phonenumber,
            "password":password

          })


        });

      const response = await LoginReq.json();
      console.log(phonenumber)

      if(response.status==false)
      {
        setISlogin(false);
        setSubmitted(false)
        setPhonenumber("")
        setPassword("")
     
        console.log("[❌] Login Failed");

      }else if(response.status==true){

        setISlogin(true)
        setSubmitted(false)
        setPhonenumber("")
        setPassword("")
        console.log("[✅] Login Successfull");

      }

     





     

      console.log(response.status);
    }
    login()

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
               {is_LoginComplete ? (
                 <h1 className="text-2xl font-bold">Enter Otp Code</h1>
               ):( <h1 className="text-2xl text-white font-bold">Welcome back</h1>)}
                <p className="text-balance text-white">
                  Login to your Acme Inc account
                </p>
              </div>
                {is_LoginComplete ? (
                <>
                    <div className="grid gap-4">
                    <div className="text-center text-white">
                      <p className="text-sm mb-1">Andika code yawe ya OTP / Enter your OTP code</p>
                      <p className="text-xs opacity-75">Twayohereje kuri WhatsApp na SMS / Sent via WhatsApp and SMS</p>
                    </div>
                    <div className="flex justify-center gap-3">
                      {[1, 2, 3, 4].map((_, index) => (
                      <Input
                        key={index}
                        className="w-12 h-12 text-center text-xl font-bold bg-white/10 text-white border-amber-400/50 focus:border-amber-400"
                        type="text"
                        maxLength={1}
                        pattern="\d"
                        inputMode="numeric"
                        required
                      />
                      ))}
                    </div>
                    <div className="text-center">
                      <button className="text-amber-400 text-sm hover:underlineB mt-2">
                      Ntabwo wabonye? Ongera usabe / Didn't receive? Resend
                      </button>
                    </div>
                    <Button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 mt-2">
                      Emeza / Verify
                    </Button>
                    </div>
                </>
                ) : (
                <>
                  <div className="grid gap-2 text-white">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    className="bg-white-900 text-white"
                    id="phone"
                    type="tel"
                    value={phonenumber}
                    onChange={e=>setPhonenumber(e.target.value)}
                    placeholder="Phone number"
                    required
                  />
                  </div>
                  <div className="grid gap-2 text-white">
                  <div className="flex items-center text-">
                    <Label htmlFor="password">Password</Label>
                    <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline "
                    >
                    Forgot your password?
                    </a>
                  </div>
                  <Input className="bg-white-900 text-white" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" id="password" type="password" required />
                  </div>
                  <Button type="button"  onClick={(e)  => login_submit()} className="w-full bg-amber-400 hover:bg-amber-400">
                  Login
                  </Button>
                </>
                )}
             
              <div className="grid grid-cols-3 gap-4">
              
              </div>
              <div className="text-center text-sm text-white">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
            <div className="relative hidden bg-white h-full md:block">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
              <img
              src="/assets/side.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-contain"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome to Kaascan Parent Portal</h2>
              <p className="text-lg opacity-90">
                Empowering parents with real-time insights into their children's educational journey.
                Stay connected, stay informed.
              </p>
              </div>
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
