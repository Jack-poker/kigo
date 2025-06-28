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
  <QueryClientProvider client={queryClient} data-oid="3mqvior">
    <ThemeProvider data-oid="d_-e8_1">
      <LanguageProvider data-oid="6osz36_">
        <TooltipProvider data-oid="5uhwuy5">
          <Toaster data-oid=".ul:c1u" />
          <Sonner data-oid="t2a5nd1" />
          <BrowserRouter data-oid=":uzhknr">
            <Routes data-oid="-0kq637">
              <Route
                path="/login"
                element={<LoginPage data-oid="1efdd0:" />}
                data-oid="upvq2no"
              />

              <Route
                path="/dashboard"
                element={<Index data-oid="f9u6odi" />}
                data-oid="0l73cke"
              />

              <Route
                path="/signup"
                element={<SignupForm data-oid="dwu.6e2" />}
                data-oid=":xrwop9"
              />

              <Route
                path="/message"
                element={<MessageGenerator data-oid="xfvc1ma" />}
                data-oid="yr6k0nf"
              />

              <Route
                path="/chat"
                element={<WhatsAppChat data-oid="d29cjsh" />}
                data-oid="a-49_04"
              />

              <Route
                path="/admin"
                element={<AdminLogin data-oid="405gem3" />}
                data-oid="6kxy64m"
              />

              <Route
                path="/admin/dashboard"
                element={<AdminPanel data-oid=".slb301" />}
                data-oid="fjz8om1"
              />

              <Route
                path="/shop"
                element={<Shop data-oid="q-1_s:e" />}
                data-oid="oa_11om"
              />

              <Route
                path="/qr-redeemer"
                element={<QRRedeemer data-oid="eqcnf5v" />}
                data-oid="3_tod2f"
              />

              <Route
                path="/student-balance"
                element={<StudentBalance data-oid="xvcru-9" />}
                data-oid="41bo85a"
              />

              <Route
                path="/location-info"
                element={<LocationInfo data-oid="0.kr0zz" />}
                data-oid="8375eb0"
              />

              <Route
                path="/news"
                element={<News data-oid=":m6g75_" />}
                data-oid="b_15do."
              />

              <Route
                path="/payment-status"
                element={<PaymentStatus data-oid="p2.er9q" />}
                data-oid="3eokuz7"
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={<NotFound data-oid="0svl1e7" />}
                data-oid="c954vjy"
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
