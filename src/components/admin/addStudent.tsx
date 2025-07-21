import {
  CheckCircle,
  Search,
  Users,
  Camera,
  ArrowLeft,
  Lock,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import React, { useState, useEffect, useRef, Component, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

// Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: string | null }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-white/20 text-white rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Something went wrong: {this.state.error}</p>
          <p>Please try again or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Language context (mocked)
interface LanguageContextType {
  t: (key: string) => string;
}
const useLanguage = (): LanguageContextType => ({
  t: (key: string) => key, // Replace with actual LanguageContext
});

// Student interface
interface Student {
  student_id: string;
  student_name: string;
  student_photo_url: string;
  school_name: string;
  grade: string;
  parent_id: string | null;
  parent_phone: string | null;
}

// Step definitions (Modified: Added Set PIN before Confirm Child)
const steps = [
  { label: "Choose Method", icon: Users },
  { label: "Find Child", icon: Search },
  { label: "Set PIN", icon: Lock }, // Moved Set PIN here
  { label: "Confirm Child", icon: CheckCircle },
];

// API base URL
const API_URL = "http://localhost:8001";

// StepIndicator Component
interface StepIndicatorProps {
  currentStep: number;
}
const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between max-w-lg mx-auto px-4">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col items-center flex-1 relative">
            <motion.div
              className={`w-12 h-12 flex items-center justify-center rounded-full bg-brand text-white border-2 border-white/20 ${index <= currentStep ? "shadow-lg" : "opacity-70"}`}
              animate={{ scale: index === currentStep ? 1.2 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <step.icon size={24} />
            </motion.div>
            <span className="mt-2 text-sm font-semibold text-white">{t(step.label)}</span>
            {index < steps.length - 1 && (
              <div className="absolute top-6 left-1/2 w-full h-1 bg-white/20">
                <motion.div
                  className="h-full bg-brand"
                  initial={{ width: "0%" }}
                  animate={{ width: index < currentStep ? "100%" : "0%" }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// MethodSelection Component
interface MethodSelectionProps {
  onMethodSelect: (method: "manual" | "qr") => void;
}
const MethodSelection: React.FC<MethodSelectionProps> = ({ onMethodSelect }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8"
    >
      <h1 className="text-3xl font-bold text-white">Add Your Child</h1>
      <p className="text-lg text-white/80">Choose how to find your child.</p>
      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMethodSelect("manual")}
          className="p-6 bg-brand text-white rounded-2xl shadow-lg flex items-center justify-center gap-4 text-xl"
        >
          <Search size={28} />
          Search by Name
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMethodSelect("qr")}
          className="p-6 bg-brand text-white rounded-2xl shadow-lg flex items-center justify-center gap-4 text-xl"
        >
          <Camera size={28} />
          Scan QR Code
        </motion.button>
      </div>
    </motion.div>
  );
};

// QRScanner Component
interface QRScannerProps {
  onScanSuccess: (student: Student) => void;
  onError: (error: string) => void;
}
const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onError }) => {
  const { t } = useLanguage();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scannerStatus, setScannerStatus] = useState<"idle" | "scanning" | "paused" | "stopped">("idle");
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);
  const lastScannedText = useRef<string | null>(null);

  const startScanner = useCallback(async () => {
    if (!isMounted.current || !scannerRef.current || scannerStatus === "scanning") return;
    try {
      setScannerStatus("scanning");
      const config: Html5QrcodeCameraScanConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          if (!isMounted.current || isProcessing || lastScannedText.current === decodedText) return;
          lastScannedText.current = decodedText;
          setIsProcessing(true);
          try {
            const response = await axios.get(`${API_URL}/admin/students`, {
              headers: {
                "X-API-KEY": "ykxiPah7Uc327P6sSeZ6KhXqnLwV6nxIYuVjooOInOO3ko26xgbJGz1VG",
              },
            });
            const student = response.data.students.find(
              (s: Student) => s.student_id === decodedText
            );
            if (student && isMounted.current) {
              await stopScanner();
              onScanSuccess(student);
            } else {
              onError("Student not found.");
              lastScannedText.current = null;
            }
          } catch (err) {
            onError("Failed to fetch student data.");
            lastScannedText.current = null;
          } finally {
            setIsProcessing(false);
          }
        },
        (error) => {
          if (process.env.NODE_ENV === "development") {
            console.warn("QR scan error:", error);
          }
        }
      );
    } catch (err: any) {
      setScannerStatus("stopped");
      onError("Camera access denied. Please allow camera permissions.");
      if (process.env.NODE_ENV === "development") {
        console.error("Start scanner error:", err);
      }
    }
    
  }, [isProcessing, scannerStatus, onScanSuccess, onError]);

  const stopScanner = useCallback(async () => {
    if (!scannerRef.current || scannerStatus !== "scanning") {
      setScannerStatus("stopped");
      return;
    }
    try {
      await scannerRef.current.stop();
      scannerRef.current.clear();
      setScannerStatus("stopped");
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error stopping scanner:", err.message);
      }
    }
  }, [scannerStatus]);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-reader");
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      if (scannerRef.current && scannerStatus === "scanning") {
        stopScanner();
      }
    };
  }, [stopScanner, scannerStatus]);

