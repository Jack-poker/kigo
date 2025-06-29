import React, { useState } from "react";
import { X, DollarSign, Save, Info, HelpCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const SpendingLimitsModal = ({ student, onClose, onSave, isLoading }) => {
  const { t } = useLanguage();

  const [limits, setLimits] = useState({
    dailyLimit: student?.spending_limit || "",
  });

  const [showGuide, setShowGuide] = useState({
    spending: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedLimits = {
      dailyLimit: limits.dailyLimit ? Number(limits.dailyLimit) : 0,
    };
    onSave(cleanedLimits);
  };

  const toggleGuide = (section) => {
    setShowGuide((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const GuideCard = ({ title, content, isVisible }) => (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isVisible ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"
      }`}
      data-oid="la:kxj-"
    >
      <div
        className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 rounded-xl p-4 backdrop-blur-sm"
        data-oid="alji9n:"
      >
        <div className="flex items-start space-x-3" data-oid="0bm7tqm">
          <div className="p-2 bg-emerald-100 rounded-lg" data-oid="alylcg1">
            <Info className="w-4 h-4 text-emerald-600" data-oid="td-s197" />
          </div>
          <div data-oid="r41jsc4">
            <h4
              className="font-semibold text-emerald-800 mb-2"
              data-oid="7h83q0."
            >
              {title}
            </h4>
            <p
              className="text-sm text-emerald-700 leading-relaxed"
              data-oid="7ta0-2z"
            >
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
      data-oid="w1zt4o6"
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-md max-h-[90vh] shadow-2xl border border-emerald-100/50 overflow-hidden"
        data-oid="qh6oo25"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white/60 to-emerald-100/40"
          data-oid="th:_j8y"
        ></div>

        <div
          className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl"
          data-oid="hy:puqr"
        ></div>
        <div
          className="absolute bottom-0 left-0 w-24 h-24 bg-green-200/20 rounded-full blur-xl"
          data-oid="r80yp:6"
        ></div>

        <div
          className="relative z-10 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 rounded-t-3xl p-6 text-white shadow-lg"
          data-oid="i4ku.ew"
        >
          <div className="flex items-center justify-between" data-oid="693-.-0">
            <div data-oid="-l0m2a8">
              <h2
                className="text-xl font-bold drop-shadow-sm"
                data-oid="gp16:wx"
              >
                {t("spendingLimits")}
              </h2>
              <p
                className="text-emerald-100 text-sm font-medium"
                data-oid="z90ktne"
              >
                {student?.student_name || "Student"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
              data-oid="g26br75"
            >
              <X className="w-5 h-5" data-oid="19bq:br" />
            </button>
          </div>
        </div>

        <div
          className="relative z-10 max-h-[calc(90vh-200px)] overflow-y-auto"
          data-oid="d:679:a"
        >
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
            data-oid=".-a5y26"
          >
            <div className="space-y-4" data-oid="zi3e0.z">
              <div
                className="flex items-center justify-between"
                data-oid="angr5eu"
              >
                <div className="flex items-center space-x-2" data-oid="efwq4z:">
                  <div
                    className="p-2 bg-emerald-100/80 rounded-xl backdrop-blur-sm"
                    data-oid="0.mpc8h"
                  >
                    <DollarSign
                      className="w-5 h-5 text-emerald-600"
                      data-oid="iaoex2b"
                    />
                  </div>
                  <h3 className="font-bold text-emerald-800" data-oid="0kjat:x">
                    {t("spendingLimits")}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggleGuide("spending")}
                  className="p-2 hover:bg-emerald-100/50 rounded-lg transition-all duration-200"
                  data-oid="bsp9vxh"
                >
                  <HelpCircle
                    className="w-4 h-4 text-emerald-600"
                    data-oid="o3v69oi"
                  />
                </button>
              </div>

              <GuideCard
                title={t("howSpendingLimitsWork")}
                content={t("spendingLimitsGuide")}
                isVisible={showGuide.spending}
                data-oid="lz440mv"
              />

              <div className="group" data-oid="fw31afp">
                <label
                  className="block text-sm font-semibold text-emerald-700 mb-2"
                  data-oid="jca8w10"
                >
                  {t("dailyLimit")}{" "}
                  <span
                    className="text-emerald-500 font-normal"
                    data-oid="67jh85-"
                  >
                    ({t("optional")})
                  </span>
                </label>
                <input
                  type="number"
                  value={limits.dailyLimit}
                  onChange={(e) =>
                    setLimits((prev) => ({
                      ...prev,
                      dailyLimit: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200/60 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 text-gray-700 group-hover:border-emerald-300"
                  placeholder={t("noDailyLimit")}
                  data-oid="lcd2ud5"
                />
              </div>
            </div>
          </form>
        </div>

        <div
          className="relative z-10 p-6 border-t border-emerald-100/60 bg-gradient-to-r from-emerald-50/40 to-green-50/40"
          data-oid="6myyszz"
        >
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-white py-4 px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            data-oid="ijlbiqi"
          >
            {isLoading ? (
              <div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                data-oid="qv8s-09"
              ></div>
            ) : (
              <>
                <Save className="w-5 h-5" data-oid=":g3xwve" />
                <span data-oid="qhok9jn">{t("saveChanges")}</span>
              </>
            )}
          </button>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none"
          data-oid="ipip0nv"
        ></div>
      </div>
    </div>
  );
};

export default SpendingLimitsModal;
