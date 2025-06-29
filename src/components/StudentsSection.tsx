import React from "react";
import { Users, Activity, Settings } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  class: string;
  photo: string;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  todaySpent: number;
  allowedDays: string[];
  allowedHours: { from: string; to: string };
}

interface LinkedStudentsProps {
  students: Student[];
  onViewTransactions: (student: Student) => void;
  onSetLimits: (student: Student) => void;
}

const LinkedStudents: React.FC<LinkedStudentsProps> = ({
  students,
  onViewTransactions,
  onSetLimits,
}) => {
  const { t } = useLanguage();

  const formatCurrency = (amount: number | undefined): string => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount ?? 0);
  };

  const formatLimitDisplay = (
    spent: number | undefined,
    limit: number | undefined,
  ): string => {
    const spentFormatted = formatCurrency(spent);
    const limitFormatted = formatCurrency(limit);
    return `${spentFormatted} / ${limitFormatted}`;
  };

  return (
    <div className="space-y-6" data-oid="982ulnp">
      <div className="flex items-center justify-between" data-oid="ufmwwse">
        <div className="flex items-center space-x-3" data-oid="_2k5vw2">
          <div
            className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl"
            data-oid="o.xni3e"
          >
            <Users
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              data-oid="benlcea"
            />
          </div>
          <h2
            className="text-white-950 dark:text-white text-2xl font-semibold"
            data-oid="99iw4e0"
          >
            {t("linkedStudents")}
          </h2>
        </div>
        <button
          onClick={() => onSetLimits({} as Student)} // Trigger link student modal in parent
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium"
          data-oid="213y.-n"
        >
          <Users className="w-5 h-5" data-oid=":pdng7t" />
          <span data-oid="uy.6e1d">{t("linkStudent")}</span>
        </button>
      </div>

      {students.length === 0 ? (
        <div
          className="bg-white dark:bg-white-950 border border-brand dark:border-green-700 rounded-xl p-8 text-center"
          data-oid="bgp.dl-"
        >
          <div
            className="flex flex-col items-center justify-center text-center text-sm text-emerald-600 dark:text-emerald-200"
            data-oid="5-v7nmj"
          >
            <div className="w-82 h-82 mx-auto mb-2" data-oid="2swzu:5">
              <img
                src="/assets/kids wearing masks at school-bro.svg"
                alt={t("noStudentsLinked")}
                className="w-full h-full object-contain"
                draggable={false}
                data-oid="mk31g1p"
              />
            </div>
            <p className="text-lg font-medium mb-1" data-oid="thr:-ul">
              {t("noStudentsLinked")}
            </p>
            {/* <p className="text-gray-400 dark:text-gray-500 text-sm">{t('linkStudentPrompt')}</p> */}
          </div>
          <p
            className="text-gray-400 dark:text-gray-500 text-sm mt-2"
            data-oid="o:h2x:j"
          >
            {t("linkStudentPrompt")}
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-oid="916j6-d"
        >
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white dark:bg-white-950 border border-brand dark:border-green-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              data-oid="tr5-da6"
            >
              <div
                className="flex items-center space-x-4 mb-4"
                data-oid="g34ylmi"
              >
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-300 dark:border-green-600"
                  data-oid="cowg6ei"
                />

                <div data-oid="5yatieq">
                  <h3
                    className="text-white-950 dark:text-white font-semibold text-lg"
                    data-oid="ppt_905"
                  >
                    {student.name}
                  </h3>
                  <p
                    className="text-green-500 dark:text-green-400 text-sm"
                    data-oid="n1p25.o"
                  >
                    {student.studentId}
                  </p>
                </div>
              </div>
              <div className="space-y-3" data-oid="yh01v0u">
                <div
                  className="flex justify-between items-center"
                  data-oid="9-v:_dj"
                >
                  <span
                    className="text-gray-500 dark:text-gray-400 text-sm"
                    data-oid="0u4:c::"
                  >
                    {t("grade")}
                  </span>
                  <span
                    className="text-white-950 dark:text-white font-medium"
                    data-oid="su4.m26"
                  >
                    {student.grade || t("notSpecified")}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center"
                  data-oid="dsybjld"
                >
                  <span
                    className="text-gray-500 dark:text-gray-400 text-sm"
                    data-oid="81u:7z3"
                  >
                    {t("class")}
                  </span>
                  <span
                    className="text-white-950 dark:text-white font-medium"
                    data-oid="0tpk.97"
                  >
                    {student.class || t("notSpecified")}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center"
                  data-oid="ad5m-a9"
                >
                  <span
                    className="text-gray-500 dark:text-gray-400 text-sm"
                    data-oid="a5dx1-a"
                  >
                    {t("todaySpent")}
                  </span>
                  <span
                    className="text-white-950 dark:text-white font-medium"
                    data-oid="j7q4z55"
                  >
                    {formatLimitDisplay(student.todaySpent, student.dailyLimit)}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex space-x-3" data-oid="no64ibt">
                <button
                  onClick={() => onViewTransactions(student)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 py-3 rounded-xl hover:bg-green-100 dark:hover:bg-green-800/30 transition-all duration-200 font-medium"
                  data-oid="4-ipmwg"
                >
                  <Activity className="w-5 h-5" data-oid="sm6o58:" />
                  <span data-oid="axttikh">{t("transactions")}</span>
                </button>
                <button
                  onClick={() => onSetLimits(student)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-all duration-200 font-medium"
                  data-oid="a:9e4qw"
                >
                  <Settings className="w-5 h-5" data-oid="dxn4n4k" />
                  <span data-oid="oeenkch">{t("setLimits")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkedStudents;
