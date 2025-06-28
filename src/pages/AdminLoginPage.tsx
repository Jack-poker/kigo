import { AdminLogin } from "@/components/admin/AdminLogin";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  return (
    <div
      className={cn(
        "relative min-h-svh",
        // Main background with gradient
        "bg-gradient-to-br from-[#F0FAF5] via-white to-[#F0FAF5]",
        // Grid pattern overlay
        "before:absolute before:inset-0 before:opacity-[0.2]",
        "before:[background-size:30px_30px]",
        "before:[background-image:linear-gradient(to_right,#00994C15_1px,transparent_1px),linear-gradient(to_bottom,#00994C15_1px,transparent_1px)]",
      )}
      data-oid="qr30fco"
    >
      {/* Decorative animated blobs */}
      <div
        className="absolute top-0 -left-4 w-72 h-72 bg-[#00994C] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"
        data-oid="kmxhx.g"
      ></div>
      <div
        className="absolute top-0 -right-4 w-72 h-72 bg-[#007E3A] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"
        data-oid="68q8fkl"
      ></div>

      {/* Centered content container */}
      <div
        className="relative flex min-h-svh flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
        data-oid="b8hwgdw"
      >
        <div
          className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
          data-oid=".ozmiug"
        >
          <AdminLogin data-oid="82jmggg" />
        </div>
      </div>
    </div>
  );
}
