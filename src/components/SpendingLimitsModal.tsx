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
      data-oid="h6x:9_y"
    >
      <div
        className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 rounded-xl p-4 backdrop-blur-sm"
        data-oid="kriq_7h"
      >
        <div className="flex items-start space-x-3" data-oid="uw3efkl">
          <div className="p-2 bg-emerald-100 rounded-lg" data-oid=".b5ytny">
            <Info className="w-4 h-4 text-emerald-600" data-oid="tcgms9i" />
          </div>
          <div data-oid="zsxv6.w">
            <h4
              className="font-semibold text-emerald-800 mb-2"
              data-oid="g_9kyf_"
            >
              {title}
            </h4>
            <p
              className="text-sm text-emerald-700 leading-relaxed"
              data-oid="uh_5nwz"
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
      data-oid="w000sm8"
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-md max-h-[90vh] shadow-2xl border border-emerald-100/50 overflow-hidden"
        data-oid="3t.6z3h"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white/60 to-emerald-100/40"
          data-oid="dfhml_q"
        ></div>

        <div
          className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl"
          data-oid="4i56rh:"
        ></div>
        <div
          className="absolute bottom-0 left-0 w-24 h-24 bg-green-200/20 rounded-full blur-xl"
          data-oid="5lkdw3a"
        ></div>

        <div
          className="relative z-10 from-emerald-500 via-green-400 to-emerald-600 rounded-t-3xl p-6 text-white shadow-lg bg-[url(/images/EVn7.png)]"
          data-oid="noe60wr"
        >
          <div className="flex items-center justify-between" data-oid="ve:6xi9">
            <div data-oid="li26m9g">
              <h2
                className="text-xl font-bold drop-shadow-sm"
                data-oid="-.q6b-q"
              >
                {t("spendingLimits")}
              </h2>
              <p
                className="text-emerald-100 text-sm font-medium border border-[#ECF2EF]"
                data-oid=".0l0-3s"
              >
                {student?.student_name || "Student"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
              data-oid="5kgy0x7"
            >
              <X className="w-5 h-5" data-oid="nj7pqi9" />
            </button>
          </div>
        </div>

        <div
          className="relative z-10 max-h-[calc(90vh-200px)] overflow-y-auto"
          data-oid="erpzjm:"
        >
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
            data-oid="3e7p:ka"
          >
            <div className="space-y-4" data-oid="7wn_9kw">
              <div
                className="flex items-center justify-between"
                data-oid="jg_ktfx"
              >
                <div className="flex items-center space-x-2" data-oid="e53_40z">
                  <div
                    className="p-2 bg-emerald-100/80 rounded-xl backdrop-blur-sm"
                    data-oid="ovag3o3"
                  >
                    <DollarSign
                      className="w-5 h-5 text-[#000000]"
                      data-oid="d_iogtu"
                    />
                  </div>
                  <h3 className="font-bold text-[#000000]" data-oid="slqs_i_">
                    {t("spendingLimits")}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggleGuide("spending")}
                  className="p-2 hover:bg-emerald-100/50 rounded-lg transition-all duration-200"
                  data-oid="iyeefa0"
                >
                  <HelpCircle
                    className="w-4 h-4 text-emerald-600"
                    data-oid="4nz:.vg"
                  />
                </button>
              </div>

              <GuideCard
                title={t("howSpendingLimitsWork")}
                content={t("spendingLimitsGuide")}
                isVisible={showGuide.spending}
                data-oid="xmci0zn"
              />

              <div className="group" data-oid="7n6sbap">
                <label
                  className="block text-sm font-semibold mb-2 text-[#000000]"
                  data-oid="ckr5wj4"
                >
                  {t("dailyLimit")}{" "}
                  <span
                    className="font-normal text-[#000000]"
                    data-oid="-fzg03-"
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
                  data-oid="nhc_ko-"
                />
              </div>
            </div>
          </form>
        </div>

        <div
          className="relative z-10 p-6 border-t border-emerald-100/60 bg-gradient-to-r from-emerald-50/40 to-green-50/40"
          data-oid="eup_fru"
        >
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full from-emerald-500 to-green-400 text-white py-4 px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 bg-none bg-[#07010A]"
            data-oid="xddv8s3"
          >
            {isLoading ? (
              <div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                data-oid="fzw_9_1"
              ></div>
            ) : (
              <>
                <Save className="w-5 h-5" data-oid="p1a42oa" />
                <span data-oid="gyp1pfk">{t("saveChanges")}</span>
              </>
            )}
          </button>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none"
          data-oid="644e_-n"
        ></div>
      </div>
    </div>
  );
};

export default SpendingLimitsModal;
