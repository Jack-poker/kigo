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
  <QueryClientProvider client={queryClient} data-oid="68bvo8o">
    <ThemeProvider data-oid="jkjsgdn">
      <LanguageProvider data-oid="lwtlf_.">
        <TooltipProvider data-oid="hmu:a-v">
          <Toaster data-oid="ocnudt." />
          <Sonner data-oid="3brromp" />
          <BrowserRouter data-oid="3.yjk52">
            <Routes data-oid="4:k_33v">
              <Route
                path="/login"
                element={<LoginPage data-oid="vfut-b6" />}
                data-oid="8_u529i"
              />

              <Route
                path="/dashboard"
                element={<Index data-oid=":i9xr--" />}
                data-oid="1yz5of7"
              />

              <Route
                path="/signup"
                element={<SignupForm data-oid="2:.e_lx" />}
                data-oid="j7n6:o_"
              />

              <Route
                path="/message"
                element={<MessageGenerator data-oid="80nf90." />}
                data-oid="csxis7a"
              />

              <Route
                path="/chat"
                element={<WhatsAppChat data-oid="6vn3g24" />}
                data-oid="ubb-7-0"
              />

              <Route
                path="/admin"
                element={<AdminLogin data-oid="inms67p" />}
                data-oid="egmrmxf"
              />

              <Route
                path="/admin/dashboard"
                element={<AdminPanel data-oid="7eu6d98" />}
                data-oid="sto108p"
              />

              <Route
                path="/shop"
                element={<Shop data-oid="ocl.vn1" />}
                data-oid="vdjvo_u"
              />

              <Route
                path="/qr-redeemer"
                element={<QRRedeemer data-oid="4_rg9p2" />}
                data-oid="cnwx.ue"
              />

              <Route
                path="/student-balance"
                element={<StudentBalance data-oid="bdo-wz_" />}
                data-oid="bez_c6s"
              />

              <Route
                path="/location-info"
                element={<LocationInfo data-oid="1q_bz_k" />}
                data-oid="su.y1pp"
              />

              <Route
                path="/news"
                element={<News data-oid="u86.z2n" />}
                data-oid="g:0i4zy"
              />

              <Route
                path="/payment-status"
                element={<PaymentStatus data-oid="z.th-js" />}
                data-oid="41qh0zf"
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={<NotFound data-oid="6akq6no" />}
                data-oid="g:zv89l"
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