useEffect(() => {
  // Automatically start scanner when component mounts
  startScanner();
  // Cleanup: stop scanner when unmounting
  return () => {
    stopScanner();
  };
  // Only run once on mount/unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleStartStop = async () => {
    if (scannerStatus === "scanning") {
      await stopScanner();
    } else {
      await startScanner();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 relative"
    >
    
      <h2 className="text-2xl font-bold text-white text-center">Scan QR Code</h2>
      <p className="text-lg text-white/80 text-center">
        Point your camera at the student’s QR code.
      </p>
      <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden">
        <div id="qr-reader" />
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3 text-white">
              <Loader2 className="w-12 h-12 animate-spin" />
              <p className="text-lg">Processing QR Code...</p>
            </div>
          </motion.div>
        )}
      </div>
      {/* <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartStop}
        disabled={isProcessing || scannerStatus === "scanning" && !scannerRef.current}
        className="w-full p-4 bg-brand text-white rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-50 "
        aria-label={scannerStatus === "scanning" ? "Stop Scanning" : "Start Scanning"}
      >
        {scannerStatus === "scanning" ? (
          <>
            <X size={24} />
            Stop Scanning
          </>
        ) : (
          <>
            <Camera size={24} />
            Start Scanning
          </>
        )}
      </motion.button> */}
    </motion.div>
  );
};

