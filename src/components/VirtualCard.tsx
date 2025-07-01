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
    <div className="relative group perspective-1000" data-oid="2v_w85h">
      {/* bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 make it glow */}
      <div
        className="absolute inset-0   rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"
        data-oid="wr5x_.x"
      ></div>
      <div
        className="relative bg-blackp  dark:bg-brand rounded-3xl p-8 text-white shadow-2xl transform group-hover:scale-105 transition-all duration-500 overflow-hidden"
        data-oid="xr2.97e"
      >
        <div
          className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_25%_25%,_rgb(255,_255,_255)_2px,_rgba(0,_0,_0,_0)_2px),_radial-gradient(circle_at_75%_25%,_rgb(255,_255,_255)_2px,_rgba(0,_0,_0,_0)_2px),_radial-gradient(circle_at_25%_75%,_rgb(255,_255,_255)_2px,_rgba(0,_0,_0,_0)_2px),_radial-gradient(circle_at_75%_75%,_rgb(255,_255,_255)_2px,_rgba(0,_0,_0,_0)_2px)] bg-[rgb(0,_0,_0)]"
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
          data-oid="m3ez9sq"
        ></div>
        <div
          className="absolute top-4 left-4 right-4 h-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="keytl.c"
        ></div>
        <div
          className="absolute bottom-4 left-4 right-4 h-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="wgs7z:p"
        ></div>
        <div
          className="absolute top-4 bottom-4 left-4 w-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="-jt8aoc"
        ></div>
        <div
          className="absolute top-4 bottom-4 right-4 w-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="pmxt0wx"
        ></div>
        <div
          className="relative z-10 flex justify-between items-start mb-8"
          data-oid="k6.55-7"
        >
          <div className="space-y-2" data-oid="7cv68.d">
            <p
              className="text-white/90 text-sm font-bold tracking-wide uppercase"
              data-oid="emmfr9f"
            >
              {t("wallet")}
            </p>
            <div className="flex items-center space-x-3" data-oid="y58owta">
              <span
                className="text-3xl font-bold drop-shadow-lg"
                data-oid="ll4dd-y"
              >
                {isVisible ? formatCurrency(balance) : "••••••"}
              </span>
              <button
                onClick={onToggleVisibility}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
                data-oid="n7bufi_"
              >
                {isVisible ? (
                  <EyeOff className="w-5 h-5" data-oid="s1amkw0" />
                ) : (
                  <Eye className="w-5 h-5" data-oid="xgp2up1" />
                )}
              </button>
            </div>
          </div>
          <div
            className="w-16 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30"
            data-oid="3rm28w5"
          >
            <div
              className="w-8 h-8 bg-gradient-to-br from-white/80 to-white/60 rounded-lg flex items-center justify-center"
              data-oid="1xumy88"
            >
              <CreditCard
                className="w-5 h-5 text-[#000000]"
                data-oid="v_w9lmj"
              />
            </div>
          </div>
        </div>
        <div className="relative z-10 mb-8" data-oid="8mjai_f">
          <p
            className="text-2xl font-mono tracking-[0.2em] drop-shadow-lg font-bold"
            data-oid="7q6mayi"
          >
            •••• •••• •••• 1234
          </p>
        </div>
        <div
          className="relative z-10 flex justify-between items-end"
          data-oid=".g.ao0z"
        >
          <div data-oid="fta12c4">
            <p
              className="text-white/80 text-xs uppercase tracking-wider mb-1 font-semibold"
              data-oid="w.4-szi"
            >
              {t("cardHolder")}
            </p>
            <p className="font-bold text-lg drop-shadow-md" data-oid="c-r86me">
              {t("parentUser")}
            </p>
          </div>
          <div className="text-right" data-oid="ewm.cu.">
            <p
              className="text-white/80 text-xs uppercase tracking-wider mb-1 font-semibold"
              data-oid="uij9rta"
            >
              {t("secure")}
            </p>
            <p className="font-bold text-lg drop-shadow-md" data-oid="py61vrm">
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
          data-oid="3rr91sd"
        ></div>
        <div
          className="absolute bottom-8 left-8 w-20 h-20 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "6px 6px",
          }}
          data-oid="emy2k.h"
        ></div>
        <div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform rotate-12"
          data-oid="fww-epm"
        ></div>
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform -rotate-12"
          data-oid="em5b20d"
        ></div>
      </div>
    </div>
  );
};

export default VirtualCard;
