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
      data-oid="99-_uf7"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-yellow-100/30 via-green-100/30 to-blue-100/30 animate-pulse"
        data-oid="qrmc4q1"
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
        data-oid="9ic87kj"
      ></div>
      <div className="container mx-auto px-6 relative z-10" data-oid="8n_tl:i">
        <div
          className="flex items-center justify-between h-20"
          data-oid="b9dm-zt"
        >
          <div className="flex items-center space-x-4" data-oid="rmuu-oo">
            <div
              className={`relative w-14 h-14 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 ${shimmerClass}`}
              data-oid="mg6h4_k"
            >
              <span
                className="text-white font-black text-xl drop-shadow-lg"
                data-oid="imjxt_k"
              >
                iW
              </span>
              <div
                className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse"
                data-oid="rk25893"
              ></div>
            </div>
            <div className="hidden sm:block" data-oid="29fwutu">
              <h1
                className="text-2xl font-black bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg"
                data-oid="rce7b1w"
              >
                {t("appName")}
              </h1>
              <div className="flex items-center space-x-2" data-oid="vfri:pc">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  data-oid="fenwul0"
                ></div>
                <p
                  className="text-sm text-gray-600 font-bold"
                  data-oid="abjk3:t"
                >
                  {t("tagline")}
                </p>
              </div>
            </div>
          </div>
          <div
            className="hidden md:flex items-center space-x-6"
            data-oid="6.nw_yq"
          >
            <div className="relative group" data-oid="vm0fho:">
              <button
                className={`relative p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
                data-oid="h0jojnd"
              >
                <Bell className="w-6 h-6" data-oid="33b5xka" />
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center"
                  data-oid="_x.elra"
                >
                  <span
                    className="text-white text-xs font-bold"
                    data-oid="hmexxz:"
                  >
                    3
                  </span>
                </span>
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75"
                  data-oid="65b-2uc"
                ></div>
              </button>
              <div
                className="absolute top-full right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                data-oid="y8k2axs"
              >
                <div className="p-6" data-oid="5v088hg">
                  <h3
                    className="font-bold text-gray-900 mb-4 text-lg"
                    data-oid="llv_sw-"
                  >
                    {t("recentNotifications")}
                  </h3>
                  <div className="space-y-3" data-oid="nt3pqi1">
                    <div
                      className="p-3 bg-green-50 rounded-xl border border-brand"
                      data-oid="o81guh4"
                    >
                      <p
                        className="text-sm font-semibold text-green-800"
                        data-oid="j-j.59k"
                      >
                        {t("alicePurchase")}
                      </p>
                      <p className="text-xs text-green-600" data-oid="s9e6.0z">
                        {t("twoMinutesAgo")}
                      </p>
                    </div>
                    <div
                      className="p-3 bg-blue-50 rounded-xl border border-blue-200"
                      data-oid="x5ob-4n"
                    >
                      <p
                        className="text-sm font-semibold text-blue-800"
                        data-oid="ov77a9q"
                      >
                        {t("bobLimitReminder")}
                      </p>
                      <p className="text-xs text-blue-600" data-oid="o5gvr6s">
                        {t("oneHourAgo")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative" data-oid="rz63dci">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm font-bold border-2 border-gray-200 hover:border-blue-300 ${shimmerClass}`}
                data-oid="0:dyquk"
              >
                <Globe className="w-5 h-5" data-oid="vw_017:" />
                <span className="text-sm" data-oid="l5qfyfb">
                  {currentLanguage?.flag} {currentLanguage?.name}
                </span>
              </button>
              {isLanguageOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-100 py-3 z-50"
                  data-oid="iksxn0r"
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
                      data-oid="vjrjyt4"
                    >
                      <span className="text-lg" data-oid="hqjku7h">
                        {lang.flag}
                      </span>
                      <span data-oid="50jgx1f">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" data-oid="ezd20p9">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-2xl hover:bg-white/60 transition-all duration-300 backdrop-blur-sm ${shimmerClass}`}
                data-oid="7_ie_dj"
              >
                <div
                  className="w-12 h-12 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                  data-oid="ufvc3gj"
                >
                  <User className="w-6 h-6 text-white" data-oid="6:m0vq5" />
                </div>
                <div className="text-left hidden lg:block" data-oid="::p.wi1">
                  <p
                    className="text-sm font-bold text-gray-900"
                    data-oid="gd78an8"
                  >
                    {t("lovingParent")}
                  </p>
                  <p
                    className="text-xs text-gray-600 font-medium"
                    data-oid="8aet3ky"
                  >
                    {t("alwaysCaring")}
                  </p>
                </div>
              </button>
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 py-4 z-50"
                  data-oid="-.kcku3"
                >
                  <div
                    className="px-6 py-4 border-b border-gray-100"
                    data-oid="gz0p46m"
                  >
                    <div
                      className="flex items-center space-x-4"
                      data-oid="ok9si5v"
                    >
                      <div
                        className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                        data-oid="5ehfp00"
                      >
                        <User
                          className="w-8 h-8 text-white"
                          data-oid="y.zv.w1"
                        />
                      </div>
                      <div data-oid="jqa2xe-">
                        <p
                          className="text-lg font-bold text-gray-900"
                          data-oid="xte51mi"
                        >
                          {t("lovingParent")}
                        </p>
                        <p className="text-sm text-gray-600" data-oid="r8:xouo">
                          parent@example.com
                        </p>
                        <p
                          className="text-xs text-green-600 font-semibold"
                          data-oid="h53wxl3"
                        >
                          {t("trustedGuardian")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-3" data-oid="1j0u6gf">
                    <button
                      onClick={() => {
                        onMenuClick();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 font-semibold"
                      data-oid="cmnl4lb"
                    >
                      <User
                        className="w-5 h-5 text-blue-500"
                        data-oid="4_s_tiw"
                      />

                      <span data-oid="4l6fo8b">{t("profileSettings")}</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 font-semibold"
                      data-oid="-redld:"
                    >
                      <Settings
                        className="w-5 h-5 text-purple-500"
                        data-oid="nfdqa2l"
                      />

                      <span data-oid="d6vo9:1">{t("accountSettings")}</span>
                    </button>
                    <hr className="my-3 border-gray-200" data-oid="y7.e9i." />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-200 font-semibold"
                      data-oid="9_5bxru"
                    >
                      <LogOut className="w-5 h-5" data-oid="rg..l6q" />
                      <span data-oid="_44sm1t">{t("signOut")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
            data-oid="4th6mp9"
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7" data-oid="xn2ucxa" />
            ) : (
              <Menu className="w-7 h-7" data-oid="6ghvwtj" />
            )}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t-2 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 py-6 space-y-6 bg-white/60 backdrop-blur-xl rounded-b-3xl"
            data-oid="tc1z0qn"
          >
            <div
              className="flex items-center space-x-4 px-6"
              data-oid="347921k"
            >
              <div
                className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                data-oid="akb.tlp"
              >
                <User className="w-8 h-8 text-white" data-oid="sfu_9vs" />
              </div>
              <div data-oid="yizz50a">
                <p
                  className="font-bold text-gray-900 text-lg"
                  data-oid="2j8zpdb"
                >
                  {t("lovingParent")}
                </p>
                <p className="text-sm text-gray-600" data-oid="r049y4o">
                  parent@example.com
                </p>
                <p
                  className="text-xs text-green-600 font-semibold"
                  data-oid="rh8ltke"
                >
                  {t("trustedGuardian")}
                </p>
              </div>
            </div>
            <div className="space-y-3 px-6" data-oid="4wzdvea">
              <button
                className="w-full flex items-center space-x-4 py-4 text-left bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl px-4 font-semibold"
                data-oid="efv3wcz"
              >
                <Bell className="w-6 h-6 text-blue-500" data-oid="dap2hef" />
                <span data-oid="y_y0kk2">{t("notifications")}</span>
                <span
                  className="ml-auto w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                  data-oid="32k:eix"
                >
                  3
                </span>
              </button>
              <div
                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-4 py-4"
                data-oid="w9zyx7e"
              >
                <div
                  className="flex items-center space-x-3 mb-3"
                  data-oid="oz5y.9_"
                >
                  <Globe
                    className="w-6 h-6 text-green-500"
                    data-oid="p6uh5-8"
                  />

                  <span className="font-semibold" data-oid="g8ppx66">
                    {t("language")}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2" data-oid="pbutsgl">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        language === lang.code
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-green-100"
                      }`}
                      data-oid="jatudn6"
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
                data-oid="t:x:gnc"
              >
                <User className="w-6 h-6 text-blue-500" data-oid="rft:g7r" />
                <span data-oid="-7rxvc1">{t("profileSettings")}</span>
              </button>
              <button
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-purple-50 to-pink-50 font-semibold text-left"
                data-oid="3r4qwar"
              >
                <Settings
                  className="w-6 h-6 text-purple-500"
                  data-oid="qi1n3d0"
                />

                <span data-oid="uvwpzn3">{t("settings")}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 font-semibold text-left"
                data-oid="vdvstgw"
              >
                <LogOut className="w-6 h-6" data-oid="46pzo7-" />
                <span data-oid="nj-epm9">{t("signOut")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 animate-pulse"
        data-oid="cij___c"
      ></div>
    </header>
  );
};

export default Header;
