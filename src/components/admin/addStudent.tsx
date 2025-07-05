import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Search,
  Users,
  Camera,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  School,
  GraduationCap,
  Loader2,
  X,
  Sparkles,
  Heart,
  Star,
  AlertCircle,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Student {
  student_id: string;
  student_name: string;
  student_photo_url: string;
  school_name: string;
  grade: string;
  parent_id: string | null;
  created_at: string;
  spending_limit: number;
  limit_period_days: number;
}

const steps = [
  { label: "chooseMethod", icon: UserPlus },
  { label: "findStudent", icon: Search },
  { label: "confirmDetails", icon: CheckCircle },
];

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const { t } = useLanguage();
  return (
    <div className="relative w-full mb-8 md:mb-12" data-oid="ocnsc3c">
      <div
        className="flex items-center justify-between max-w-[90vw] sm:max-w-md mx-auto"
        data-oid="qco:_6j"
      >
        {steps.map((step, index) => (
          <div key={step.label} data-oid="8ucp:81">
            <div
              className="flex flex-col items-center z-10 relative"
              data-oid="rycat.y"
            >
              <motion.div
                className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full shadow-xl backdrop-blur-sm border-2 ${
                  index <= currentStep
                    ? "bg-brand text-white border-white/20"
                    : "bg-brand text-gray-400 border-gray-200/30"
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                  opacity: 1,
                  transition: { duration: 0.4, type: "spring", bounce: 0.3 },
                }}
                data-oid=".wvnseb"
              >
                {index < currentStep ? (
                  <CheckCircle
                    size={20}
                    className="sm:w-6 sm:h-6"
                    data-oid="wiczfrp"
                  />
                ) : (
                  <step.icon
                    size={20}
                    className="sm:w-6 sm:h-6"
                    data-oid="oosmvlv"
                  />
                )}
                {index === currentStep && (
                  <motion.div
                    className="absolute rounded-full bg-zinc-900"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    data-oid="ofp7_s9"
                  />
                )}
              </motion.div>
              <motion.span
                className={`mt-2 text-xs sm:text-sm font-semibold ${
                  index <= currentStep ? "text-gray-900" : "text-gray-500"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-oid="d.6xzax"
              >
                {t(step.label)}
              </motion.span>
            </div>
            {index < steps.length - 1 && (
              <div className="relative flex-1 mx-2 sm:mx-6" data-oid="jlncg:n">
                <div
                  className="absolute top-5 sm:top-6 h-1 w-full bg-gray-200/50 rounded-full"
                  data-oid="0vyyjpt"
                />

                <motion.div
                  className="absolute top-5 sm:top-6 h-1 bg-gradient-to-r from-indigo-900 via-indigo-700 to-yellow-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: index < currentStep ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  data-oid="o927:qb"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MethodSelection: React.FC<{
  onMethodSelect: (method: "manual" | "qr") => void;
}> = ({ onMethodSelect }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-8"
      data-oid="h5u43jh"
    >
      <div className="space-y-4" data-oid="iauksk6">
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 bg-brand rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          data-oid="3iilxb."
        >
          <Users
            className="w-8 h-8 sm:w-10 sm:h-10 text-white"
            data-oid="oaizu.f"
          />
        </motion.div>
        <div data-oid="439_2n1">
          <h1
            className="text-2xl sm:text-4xl font-bold bg-brand bg-clip-text text-transparent mb-4"
            data-oid="7o1rny:"
          >
            {t("addYourChild")}
          </h1>
          <p
            className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto leading-relaxed"
            data-oid="pzky_m8"
          >
            {t("connectChildPrompt")}
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-[90vw] sm:max-w-3xl mx-auto"
        data-oid="tyl0vnr"
      >
        <motion.button
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMethodSelect("manual")}
          className="group relative p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          data-oid=":jg-ul9"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            data-oid="bn7tqja"
          />

          <div className="relative space-y-4 sm:space-y-6" data-oid="6_zj_x3">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-700 to-indigo-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg bg-[#000000]"
              data-oid="zck-8id"
            >
              <Search
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                data-oid=".xp5kq9"
              />
            </div>
            <div className="text-left" data-oid="hqzn_ta">
              <h3
                className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                data-oid="cl6jkvc"
              >
                {t("searchByName")}
              </h3>
              <p
                className="text-gray-600 leading-relaxed text-sm sm:text-base"
                data-oid="h9mtz8i"
              >
                {t("searchByNameDesc")}
              </p>
            </div>
            <div
              className="flex items-center text-indigo-700 font-semibold group-hover:translate-x-2 transition-transform duration-300"
              data-oid="24x8s-4"
            >
              <span className="text-sm sm:text-base" data-oid="ywt-6p5">
                {t("getStarted")}
              </span>
              <ArrowRight className="w-4 h-4 ml-2" data-oid="18sbgv1" />
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMethodSelect("qr")}
          className="group relative p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          data-oid="hk6p5v3"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            data-oid="a5i13lc"
          />

          <div className="relative space-y-4 sm:space-y-6" data-oid=".sxuv_0">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg bg-[#000000]"
              data-oid="e5uybx2"
            >
              <Camera
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                data-oid="_2exw7c"
              />
            </div>
            <div className="text-left" data-oid="ppmnahi">
              <h3
                className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                data-oid="e5mjvw-"
              >
                {t("scanQRCode")}
              </h3>
              <p
                className="text-gray-600 leading-relaxed text-sm sm:text-base"
                data-oid="v6yg5o-"
              >
                {t("scanQRCodeDesc")}
              </p>
            </div>
            <div
              className="flex items-center text-yellow-600 font-semibold group-hover:translate-x-2 transition-transform duration-300"
              data-oid="3cpuq22"
            >
              <span className="text-sm sm:text-base" data-oid="ai-i8c3">
                {t("openCamera")}
              </span>
              <Camera className="w-4 h-4 ml-2" data-oid="kx2sg.z" />
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

const ManualSearch: React.FC<{
  schools: string[];
  grades: string[];
  selectedSchool: string;
  setSelectedSchool: (value: string) => void;
  selectedGrade: string;
  setSelectedGrade: (value: string) => void;
  searchResults: Student[];
  handleSearch: () => void;
  onStudentSelect: (student: Student) => void;
  isLoading: boolean;
  searchName: string;
  setSearchName: (value: string) => void;
}> = ({
  schools,
  grades,
  selectedSchool,
  setSelectedSchool,
  selectedGrade,
  setSelectedGrade,
  searchResults,
  handleSearch,
  onStudentSelect,
  isLoading,
  searchName,
  setSearchName,
}) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
      data-oid="u902c.-"
    >
      <div className="text-center space-y-3" data-oid="rhrrcm_">
        <h2
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent"
          data-oid="v2tadcc"
        >
          {t("findStudent")}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg" data-oid="ltrp0ff">
          {t("findStudentPrompt")}
        </p>
      </div>

      <div className="space-y-4" data-oid="9693c5c">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          data-oid="t87n-nm"
        >
          <label
            className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2"
            data-oid="7v0fl6j"
          >
            <Users className="w-4 h-4 text-indigo-700" data-oid="f5kay4n" />
            {t("studentName")}
          </label>
          <div className="relative" data-oid="qpo8zbe">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder={t("enterStudentName")}
              className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-700 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg text-sm sm:text-base"
              data-oid="e82olu9"
            />

            <Search
              className="absolute left-3 sm:left-4 top-3 sm:top-4 w-5 h-5 text-gray-400"
              data-oid="r5-qse5"
            />
          </div>
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          data-oid="po3a0-7"
        >
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            data-oid="_xsqa3z"
          >
            <label
              className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2"
              data-oid="8ywrx2a"
            >
              <School className="w-4 h-4 text-yellow-600" data-oid="wovcwo4" />
              {t("schoolName")}
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-600 transition-all duration-300 text-gray-900 shadow-lg appearance-none cursor-pointer text-sm sm:text-base"
              data-oid="73p8539"
            >
              <option value="" data-oid="94n1d4y">
                {t("chooseSchool")}
              </option>
              {schools.map((school) => (
                <option key={school} value={school} data-oid="a05h:d-">
                  {school}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            data-oid="uvmwjx7"
          >
            <label
              className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2"
              data-oid="fif00na"
            >
              <GraduationCap
                className="w-4 h-4 text-indigo-700"
                data-oid="chhmwi7"
              />

              {t("gradeLevel")}
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              disabled={!selectedSchool}
              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-700 transition-all duration-300 text-gray-900 shadow-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              data-oid="edqratf"
            >
              <option value="" data-oid="lz.pkf3">
                {t("chooseGrade")}
              </option>
              {grades.map((grade) => (
                <option key={grade} value={grade} data-oid="t8hzxve">
                  {grade}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {(searchName || (selectedSchool && selectedGrade)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            data-oid="nraz10x"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-900 via-indigo-700 to-yellow-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto text-sm sm:text-base"
              data-oid="af_p7g2"
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    data-oid="rz-:4:u"
                  />

                  {t("searching")}
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" data-oid="xvv80tz" />
                  {t("searchStudents")}
                  <Sparkles className="w-4 h-4" data-oid="_0_6t6x" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>

      <AnimatePresence data-oid="5lg266x">
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-4"
            data-oid=":xdplk1"
          >
            <h3
              className="text-lg sm:text-xl font-bold text-gray-900 text-center sticky top-0 bg-white/80 backdrop-blur-sm py-2 z-10"
              data-oid="dkqjscx"
            >
              {t("selectYourChild")}
            </h3>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-indigo-50 scroll-smooth p-3 sm:p-4 rounded-2xl"
              data-oid="nzg3b5y"
            >
              {searchResults.map((student, index) => (
                <motion.button
                  key={student.student_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    y: -4,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onStudentSelect(student)}
                  className="group p-4 sm:p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
                  data-oid="vc.8oam"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-oid=".w9.e5a"
                  />

                  <div
                    className="relative flex items-center gap-3 sm:gap-4"
                    data-oid="monir6y"
                  >
                    <div className="relative" data-oid="w8xr.rd">
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg"
                        data-oid="zlebqzy"
                      >
                        <img
                          src={student.student_photo_url}
                          alt={student.student_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              student.student_name,
                            )}&background=random&color=fff`;
                          }}
                          data-oid="n-k-1tw"
                        />
                      </div>
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                        data-oid="gq5rggd"
                      >
                        <Heart
                          className="w-3 h-3 text-white"
                          data-oid="3x3ufuu"
                        />
                      </div>
                    </div>
                    <div className="flex-1" data-oid="oo-30o4">
                      <h4
                        className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors text-base sm:text-lg"
                        data-oid="tipy6su"
                      >
                        {student.student_name}
                      </h4>
                      <p
                        className="text-gray-600 font-medium text-sm sm:text-base"
                        data-oid="5t2ckwc"
                      >
                        {student.school_name}
                      </p>
                      <p
                        className="text-xs sm:text-sm text-gray-500 flex items-center gap-1"
                        data-oid=".2t4d2n"
                      >
                        <Star className="w-3 h-3" data-oid="w1oftmd" />
                        {t("grade")} {student.grade}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-indigo-700 group-hover:translate-x-2 transition-all duration-300"
                      data-oid="s574ylj"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const QRScanner: React.FC<{
  onStudentFound: (studentId: string) => void;
  onClose: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onBack: () => void;
}> = ({ onStudentFound, onClose, isLoading, setIsLoading, onBack }) => {
  const { t } = useLanguage();
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let html5QrcodeScanner: Html5QrcodeScanner | null = null;

    const initializeScanner = () => {
      if (!scannerRef.current || isInitialized) return;

      try {
        // Clean configuration to prevent camera view repetition
        html5QrcodeScanner = new Html5QrcodeScanner(
          "qr-scanner",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            // Prevent UI controls and overlays
            disableFlip: false,
            rememberLastUsedCamera: true,
            supportedScanTypes: [],
            // Hide all default UI elements
            showTorchButtonIfSupported: false,
            showZoomSliderIfSupported: false,
            // Auto-select best camera
            facingMode: "environment",
          },
          /* verbose= */ false,
        );

        setScanner(html5QrcodeScanner);
        setIsInitialized(true);

        // Success callback - when QR code is detected
        const onScanSuccess = (decodedText: string) => {
          // Validate if it's a valid student ID (UUID format)
          if (
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              decodedText,
            )
          ) {
            setIsLoading(true);
            onStudentFound(decodedText);
            setIsScanning(false);
          }
        };

        // Error callback - completely silent
        const onScanError = () => {
          // Silently ignore all errors
          return;
        };

        // Start the scanner automatically
        html5QrcodeScanner.render(onScanSuccess, onScanError);
        setIsScanning(true);
      } catch (err: any) {
        // Silent fallback
        console.warn("Scanner initialization:", err);
      }
    };

    // Start immediately but only once
    if (!isInitialized) {
      const timer = setTimeout(initializeScanner, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      if (html5QrcodeScanner && isInitialized) {
        html5QrcodeScanner
          .clear()
          .then(() => {
            setScanner(null);
            setIsScanning(false);
            setIsInitialized(false);
          })
          .catch(() => {
            // Silent cleanup
          });
      }
    };
  }, [onStudentFound, setIsLoading, isInitialized]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      data-oid="8bynvdo"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        data-oid="2fx_7d8"
      >
        {/* Header */}
        <div className="relative p-6 bg-brand text-white" data-oid="z26:by5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            data-oid="i3ub129"
          >
            <X className="w-5 h-5" data-oid="e8mz_yj" />
          </button>

          <div className="text-center" data-oid="94a2m1t">
            <div
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              data-oid="fuq.rt3"
            >
              <Camera className="w-8 h-8" data-oid="coi9nhg" />
            </div>
            <h2 className="text-2xl font-bold mb-2" data-oid="cc6lyx-">
              Scan QR Code
            </h2>
            <p className="text-yellow-100" data-oid="4cgkxkn">
              Simply point your camera at the QR code
            </p>
          </div>
        </div>

        {/* Scanner Area */}
        <div className="p-6" data-oid="r6_at4:">
          <div
            className="relative mx-auto w-80 h-80 rounded-2xl overflow-hidden bg-gray-50"
            data-oid="e0b4_22"
          >
            {/* Scanner Container - Clean and simple */}
            <div
              id="qr-scanner"
              ref={scannerRef}
              className="w-full h-full [&>div]:!border-none [&>div]:!shadow-none [&_button]:!hidden [&_select]:!hidden [&_span]:!hidden"
              style={
                {
                  // Hide all default UI elements
                  "--qr-scanner-border": "none",
                  "--qr-scanner-background": "transparent",
                } as React.CSSProperties
              }
              data-oid="_3bla9z"
            />

            {/* Clean scanning overlay - only when scanning */}
            {isScanning && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                data-oid="dssfn-a"
              >
                <div className="relative" data-oid="ly5wlh3">
                  {/* Clean scanning frame */}
                  <div
                    className="w-64 h-64 border-4 border-yellow-400 rounded-2xl bg-transparent"
                    data-oid="aio6ow7"
                  />

                  {/* Corner indicators */}
                  <div
                    className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-yellow-400 rounded-tl-lg"
                    data-oid="3:wnnqz"
                  />

                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-yellow-400 rounded-tr-lg"
                    data-oid="6m5j4e-"
                  />

                  <div
                    className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-yellow-400 rounded-bl-lg"
                    data-oid="59uh:z."
                  />

                  <div
                    className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-yellow-400 rounded-br-lg"
                    data-oid="wyea2o6"
                  />

                  {/* Scanning line animation */}
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                    animate={{ y: [0, 256, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    data-oid="0li7h_r"
                  />

                  {/* Gentle pulse effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-yellow-400/30 rounded-2xl"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    data-oid="27b3z_a"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Simple status indicator */}
          <div className="mt-6 text-center" data-oid="v2c48_v">
            <div
              className="flex items-center justify-center gap-2 text-yellow-600"
              data-oid="vdoe10p"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                data-oid="fz7j1::"
              >
                <Camera className="w-5 h-5" data-oid="1pdh5:0" />
              </motion.div>
              <span className="font-medium" data-oid="5lyl2db">
                🎯 Ready to scan - Point at QR code
              </span>
            </div>
          </div>

          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="w-full mt-6 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3"
            data-oid="emvbv.w"
          >
            <ArrowLeft className="w-5 h-5" data-oid="w:3184z" />← Back to
            Options
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StudentConfirmation: React.FC<{
  student: Student;
  onConfirm: () => void;
  isLoading: boolean;
}> = ({ student, onConfirm, isLoading }) => {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const chartData = [
    { name: t("spendingLimit"), value: student.spending_limit },
    { name: t("limitPeriod"), value: student.limit_period_days },
  ];

  const CustomSVGPlaceholder = () => (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-3xl shadow-xl"
      data-oid="83nmtdy"
    >
      <rect width="128" height="128" fill="url(#gradient)" data-oid=":lq844d" />
      <path
        d="M64 48C72.8366 48 80 40.8366 80 32C80 23.1634 72.8366 16 64 16C55.1634 16 48 23.1634 48 32C48 40.8366 55.1634 48 64 48Z"
        fill="#fff"
        fillOpacity="0.8"
        data-oid="nninue_"
      />

      <path
        d="M64 64C50.7452 64 40 74.7452 40 88V112H88V88C88 74.7452 77.2548 64 64 64Z"
        fill="#fff"
        fillOpacity="0.8"
        data-oid="f.dg4d:"
      />

      <defs data-oid="w0het_h">
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="128"
          y2="128"
          data-oid="z2hd2gx"
        >
          <stop offset="0%" stopColor="#4f46e5" data-oid="ixoo-ev" />
          <stop offset="100%" stopColor="#facc15" data-oid="k2skkhe" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
      data-oid="bl-z984"
    >
      <div className="text-center space-y-3" data-oid="t.wbr7.">
        <h2
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-yellow-800 bg-clip-text text-transparent"
          data-oid="z:hcmmd"
        >
          {t("confirmDetails")}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg" data-oid="uz8o3._">
          {t("verifyStudentPrompt")}
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-white/20"
        data-oid="8_e5onb"
      >
        <div className="text-center space-y-4 sm:space-y-6" data-oid="uhd0f92">
          <div
            className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32"
            data-oid="7tohqb7"
          >
            <div
              className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl"
              data-oid=".ej3f:2"
            >
              {imageError ? (
                <CustomSVGPlaceholder data-oid="jw6jb4x" />
              ) : (
                <img
                  src={student.student_photo_url}
                  alt={student.student_name}
                  className="w-full h-full object-cover"
                  onError={() => {
                    setImageError(true);
                  }}
                  data-oid="7j2_o9j"
                />
              )}
            </div>
            <div
              className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
              data-oid="d5xmu55"
            >
              <CheckCircle
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                data-oid="qt.4yfx"
              />
            </div>
          </div>

          <div data-oid="s-96bwn">
            <h3
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
              data-oid="few14hh"
            >
              {student.student_name}
            </h3>
            <p
              className="text-gray-600 font-medium text-sm sm:text-base"
              data-oid="9.pzipf"
            >
              {t("studentId")}: {student.student_id.slice(0, 8)}...
            </p>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          data-oid="vz2:8l."
        >
          <motion.div
            className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200"
            whileHover={{ scale: 1.02 }}
            data-oid="t50vt9s"
          >
            <div
              className="flex items-center gap-3 sm:gap-4"
              data-oid="z:drz6e"
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-700 rounded-xl flex items-center justify-center shadow-lg"
                data-oid=":8mw4pi"
              >
                <School
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  data-oid="wl88ir7"
                />
              </div>
              <div data-oid="9zjj6-:">
                <p
                  className="text-xs sm:text-sm text-indigo-700 font-semibold"
                  data-oid="hqa6nrj"
                >
                  {t("school")}
                </p>
                <p
                  className="font-bold text-gray-900 text-sm sm:text-base"
                  data-oid=":rg_dl6"
                >
                  {student.school_name}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200"
            whileHover={{ scale: 1.02 }}
            data-oid="o8oymi:"
          >
            <div
              className="flex items-center gap-3 sm:gap-4"
              data-oid="med2m8x"
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg"
                data-oid="of4c82s"
              >
                <GraduationCap
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  data-oid="y_jaeo6"
                />
              </div>
              <div data-oid="v8i8l:t">
                <p
                  className="text-xs sm:text-sm text-yellow-700 font-semibold"
                  data-oid="map-h-y"
                >
                  {t("grade")}
                </p>
                <p
                  className="font-bold text-gray-900 text-sm sm:text-base"
                  data-oid=":3n_l78"
                >
                  {student.grade}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="p-4 sm:p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20"
          data-oid="u3e.oyl"
        >
          <h4
            className="text-lg sm:text-xl font-bold text-gray-900 mb-4"
            data-oid="d-u-jgk"
          >
            {t("studentStats")}
          </h4>
          <ResponsiveContainer width="100%" height={200} data-oid="xhdqt48">
            <BarChart data={chartData} data-oid="npoar8z">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                data-oid="v3m60p5"
              />

              <XAxis
                dataKey="name"
                stroke="#374151"
                fontSize={12}
                data-oid="enegmjx"
              />

              <YAxis stroke="#374151" fontSize={12} data-oid="9afc-ct" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
                data-oid="i8nssd4"
              />

              <Bar
                dataKey="value"
                fill="url(#chartGradient)"
                radius={[8, 8, 0, 0]}
                barSize={40}
                data-oid="2ybal1u"
              />

              <defs data-oid="0x7iof2">
                <linearGradient
                  id="chartGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                  data-oid="dtt9t_c"
                >
                  <stop offset="0%" stopColor="#4f46e5" data-oid="sk_5wmb" />
                  <stop offset="100%" stopColor="#facc15" data-oid="xjmp__-" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-yellow-500 via-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          data-oid="c1j0xyr"
        >
          {isLoading ? (
            <>
              <Loader2
                className="w-5 h-5 sm:w-6 sm:h-6 animate-spin"
                data-oid="wf91jcm"
              />

              {t("addingStudent")}
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" data-oid="jv:jj:h" />
              {t("addToAccount")}
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" data-oid="csv7loj" />
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const QuitConfirmation: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
      data-oid="pyx1wol"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-[90vw] sm:max-w-md w-full p-4 sm:p-6"
        data-oid="7kbkg_z"
      >
        <div className="text-center space-y-4" data-oid="ldly07a">
          <AlertCircle
            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-yellow-500"
            data-oid="tm0xxoa"
          />

          <h3
            className="text-lg sm:text-xl font-bold text-gray-900"
            data-oid="e8blawn"
          >
            {t("quitConfirmTitle")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base" data-oid=".-0o8a5">
            {t("quitConfirmPrompt")}
          </p>
        </div>
        <div
          className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4"
          data-oid="4legj4u"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
            data-oid="4ov--mr"
          >
            {t("cancel")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 px-4 sm:px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
            data-oid="jvjrpt."
          >
            {t("quit")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl"
          data-oid="ax1:guc"
        >
          <AlertCircle
            className="w-12 h-12 mx-auto mb-4 text-red-500"
            data-oid="vxein5u"
          />

          <h2 className="text-xl font-bold text-gray-900" data-oid="tbjh_rl">
            Something went wrong
          </h2>
          <p className="text-gray-600 mt-2" data-oid="66o-gwk">
            Please refresh the page or try again later.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: string }[]
  >([]);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const API_URL = "http://localhost:8001";

  const fetchCsrfToken = async (retries = 3): Promise<string | undefined> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(`${API_URL}/get-csrf-token`);
        setCsrfToken(response.data.csrf_token);
        return response.data.csrf_token;
      } catch (err) {
        console.error(`CSRF token fetch attempt ${attempt} failed:`, err);
        if (attempt === retries) {
          setError(t("fetchCsrfError"));
          return undefined;
        }
      }
    }
  };

  const showToast = (message: string, type = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const validateToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(t("authError"));
      navigate("/login");
      return false;
    }
    return token;
  };

  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      const token = validateToken();
      if (!token) return;

      try {
        const response = await axios.get(`${API_URL}/admin/students`, {
          headers: {
            "X-API-KEY":
              "ykxiPah7Uc327P6sSeZ6KhXqnLwV6nxIYuVjooOInOO3ko26xgbJGz1VG",
          },
        });
        const students: Student[] = response.data.students;
        const uniqueSchools = Array.from(
          new Set(students.map((s) => s.school_name)),
        ).sort();
        setSchools(uniqueSchools);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError(t("permissionError"));
        } else if (err.response?.status === 401) {
          setError(t("authError"));
          navigate("/login");
        } else {
          setError(t("fetchSchoolsError"));
        }
        console.error("Fetch schools error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchools();
    fetchCsrfToken();
  }, [navigate, t]);

  useEffect(() => {
    if (selectedSchool) {
      const fetchGrades = async () => {
        const token = validateToken();
        if (!token) return;

        try {
          const API_KEY =
            "ykxiPah7Uc327P6sSeZ6KhXqnLwV6nxIYuVjooOInOO3ko26xgbJGz1VG";
          const response = await axios.get(`${API_URL}/admin/students`, {
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": API_KEY,
            },
          });
          const students: Student[] = response.data.students;
          const uniqueGrades = Array.from(
            new Set(
              students
                .filter((s) => s.school_name === selectedSchool)
                .map((s) => s.grade),
            ),
          ).sort();
          setGrades(uniqueGrades);
        } catch (err: any) {
          if (err.response?.status === 403) {
            setError(t("permissionError"));
          } else if (err.response?.status === 401) {
            setError(t("authError"));
            navigate("/login");
          } else {
            setError(t("fetchGradesError"));
          }
          console.error("Fetch grades error:", err);
        }
      };
      fetchGrades();
    } else {
      setGrades([]);
      setSelectedGrade("");
    }
  }, [selectedSchool, navigate, t]);

  const handleSearch = async () => {
    setIsLoading(true);
    const token = validateToken();
    if (!token) return;

    try {
      const API_KEY =
        "ykxiPah7Uc327P6sSeZ6KhXqnLwV6nxIYuVjooOInOO3ko26xgbJGz1VG";
      const response = await axios.get(`${API_URL}/admin/students`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      });
      let filtered = response.data.students as Student[];

      if (searchName) {
        filtered = filtered.filter((s: Student) =>
          s.student_name.toLowerCase().includes(searchName.toLowerCase()),
        );
      }

      if (selectedSchool) {
        filtered = filtered.filter(
          (s: Student) => s.school_name === selectedSchool,
        );
      }

      if (selectedGrade) {
        filtered = filtered.filter((s: Student) => s.grade === selectedGrade);
      }

      setSearchResults(filtered);
      if (filtered.length === 0) {
        setError(t("noStudentsFound"));
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError(t("permissionError"));
      } else if (err.response?.status === 401) {
        setError(t("authError"));
        navigate("/login");
      } else {
        setError(t("searchStudentsError"));
      }
      console.error("Search students error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = async (studentId: string) => {
    setIsLoading(true);
    setShowQRScanner(false);
    const token = validateToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const API_KEY =
        "ykxiPah7Uc327P6sSeZ6KhXqnLwV6nxIYuVjooOInOO3ko26xgbJGz1VG";
      const response = await axios.get(`${API_URL}/admin/students`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      });
      const student = response.data.students.find(
        (s: Student) => s.student_id === studentId,
      );
      if (student) {
        setSelectedStudent(student);
        setCurrentStep(2);
      } else {
        setError(t("studentNotFound"));
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError(t("permissionError"));
      } else if (err.response?.status === 401) {
        setError(t("authError"));
        navigate("/login");
      } else {
        setError(t("fetchStudentError"));
      }
      console.error("QR scan fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedStudent) return;

    setIsLoading(true);
    const token = validateToken();
    if (!token) return;

    try {
      const csrf = csrfToken || (await fetchCsrfToken());
      if (!csrf) {
        setError(t("fetchCsrfError"));
        setIsLoading(false);
        return;
      }
      await axios.post(
        `${API_URL}/link-student`,
        {
          student_id: selectedStudent.student_id,
          csrf_token: csrf,
        },
        { headers: { Authorization: `Bearer ${token}`, "X-CSRF-Token": csrf } },
      );

      showToast(
        t("linkStudentSuccess", { name: selectedStudent.student_name }),
      );
      setCurrentStep(0);
      setSearchMethod("manual");
      setSelectedSchool("");
      setSelectedGrade("");
      setSearchName("");
      setSearchResults([]);
      setSelectedStudent(null);
      setError(null);
      navigate("/");
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError(t("permissionError"));
      } else if (err.response?.status === 401) {
        setError(t("authError"));
        navigate("/login");
      } else {
        setError(err.response?.data?.detail || t("linkStudentError"));
      }
      console.error("Link student error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodSelect = (method: "manual" | "qr") => {
    setSearchMethod(method);
    if (method === "qr") {
      setShowQRScanner(true);
    } else {
      setCurrentStep(1);
    }
    setError(null);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setCurrentStep(2);
  };

  const handlePrev = () => {
    if (currentStep === 0) {
      setShowQuitConfirm(true);
    } else if (currentStep === 1) {
      setCurrentStep(0);
      setSearchResults([]);
      setSearchName("");
      setSelectedSchool("");
      setSelectedGrade("");
      setError(null);
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setSelectedStudent(null);
      setError(null);
    }
  };

  const handleQuit = () => {
    setShowQuitConfirm(true);
  };

  const confirmQuit = () => {
    setCurrentStep(0);
    setSearchMethod("manual");
    setSelectedSchool("");
    setSelectedGrade("");
    setSearchName("");
    setSearchResults([]);
    setSelectedStudent(null);
    setError(null);
    setShowQRScanner(false);
    setShowQuitConfirm(false);
    navigate("/");
  };

  return (
    <ErrorBoundary data-oid=":.v9qtr">
      <div
        className="min-h-screen bg-brand backdrop-blur-2xl relative overflow-hidden"
        data-oid="s:1v2g9"
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(0deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(135deg, rgb(144, 100, 159) 0%, rgb(144, 100, 159) 24%,rgb(112, 112, 163) 24%, rgb(112, 112, 163) 28%,rgb(79, 124, 166) 28%, rgb(79, 124, 166) 40%,rgb(47, 136, 170) 40%, rgb(47, 136, 170) 84%,rgb(14, 148, 173) 84%, rgb(14, 148, 173) 100%),linear-gradient(90deg, rgb(79, 35, 157),rgb(43, 171, 222))",
            backgroundBlendMode: "overlay,overlay,overlay,normal",
          }}
          data-oid="umcmh7:"
        >
          <div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-yellow-400/20 rounded-full blur-3xl"
            data-oid="v2poj9k"
          />

          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-indigo-400/20 rounded-full blur-3xl"
            data-oid="9m3-412"
          />
        </div>

        <div
          className="relative max-w-[95vw] md:max-w-5xl mx-auto py-8 px-2 sm:px-4"
          data-oid="nzr7k2l"
        >
          <div className="relative" data-oid="b.k:m:2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuit}
              className="absolute top-0 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-gray-700 transition-colors"
              data-oid="346dij."
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" data-oid="m65mnnx" />
            </motion.button>
            <StepIndicator currentStep={currentStep} data-oid="_qypuuo" />
          </div>

          <AnimatePresence data-oid="sxaokow">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center backdrop-blur-sm text-sm sm:text-base"
                data-oid="jjlzpa3"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 min-h-[500px] sm:min-h-[600px] border border-white/20"
            data-oid="-w30q-_"
          >
            <AnimatePresence mode="wait" data-oid="g_16n_y">
              {currentStep === 0 && (
                <MethodSelection
                  key="method"
                  onMethodSelect={handleMethodSelect}
                  data-oid="793_wl7"
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
                  searchResults={searchResults}
                  handleSearch={handleSearch}
                  onStudentSelect={handleStudentSelect}
                  isLoading={isLoading}
                  searchName={searchName}
                  setSearchName={setSearchName}
                  data-oid="uyjiimr"
                />
              )}
              {currentStep === 2 && selectedStudent && (
                <StudentConfirmation
                  key="confirm"
                  student={selectedStudent}
                  onConfirm={handleConfirm}
                  isLoading={isLoading}
                  data-oid="irlqsf2"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-6 sm:mt-8" data-oid="wtkn3zh">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrev}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-700 shadow-lg hover:shadow-xl border border-white/20 text-sm sm:text-base"
              data-oid="kuyu5x3"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" data-oid="gtrgl15" />
              {currentStep === 0 ? t("quit") : t("previous")}
            </motion.button>

            <div className="text-center" data-oid="9r0y0bm">
              <p
                className="text-xs sm:text-sm text-gray-500"
                data-oid="9m5vg79"
              >
                {t("step")} {currentStep + 1} {t("of")} {steps.length}
              </p>
            </div>

            <div className="w-24 sm:w-32" data-oid="rauvh9c" />
          </div>
        </div>

        <AnimatePresence data-oid="vq3os.0">
          {showQRScanner && (
            <QRScanner
              onStudentFound={handleQRScan}
              onClose={() => {
                setShowQRScanner(false);
                setCurrentStep(0);
                setError(null);
              }}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onBack={() => {
                setShowQRScanner(false);
                setCurrentStep(0);
                setError(null);
              }}
              data-oid="uqsgt-y"
            />
          )}
          {showQuitConfirm && (
            <QuitConfirmation
              onConfirm={confirmQuit}
              onCancel={() => setShowQuitConfirm(false)}
              data-oid="okrxaqy"
            />
          )}
        </AnimatePresence>

        <div
          className="fixed top-16 sm:top-20 right-2 sm:right-4 space-y-2 z-50"
          data-oid="9do-0-j"
        >
          <AnimatePresence data-oid="hp2aeen">
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`p-3 sm:p-4 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  toast.type === "success"
                    ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
                data-oid="pd:bjwd"
              >
                {toast.message}
                <button
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                  className="ml-2 p-1 hover:bg-gray-200/50 rounded-full"
                  data-oid="4:9qr69"
                >
                  <X className="w-4 h-4" data-oid="m870.ff" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AddStudent;
