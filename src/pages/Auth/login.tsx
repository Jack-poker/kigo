import { LoginForm } from "@/components/login-form"
import { cn } from "@/lib/utils"

export default function LoginPage(baseUrl) {
  return (
    <div className={cn(
        "relative min-h-svh",
        // Main background with gradient
        // "bg-gradient-to-br from-[#F0FAF5] via-white to-[#F0FAF5]",
        // "bg-gradient-to-r from-lime-400 to-lime-500",//code_here
        // Modern grid overlay
        "before:absolute before:inset-0 before:opacity-[0.2]",
        "before:[background-size:30px_30px]",
        "before:[background-image:linear-gradient(to_right,#00994C15_1px,transparent_1px),linear-gradient(to_bottom,#00994C15_1px,transparent_1px)]",
      )}  style={{      backgroundImage: "url('/assets/background.png')",
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto'}}>
      {/* Decorative gradient blur */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-[#00994C] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-[#007E3A] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      
      {/* Content container */}
      <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