// ManualSearch Component
interface ManualSearchProps {
  schools: string[];
  grades: string[];
  selectedSchool: string;
  setSelectedSchool: (value: string) => void;
  selectedGrade: string;
  setSelectedGrade: (value: string) => void;
  searchName: string;
  setSearchName: (value: string) => void;
  handleSearch: () => void;
  searchResults: Student[];
  onStudentSelect: (student: Student) => void;
  isLoading: boolean;
}
const ManualSearch: React.FC<ManualSearchProps> = ({
  schools,
  grades,
  selectedSchool,
  setSelectedSchool,
  selectedGrade,
  setSelectedGrade,
  searchName,
  setSearchName,
  handleSearch,
  searchResults,
  onStudentSelect,
  isLoading,
}) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white text-center">Find Your Child</h2>
      <p className="text-lg text-white/80 text-center">Enter their name, school, and class.</p>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Child's Name"
            className="w-full p-4 pl-12 bg-white text-brand rounded-2xl text-lg shadow-lg"
            aria-label="Child's Name"
          />
          <Search className="absolute left-4 top-4 w-6 h-6 text-brand" />
        </div>
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="w-full p-4 bg-white text-brand rounded-2xl text-lg shadow-lg"
          aria-label="Select School"
        >
          <option value="">Select School</option>
          {schools.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="w-full p-4 bg-white text-brand rounded-2xl text-lg shadow-lg"
          aria-label="Select Class or Grade"
        >
          <option value="">Select Class/Grade</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          disabled={isLoading || !searchName || !selectedSchool}
          className="w-full p-4 bg-brand text-white rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-50"
          aria-label="Find Child"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search size={24} />
              Find Child
            </>
          )}
        </motion.button>
      </div>
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <p className="text-lg text-white text-center">Pick Your Child</p>
          <div className="max-h-64 overflow-y-auto">
            {searchResults.map((student) => (
              <motion.button
                key={student.student_id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStudentSelect(student)}
                className="w-full p-4 bg-white text-brand rounded-2xl shadow-lg flex items-center gap-4 mb-2"
                aria-label={`Select ${student.student_name}`}
              >
                <img
                  src={student.student_photo_url}
                  alt={student.student_name}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.student_name)}`;
                  }}
                />
                <div className="text-left">
                  <p className="text-lg font-semibold">{student.student_name}</p>
                  <p className="text-sm">{student.school_name} - {student.grade}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// StudentConfirmation Component
interface StudentConfirmationProps {
  student: Student;
  pin: string; // Added pin prop
  onConfirm: () => void;
  isLoading: boolean;
}
const StudentConfirmation: React.FC<StudentConfirmationProps> = ({ student, pin, onConfirm, isLoading }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white text-center">Is This Your Child?</h2>
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
        <img
          src={student.student_photo_url}
          alt={student.student_name}
          className="w-24 h-24 rounded-full mx-auto mb-4"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.student_name)}`;
          }}
        />
        <p className="text-xl font-semibold text-brand">{student.student_name}</p>
        <p className="text-lg text-brand/80">{student.school_name} - {student.grade}</p>
        <p className="text-sm text-brand/80 mt-2">PIN: {pin}</p> {/* Display PIN for confirmation */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          disabled={isLoading}
          className="mt-4 w-full p-4 bg-brand text-white rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-50"
          aria-label="Confirm Student"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <CheckCircle size={24} />
              Yes, Add Them
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// PinSetup Component
interface PinSetupProps {
  student: Student;
  onSetPin: (pin: string) => void; // Modified to pass PIN
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
const PinSetup: React.FC<PinSetupProps> = ({ student, onSetPin, isLoading, setIsLoading }) => {
  const { t } = useLanguage();
  const [pin, setPin] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [stage, setStage] = useState<"enterPin" | "confirmPin">("enterPin");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentInput.length === 4) {
      if (stage === "enterPin") {
        setPin(currentInput);
        setCurrentInput("");
        setStage("confirmPin");
      } else if (stage === "confirmPin") {
        if (currentInput === pin) {
          onSetPin(currentInput); // Pass the confirmed PIN
        } else {
          setError("PINs don’t match. Try again.");
          setCurrentInput("");
          setTimeout(() => setError(null), 3000);
        }
      }
    }
  }, [currentInput, stage, pin, onSetPin]);

  const handleNumberPress = (num: string) => {
    if (currentInput.length < 4) setCurrentInput(currentInput + num);
  };

  const handleBackspace = () => {
    setCurrentInput(currentInput.slice(0, -1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white text-center">
        Set a PIN for {student.student_name}
      </h2>
      <p className="text-lg text-white/80 text-center">
        {stage === "enterPin" ? "Enter a 4-digit PIN" : "Enter the PIN again"}
      </p>
      <div className="flex justify-center gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl text-brand"
          >
            {currentInput[i] || ""}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNumberPress(num.toString())}
            className="p-4 bg-brand text-white rounded-xl text-2xl border border-white-200"
            aria-label={`Number ${num}`}
          >
            {num}
          </motion.button>
        ))}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleBackspace}
          className="p-4 bg-brand text-white rounded-xl text-2xl"
          aria-label="Backspace"
        >
          ⌫
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleNumberPress("0")}
          className="p-4 bg-brand text-white rounded-xl text-2xl"
          aria-label="Number 0"
        >
          0
        </motion.button>
      </div>
      {error && <p className="text-white text-center">{error}</p>}
      {isLoading && (
        <div className="flex justify-center items-center gap-3 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-lg">Setting PIN...</p>
        </div>
      )}
    </motion.div>
  );
};

