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
  <QueryClientProvider client={queryClient} data-oid="3l4im0z">
    <ThemeProvider data-oid="z.ldiag">
      <LanguageProvider data-oid="wqci47d">
        <TooltipProvider data-oid="1b6jnr4">
          <Toaster data-oid="6d--2z6" />
          <Sonner data-oid="n3az9eo" />
          <BrowserRouter data-oid="5vhccn8">
            <Routes data-oid="y13n__w">
              <Route
                path="/login"
                element={<LoginPage data-oid="4-q2m0p" />}
                data-oid="a-3h.td"
              />

              <Route
                path="/dashboard"
                element={<Index data-oid="mnfctmx" />}
                data-oid="52zokg:"
              />

              <Route
                path="/signup"
                element={<SignupForm data-oid="5f8khn-" />}
                data-oid="dlz2tnh"
              />

              <Route
                path="/message"
                element={<MessageGenerator data-oid="s09416f" />}
                data-oid="723v._4"
              />

              <Route
                path="/chat"
                element={<WhatsAppChat data-oid="w4-cwm9" />}
                data-oid="ln4yobg"
              />

              <Route
                path="/admin"
                element={<AdminLogin data-oid=":ciivp_" />}
                data-oid="jyfofpa"
              />

              <Route
                path="/admin/dashboard"
                element={<AdminPanel data-oid="yl99_-y" />}
                data-oid="90e6dbx"
              />

              <Route
                path="/shop"
                element={<Shop data-oid="r8-d0xq" />}
                data-oid="c2vvu1d"
              />

              <Route
                path="/qr-redeemer"
                element={<QRRedeemer data-oid="qgog:i." />}
                data-oid="a7v_wua"
              />

              <Route
                path="/student-balance"
                element={<StudentBalance data-oid="nx1_6_c" />}
                data-oid="je_96ye"
              />

              <Route
                path="/location-info"
                element={<LocationInfo data-oid="bd9jt0d" />}
                data-oid="l39ll5k"
              />

              <Route
                path="/news"
                element={<News data-oid="c7z1zlq" />}
                data-oid="qohbvj2"
              />

              <Route
                path="/payment-status"
                element={<PaymentStatus data-oid="md4l8j8" />}
                data-oid="zbu3drz"
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={<NotFound data-oid="2zvg6qm" />}
                data-oid="51nvo7v"
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
