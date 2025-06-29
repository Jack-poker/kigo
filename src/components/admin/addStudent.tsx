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
    <div className="relative w-full mb-8 md:mb-12" data-oid="ai1hxkl">
      <div
        className="flex items-center justify-between max-w-[90vw] sm:max-w-md mx-auto"
        data-oid="m0g9z_s"
      >
        {steps.map((step, index) => (
          <div key={step.label} data-oid="r8ifci:">
            <div
              className="flex flex-col items-center z-10 relative"
              data-oid="8:g_pyy"
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
                data-oid="k8:j6h7"
              >
                {index < currentStep ? (
                  <CheckCircle
                    size={20}
                    className="sm:w-6 sm:h-6"
                    data-oid="kewn:fd"
                  />
                ) : (
                  <step.icon
                    size={20}
                    className="sm:w-6 sm:h-6"
                    data-oid="8x7:yow"
                  />
                )}
                {index === currentStep && (
                  <motion.div
                    className="absolute rounded-full bg-zinc-900"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    data-oid="5i10ix3"
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
                data-oid="uz32b7p"
              >
                {t(step.label)}
              </motion.span>
            </div>
            {index < steps.length - 1 && (
              <div className="relative flex-1 mx-2 sm:mx-6" data-oid="7ruf69j">
                <div
                  className="absolute top-5 sm:top-6 h-1 w-full bg-gray-200/50 rounded-full"
                  data-oid="c82vgxp"
                />

                <motion.div
                  className="absolute top-5 sm:top-6 h-1 bg-gradient-to-r from-indigo-900 via-indigo-700 to-yellow-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: index < currentStep ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  data-oid="v:zw:yu"
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
      data-oid="y2l_m1b"
    >
      <div className="space-y-4" data-oid="0_dw-xd">
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 bg-brand rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          data-oid="aa732pi"
        >
          <Users
            className="w-8 h-8 sm:w-10 sm:h-10 text-white"
            data-oid="k3m2w7r"
          />
        </motion.div>
        <div data-oid="vym5wew">
          <h1
            className="text-2xl sm:text-4xl font-bold bg-brand bg-clip-text text-transparent mb-4"
            data-oid="n92x4h0"
          >
            {t("addYourChild")}
          </h1>
          <p
            className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto leading-relaxed"
            data-oid="pw73uon"
          >
            {t("connectChildPrompt")}
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-[90vw] sm:max-w-3xl mx-auto"
        data-oid="4s2.705"
      >
        <motion.button
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMethodSelect("manual")}
          className="group relative p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          data-oid="-..pnc7"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            data-oid="7ykrr-d"
          />

          <div className="relative space-y-4 sm:space-y-6" data-oid="z7mo8x3">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-700 to-indigo-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg bg-[#000000]"
              data-oid="-0qn-tw"
            >
              <Search
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                data-oid=".pexn7g"
              />
            </div>
            <div className="text-left" data-oid="2i62u03">
              <h3
                className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                data-oid="lih-43k"
              >
                {t("searchByName")}
              </h3>
              <p
                className="text-gray-600 leading-relaxed text-sm sm:text-base"
                data-oid=":ig2g48"
              >
                {t("searchByNameDesc")}
              </p>
            </div>
            <div
              className="flex items-center text-indigo-700 font-semibold group-hover:translate-x-2 transition-transform duration-300"
              data-oid="_ppxvk7"
            >
              <span className="text-sm sm:text-base" data-oid="bojtqf1">
                {t("getStarted")}
              </span>
              <ArrowRight className="w-4 h-4 ml-2" data-oid="0s:fx-o" />
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
          data-oid="nl0ph1g"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            data-oid="5zvmquv"
          />

          <div className="relative space-y-4 sm:space-y-6" data-oid="a67sb93">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg bg-[#000000]"
              data-oid="e0iyw5s"
            >
              <Camera
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                data-oid="5dy7odp"
              />
            </div>
            <div className="text-left" data-oid="zp90pw2">
              <h3
                className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                data-oid="jpn0pq4"
              >
                {t("scanQRCode")}
              </h3>
              <p
                className="text-gray-600 leading-relaxed text-sm sm:text-base"
                data-oid="2nn3teo"
              >
                {t("scanQRCodeDesc")}
              </p>
            </div>
            <div
              className="flex items-center text-yellow-600 font-semibold group-hover:translate-x-2 transition-transform duration-300"
              data-oid="lub9yc8"
            >
              <span className="text-sm sm:text-base" data-oid="usrpdqw">
                {t("openCamera")}
              </span>
              <Camera className="w-4 h-4 ml-2" data-oid="y-xb0mu" />
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
      data-oid="3_krunh"
    >
      <div className="text-center space-y-3" data-oid="488lrgc">
        <h2
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent"
          data-oid="-68ikgo"
        >
          {t("findStudent")}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg" data-oid="6x9598s">
          {t("findStudentPrompt")}
        </p>
      </div>

      <div className="space-y-4" data-oid="lffmfdj">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          data-oid=":p2p2vi"
        >
          <label
            className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2"
            data-oid="zeqy8p1"
          >
            <Users className="w-4 h-4 text-indigo-700" data-oid="xyz06pk" />
            {t("studentName")}
          </label>
          <div className="relative" data-oid="s5jyjb8">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder={t("enterStudentName")}
              className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-700 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg text-sm sm:text-base"
              data-oid="8-al6xo"
            />

            <Search
              className="absolute left-3 sm:left-4 top-3 sm:top-4 w-5 h-5 text-gray-400"
              data-oid="00c-f4:"
            />
          </div>
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          data-oid="b981ggf"
        >
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            data-oid="yyjs4w."
          >
            <label
              className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2"
              data-oid="fih65_c"
            >
              <School className="w-4 h-4 text-yellow-600" data-oid="412zt8g" />
              {t("schoolName")}
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-600 transition-all duration-300 text-gray-900 shadow-lg appearance-none cursor-pointer text-sm sm:text-base"
              data-oid="zxrihl6"
            >
              <option value="" data-oid="95.3-5x">
                {t("chooseSchool")}
              </option>
              {schools.map((school) => (
                <option key={school} value={school} data-oid="gsbybd1">
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
            data-oid="pyobkod"
          >
            <label
              className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2"
              data-oid="14geb12"
            >
              <GraduationCap
                className="w-4 h-4 text-indigo-700"
                data-oid="s-nzi47"
              />

              {t("gradeLevel")}
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              disabled={!selectedSchool}
              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-700 transition-all duration-300 text-gray-900 shadow-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              data-oid="q_vvsmc"
            >
              <option value="" data-oid="h4-qepp">
                {t("chooseGrade")}
              </option>
              {grades.map((grade) => (
                <option key={grade} value={grade} data-oid="9mir7gk">
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
            data-oid="gl7.lju"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-900 via-indigo-700 to-yellow-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto text-sm sm:text-base"
              data-oid="jjnif4-"
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    data-oid="z0xtt99"
                  />

                  {t("searching")}
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" data-oid="::pgcrb" />
                  {t("searchStudents")}
                  <Sparkles className="w-4 h-4" data-oid=".9-h:d8" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>

      <AnimatePresence data-oid="0wooal8">
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-4"
            data-oid="a.joh50"
          >
            <h3
              className="text-lg sm:text-xl font-bold text-gray-900 text-center sticky top-0 bg-white/80 backdrop-blur-sm py-2 z-10"
              data-oid="i9-9eby"
            >
              {t("selectYourChild")}
            </h3>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-indigo-50 scroll-smooth p-3 sm:p-4 rounded-2xl"
              data-oid="5nj-x1f"
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
                  data-oid="omx63l."
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-oid="w021tlx"
                  />

                  <div
                    className="relative flex items-center gap-3 sm:gap-4"
                    data-oid="7fwjqbj"
                  >
                    <div className="relative" data-oid="6yvr_z1">
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg"
                        data-oid="g_vb.0d"
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
                          data-oid="_r0_eo."
                        />
                      </div>
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                        data-oid="2jn8eni"
                      >
                        <Heart
                          className="w-3 h-3 text-white"
                          data-oid="uvcl.bc"
                        />
                      </div>
                    </div>
                    <div className="flex-1" data-oid="_i5tgce">
                      <h4
                        className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors text-base sm:text-lg"
                        data-oid="5d-4vtu"
                      >
                        {student.student_name}
                      </h4>
                      <p
                        className="text-gray-600 font-medium text-sm sm:text-base"
                        data-oid="s.v1vfx"
                      >
                        {student.school_name}
                      </p>
                      <p
                        className="text-xs sm:text-sm text-gray-500 flex items-center gap-1"
                        data-oid="6edqaqs"
                      >
                        <Star className="w-3 h-3" data-oid="zbwcs42" />
                        {t("grade")} {student.grade}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-indigo-700 group-hover:translate-x-2 transition-all duration-300"
                      data-oid="52uu8ui"
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
  const [error, setError] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(
          (device) => device.kind === "videoinput",
        );
        setHasCamera(hasVideoInput);
        if (!hasVideoInput) {
          setError(t("noCameraFound"));
        }
      } catch (err) {
        console.error("Error checking camera:", err);
        setHasCamera(false);
        setError(t("noCameraFound"));
      }
    };

    checkCamera();

    let html5QrcodeScanner: Html5QrcodeScanner | null = null;
    if (scannerRef.current && !scanner && hasCamera) {
      try {
        html5QrcodeScanner = new Html5QrcodeScanner(
          scannerRef.current.id,
          {
            fps: 10,
            qrbox: {
              width: window.innerWidth < 640 ? 250 : 300,
              height: window.innerWidth < 640 ? 250 : 300,
            },
            aspectRatio: 1.0,
            disableFlip: false,
            facingMode: "environment",
          },
          false,
        );
        setScanner(html5QrcodeScanner);

        html5QrcodeScanner.render(
          (decodedText) => {
            if (
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                decodedText,
              )
            ) {
              setIsLoading(true);
              onStudentFound(decodedText);
              setIsScanning(false);
            } else {
              setError(t("invalidStudentId"));
            }
          },
          (err) => {
            console.warn("QR scan error:", err);
            if (err.message.includes("Permission denied")) {
              setError(t("cameraPermissionDenied"));
            } else if (
              err.message.includes("No MultiFormat Readers") ||
              err.message.includes("No devices found")
            ) {
              setError(t("noCameraFound"));
            } else {
              setError(t("qrScanError"));
            }
          },
        );
        setIsScanning(true);
      } catch (err) {
        console.error("Scanner initialization error:", err);
        setError(t("qrScanError"));
      }
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner
          .clear()
          .then(() => {
            setScanner(null);
            setIsScanning(false);
          })
          .catch((err) => console.warn("Error clearing scanner:", err));
      }
    };
  }, [t, onStudentFound, hasCamera, setIsLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
      data-oid="oft:gkb"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-[90vw] sm:max-w-md w-full overflow-hidden"
        data-oid="uc:-y:g"
      >
        <div
          className="relative p-4 sm:p-6 from-indigo-900 to-yellow-500 text-white bg-[#05000000] bg-[url(/images/1ev8.png)]"
          data-oid="tt:rq:h"
        >
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            data-oid="c8h-2a5"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" data-oid=".kqn.mz" />
          </button>
          <div className="text-center" data-oid="7psd316">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
              data-oid="ow3gb4f"
            >
              <Camera className="w-6 h-6 sm:w-8 sm:h-8" data-oid="_cyhr4k" />
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold mb-2"
              data-oid="0:vq.df"
            >
              {t("scanQRCode")}
            </h2>
            <p
              className="text-indigo-100 text-sm sm:text-base"
              data-oid="xbl8a_h"
            >
              {t("positionQRCode")}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6" data-oid="wnep1u.">
          {hasCamera !== false && (
            <div
              className="relative mx-auto w-[80vw] sm:w-80 h-[80vw] sm:h-80 max-w-[300px] max-h-[300px] rounded-2xl overflow-hidden bg-gray-900"
              data-oid="ujp51s6"
            >
              <div
                id="qr-scanner"
                ref={scannerRef}
                className="w-full h-full"
                data-oid="szuk6na"
              />

              {isScanning && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  data-oid="-ug93gn"
                >
                  <div className="relative" data-oid="df:qb1u">
                    <div
                      className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] border-4 border-white/80 rounded-2xl bg-transparent"
                      data-oid="8yu_r_s"
                    />

                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                      animate={{
                        y: [0, window.innerWidth < 640 ? 250 : 300, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      data-oid="riv-qyk"
                    />

                    <div
                      className="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-t-4 border-yellow-400 rounded-tl-lg"
                      data-oid="x3ygetb"
                    />

                    <div
                      className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-t-4 border-yellow-400 rounded-tr-lg"
                      data-oid=".m.gucq"
                    />

                    <div
                      className="absolute -bottom-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-b-4 border-yellow-400 rounded-bl-lg"
                      data-oid="5zv-i48"
                    />

                    <div
                      className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-b-4 border-yellow-400 rounded-br-lg"
                      data-oid="73.9d-i"
                    />

                    <motion.div
                      className="absolute inset-0 border-2 border-yellow-400/50 rounded-2xl"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      data-oid="v1cecpa"
                    />
                  </div>
                </div>
              )}
              {error && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50"
                  data-oid="ot96j2d"
                >
                  <div
                    className="text-center text-white p-4"
                    data-oid="14_3440"
                  >
                    <AlertCircle
                      className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-red-400"
                      data-oid=":c-h.sw"
                    />

                    <p className="text-xs sm:text-sm" data-oid="br8-:3y">
                      {error}
                    </p>
                    <button
                      onClick={() => {
                        setError(null);
                        if (
                          error === t("cameraPermissionDenied") ||
                          error === t("noCameraFound")
                        ) {
                          setHasCamera(false);
                        }
                      }}
                      className="mt-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm hover:bg-indigo-700 transition-colors"
                      data-oid="wekn:m6"
                    >
                      {t("tryAgain")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base"
            data-oid="9gs37se"
          >
            <ArrowLeft className="w-5 h-5" data-oid="ve:ir5e" />
            {t("backToMethod")}
          </motion.button>

          <div className="text-center" data-oid="c8_bqan">
            {isScanning && hasCamera ? (
              <div
                className="flex items-center justify-center gap-2 text-indigo-700"
                data-oid="gjjkm9z"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  data-oid="lf2y_zj"
                >
                  <Camera
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    data-oid="2_gez_a"
                  />
                </motion.div>
                <span
                  className="font-medium text-sm sm:text-base"
                  data-oid="y9yrsdu"
                >
                  {t("scanningQRCode")}
                </span>
              </div>
            ) : (
              <div
                className="flex items-center justify-center gap-2 text-gray-500"
                data-oid="_y6y_x4"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" data-oid="uiawqop" />
                <span
                  className="font-medium text-sm sm:text-base"
                  data-oid="p5dfgd0"
                >
                  {hasCamera === false ? t("noCameraFound") : t("cameraReady")}
                </span>
              </div>
            )}
          </div>
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
      data-oid="5lcvw4h"
    >
      <rect width="128" height="128" fill="url(#gradient)" data-oid="vnmih01" />
      <path
        d="M64 48C72.8366 48 80 40.8366 80 32C80 23.1634 72.8366 16 64 16C55.1634 16 48 23.1634 48 32C48 40.8366 55.1634 48 64 48Z"
        fill="#fff"
        fillOpacity="0.8"
        data-oid="3rju72e"
      />

      <path
        d="M64 64C50.7452 64 40 74.7452 40 88V112H88V88C88 74.7452 77.2548 64 64 64Z"
        fill="#fff"
        fillOpacity="0.8"
        data-oid="zw_vjc1"
      />

      <defs data-oid="7e_423y">
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="128"
          y2="128"
          data-oid="fkug2g7"
        >
          <stop offset="0%" stopColor="#4f46e5" data-oid="arbmy6b" />
          <stop offset="100%" stopColor="#facc15" data-oid="ea_uv-1" />
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
      data-oid="ifapz67"
    >
      <div className="text-center space-y-3" data-oid="onafiy8">
        <h2
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent"
          data-oid="-x83r9v"
        >
          {t("confirmDetails")}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg" data-oid="xka-5tg">
          {t("verifyStudentPrompt")}
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-white/20"
        data-oid="918qhb4"
      >
        <div className="text-center space-y-4 sm:space-y-6" data-oid="2u1vjw3">
          <div
            className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32"
            data-oid="qdgi0oi"
          >
            <div
              className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl"
              data-oid="0nv8h4n"
            >
              {imageError ? (
                <CustomSVGPlaceholder data-oid="i_a67xl" />
              ) : (
                <img
                  src={student.student_photo_url}
                  alt={student.student_name}
                  className="w-full h-full object-cover"
                  onError={() => {
                    setImageError(true);
                  }}
                  data-oid="j.f7uwc"
                />
              )}
            </div>
            <div
              className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
              data-oid="efgwx2a"
            >
              <CheckCircle
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                data-oid="ndtq_2y"
              />
            </div>
          </div>

          <div data-oid="5oeor8y">
            <h3
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
              data-oid="unfhoep"
            >
              {student.student_name}
            </h3>
            <p
              className="text-gray-600 font-medium text-sm sm:text-base"
              data-oid="o3tob1e"
            >
              {t("studentId")}: {student.student_id.slice(0, 8)}...
            </p>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          data-oid="9b6f_py"
        >
          <motion.div
            className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200"
            whileHover={{ scale: 1.02 }}
            data-oid="x8p65x3"
          >
            <div
              className="flex items-center gap-3 sm:gap-4"
              data-oid="cb6zusj"
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-700 rounded-xl flex items-center justify-center shadow-lg"
                data-oid="vz2.1m2"
              >
                <School
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  data-oid="i9_i3w9"
                />
              </div>
              <div data-oid="8uro88t">
                <p
                  className="text-xs sm:text-sm text-indigo-700 font-semibold"
                  data-oid=".1r9d47"
                >
                  {t("school")}
                </p>
                <p
                  className="font-bold text-gray-900 text-sm sm:text-base"
                  data-oid="_fk3rgf"
                >
                  {student.school_name}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200"
            whileHover={{ scale: 1.02 }}
            data-oid="b9a.sts"
          >
            <div
              className="flex items-center gap-3 sm:gap-4"
              data-oid="p4eakn-"
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg"
                data-oid="1.b3el1"
              >
                <GraduationCap
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  data-oid="s3hs3s2"
                />
              </div>
              <div data-oid="2fwapas">
                <p
                  className="text-xs sm:text-sm text-yellow-700 font-semibold"
                  data-oid="okfk6uq"
                >
                  {t("grade")}
                </p>
                <p
                  className="font-bold text-gray-900 text-sm sm:text-base"
                  data-oid="-au3vcq"
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
          data-oid="30f6sib"
        >
          <h4
            className="text-lg sm:text-xl font-bold text-gray-900 mb-4"
            data-oid="2cni81:"
          >
            {t("studentStats")}
          </h4>
          <ResponsiveContainer width="100%" height={200} data-oid="25fqsod">
            <BarChart data={chartData} data-oid="i1y5fhr">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                data-oid="478vg4t"
              />

              <XAxis
                dataKey="name"
                stroke="#374151"
                fontSize={12}
                data-oid="4-.rg:s"
              />

              <YAxis stroke="#374151" fontSize={12} data-oid="-hzfuwz" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
                data-oid="t2ttfv5"
              />

              <Bar
                dataKey="value"
                fill="url(#chartGradient)"
                radius={[8, 8, 0, 0]}
                barSize={40}
                data-oid="r74ql18"
              />

              <defs data-oid="q8kf-02">
                <linearGradient
                  id="chartGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                  data-oid="fgzs:1d"
                >
                  <stop offset="0%" stopColor="#4f46e5" data-oid="ik-sfad" />
                  <stop offset="100%" stopColor="#facc15" data-oid="lnsy-bc" />
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
          className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          data-oid="t3_acnp"
        >
          {isLoading ? (
            <>
              <Loader2
                className="w-5 h-5 sm:w-6 sm:h-6 animate-spin"
                data-oid="y7xb:70"
              />

              {t("addingStudent")}
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" data-oid="-otwd3z" />
              {t("addToAccount")}
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" data-oid="9w-cud:" />
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
      data-oid="gku24_l"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-[90vw] sm:max-w-md w-full p-4 sm:p-6"
        data-oid="yywyin6"
      >
        <div className="text-center space-y-4" data-oid="fnuavoa">
          <AlertCircle
            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-yellow-500"
            data-oid="d5fhwxt"
          />

          <h3
            className="text-lg sm:text-xl font-bold text-gray-900"
            data-oid="a1_iwxa"
          >
            {t("quitConfirmTitle")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base" data-oid="7p6k_q8">
            {t("quitConfirmPrompt")}
          </p>
        </div>
        <div
          className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4"
          data-oid="64dgxnx"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
            data-oid="yegg9h7"
          >
            {t("cancel")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 px-4 sm:px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
            data-oid="hj8vxa_"
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
          data-oid="g7ldls5"
        >
          <AlertCircle
            className="w-12 h-12 mx-auto mb-4 text-red-500"
            data-oid="x:v1c2q"
          />

          <h2 className="text-xl font-bold text-gray-900" data-oid="55y-xl:">
            Something went wrong
          </h2>
          <p className="text-gray-600 mt-2" data-oid="jql3_m.">
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
    <ErrorBoundary data-oid="5_v2nti">
      <div
        className="min-h-screen bg-brand backdrop-blur-2xl relative overflow-hidden"
        data-oid="x6jozfy"
      >
        <div
          className="absolute inset-0 overflow-hidden bg-[url(/images/rw4j.png)]"
          data-oid="c5ejst-"
        >
          <div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-yellow-400/20 rounded-full blur-3xl"
            data-oid="n:wjv9j"
          />

          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-indigo-400/20 rounded-full blur-3xl"
            data-oid="m.0zwrd"
          />
        </div>

        <div
          className="relative max-w-[95vw] md:max-w-5xl mx-auto py-8 px-2 sm:px-4"
          data-oid="87e12lj"
        >
          <div className="relative" data-oid="lyifni4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuit}
              className="absolute top-0 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-gray-700 transition-colors"
              data-oid="r9yvnb0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" data-oid="g2-oap9" />
            </motion.button>
            <StepIndicator currentStep={currentStep} data-oid="ddthr81" />
          </div>

          <AnimatePresence data-oid="bhgzeh_">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center backdrop-blur-sm text-sm sm:text-base"
                data-oid=":byif1y"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 min-h-[500px] sm:min-h-[600px] border border-white/20"
            data-oid="j:is6-7"
          >
            <AnimatePresence mode="wait" data-oid="xw1c7me">
              {currentStep === 0 && (
                <MethodSelection
                  key="method"
                  onMethodSelect={handleMethodSelect}
                  data-oid=".a03eqa"
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
                  data-oid="p2_k1-1"
                />
              )}
              {currentStep === 2 && selectedStudent && (
                <StudentConfirmation
                  key="confirm"
                  student={selectedStudent}
                  onConfirm={handleConfirm}
                  isLoading={isLoading}
                  data-oid="6tkeh7z"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-6 sm:mt-8" data-oid="4wqrngx">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrev}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-700 shadow-lg hover:shadow-xl border border-white/20 text-sm sm:text-base"
              data-oid="f7b4kmb"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" data-oid="9mq6xo4" />
              {currentStep === 0 ? t("quit") : t("previous")}
            </motion.button>

            <div className="text-center" data-oid="aeumk.7">
              <p
                className="text-xs sm:text-sm text-gray-500"
                data-oid="ce2:3ev"
              >
                {t("step")} {currentStep + 1} {t("of")} {steps.length}
              </p>
            </div>

            <div className="w-24 sm:w-32" data-oid="_ccyabw" />
          </div>
        </div>

        <AnimatePresence data-oid="_xtxrku">
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
              data-oid="nel6_kb"
            />
          )}
          {showQuitConfirm && (
            <QuitConfirmation
              onConfirm={confirmQuit}
              onCancel={() => setShowQuitConfirm(false)}
              data-oid="qc644:f"
            />
          )}
        </AnimatePresence>

        <div
          className="fixed top-16 sm:top-20 right-2 sm:right-4 space-y-2 z-50"
          data-oid="epn17i7"
        >
          <AnimatePresence data-oid="fm__9ap">
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`p-3 sm:p-4 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  toast.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
                data-oid="r8hcpfl"
              >
                {toast.message}
                <button
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                  className="ml-2 p-1 hover:bg-gray-200/50 rounded-full"
                  data-oid="c_c-v-p"
                >
                  <X className="w-4 h-4" data-oid="l8d0fpr" />
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
