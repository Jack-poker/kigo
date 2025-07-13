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
  <QueryClientProvider client={queryClient} data-oid="mknwii0">
    <ThemeProvider data-oid="8z52gbx">
      <LanguageProvider data-oid="r:puzxo">
        <TooltipProvider data-oid="8qsyig5">
          <Toaster data-oid="8a:ui:a" />
          <Sonner data-oid="qkglz27" />
          <BrowserRouter data-oid="66rarny">
            <Routes data-oid="iszwi84">
              <Route
                path="/login"
                element={<LoginPage data-oid="671-bx4" />}
                data-oid="6v9in3q"
              />

              <Route
                path="/dashboard"
                element={<Index data-oid="0drvgdy" />}
                data-oid="9ufv2_1"
              />

              <Route
                path="/signup"
                element={<SignupForm data-oid="_bj4mgf" />}
                data-oid="8iorq1m"
              />

              <Route
                path="/message"
                element={<MessageGenerator data-oid="2lj0v3_" />}
                data-oid="orfe35z"
              />

              <Route
                path="/chat"
                element={<WhatsAppChat data-oid=".1i:qc." />}
                data-oid="yjc0jml"
              />

              <Route
                path="/admin"
                element={<AdminLogin data-oid="_n8koal" />}
                data-oid="2hkzl3p"
              />

              <Route
                path="/admin/dashboard"
                element={<AdminPanel data-oid="z66bi8z" />}
                data-oid="p-i3qu-"
              />

              <Route
                path="/shop"
                element={<Shop data-oid="feqse:3" />}
                data-oid="9psrz-2"
              />

              <Route
                path="/qr-redeemer"
                element={<QRRedeemer data-oid="g1df0rc" />}
                data-oid="q61qike"
              />

              <Route
                path="/student-balance"
                element={<StudentBalance data-oid="g1lhekk" />}
                data-oid="it4rdnq"
              />

              <Route
                path="/location-info"
                element={<LocationInfo data-oid="adez60i" />}
                data-oid="z.z:yoi"
              />

              <Route
                path="/news"
                element={<News data-oid="e33sbz3" />}
                data-oid="itaivgi"
              />

              <Route
                path="/payment-status"
                element={<PaymentStatus data-oid="we_74s6" />}
                data-oid="b_7i4b:"
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                 element={<LoginPage data-oid="671-bx4" />}
                // element={<NotFound data-oid=":-6oz71" />}
                data-oid=".vfibfc"
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
