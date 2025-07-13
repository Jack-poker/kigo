import { LoginForm } from "@/components/login-form";
import { cn } from "@/lib/utils";
import { QrCode } from '@ark-ui/react/qr-code'
import { useMediaQuery } from "react-responsive";
import { RocketIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useState } from "react";




export const Qrcode = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (!isDesktop) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 50,
        background: "rgb(255, 255, 255)",
        borderRadius: "1.5rem",
        boxShadow: "0 8px 32px rgba(255, 255, 255, 0.15)",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        border: "1px solid #e0e0e0",
        backdropFilter: "blur(8px)",
        width:"200px"
      }}
    >
      <QrCode.Root defaultValue="https://kaascan.com">
        <QrCode.Frame style={{ borderRadius: "1rem", overflow: "hidden" }}>
          <QrCode.Pattern color="#fff" />
        </QrCode.Frame>
       
        <QrCode.DownloadTrigger
          fileName="qr-code.png"
          mimeType="image/png"
          style={{
            marginTop: "0.5rem",
            background: "orange",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(79,124,166,0.10)",
            transition: "background 0.2s",
          }}
        >
          Download
        </QrCode.DownloadTrigger>
      </QrCode.Root>
      <span style={{ fontSize: "0.85rem", color: "gray", fontWeight: 500 }}>
        Scan to visit our site
      </span>
    </div>
  );
};


export default function LoginPage(baseUrl) {
  return (
    <>
    <div
      className={cn(
        "relative min-h-svh overflow-hidden", // ✅ Prevent scroll
        "before:absolute before:inset-0 before:opacity-[0.2]",
        "before:[background-size:30px_30px]",
        "before:[background-image:linear-gradient(to_right,#00994C15_1px,transparent_1px),linear-gradient(to_bottom,#00994C15_1px,transparent_1px)]"
      )}
      style={{
        backgroundImage: "linear-gradient(45deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
        backgroundBlendMode: "overlay,overlay,overlay,normal",
      }}
      data-oid="4c0jug3"
    >
      {/* Decorative gradient blur */}
      <div
        className="absolute top-0 -left-4 w-72 h-72 bg-[#00994C] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none"
        data-oid="axgdhso"
      ></div>
      <div
        className="absolute top-0 -right-4 w-72 h-72 bg-[#007E3A] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"
        data-oid="u2elad_"
      ></div>

      {/* Content container */}
      <div
        className="relative flex min-h-svh items-center justify-center p-6 md:p-10"
        data-oid="xa6ww5z"
      >
        <div className="w-full max-w-sm md:max-w-3xl" data-oid="-g7amzs">
          <Qrcode />
          
          <LoginForm data-oid="q9_r0m-" />
        </div>
      </div>
    </div></>
  );
}
