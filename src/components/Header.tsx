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
      data-oid="zbdevgc"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-yellow-100/30 via-green-100/30 to-blue-100/30 animate-pulse"
        data-oid="bswq5m1"
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
        data-oid="ho_2lx9"
      ></div>
      <div className="container mx-auto px-6 relative z-10" data-oid="m1tqh59">
        <div
          className="flex items-center justify-between h-20"
          data-oid="eewt11k"
        >
          <div className="flex items-center space-x-4" data-oid="l_b1il4">
            <div
              className={`relative w-14 h-14 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 ${shimmerClass}`}
              data-oid="quv88ly"
            >
              <span
                className="text-white font-black text-xl drop-shadow-lg"
                data-oid="da9_3bo"
              >
                iW
              </span>
              <div
                className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse"
                data-oid="rczunxn"
              ></div>
            </div>
            <div className="hidden sm:block" data-oid="wz71vp1">
              <h1
                className="text-2xl font-black bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg"
                data-oid="saa6qqn"
              >
                {t("appName")}
              </h1>
              <div className="flex items-center space-x-2" data-oid="2x0gfqp">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  data-oid="5p:-5do"
                ></div>
                <p
                  className="text-sm text-gray-600 font-bold"
                  data-oid=":6fwrtm"
                >
                  {t("tagline")}
                </p>
              </div>
            </div>
          </div>
          <div
            className="hidden md:flex items-center space-x-6"
            data-oid="hu1..pt"
          >
            <div className="relative group" data-oid="-k8ir6s">
              <button
                className={`relative p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
                data-oid="dco6obp"
              >
                <Bell className="w-6 h-6" data-oid="ohnkthy" />
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center"
                  data-oid="6sly06f"
                >
                  <span
                    className="text-white text-xs font-bold"
                    data-oid="69cfpat"
                  >
                    3
                  </span>
                </span>
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75"
                  data-oid="r7rtml2"
                ></div>
              </button>
              <div
                className="absolute top-full right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                data-oid="8h3rly_"
              >
                <div className="p-6" data-oid="b.0xctb">
                  <h3
                    className="font-bold text-gray-900 mb-4 text-lg"
                    data-oid="tqcpfu_"
                  >
                    {t("recentNotifications")}
                  </h3>
                  <div className="space-y-3" data-oid="uz0e4aa">
                    <div
                      className="p-3 bg-green-50 rounded-xl border border-brand"
                      data-oid="w9s_qb3"
                    >
                      <p
                        className="text-sm font-semibold text-green-800"
                        data-oid="gb.ic8."
                      >
                        {t("alicePurchase")}
                      </p>
                      <p className="text-xs text-green-600" data-oid="jhsud0v">
                        {t("twoMinutesAgo")}
                      </p>
                    </div>
                    <div
                      className="p-3 bg-blue-50 rounded-xl border border-blue-200"
                      data-oid="bdfj7v7"
                    >
                      <p
                        className="text-sm font-semibold text-blue-800"
                        data-oid="ea7ctd9"
                      >
                        {t("bobLimitReminder")}
                      </p>
                      <p className="text-xs text-blue-600" data-oid=".6tk_el">
                        {t("oneHourAgo")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative" data-oid="ml9uft1">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm font-bold border-2 border-gray-200 hover:border-blue-300 ${shimmerClass}`}
                data-oid="tbxxq0u"
              >
                <Globe className="w-5 h-5" data-oid="mhw_tw2" />
                <span className="text-sm" data-oid="zkc_lr7">
                  {currentLanguage?.flag} {currentLanguage?.name}
                </span>
              </button>
              {isLanguageOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-100 py-3 z-50"
                  data-oid="v1d:n4w"
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
                      data-oid="z.08fbt"
                    >
                      <span className="text-lg" data-oid="43.sj4i">
                        {lang.flag}
                      </span>
                      <span data-oid=":rwbovf">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" data-oid="pwcj_89">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-2xl hover:bg-white/60 transition-all duration-300 backdrop-blur-sm ${shimmerClass}`}
                data-oid="l4rfb86"
              >
                <div
                  className="w-12 h-12 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                  data-oid="1:uz80s"
                >
                  <User className="w-6 h-6 text-white" data-oid="gb137o3" />
                </div>
                <div className="text-left hidden lg:block" data-oid="rb0-_y4">
                  <p
                    className="text-sm font-bold text-gray-900"
                    data-oid="u:xtd73"
                  >
                    {t("lovingParent")}
                  </p>
                  <p
                    className="text-xs text-gray-600 font-medium"
                    data-oid="rvbwjmg"
                  >
                    {t("alwaysCaring")}
                  </p>
                </div>
              </button>
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 py-4 z-50"
                  data-oid="vadgxt0"
                >
                  <div
                    className="px-6 py-4 border-b border-gray-100"
                    data-oid="uoe8:.x"
                  >
                    <div
                      className="flex items-center space-x-4"
                      data-oid="2h2jwv0"
                    >
                      <div
                        className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                        data-oid=":vd_jsb"
                      >
                        <User
                          className="w-8 h-8 text-white"
                          data-oid="xt0v4nf"
                        />
                      </div>
                      <div data-oid="q.i2o2y">
                        <p
                          className="text-lg font-bold text-gray-900"
                          data-oid="0nz9wrb"
                        >
                          {t("lovingParent")}
                        </p>
                        <p className="text-sm text-gray-600" data-oid="s1svrm4">
                          parent@example.com
                        </p>
                        <p
                          className="text-xs text-green-600 font-semibold"
                          data-oid="y4znjrk"
                        >
                          {t("trustedGuardian")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-3" data-oid="wkiks6:">
                    <button
                      onClick={() => {
                        onMenuClick();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 font-semibold"
                      data-oid="f4_qcfi"
                    >
                      <User
                        className="w-5 h-5 text-blue-500"
                        data-oid="5f1:_48"
                      />

                      <span data-oid="y3mzzrr">{t("profileSettings")}</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 font-semibold"
                      data-oid="h_jnnwj"
                    >
                      <Settings
                        className="w-5 h-5 text-purple-500"
                        data-oid=".viurwr"
                      />

                      <span data-oid="e11gba:">{t("accountSettings")}</span>
                    </button>
                    <hr className="my-3 border-gray-200" data-oid="2u5i-06" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-200 font-semibold"
                      data-oid="3z:v5tz"
                    >
                      <LogOut className="w-5 h-5" data-oid="0opx9da" />
                      <span data-oid=":jlld6m">{t("signOut")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
            data-oid="2aij-m5"
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7" data-oid="jcn.2vv" />
            ) : (
              <Menu className="w-7 h-7" data-oid="cy5atnv" />
            )}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t-2 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 py-6 space-y-6 bg-white/60 backdrop-blur-xl rounded-b-3xl"
            data-oid="ibzj_48"
          >
            <div
              className="flex items-center space-x-4 px-6"
              data-oid="t7wy_9_"
            >
              <div
                className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                data-oid="taodhrs"
              >
                <User className="w-8 h-8 text-white" data-oid="vkux4cp" />
              </div>
              <div data-oid="g4tsjzz">
                <p
                  className="font-bold text-gray-900 text-lg"
                  data-oid="endp_d:"
                >
                  {t("lovingParent")}
                </p>
                <p className="text-sm text-gray-600" data-oid="l67g05d">
                  parent@example.com
                </p>
                <p
                  className="text-xs text-green-600 font-semibold"
                  data-oid="h.753jr"
                >
                  {t("trustedGuardian")}
                </p>
              </div>
            </div>
            <div className="space-y-3 px-6" data-oid="e4:a_dg">
              <button
                className="w-full flex items-center space-x-4 py-4 text-left bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl px-4 font-semibold"
                data-oid="bokk6hr"
              >
                <Bell className="w-6 h-6 text-blue-500" data-oid="p3xz172" />
                <span data-oid="8wncbqn">{t("notifications")}</span>
                <span
                  className="ml-auto w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                  data-oid="jhahr7k"
                >
                  3
                </span>
              </button>
              <div
                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-4 py-4"
                data-oid="9aceolk"
              >
                <div
                  className="flex items-center space-x-3 mb-3"
                  data-oid="gmc5fl5"
                >
                  <Globe
                    className="w-6 h-6 text-green-500"
                    data-oid="ds2xqqc"
                  />

                  <span className="font-semibold" data-oid="vr5armr">
                    {t("language")}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2" data-oid="ny3gmay">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        language === lang.code
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-green-100"
                      }`}
                      data-oid="h1sj23e"
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
                data-oid="_z13ysm"
              >
                <User className="w-6 h-6 text-blue-500" data-oid="bqqr9h3" />
                <span data-oid="nv7t44p">{t("profileSettings")}</span>
              </button>
              <button
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-purple-50 to-pink-50 font-semibold text-left"
                data-oid="v9hsx_0"
              >
                <Settings
                  className="w-6 h-6 text-purple-500"
                  data-oid="am.baqj"
                />

                <span data-oid="eqemd:n">{t("settings")}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 font-semibold text-left"
                data-oid="9xmdnz3"
              >
                <LogOut className="w-6 h-6" data-oid="azgtd61" />
                <span data-oid="mb_::6d">{t("signOut")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 animate-pulse"
        data-oid="c7vxg8d"
      ></div>
    </header>
  );
};

export default Header;
