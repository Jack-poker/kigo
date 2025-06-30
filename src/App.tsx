import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Auth/login";
import SignupForm from "./pages/Auth/signup";
import MessageCard from "./components/MessageCard";
import MessageGenerator from "./pages/MessageGenerator";
import WhatsAppChat from "./pages/WhatsAppChat";
import AdminPanel from "./pages/AdminPanel";
import QRRedeemer from "./pages/QRRedeemer";
import StudentBalance from "./pages/StudentBalance";
import LocationInfo from "./pages/LocationInfo";
import News from "./pages/News";
import Shop from "./pages/shop";
import { AdminLogin } from "./components/admin/AdminLogin";
import PaymentStatus from "./pages/paymentStatus";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient} data-oid="mwbxh.g">
    <ThemeProvider data-oid="aor5fqa">
      <LanguageProvider data-oid="u01nq7l">
        <TooltipProvider data-oid=".xc-n8k">
          <Toaster data-oid="vvt-idc" />
          <Sonner data-oid="z9x1sk5" />
          <BrowserRouter data-oid="pd6aa3x">
            <Routes data-oid="5cyzufd">
              <Route
                path="/login"
                element={<LoginPage data-oid="ixsd_d5" />}
                data-oid="_0zsj1b"
              />

              <Route
                path="/dashboard"
                element={<Index data-oid=":svioi:" />}
                data-oid="ylbat2-"
              />

              <Route
                path="/signup"
                element={<SignupForm data-oid="t18p52g" />}
                data-oid="ny6ov-r"
              />

              <Route
                path="/message"
                element={<MessageGenerator data-oid="yw2k6gv" />}
                data-oid="qqa1v32"
              />

              <Route
                path="/chat"
                element={<WhatsAppChat data-oid=".6dkyov" />}
                data-oid="pl1sb2l"
              />

              <Route
                path="/admin"
                element={<AdminLogin data-oid="ueq5aaq" />}
                data-oid="oqwlvbi"
              />

              <Route
                path="/admin/dashboard"
                element={<AdminPanel data-oid="zv1g3ny" />}
                data-oid="obrf.fm"
              />

              <Route
                path="/shop"
                element={<Shop data-oid="stz6.vn" />}
                data-oid=".fi-v5v"
              />

              <Route
                path="/qr-redeemer"
                element={<QRRedeemer data-oid="rhmekig" />}
                data-oid="he0u-67"
              />

              <Route
                path="/student-balance"
                element={<StudentBalance data-oid="gdwo73y" />}
                data-oid="8rwl017"
              />

              <Route
                path="/location-info"
                element={<LocationInfo data-oid="_0q078e" />}
                data-oid="nq6qwpk"
              />

              <Route
                path="/news"
                element={<News data-oid="zq7ix3:" />}
                data-oid="dsgz1fg"
              />

              <Route
                path="/payment-status"
                element={<PaymentStatus data-oid="8_if:82" />}
                data-oid="uwfernv"
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={<NotFound data-oid="gp9fzoi" />}
                data-oid="_6sbn6-"
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
