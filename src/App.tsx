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
  <QueryClientProvider client={queryClient} data-oid="e_x:w0t">
    <ThemeProvider data-oid="csika07">
      <LanguageProvider data-oid="fv_6u9e">
        <TooltipProvider data-oid="i-qhxfc">
          <Toaster data-oid="blj61vf" />
          <Sonner data-oid="837.xx." />
          <BrowserRouter data-oid="8vfennd">
            <Routes data-oid="jhrvswo">
              <Route
                path="/login"
                element={<LoginPage data-oid="dox3gn9" />}
                data-oid="cr7:v-e"
              />

              <Route
                path="/dashboard"
                element={<Index data-oid="e:2z-r4" />}
                data-oid="k-6.oh:"
              />

              <Route
                path="/signup"
                element={<SignupForm data-oid="bpxb-4h" />}
                data-oid="4.1s820"
              />

              <Route
                path="/message"
                element={<MessageGenerator data-oid="pbbp2.q" />}
                data-oid="6fgv89s"
              />

              <Route
                path="/chat"
                element={<WhatsAppChat data-oid="r:3l-dp" />}
                data-oid="d0oez2p"
              />

              <Route
                path="/admin"
                element={<AdminLogin data-oid="70ubadf" />}
                data-oid="i01u.dm"
              />

              <Route
                path="/admin/dashboard"
                element={<AdminPanel data-oid="td-e5at" />}
                data-oid="o57wp91"
              />

              <Route
                path="/shop"
                element={<Shop data-oid="0-t82dw" />}
                data-oid=".1snepy"
              />

              <Route
                path="/qr-redeemer"
                element={<QRRedeemer data-oid="4f9hr2m" />}
                data-oid="vlnx2gf"
              />

              <Route
                path="/student-balance"
                element={<StudentBalance data-oid="42:0m3d" />}
                data-oid="4i_:1z_"
              />

              <Route
                path="/location-info"
                element={<LocationInfo data-oid="-hkbgp1" />}
                data-oid="7xno_9c"
              />

              <Route
                path="/news"
                element={<News data-oid="so4phm4" />}
                data-oid="2im6wp1"
              />

              <Route
                path="/payment-status"
                element={<PaymentStatus data-oid="svos7o_" />}
                data-oid="g4hkav0"
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={<NotFound data-oid="y56y4tc" />}
                data-oid="bbgl1c8"
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
