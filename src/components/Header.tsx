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
      data-oid="uw27jnu"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-yellow-100/30 via-green-100/30 to-blue-100/30 animate-pulse"
        data-oid="cigeod6"
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
        data-oid="4kz6c6r"
      ></div>
      <div className="container mx-auto px-6 relative z-10" data-oid="xsfp:rk">
        <div
          className="flex items-center justify-between h-20"
          data-oid="66osu.k"
        >
          <div className="flex items-center space-x-4" data-oid="1u9kh:l">
            <div
              className={`relative w-14 h-14 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 ${shimmerClass}`}
              data-oid="28v3b4w"
            >
              <span
                className="text-white font-black text-xl drop-shadow-lg"
                data-oid="5_9u:lz"
              >
                iW
              </span>
              <div
                className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse"
                data-oid="emena79"
              ></div>
            </div>
            <div className="hidden sm:block" data-oid="n2001sf">
              <h1
                className="text-2xl font-black bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg"
                data-oid="-jb-_ly"
              >
                {t("appName")}
              </h1>
              <div className="flex items-center space-x-2" data-oid=".3kba2v">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  data-oid="p-75i0j"
                ></div>
                <p
                  className="text-sm text-gray-600 font-bold"
                  data-oid="tgkufuu"
                >
                  {t("tagline")}
                </p>
              </div>
            </div>
          </div>
          <div
            className="hidden md:flex items-center space-x-6"
            data-oid="o178noa"
          >
            <div className="relative group" data-oid="9sir:10">
              <button
                className={`relative p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
                data-oid="lw_l2un"
              >
                <Bell className="w-6 h-6" data-oid="5p._rel" />
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center"
                  data-oid="03ztl78"
                >
                  <span
                    className="text-white text-xs font-bold"
                    data-oid="0_34d_:"
                  >
                    3
                  </span>
                </span>
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75"
                  data-oid="gb:fvgt"
                ></div>
              </button>
              <div
                className="absolute top-full right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                data-oid="f1qxm-9"
              >
                <div className="p-6" data-oid="r36h7z0">
                  <h3
                    className="font-bold text-gray-900 mb-4 text-lg"
                    data-oid="ypohoza"
                  >
                    {t("recentNotifications")}
                  </h3>
                  <div className="space-y-3" data-oid="qmh36bx">
                    <div
                      className="p-3 bg-green-50 rounded-xl border border-brand"
                      data-oid="vzmnw--"
                    >
                      <p
                        className="text-sm font-semibold text-green-800"
                        data-oid="oo4952:"
                      >
                        {t("alicePurchase")}
                      </p>
                      <p className="text-xs text-green-600" data-oid="myjtqm5">
                        {t("twoMinutesAgo")}
                      </p>
                    </div>
                    <div
                      className="p-3 bg-blue-50 rounded-xl border border-blue-200"
                      data-oid="58:qp5q"
                    >
                      <p
                        className="text-sm font-semibold text-blue-800"
                        data-oid="2g9s6kl"
                      >
                        {t("bobLimitReminder")}
                      </p>
                      <p className="text-xs text-blue-600" data-oid=".y-q_b0">
                        {t("oneHourAgo")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative" data-oid="z_osri4">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm font-bold border-2 border-gray-200 hover:border-blue-300 ${shimmerClass}`}
                data-oid="jrxqfjp"
              >
                <Globe className="w-5 h-5" data-oid="h03i5wk" />
                <span className="text-sm" data-oid="fm-.6cg">
                  {currentLanguage?.flag} {currentLanguage?.name}
                </span>
              </button>
              {isLanguageOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-100 py-3 z-50"
                  data-oid="9bqx:x0"
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
                      data-oid=".kp.q.d"
                    >
                      <span className="text-lg" data-oid="p-1me7x">
                        {lang.flag}
                      </span>
                      <span data-oid="1.uk:is">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" data-oid="ucnfwj7">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-2xl hover:bg-white/60 transition-all duration-300 backdrop-blur-sm ${shimmerClass}`}
                data-oid="-wiupm2"
              >
                <div
                  className="w-12 h-12 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                  data-oid="jjvy2l_"
                >
                  <User className="w-6 h-6 text-white" data-oid="_f8785w" />
                </div>
                <div className="text-left hidden lg:block" data-oid="4lzz8l.">
                  <p
                    className="text-sm font-bold text-gray-900"
                    data-oid="qvuf-bo"
                  >
                    {t("lovingParent")}
                  </p>
                  <p
                    className="text-xs text-gray-600 font-medium"
                    data-oid="zcb85e6"
                  >
                    {t("alwaysCaring")}
                  </p>
                </div>
              </button>
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-100 py-4 z-50"
                  data-oid="n77gn4w"
                >
                  <div
                    className="px-6 py-4 border-b border-gray-100"
                    data-oid="m2-bh9n"
                  >
                    <div
                      className="flex items-center space-x-4"
                      data-oid="m4adsff"
                    >
                      <div
                        className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                        data-oid="-h7eue4"
                      >
                        <User
                          className="w-8 h-8 text-white"
                          data-oid="x4m012_"
                        />
                      </div>
                      <div data-oid="v2ucc6a">
                        <p
                          className="text-lg font-bold text-gray-900"
                          data-oid="42ct4dc"
                        >
                          {t("lovingParent")}
                        </p>
                        <p className="text-sm text-gray-600" data-oid="g.5d0ug">
                          parent@example.com
                        </p>
                        <p
                          className="text-xs text-green-600 font-semibold"
                          data-oid="chec1hi"
                        >
                          {t("trustedGuardian")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-3" data-oid="_mc_rg-">
                    <button
                      onClick={() => {
                        onMenuClick();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 font-semibold"
                      data-oid="_a9a1qy"
                    >
                      <User
                        className="w-5 h-5 text-blue-500"
                        data-oid="z7:nigm"
                      />

                      <span data-oid="hiwkkpg">{t("profileSettings")}</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 font-semibold"
                      data-oid="w4lkf6f"
                    >
                      <Settings
                        className="w-5 h-5 text-purple-500"
                        data-oid="egqnlbu"
                      />

                      <span data-oid="qekybvg">{t("accountSettings")}</span>
                    </button>
                    <hr className="my-3 border-gray-200" data-oid="qq6.._3" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-4 px-6 py-3 text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-200 font-semibold"
                      data-oid="evl8non"
                    >
                      <LogOut className="w-5 h-5" data-oid="tq84q:t" />
                      <span data-oid="i9u60il">{t("signOut")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-4 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-2xl hover:bg-white/60 backdrop-blur-sm ${shimmerClass}`}
            data-oid="wn3zhef"
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7" data-oid="ubmadvl" />
            ) : (
              <Menu className="w-7 h-7" data-oid="7ro3k_m" />
            )}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t-2 border-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 py-6 space-y-6 bg-white/60 backdrop-blur-xl rounded-b-3xl"
            data-oid="yqron4d"
          >
            <div
              className="flex items-center space-x-4 px-6"
              data-oid="d50u1:1"
            >
              <div
                className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                data-oid="5hr-u2e"
              >
                <User className="w-8 h-8 text-white" data-oid="gfrfjhh" />
              </div>
              <div data-oid="y9284lv">
                <p
                  className="font-bold text-gray-900 text-lg"
                  data-oid="k8b:5j6"
                >
                  {t("lovingParent")}
                </p>
                <p className="text-sm text-gray-600" data-oid="91sr68d">
                  parent@example.com
                </p>
                <p
                  className="text-xs text-green-600 font-semibold"
                  data-oid="jhpcq90"
                >
                  {t("trustedGuardian")}
                </p>
              </div>
            </div>
            <div className="space-y-3 px-6" data-oid="zdlap7v">
              <button
                className="w-full flex items-center space-x-4 py-4 text-left bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl px-4 font-semibold"
                data-oid="k3rq10f"
              >
                <Bell className="w-6 h-6 text-blue-500" data-oid="pp65raz" />
                <span data-oid="2:9-o7k">{t("notifications")}</span>
                <span
                  className="ml-auto w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                  data-oid=".gjiv21"
                >
                  3
                </span>
              </button>
              <div
                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-4 py-4"
                data-oid="mmp-_pm"
              >
                <div
                  className="flex items-center space-x-3 mb-3"
                  data-oid="hnf1kf."
                >
                  <Globe
                    className="w-6 h-6 text-green-500"
                    data-oid="_ecjsgr"
                  />

                  <span className="font-semibold" data-oid="lo7p2py">
                    {t("language")}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2" data-oid="84hcwlh">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        language === lang.code
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-green-100"
                      }`}
                      data-oid="zpr:wly"
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
                data-oid="fnxjj2."
              >
                <User className="w-6 h-6 text-blue-500" data-oid="1f4y_er" />
                <span data-oid="cfrfbrk">{t("profileSettings")}</span>
              </button>
              <button
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-purple-50 to-pink-50 font-semibold text-left"
                data-oid="dw_7ku2"
              >
                <Settings
                  className="w-6 h-6 text-purple-500"
                  data-oid="ovj5672"
                />

                <span data-oid="tw0sjpp">{t("settings")}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full space-x-4 py-4 rounded-xl px-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 font-semibold text-left"
                data-oid="6ckulol"
              >
                <LogOut className="w-6 h-6" data-oid="0h6ej9r" />
                <span data-oid=".mgwha4">{t("signOut")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 animate-pulse"
        data-oid="2b_7_y1"
      ></div>
    </header>
  );
};

export default Header;