// Main AddStudent Component
const AddStudent: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchMethod, setSearchMethod] = useState<"manual" | "qr">("manual");
  const [schools, setSchools] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [pin, setPin] = useState<string>(""); // Added state for PIN
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState("");

  const fetchCsrfToken = async (retries = 3): Promise<string | undefined> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(`${API_URL}/get-csrf-token`);
        setCsrfToken(response.data.csrf_token);
        return response.data.csrf_token;
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error(`CSRF token fetch attempt ${attempt} failed:`, err);
        }
        if (attempt === retries) {
          setError("Failed to fetch CSRF token.");
          return undefined;
        }
      }
    }
  };

  const validateToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to continue.");
      navigate("/dashboard");
      return false;
    }
    return token;
  };

  useEffect(() => {
    const fetchSchoolsAndGrades = async () => {
      setIsLoading(true);
      const token = validateToken();
      if (!token) return;

      try {
        const response = await axios.get(`${API_URL}/admin/students`, {
          headers: {
            "X-API-KEY": "ykxiPah7Uc327P6sSeZ6KhXqnLwV6nxIYuVjooOInOO3ko26xgbJGz1VG",
          },
        });
        const uniqueSchools = [...new Set(response.data.students.map((s: Student) => s.school_name))].sort();
        const uniqueGrades = [...new Set(response.data.students.map((s: Student) => s.grade))].sort();
        setSchools(uniqueSchools);
        setGrades(uniqueGrades);
       
      // setScannerStatus("stopped");
    
      
      } catch (err) {
        setError("initializing Data...");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchoolsAndGrades();
    fetchCsrfToken();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    const token = validateToken();
    if (!token) return;

    try {
      const response = await axios.get(`${API_URL}/admin/students`, {
        headers: {
          "X-API-KEY": "ykxiPah7Uc327P6sSeZ6KhXqnLwV6nxIYuVjooOInOO3ko26xgbJGz1VG",
        },
      });
      const filtered = response.data.students.filter(
        (s: Student) =>
          s.student_name.toLowerCase().includes(searchName.toLowerCase()) &&
          (!selectedSchool || s.school_name === selectedSchool) &&
          (!selectedGrade || s.grade === selectedGrade)
      );
      setSearchResults(filtered);
      if (filtered.length === 0) setError("No children found.");
    } catch (err) {
      setError("Search failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPin = async (newPin: string) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${API_URL}/student/pin`,
        { student_id: selectedStudent!.student_id, pin: newPin },
        {
          headers: {
            "X-API-KEY": "ykxiPah7Uc327P6sSeZ6KhXqnLwV6nxIYuVjooOInOO3ko26xgbJGz1VG",
          },
        }
      );
      setPin(newPin); // Store the PIN
      setCurrentStep(3); // Move to confirmation step
    } catch (err) {
      setError("Failed to set PIN. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedStudent || !pin) return;
    setIsLoading(true);
    const token = validateToken();
    if (!token) return;

    try {
      const csrf = csrfToken || (await fetchCsrfToken());
      if (!csrf) {
        setError("Failed to fetch CSRF token.");
        setIsLoading(false);
        return;
      }
      const parent_data = await axios.get("http://localhost:8001/profile", {
        headers: { Authorization: `Bearer ${token}`, "X-CSRF-Token": csrf },
      });

      if (parent_data.data["status"] === "success") {
        let parent_phone = parent_data.data["profile"]["phone_number"];
        console.log(parent_phone);
      }

      const response = await axios.post(
        `https://auto.kaascan.com/webhook/link-student`,
        {
          student_id: selectedStudent.student_id,
          parent_phone: parent_data.data["profile"]["phone_number"] || null,
          parent_id: selectedStudent.parent_id || null,
          pin, // Include PIN in the linking request
          csrf_token: csrf,
        },
        {
          headers: {
            "X-API-KEY": "Yeda9SWIhjGpaiBB9oeWujZ8xHRKBnPrCnr0kHlLQxBDuaoEdm8wKu39m5zd1EAyUSMrUF2MOdplN0ogcAH2RDjf8DJ9eb9T3qnSXEpdE4msKbQHRD2w2sMMe9r03tvC",
          },
        }
      );

      if (response.data["status"] === true) {
        console.log(response.data["status"]);
        setError("Student added successfully.");
        // Force a refresh of the current page
        window.location.reload();
      } else {
        setError(
          response.data["message"] === "Already linked"
            ? "Umwana asanzwe ahujwe na account yanyu."
            : "Guhuza umunyeshuri na account ntibishoboye kugenda neza mwongere mugerageze."
        );
        console.log("Student adding failed");
      }
    } catch (err) {
      setError("Initializing data...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodSelect = (method: "manual" | "qr") => {
    setSearchMethod(method);
    setCurrentStep(method === "manual" ? 1 : 2);
    setSearchResults([]);
    setSearchName("");
    setSelectedSchool("");
    setSelectedGrade("");
    setError(null);
    setPin(""); // Reset PIN when changing method
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setCurrentStep(2); // Move to Set PIN step
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      if (currentStep === 2 && searchMethod === "qr") {
        setCurrentStep(0);
      } else if (currentStep === 3) {
        setCurrentStep(2); // Go back to Set PIN
      } else {
        setCurrentStep(currentStep - 1);
      }
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen bg-brand relative"
          style={{
        backgroundImage:
          "linear-gradient(45deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
        backgroundBlendMode: "overlay,overlay,overlay,normal",
      }}
      >
        <div className="max-w-4xl mx-auto py-8 px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/dashboard")}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white"
            aria-label="Close"
          >
            <X size={24} />
          </motion.button>
          <StepIndicator currentStep={currentStep} />
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-white/20 text-white rounded-2xl text-center"
            >
              {error}
            </motion.div>
          )}
          <div className="bg-white/10 rounded-3xl p-6 min-h-[60vh]">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <MethodSelection
                  key="method"
                  onMethodSelect={handleMethodSelect}
                />
              )}
              {currentStep === 1 && (
                <ManualSearch
                  key="manual"
                  schools={schools}
                  grades={grades}
                  selectedSchool={selectedSchool}
                  setSelectedSchool={setSelectedSchool}
                  selectedGrade={selectedGrade}
                  setSelectedGrade={setSelectedGrade}
                  searchName={searchName}
                  setSearchName={setSearchName}
                  handleSearch={handleSearch}
                  searchResults={searchResults}
                  onStudentSelect={handleStudentSelect}
                  isLoading={isLoading}
                />
              )}
              {currentStep === 2 && searchMethod === "qr" && (
                <QRScanner
                  key="qr"
                  onScanSuccess={handleStudentSelect}
                  onError={setError}
                />
              )}
              {currentStep === 2 && selectedStudent && (
                <PinSetup
                  key="setPin"
                  student={selectedStudent}
                  onSetPin={handleSetPin}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              )}
              {currentStep === 3 && selectedStudent && (
                <StudentConfirmation
                  key="confirm"
                  student={selectedStudent}
                  pin={pin} // Pass PIN to confirmation
                  onConfirm={handleConfirm}
                  isLoading={isLoading}
                />
              )}
            </AnimatePresence>
          </div>
          <div className="flex justify-between mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="p-4 bg-brand text-white rounded-2xl flex items-center gap-2 text-lg"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
              Back
            </motion.button>
            <p className="text-white text-lg">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AddStudent;

