import React from "react";
import { Eye, EyeOff, CreditCard } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const VirtualCard = ({ balance, isVisible, onToggleVisibility }) => {
  const { t } = useLanguage();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative group perspective-1000" data-oid="hk.g3v7">
      {/* bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 make it glow */}
      <div
        className="absolute inset-0   rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"
        data-oid="othc:a8"
      ></div>
      <div
        className="relative bg-brand  dark:bg-gradient-to-br from-emerald-700 via-green-500 to-emerald-900  rounded-3xl p-8 text-white shadow-2xl transform group-hover:scale-105 transition-all duration-500 overflow-hidden"
        data-oid="3opba38"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, white 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, white 2px, transparent 2px)
          `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 0, 0 0, 0 0",
          }}
          data-oid="v0nxah8"
        ></div>
        <div
          className="absolute top-4 left-4 right-4 h-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="1d486cd"
        ></div>
        <div
          className="absolute bottom-4 left-4 right-4 h-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="t_5lbjw"
        ></div>
        <div
          className="absolute top-4 bottom-4 left-4 w-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid=".5k:5ky"
        ></div>
        <div
          className="absolute top-4 bottom-4 right-4 w-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="yq1:8wm"
        ></div>
        <div
          className="relative z-10 flex justify-between items-start mb-8"
          data-oid="uzwqau."
        >
          <div className="space-y-2" data-oid="g2j-.17">
            <p
              className="text-white/90 text-sm font-bold tracking-wide uppercase"
              data-oid="98s.y7."
            >
              {t("wallet")}
            </p>
            <div className="flex items-center space-x-3" data-oid="5xdz4x5">
              <span
                className="text-3xl font-bold drop-shadow-lg"
                data-oid="i.gp6ef"
              >
                {isVisible ? formatCurrency(balance) : "••••••"}
              </span>
              <button
                onClick={onToggleVisibility}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
                data-oid="8:79-57"
              >
                {isVisible ? (
                  <EyeOff className="w-5 h-5" data-oid="51t24ay" />
                ) : (
                  <Eye className="w-5 h-5" data-oid="1m1rt2j" />
                )}
              </button>
            </div>
          </div>
          <div
            className="w-16 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30"
            data-oid="clo-c.s"
          >
            <div
              className="w-8 h-8 bg-gradient-to-br from-white/80 to-white/60 rounded-lg flex items-center justify-center"
              data-oid="4rjtrug"
            >
              <CreditCard
                className="w-5 h-5 text-emerald-700"
                data-oid="rmxh5l3"
              />
            </div>
          </div>
        </div>
        <div className="relative z-10 mb-8" data-oid="prxjxdn">
          <p
            className="text-2xl font-mono tracking-[0.2em] drop-shadow-lg font-bold"
            data-oid="98c6:62"
          >
            •••• •••• •••• 1234
          </p>
        </div>
        <div
          className="relative z-10 flex justify-between items-end"
          data-oid="tbc91dk"
        >
          <div data-oid="_:9g7v7">
            <p
              className="text-white/80 text-xs uppercase tracking-wider mb-1 font-semibold"
              data-oid="k3fyvcd"
            >
              {t("cardHolder")}
            </p>
            <p className="font-bold text-lg drop-shadow-md" data-oid="q4ee_rz">
              {t("parentUser")}
            </p>
          </div>
          <div className="text-right" data-oid="icz.mld">
            <p
              className="text-white/80 text-xs uppercase tracking-wider mb-1 font-semibold"
              data-oid="n3pvbrc"
            >
              {t("secure")}
            </p>
            <p className="font-bold text-lg drop-shadow-md" data-oid="ovfz5uv">
              {t("wallet")}
            </p>
          </div>
        </div>
        <div
          className="absolute top-8 right-8 w-24 h-24 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
          data-oid="hn9sz0b"
        ></div>
        <div
          className="absolute bottom-8 left-8 w-20 h-20 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "6px 6px",
          }}
          data-oid="3:0z062"
        ></div>
        <div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform rotate-12"
          data-oid="6kc00k0"
        ></div>
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform -rotate-12"
          data-oid="49._20g"
        ></div>
      </div>
    </div>
  );
};

export default VirtualCard;
