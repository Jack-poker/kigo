import React, { useState } from "react";
import { Globe, User, Bell, Settings, LogOut, Menu, X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languages = [
    { code: "en", name: t("english"), flag: "🇺🇸" },
    { code: "fr", name: t("french"), flag: "🇫🇷" },
    { code: "rw", name: t("kinyarwanda"), flag: "🇷🇼" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  const shimmerClass =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header
      className="bg-gradient-to-r from-red-50 via-yellow-50 via-green-50 to-blue-50 backdrop-blur-xl border-b-4 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 sticky top-0 z-50 shadow-2xl"
      data-oid="yx.e65b"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-yellow-100/30 via-green-100/30 to-blue-100/30 animate-pulse"
        data-oid="y8t4g7i"
      ></div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
          radial-gradient(circle at 25% 25%, #ef4444 1px, transparent 1px),
          radial-gradient(circle at 75% 25%, #eab308 1px, transparent 1px),
          radial-gradient(circle at 25% 75%, #22c55e 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
        }}
        data-oid="rqxkx2-"
      ></div>
      <div className="container mx-auto px-6 relative z-10" data-oid="wj0i8o_">
        <div
          className="flex items-center justify-between h-20"
          data-oid="5ap90gs"
        >
          <div className="flex items-center space-x-4" data-oid="h4.36zl">
            <div
              className={`relative w-14 h-14 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 ${shimmerClass}`}
              data-oid="mddldvu"
            >
              <span
                className="text-white font-black text-xl drop-shadow-lg"
                data-oid="ljq9-jl"
              >
                iW
              </span>
              <div
                className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse"
                data-oid="a3t-gaz"
              ></div>
            </div>
            <div className="hidden sm:block" data-oid="b871.3r">
              <h1
                className="text-2xl font-black bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg"
                data-oid="ukecj1x"
              >
                {t("appName")}
              </h1>
              <div className="flex items-center space-x-2" data-oid="a8s125u">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  data-oid="5hvdx:z"
                ></div>
                <p
                  className="text-sm text-gray-600 font-bold"
                  data-oid="cszs2rn"
                >
                  {t("tagline")}
                </p>
              </div>
            </div>
          </div>
          <div
            className="hidden md:flex items-center space-x-6"
            data-oid="pxfpkuc"
          >
            <div className="relative group" data-oid="9els2gc">
              <button
                className={`relative p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
                data-oid="3ogj-et"
              >
                <Bell className="w-6 h-6" data-oid="oh6vx1y" />
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center"
                  data-oid=".p8uc-7"
                >
                  <span
                    className="text-white text-xs font-bold"
                    data-oid="n59j-ax"
                  >
                    3
                  </span>
                </span>
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75"
                  data-oid="lmqdj_s"
                ></div>
              </button>
              <div
                className="absolute top-full right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                data-oid="z8lc-ke"
              >
                <div className="p-6" data-oid="a5g3-qc">
                  <h3
                    className="font-bold text-gray-900 mb-4 text-lg"
                    data-oid="f1b6rvs"
                  >
                    {t("recentNotifications")}
                  </h3>
                  <div className="space-y-3" data-oid="po-.z86">
                    <div
                      className="p-3 bg-green-50 rounded-xl border border-brand"
                      data-oid=".:7spoa"
                    >
                      <p
                        className="text-sm font-semibold text-green-800"
                        data-oid="8xyj2up"
                      >
                        {t("alicePurchase")}
                      </p>
                      <p className="text-xs text-green-600" data-oid="c_cl-ko">
                        {t("twoMinutesAgo")}
                      </p>
                    </div>
                    <div
                      className="p-3 bg-blue-50 rounded-xl border border-blue-200"
                      data-oid="q523jra"
                    >
                      <p
                        className="text-sm font-semibold text-blue-800"
                        data-oid="h-zdd1-"
                      >
                        {t("bobLimitReminder")}
                      </p>
                      <p className="text-xs text-blue-600" data-oid="3wwc6s8">
                        {t("oneHourAgo")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative" data-oid="qjfgr0b">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm font-bold border-2 border-gray-200 hover:border-blue-300 ${shimmerClass}`}
                data-oid="br79sq."
              >
                <Globe className="w-5 h-5" data-oid="fvwhhew" />
                <span className="text-sm" data-oid="y4bvau:">
                  {currentLanguage?.flag} {currentLanguage?.name}
                </span>
              </button>
              {isLanguageOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-100 py-3 z-50"
                  data-oid=".he2k--"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 font-semibold flex items-center space-x-3 ${
                        language === lang.code ? "bg-blue-50 text-blue-600" : ""
                      }`}
                      data-oid="kq75hl8"
                    >
                      <span className="text-lg" data-oid="b30h:lz">
                        {lang.flag}
                      </span>
                      <span data-oid="e:8p0..">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" data-oid="p3qlwlp">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-2xl hover:bg-white/60 transition-all duration-300 backdrop-blur-sm ${shimmerClass}`}
                data-oid="zl3gcnq"
              >
                <div
                  className="w-12 h-12 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                  data-oid="355t8ti"
                >
                  <User className="w-6 h-6 text-white" data-oid="ffhdz90" />
                </div>
                <div className="text-left hidden lg:block" data-oid="31r.s9l">
                  <p
                    className="text-sm font-bold text-gray-900"
                    data-oid="ojg1876"
                  >
                    {t("lovingParent")}
                  </p>
                  <p
                    className="text-xs text-gray-600 font-medium"
                    data-oid="z_-1jm2"
                  >
                    {t("alwaysCaring")}
                  </p>
                </div>
              </button>
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 py-4 z-50"
                  data-oid=".9ae:cy"
                >
                  <div
                    className="px-6 py-4 border-b border-gray-100"
                    data-oid="-6d:17t"
                  >
                    <div
                      className="flex items-center space-x-4"
                      data-oid="6sj:yx."
                    >
                      <div
                        className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                        data-oid="h3.dj7q"
                      >
                        <User
                          className="w-8 h-8 text-white"
                          data-oid="271sfwd"
                        />
                      </div>
                      <div data-oid="-ig042y">
                        <p
                          className="text-lg font-bold text-gray-900"
                          data-oid="s85vzvq"
                        >
                          {t("lovingParent")}
                        </p>
                        <p className="text-sm text-gray-600" data-oid="dg_gmof">
                          parent@example.com
                        </p>
                        <p
                          className="text-xs text-green-600 font-semibold"
                          data-oid="s923fl6"
                        >
                          {t("trustedGuardian")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-3" data-oid="xl0xn2:">
                    <button
                      onClick={() => {
                        onMenuClick();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 font-semibold"
                      data-oid="irxxlf8"
                    >
                      <User
                        className="w-5 h-5 text-blue-500"
                        data-oid="cb3yjeq"
                      />

                      <span data-oid="12-msic">{t("profileSettings")}</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 font-semibold"
                      data-oid="sj.armg"
                    >
                      <Settings
                        className="w-5 h-5 text-purple-500"
                        data-oid="fh3ltdo"
                      />

                      <span data-oid="th7sef0">{t("accountSettings")}</span>
                    </button>
                    <hr className="my-3 border-gray-200" data-oid="4kl08g." />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-200 font-semibold"
                      data-oid="p6d56ql"
                    >
                      <LogOut className="w-5 h-5" data-oid="zhqtcn7" />
                      <span data-oid="lv-vch5">{t("signOut")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
            data-oid="p-w-kz6"
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7" data-oid="5q25w2f" />
            ) : (
              <Menu className="w-7 h-7" data-oid="4bkolko" />
            )}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t-2 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 py-6 space-y-6 bg-white/60 backdrop-blur-xl rounded-b-3xl"
            data-oid="0zesgn0"
          >
            <div
              className="flex items-center space-x-4 px-6"
              data-oid="ai0_dvt"
            >
              <div
                className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                data-oid="_531am9"
              >
                <User className="w-8 h-8 text-white" data-oid="w7.qqdl" />
              </div>
              <div data-oid="0wkqdui">
                <p
                  className="font-bold text-gray-900 text-lg"
                  data-oid="u6:4qn6"
                >
                  {t("lovingParent")}
                </p>
                <p className="text-sm text-gray-600" data-oid="2ens7e8">
                  parent@example.com
                </p>
                <p
                  className="text-xs text-green-600 font-semibold"
                  data-oid="wvyk0s0"
                >
                  {t("trustedGuardian")}
                </p>
              </div>
            </div>
            <div className="space-y-3 px-6" data-oid="ijtowis">
              <button
                className="w-full flex items-center space-x-4 py-4 text-left bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl px-4 font-semibold"
                data-oid="a00rog4"
              >
                <Bell className="w-6 h-6 text-blue-500" data-oid="2uevjs3" />
                <span data-oid="vd-68n7">{t("notifications")}</span>
                <span
                  className="ml-auto w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                  data-oid="9w7tp_q"
                >
                  3
                </span>
              </button>
              <div
                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-4 py-4"
                data-oid="rz_0eki"
              >
                <div
                  className="flex items-center space-x-3 mb-3"
                  data-oid="tpyf6g8"
                >
                  <Globe
                    className="w-6 h-6 text-green-500"
                    data-oid="nd:2sj1"
                  />

                  <span className="font-semibold" data-oid="hgucp:4">
                    {t("language")}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2" data-oid="qq:-6by">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        language === lang.code
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-green-100"
                      }`}
                      data-oid="b93s:qx"
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  onMenuClick();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full space-x-4 py-4 rounded-2xl px-4 bg-gradient-to-r from-blue-50 to-cyan-50 font-semibold text-left"
                data-oid="srhrg6w"
              >
                <User className="w-6 h-6 text-blue-500" data-oid="asvmyb_" />
                <span data-oid="uut_tdj">{t("profileSettings")}</span>
              </button>
              <button
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-purple-50 to-pink-50 font-semibold text-left"
                data-oid="4m-e7.p"
              >
                <Settings
                  className="w-6 h-6 text-purple-500"
                  data-oid="i-.0wot"
                />

                <span data-oid="pz49dqz">{t("settings")}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 font-semibold text-left"
                data-oid="1srb0zy"
              >
                <LogOut className="w-6 h-6" data-oid="m4_zwz8" />
                <span data-oid="1r7av29">{t("signOut")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 animate-pulse"
        data-oid="ngdtufw"
      ></div>
    </header>
  );
};

export default Header;
