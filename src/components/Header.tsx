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
      data-oid="bsvtud:"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-yellow-100/30 via-green-100/30 to-blue-100/30 animate-pulse"
        data-oid="zlu62:q"
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
        data-oid="0fiogir"
      ></div>
      <div className="container mx-auto px-6 relative z-10" data-oid="ma-k81r">
        <div
          className="flex items-center justify-between h-20"
          data-oid="r485txj"
        >
          <div className="flex items-center space-x-4" data-oid="_9fltt2">
            <div
              className={`relative w-14 h-14 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 ${shimmerClass}`}
              data-oid="j7-r73f"
            >
              <span
                className="text-white font-black text-xl drop-shadow-lg"
                data-oid=".pfyahy"
              >
                iW
              </span>
              <div
                className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse"
                data-oid="9m70.7a"
              ></div>
            </div>
            <div className="hidden sm:block" data-oid="l16gbuo">
              <h1
                className="text-2xl font-black bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg"
                data-oid="tz5dr8b"
              >
                {t("appName")}
              </h1>
              <div className="flex items-center space-x-2" data-oid="-q_e3uq">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  data-oid="fcoi2xd"
                ></div>
                <p
                  className="text-sm text-gray-600 font-bold"
                  data-oid="23agu6v"
                >
                  {t("tagline")}
                </p>
              </div>
            </div>
          </div>
          <div
            className="hidden md:flex items-center space-x-6"
            data-oid="1-m8as:"
          >
            <div className="relative group" data-oid="l1udqgy">
              <button
                className={`relative p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
                data-oid="o-nv.cv"
              >
                <Bell className="w-6 h-6" data-oid="q0n-8qk" />
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center"
                  data-oid="2ka08xc"
                >
                  <span
                    className="text-white text-xs font-bold"
                    data-oid="mqz7k4-"
                  >
                    3
                  </span>
                </span>
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75"
                  data-oid=":.j5htd"
                ></div>
              </button>
              <div
                className="absolute top-full right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                data-oid="p02i_cr"
              >
                <div className="p-6" data-oid="t:un0-:">
                  <h3
                    className="font-bold text-gray-900 mb-4 text-lg"
                    data-oid="v7b49xa"
                  >
                    {t("recentNotifications")}
                  </h3>
                  <div className="space-y-3" data-oid="r1b_9l4">
                    <div
                      className="p-3 bg-green-50 rounded-xl border border-brand"
                      data-oid="s0shmnn"
                    >
                      <p
                        className="text-sm font-semibold text-green-800"
                        data-oid="g-dicv6"
                      >
                        {t("alicePurchase")}
                      </p>
                      <p className="text-xs text-green-600" data-oid="pgwsejn">
                        {t("twoMinutesAgo")}
                      </p>
                    </div>
                    <div
                      className="p-3 bg-blue-50 rounded-xl border border-blue-200"
                      data-oid="oxaa9l."
                    >
                      <p
                        className="text-sm font-semibold text-blue-800"
                        data-oid="fhc2g:_"
                      >
                        {t("bobLimitReminder")}
                      </p>
                      <p className="text-xs text-blue-600" data-oid="r917i58">
                        {t("oneHourAgo")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative" data-oid="4e77-m2">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm font-bold border-2 border-gray-200 hover:border-blue-300 ${shimmerClass}`}
                data-oid="-s:1r3-"
              >
                <Globe className="w-5 h-5" data-oid="q6tib7f" />
                <span className="text-sm" data-oid="uq7yc1f">
                  {currentLanguage?.flag} {currentLanguage?.name}
                </span>
              </button>
              {isLanguageOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-100 py-3 z-50"
                  data-oid="l77dw1_"
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
                      data-oid="jm92n2b"
                    >
                      <span className="text-lg" data-oid="-8dgpi.">
                        {lang.flag}
                      </span>
                      <span data-oid="ugeib:w">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" data-oid="8u5oly8">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-2xl hover:bg-white/60 transition-all duration-300 backdrop-blur-sm ${shimmerClass}`}
                data-oid="a5a8zf1"
              >
                <div
                  className="w-12 h-12 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                  data-oid="xsr042a"
                >
                  <User className="w-6 h-6 text-white" data-oid="ukods4x" />
                </div>
                <div className="text-left hidden lg:block" data-oid="dremade">
                  <p
                    className="text-sm font-bold text-gray-900"
                    data-oid="_p-:rah"
                  >
                    {t("lovingParent")}
                  </p>
                  <p
                    className="text-xs text-gray-600 font-medium"
                    data-oid="jfyd.4p"
                  >
                    {t("alwaysCaring")}
                  </p>
                </div>
              </button>
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 py-4 z-50"
                  data-oid="n7rebe:"
                >
                  <div
                    className="px-6 py-4 border-b border-gray-100"
                    data-oid="1c44boa"
                  >
                    <div
                      className="flex items-center space-x-4"
                      data-oid="-9okh5_"
                    >
                      <div
                        className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                        data-oid="3z3xx9a"
                      >
                        <User
                          className="w-8 h-8 text-white"
                          data-oid="k66clgd"
                        />
                      </div>
                      <div data-oid="10wb1d3">
                        <p
                          className="text-lg font-bold text-gray-900"
                          data-oid="q-q6v19"
                        >
                          {t("lovingParent")}
                        </p>
                        <p className="text-sm text-gray-600" data-oid="1:30js2">
                          parent@example.com
                        </p>
                        <p
                          className="text-xs text-green-600 font-semibold"
                          data-oid="x_.fkay"
                        >
                          {t("trustedGuardian")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-3" data-oid="n7xd:o5">
                    <button
                      onClick={() => {
                        onMenuClick();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 font-semibold"
                      data-oid="debebe4"
                    >
                      <User
                        className="w-5 h-5 text-blue-500"
                        data-oid="f1.q0v6"
                      />

                      <span data-oid="q2hwpqm">{t("profileSettings")}</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 font-semibold"
                      data-oid="tmi03wb"
                    >
                      <Settings
                        className="w-5 h-5 text-purple-500"
                        data-oid="2fe:hc_"
                      />

                      <span data-oid="eh.xjxd">{t("accountSettings")}</span>
                    </button>
                    <hr className="my-3 border-gray-200" data-oid="2.b_c02" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-200 font-semibold"
                      data-oid="qb4jrh0"
                    >
                      <LogOut className="w-5 h-5" data-oid="j3f6rl6" />
                      <span data-oid="kjq82bf">{t("signOut")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
            data-oid="vwffo_d"
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7" data-oid="im:qc85" />
            ) : (
              <Menu className="w-7 h-7" data-oid="6kdcoie" />
            )}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t-2 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 py-6 space-y-6 bg-white/60 backdrop-blur-xl rounded-b-3xl"
            data-oid="ew01tc7"
          >
            <div
              className="flex items-center space-x-4 px-6"
              data-oid=":.5uyu5"
            >
              <div
                className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                data-oid="xcbapu5"
              >
                <User className="w-8 h-8 text-white" data-oid="v6dqd:r" />
              </div>
              <div data-oid="3dcqw2p">
                <p
                  className="font-bold text-gray-900 text-lg"
                  data-oid="1djmv4s"
                >
                  {t("lovingParent")}
                </p>
                <p className="text-sm text-gray-600" data-oid="o1th6a9">
                  parent@example.com
                </p>
                <p
                  className="text-xs text-green-600 font-semibold"
                  data-oid="1wou0f-"
                >
                  {t("trustedGuardian")}
                </p>
              </div>
            </div>
            <div className="space-y-3 px-6" data-oid="z0719xf">
              <button
                className="w-full flex items-center space-x-4 py-4 text-left bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl px-4 font-semibold"
                data-oid="l-n:f18"
              >
                <Bell className="w-6 h-6 text-blue-500" data-oid="0-dq7py" />
                <span data-oid="9ox3s1x">{t("notifications")}</span>
                <span
                  className="ml-auto w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                  data-oid="rvochn9"
                >
                  3
                </span>
              </button>
              <div
                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-4 py-4"
                data-oid="we8791r"
              >
                <div
                  className="flex items-center space-x-3 mb-3"
                  data-oid="t--7f.f"
                >
                  <Globe
                    className="w-6 h-6 text-green-500"
                    data-oid="gk3t7zw"
                  />

                  <span className="font-semibold" data-oid="uulnpn1">
                    {t("language")}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2" data-oid="2148y5p">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        language === lang.code
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-green-100"
                      }`}
                      data-oid="_ypd1nq"
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
                data-oid="1g9.52v"
              >
                <User className="w-6 h-6 text-blue-500" data-oid="cwzm:hy" />
                <span data-oid="d51eqxm">{t("profileSettings")}</span>
              </button>
              <button
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-purple-50 to-pink-50 font-semibold text-left"
                data-oid="e8qhkpr"
              >
                <Settings
                  className="w-6 h-6 text-purple-500"
                  data-oid="hv:6hn2"
                />

                <span data-oid="dmd9-a7">{t("settings")}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 font-semibold text-left"
                data-oid="y3l-8b2"
              >
                <LogOut className="w-6 h-6" data-oid="uezcloa" />
                <span data-oid="dl6k61p">{t("signOut")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 animate-pulse"
        data-oid="hubcu7a"
      ></div>
    </header>
  );
};

export default Header;
