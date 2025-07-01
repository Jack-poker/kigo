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
    <div className="relative w-full mb-8 md:mb-12" data-oid=":5eksh2">
      <div
        className="flex items-center justify-between max-w-[90vw] sm:max-w-md mx-auto"
        data-oid="ooiuv01"
      >
        {steps.map((step, index) => (
          <div key={step.label} data-oid="uuax.21">
            <div
              className="flex flex-col items-center z-10 relative"
              data-oid="aa6qay:"
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
                data-oid="7.8tvkj"
              >
                {index < currentStep ? (
                  <CheckCircle
                    size={20}
                    className="sm:w-6 sm:h-6"
                    data-oid="l1im8i2"
                  />
                ) : (
                  <step.icon
                    size={20}
                    className="sm:w-6 sm:h-6"
                    data-oid="yzx157g"
                  />
                )}
                {index === currentStep && (
                  <motion.div
                    className="absolute rounded-full bg-zinc-900"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    data-oid="t9sn_0w"
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
                data-oid="sr0tlsa"
              >
                {t(step.label)}
              </motion.span>
            </div>
            {index < steps.length - 1 && (
              <div className="relative flex-1 mx-2 sm:mx-6" data-oid="2.sa6jw">
                <div
                  className="absolute top-5 sm:top-6 h-1 w-full bg-gray-200/50 rounded-full"
                  data-oid="66de9oa"
                />

                <motion.div
                  className="absolute top-5 sm:top-6 h-1 bg-gradient-to-r from-indigo-900 via-indigo-700 to-yellow-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: index < currentStep ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  data-oid="eoslbu2"
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
      data-oid="jgu4_it"
    >
      <div className="space-y-4" data-oid="05xmsxr">
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 bg-brand rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          data-oid="llg22_d"
        >
          <Users
            className="w-8 h-8 sm:w-10 sm:h-10 text-white"
            data-oid="zm6iok:"
          />
        </motion.div>
        <div data-oid="0fgb-d_">
          <h1
            className="text-2xl sm:text-4xl font-bold bg-brand bg-clip-text text-transparent mb-4"
            data-oid="xthdbty"
          >
            {t("addYourChild")}
          </h1>
          <p
            className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto leading-relaxed"
            data-oid="9z88n1z"
          >
            {t("connectChildPrompt")}
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-[90vw] sm:max-w-3xl mx-auto"
        data-oid="-pxlqb8"
      >
        <motion.button
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMethodSelect("manual")}
          className="group relative p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          data-oid="q50i0ed"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            data-oid="j4o8m02"
          />

          <div className="relative space-y-4 sm:space-y-6" data-oid="9j0qhju">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-700 to-indigo-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg bg-[#000000]"
              data-oid=":d-s690"
            >
              <Search
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                data-oid="avilat4"
              />
            </div>
            <div className="text-left" data-oid="xbncbut">
              <h3
                className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                data-oid="rjlr7mi"
              >
                {t("searchByName")}
              </h3>
              <p
                className="text-gray-600 leading-relaxed text-sm sm:text-base"
                data-oid="3xuq7zo"
              >
                {t("searchByNameDesc")}
              </p>
            </div>
            <div
              className="flex items-center text-indigo-700 font-semibold group-hover:translate-x-2 transition-transform duration-300"
              data-oid="oam8t4l"
            >
              <span className="text-sm sm:text-base" data-oid="30zoqv4">
                {t("getStarted")}
              </span>
              <ArrowRight className="w-4 h-4 ml-2" data-oid="vwal2ju" />
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
          data-oid="orzd26v"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            data-oid="79ugz_z"
          />

          <div className="relative space-y-4 sm:space-y-6" data-oid="rpuonk-">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg bg-[#000000]"
              data-oid="rexo5b7"
            >
              <Camera
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                data-oid="cb4i88i"
              />
            </div>
            <div className="text-left" data-oid="0st-slc">
              <h3
                className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                data-oid="d0:b.et"
              >
                {t("scanQRCode")}
              </h3>
              <p
                className="text-gray-600 leading-relaxed text-sm sm:text-base"
                data-oid="l7p.6v3"
              >
                {t("scanQRCodeDesc")}
              </p>
            </div>
            <div
              className="flex items-center text-yellow-600 font-semibold group-hover:translate-x-2 transition-transform duration-300"
              data-oid=".uda:9b"
            >
              <span className="text-sm sm:text-base" data-oid="cd3-7qp">
                {t("openCamera")}
              </span>
              <Camera className="w-4 h-4 ml-2" data-oid="ffiyq7b" />
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
      data-oid="kw_5fa7"
    >
      <div className="text-center space-y-3" data-oid="l9:i56_">
        <h2
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent"
          data-oid="_7sa2iu"
        >
          {t("findStudent")}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg" data-oid="8uwbtgd">
          {t("findStudentPrompt")}
        </p>
      </div>

      <div className="space-y-4" data-oid="vpb6blo">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          data-oid="4n9_f:j"
        >
          <label
            className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2"
            data-oid="qkl7.bg"
          >
            <Users className="w-4 h-4 text-indigo-700" data-oid="f3t3bn-" />
            {t("studentName")}
          </label>
          <div className="relative" data-oid="m4z_77p">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder={t("enterStudentName")}
              className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-700 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg text-sm sm:text-base"
              data-oid="gw95xg9"
            />

            <Search
              className="absolute left-3 sm:left-4 top-3 sm:top-4 w-5 h-5 text-gray-400"
              data-oid="ci0nt3e"
            />
          </div>
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          data-oid="369owe6"
        >
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            data-oid="wxndvfs"
          >
            <label
              className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2"
              data-oid="aj3l-zd"
            >
              <School className="w-4 h-4 text-yellow-600" data-oid="5fj1y--" />
              {t("schoolName")}
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-600 transition-all duration-300 text-gray-900 shadow-lg appearance-none cursor-pointer text-sm sm:text-base"
              data-oid=":do-exm"
            >
              <option value="" data-oid="-n9b1mg">
                {t("chooseSchool")}
              </option>
              {schools.map((school) => (
                <option key={school} value={school} data-oid="rkv5c43">
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
            data-oid="g8jymbv"
          >
            <label
              className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2"
              data-oid="otyag1:"
            >
              <GraduationCap
                className="w-4 h-4 text-indigo-700"
                data-oid="1un7u.1"
              />

              {t("gradeLevel")}
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              disabled={!selectedSchool}
              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-700 transition-all duration-300 text-gray-900 shadow-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              data-oid="214mzho"
            >
              <option value="" data-oid="hyhlql1">
                {t("chooseGrade")}
              </option>
              {grades.map((grade) => (
                <option key={grade} value={grade} data-oid="im6izqc">
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
            data-oid="je_kj45"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-900 via-indigo-700 to-yellow-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto text-sm sm:text-base"
              data-oid="zjltsuj"
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    data-oid="tgzt319"
                  />

                  {t("searching")}
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" data-oid="lei8gch" />
                  {t("searchStudents")}
                  <Sparkles className="w-4 h-4" data-oid=".-2qidz" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>

      <AnimatePresence data-oid="-014k26">
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-4"
            data-oid="tqbmf0n"
          >
            <h3
              className="text-lg sm:text-xl font-bold text-gray-900 text-center sticky top-0 bg-white/80 backdrop-blur-sm py-2 z-10"
              data-oid="x_j.fhc"
            >
              {t("selectYourChild")}
            </h3>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-indigo-50 scroll-smooth p-3 sm:p-4 rounded-2xl"
              data-oid="l:2jcys"
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
                  data-oid="6:eccz2"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-oid="fx840:p"
                  />

                  <div
                    className="relative flex items-center gap-3 sm:gap-4"
                    data-oid="kq4-ra7"
                  >
                    <div className="relative" data-oid="wd5da02">
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg"
                        data-oid="4aexdoq"
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
                          data-oid="tv7f3q_"
                        />
                      </div>
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                        data-oid="-odovhe"
                      >
                        <Heart
                          className="w-3 h-3 text-white"
                          data-oid="375pgbc"
                        />
                      </div>
                    </div>
                    <div className="flex-1" data-oid="1xigu8n">
                      <h4
                        className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors text-base sm:text-lg"
                        data-oid="omq0b53"
                      >
                        {student.student_name}
                      </h4>
                      <p
                        className="text-gray-600 font-medium text-sm sm:text-base"
                        data-oid="giym.v6"
                      >
                        {student.school_name}
                      </p>
                      <p
                        className="text-xs sm:text-sm text-gray-500 flex items-center gap-1"
                        data-oid="7k36o23"
                      >
                        <Star className="w-3 h-3" data-oid="c1a2lhh" />
                        {t("grade")} {student.grade}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-indigo-700 group-hover:translate-x-2 transition-all duration-300"
                      data-oid="s-8yhrp"
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
      data-oid="dth0-uv"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-[90vw] sm:max-w-md w-full overflow-hidden"
        data-oid="kaug13w"
      >
        <div
          className="relative p-4 sm:p-6 from-indigo-900 to-yellow-500 text-white bg-[#05000000] bg-[url(/images/1ev8.png)]"
          data-oid="l16d:az"
        >
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            data-oid="0wtxte_"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" data-oid="vaihby0" />
          </button>
          <div className="text-center" data-oid="_ey:m:y">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
              data-oid="qn4fx2q"
            >
              <Camera className="w-6 h-6 sm:w-8 sm:h-8" data-oid="vy.qc2c" />
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold mb-2"
              data-oid="nv:__ec"
            >
              {t("scanQRCode")}
            </h2>
            <p
              className="text-indigo-100 text-sm sm:text-base"
              data-oid="0gdfmn5"
            >
              {t("positionQRCode")}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6" data-oid="hsq85i1">
          {hasCamera !== false && (
            <div
              className="relative mx-auto w-[80vw] sm:w-80 h-[80vw] sm:h-80 max-w-[300px] max-h-[300px] rounded-2xl overflow-hidden bg-gray-900"
              data-oid="617lk2t"
            >
              <div
                id="qr-scanner"
                ref={scannerRef}
                className="w-full h-full"
                data-oid="sqdn9tg"
              />

              {isScanning && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  data-oid="23-lk5n"
                >
                  <div className="relative" data-oid="d.hgprb">
                    <div
                      className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] border-4 border-white/80 rounded-2xl bg-transparent"
                      data-oid="cgdauau"
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
                      data-oid=".x4m8lr"
                    />

                    <div
                      className="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-t-4 border-yellow-400 rounded-tl-lg"
                      data-oid="f1z6m3o"
                    />

                    <div
                      className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-t-4 border-yellow-400 rounded-tr-lg"
                      data-oid=":ntw9-."
                    />

                    <div
                      className="absolute -bottom-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 border-l-4 border-b-4 border-yellow-400 rounded-bl-lg"
                      data-oid=":14:pqc"
                    />

                    <div
                      className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 border-r-4 border-b-4 border-yellow-400 rounded-br-lg"
                      data-oid="2.2eyt."
                    />

                    <motion.div
                      className="absolute inset-0 border-2 border-yellow-400/50 rounded-2xl"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      data-oid="73:m8xh"
                    />
                  </div>
                </div>
              )}
              {error && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50"
                  data-oid="toxa0v_"
                >
                  <div
                    className="text-center text-white p-4"
                    data-oid="7nzs24k"
                  >
                    <AlertCircle
                      className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-red-400"
                      data-oid="bvwb:jv"
                    />

                    <p className="text-xs sm:text-sm" data-oid="t0833:u">
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
                      data-oid="zp6waht"
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
            data-oid="n:7hlo-"
          >
            <ArrowLeft className="w-5 h-5" data-oid=":1t_pn9" />
            {t("backToMethod")}
          </motion.button>

          <div className="text-center" data-oid="lwusuhl">
            {isScanning && hasCamera ? (
              <div
                className="flex items-center justify-center gap-2 text-indigo-700"
                data-oid="l6v5e.q"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  data-oid="z3jxi9u"
                >
                  <Camera
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    data-oid="c:-fu80"
                  />
                </motion.div>
                <span
                  className="font-medium text-sm sm:text-base"
                  data-oid="_o4yh:e"
                >
                  {t("scanningQRCode")}
                </span>
              </div>
            ) : (
              <div
                className="flex items-center justify-center gap-2 text-gray-500"
                data-oid="6d7d6z8"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" data-oid="2jhs93q" />
                <span
                  className="font-medium text-sm sm:text-base"
                  data-oid="6yj1rqw"
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
      data-oid="-vxt4v8"
    >
      <rect width="128" height="128" fill="url(#gradient)" data-oid="j19auln" />
      <path
        d="M64 48C72.8366 48 80 40.8366 80 32C80 23.1634 72.8366 16 64 16C55.1634 16 48 23.1634 48 32C48 40.8366 55.1634 48 64 48Z"
        fill="#fff"
        fillOpacity="0.8"
        data-oid="8lhwz79"
      />

      <path
        d="M64 64C50.7452 64 40 74.7452 40 88V112H88V88C88 74.7452 77.2548 64 64 64Z"
        fill="#fff"
        fillOpacity="0.8"
        data-oid="hig:xy9"
      />

      <defs data-oid="p2yens9">
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="128"
          y2="128"
          data-oid="my6ln4o"
        >
          <stop offset="0%" stopColor="#4f46e5" data-oid="0:ri3st" />
          <stop offset="100%" stopColor="#facc15" data-oid="ab3:h8k" />
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
      data-oid="a76..cl"
    >
      <div className="text-center space-y-3" data-oid="h2l9brj">
        <h2
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent"
          data-oid="h-l5f0l"
        >
          {t("confirmDetails")}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg" data-oid="etcr4dr">
          {t("verifyStudentPrompt")}
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-white/20"
        data-oid="1bp65aa"
      >
        <div className="text-center space-y-4 sm:space-y-6" data-oid="v4m47wr">
          <div
            className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32"
            data-oid="f2_i950"
          >
            <div
              className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl"
              data-oid="b7u7._6"
            >
              {imageError ? (
                <CustomSVGPlaceholder data-oid="t_gumsx" />
              ) : (
                <img
                  src={student.student_photo_url}
                  alt={student.student_name}
                  className="w-full h-full object-cover"
                  onError={() => {
                    setImageError(true);
                  }}
                  data-oid="1hktzqx"
                />
              )}
            </div>
            <div
              className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
              data-oid="b7d:oxg"
            >
              <CheckCircle
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                data-oid="yg.sdwm"
              />
            </div>
          </div>

          <div data-oid="zpj93_w">
            <h3
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
              data-oid="ny8v:c6"
            >
              {student.student_name}
            </h3>
            <p
              className="text-gray-600 font-medium text-sm sm:text-base"
              data-oid="p257kku"
            >
              {t("studentId")}: {student.student_id.slice(0, 8)}...
            </p>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          data-oid="ebcrahe"
        >
          <motion.div
            className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200"
            whileHover={{ scale: 1.02 }}
            data-oid="o.xgx_m"
          >
            <div
              className="flex items-center gap-3 sm:gap-4"
              data-oid="ovhzb5p"
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-700 rounded-xl flex items-center justify-center shadow-lg"
                data-oid="n43sm7l"
              >
                <School
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  data-oid="eb.kga3"
                />
              </div>
              <div data-oid="14b.gvi">
                <p
                  className="text-xs sm:text-sm text-indigo-700 font-semibold"
                  data-oid="uzx9i_b"
                >
                  {t("school")}
                </p>
                <p
                  className="font-bold text-gray-900 text-sm sm:text-base"
                  data-oid="6teqc.p"
                >
                  {student.school_name}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200"
            whileHover={{ scale: 1.02 }}
            data-oid="xkdw0qa"
          >
            <div
              className="flex items-center gap-3 sm:gap-4"
              data-oid="fu38mov"
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg"
                data-oid="8:xph2u"
              >
                <GraduationCap
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  data-oid="j1usha3"
                />
              </div>
              <div data-oid="u2megl9">
                <p
                  className="text-xs sm:text-sm text-yellow-700 font-semibold"
                  data-oid=".k4c9sf"
                >
                  {t("grade")}
                </p>
                <p
                  className="font-bold text-gray-900 text-sm sm:text-base"
                  data-oid="15or7x9"
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
          data-oid="r.06dny"
        >
          <h4
            className="text-lg sm:text-xl font-bold text-gray-900 mb-4"
            data-oid="o.1ohzg"
          >
            {t("studentStats")}
          </h4>
          <ResponsiveContainer width="100%" height={200} data-oid="4kjr7vd">
            <BarChart data={chartData} data-oid="jlclhnp">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                data-oid="taw-tl-"
              />

              <XAxis
                dataKey="name"
                stroke="#374151"
                fontSize={12}
                data-oid="st1_u-h"
              />

              <YAxis stroke="#374151" fontSize={12} data-oid="c07s_w6" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
                data-oid="lrpn3i."
              />

              <Bar
                dataKey="value"
                fill="url(#chartGradient)"
                radius={[8, 8, 0, 0]}
                barSize={40}
                data-oid="5n2vigl"
              />

              <defs data-oid="lgn82p2">
                <linearGradient
                  id="chartGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                  data-oid="jfa.ab8"
                >
                  <stop offset="0%" stopColor="#4f46e5" data-oid="fe24gvr" />
                  <stop offset="100%" stopColor="#facc15" data-oid="vz0eehq" />
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
          data-oid="u7o4_2d"
        >
          {isLoading ? (
            <>
              <Loader2
                className="w-5 h-5 sm:w-6 sm:h-6 animate-spin"
                data-oid="q-6id.p"
              />

              {t("addingStudent")}
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" data-oid="rt-_pkg" />
              {t("addToAccount")}
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" data-oid="5qe.13t" />
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
      data-oid="lz4k_h5"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-[90vw] sm:max-w-md w-full p-4 sm:p-6"
        data-oid="h6k0n5q"
      >
        <div className="text-center space-y-4" data-oid="j8b9-_1">
          <AlertCircle
            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-yellow-500"
            data-oid="segcsl5"
          />

          <h3
            className="text-lg sm:text-xl font-bold text-gray-900"
            data-oid="6qelz11"
          >
            {t("quitConfirmTitle")}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base" data-oid="ex8g9ai">
            {t("quitConfirmPrompt")}
          </p>
        </div>
        <div
          className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4"
          data-oid="ct.bkrr"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
            data-oid="1l5y-iq"
          >
            {t("cancel")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 px-4 sm:px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
            data-oid="l55:lnq"
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
          data-oid="trpdbwc"
        >
          <AlertCircle
            className="w-12 h-12 mx-auto mb-4 text-red-500"
            data-oid="aargvzw"
          />

          <h2 className="text-xl font-bold text-gray-900" data-oid="t70hvys">
            Something went wrong
          </h2>
          <p className="text-gray-600 mt-2" data-oid="516_7nl">
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
    <ErrorBoundary data-oid=":u.nzaa">
      <div
        className="min-h-screen bg-brand backdrop-blur-2xl relative overflow-hidden"
        data-oid="qpfsq-p"
      >
        <div
          className="absolute inset-0 overflow-hidden bg-[url(/images/rw4j.png)]"
          data-oid="eajsxtq"
        >
          <div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-yellow-400/20 rounded-full blur-3xl"
            data-oid="kh0augg"
          />

          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-indigo-400/20 rounded-full blur-3xl"
            data-oid="a7am9kk"
          />
        </div>

        <div
          className="relative max-w-[95vw] md:max-w-5xl mx-auto py-8 px-2 sm:px-4"
          data-oid="2_z1b.h"
        >
          <div className="relative" data-oid="r_ltxlo">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuit}
              className="absolute top-0 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-gray-700 transition-colors"
              data-oid="9cyjbwv"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" data-oid=":dh.zaj" />
            </motion.button>
            <StepIndicator currentStep={currentStep} data-oid="c63a-64" />
          </div>

          <AnimatePresence data-oid="u2jhes1">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center backdrop-blur-sm text-sm sm:text-base"
                data-oid="ubhvfrq"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 min-h-[500px] sm:min-h-[600px] border border-white/20"
            data-oid="8::u0wq"
          >
            <AnimatePresence mode="wait" data-oid="_:_l6nv">
              {currentStep === 0 && (
                <MethodSelection
                  key="method"
                  onMethodSelect={handleMethodSelect}
                  data-oid="sysx6mo"
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
                  data-oid="bg719_1"
                />
              )}
              {currentStep === 2 && selectedStudent && (
                <StudentConfirmation
                  key="confirm"
                  student={selectedStudent}
                  onConfirm={handleConfirm}
                  isLoading={isLoading}
                  data-oid="kopuas6"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-6 sm:mt-8" data-oid="u1ykw5o">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrev}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 bg-white/80 backdrop-blur-sm text-gray-700 shadow-lg hover:shadow-xl border border-white/20 text-sm sm:text-base"
              data-oid="ayncuxf"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" data-oid="atrmwkz" />
              {currentStep === 0 ? t("quit") : t("previous")}
            </motion.button>

            <div className="text-center" data-oid="aqmt7yt">
              <p
                className="text-xs sm:text-sm text-gray-500"
                data-oid="ws.8s.r"
              >
                {t("step")} {currentStep + 1} {t("of")} {steps.length}
              </p>
            </div>

            <div className="w-24 sm:w-32" data-oid="1pcm-ar" />
          </div>
        </div>

        <AnimatePresence data-oid="jo.gk54">
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
              data-oid="7azps3a"
            />
          )}
          {showQuitConfirm && (
            <QuitConfirmation
              onConfirm={confirmQuit}
              onCancel={() => setShowQuitConfirm(false)}
              data-oid="67575hh"
            />
          )}
        </AnimatePresence>

        <div
          className="fixed top-16 sm:top-20 right-2 sm:right-4 space-y-2 z-50"
          data-oid="6_w8:sg"
        >
          <AnimatePresence data-oid="w3e-n2e">
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
                data-oid="1r49dm4"
              >
                {toast.message}
                <button
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                  className="ml-2 p-1 hover:bg-gray-200/50 rounded-full"
                  data-oid="8xsn9r4"
                >
                  <X className="w-4 h-4" data-oid="x2gd_mm" />
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
