import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <div
      className={cn(
        "relative min-h-svh",
        // Main background with gradient
        // "bg-gradient-to-br from-[#F0FAF5] via-white to-[#F0FAF5]",
        // Modern grid overlay
        "before:absolute before:inset-0 before:opacity-[0.2]",
        "before:[background-size:30px_30px]",
        "before:[background-image:linear-gradient(to_right,#00994C15_1px,transparent_1px),linear-gradient(to_bottom,#00994C15_1px,transparent_1px)]",
      )}
      // style={{
      //   backgroundImage: "url('/assets/background.png')",
      //   backgroundRepeat: "repeat",
      //   backgroundSize: "auto",
      // }}

      style={{
        backgroundImage:
          "linear-gradient(45deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
        backgroundBlendMode: "overlay,overlay,overlay,normal",
      }}
      data-oid="p_0s14-"
    >
      {/* Decorative gradient blur */}
      <div
        className="absolute top-0 -left-4 w-72 h-72 bg-[#00994C] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"
        data-oid="7u3t19u"
      ></div>
      <div
        className="absolute top-0 -right-4 w-72 h-72 bg-[#007E3A] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"
        data-oid="6nqydh6"
      ></div>

      {/* Content container */}
      <div
        className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
        data-oid="8iry0t4"
      >
        <div className="w-full max-w-sm md:max-w-3xl" data-oid="p2md7g5">
          <SignupForm data-oid="j6.:8o6" />
        </div>
      </div>
    </div>
  );
}
