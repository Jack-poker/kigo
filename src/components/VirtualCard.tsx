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
    <div className="relative group perspective-1000" data-oid="zh:-2u3">
      {/* bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 make it glow */}
      <div
        className="absolute inset-0   rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"
        data-oid="tet5x1o"
      ></div>
      <div
        className="relative   dark:bg-b rounded-3xl p-8 text-white shadow-2xl transform group-hover:scale-105 transition-all duration-500 overflow-hidden"
        data-oid="_fvrhoq"
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
          data-oid="sspscg9"
        ></div>
        <div
          className="absolute top-4 left-4 right-4 h-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="fzi7dp-"
        ></div>
        <div
          className="absolute bottom-4 left-4 right-4 h-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="ub16u7q"
        ></div>
        <div
          className="absolute top-4 bottom-4 left-4 w-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="w7o:-_m"
        ></div>
        <div
          className="absolute top-4 bottom-4 right-4 w-0.5 bg-white/30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 8px, white 8px, white 12px)",
          }}
          data-oid="77w7ht."
        ></div>
        <div
          className="relative z-10 flex justify-between items-start mb-8"
          data-oid="l:p.fbp"
        >
          <div className="space-y-2" data-oid="eqjmpdo">
            <p
              className="text-white/90 text-sm font-bold tracking-wide uppercase"
              data-oid="1dld.tr"
            >
              {t("wallet")}
            </p>
            <div className="flex items-center space-x-3" data-oid="-noovis">
              <span
                className="text-3xl font-bold drop-shadow-lg"
                data-oid="6diek3."
              >
                {isVisible ? formatCurrency(balance) : "••••••"}
              </span>
              <button
                onClick={onToggleVisibility}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
                data-oid="pmuq8t6"
              >
                {isVisible ? (
                  <EyeOff className="w-5 h-5" data-oid="2t.nimp" />
                ) : (
                  <Eye className="w-5 h-5" data-oid="lw84awo" />
                )}
              </button>
            </div>
          </div>
          <div
            className="w-16 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30"
            data-oid="87_:g5d"
          >
            <div
              className="w-8 h-8 bg-gradient-to-br from-white/80 to-white/60 rounded-lg flex items-center justify-center"
              data-oid="5lk.giq"
            >
              <CreditCard
                className="w-5 h-5 text-brand"
                data-oid="t0u0nj:"
              />
            </div>
          </div>
        </div>
        <div className="relative z-10 mb-8" data-oid="iqos48.">
          <p
            className="text-2xl font-mono tracking-[0.2em] drop-shadow-lg font-bold"
            data-oid="dnfaoal"
          >
            •••• •••• •••• 1234
          </p>
        </div>
        <div
          className="relative z-10 flex justify-between items-end"
          data-oid="xd2r97s"
        >
          <div data-oid="5luo0ov">
            <p
              className="text-white/80 text-xs uppercase tracking-wider mb-1 font-semibold"
              data-oid="vc:xkx:"
            >
              {t("cardHolder")}
            </p>
            <p className="font-bold text-lg drop-shadow-md" data-oid="av0z-mc">
              {t("parentUser")}
            </p>
          </div>
          <div className="text-right" data-oid="w_o3v.y">
            <p
              className="text-white/80 text-xs uppercase tracking-wider mb-1 font-semibold"
              data-oid="gmpbkhr"
            >
              {t("secure")}
            </p>
            <p className="font-bold text-lg drop-shadow-md" data-oid="36255oj">
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
          data-oid="layclwy"
        ></div>
        <div
          className="absolute bottom-8 left-8 w-20 h-20 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "6px 6px",
          }}
          data-oid="ju70:n_"
        ></div>
        <div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform rotate-12"
          data-oid="k_07zjb"
        ></div>
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform -rotate-12"
          data-oid="xs34g08"
        ></div>
      </div>
    </div>
  );
};

export default VirtualCard;
