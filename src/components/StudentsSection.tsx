import React, { useState } from "react";
import {
  Users,
  Activity,
  Settings,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
} from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  // Get unique schools from students
  const schools = [
    ...new Set(
      students.map(
        (student) => student.class?.split(" ")[0] || "Unknown School",
      ),
    ),
  ];

  // Filter students based on search and school
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool =
      !selectedSchool || student.class?.includes(selectedSchool);
    return matchesSearch && matchesSchool;
  });

  // Mock recent transactions for preview
  const getRecentTransactions = (studentId: string) => [
    {
      id: 1,
      title: "School Lunch",
      amount: -1500,
      time: "2 hours ago",
      status: "completed",
      location: "School Cafeteria",
    },
    {
      id: 2,
      title: "Stationery Purchase",
      amount: -2500,
      time: "1 day ago",
      status: "completed",
      location: "School Store",
    },
    {
      id: 3,
      title: "Transport Fee",
      amount: -1000,
      time: "2 days ago",
      status: "pending",
      location: "School Gate",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle className="w-4 h-4 text-[#EAB400]" data-oid="dth5xfe" />
        );

      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" data-oid="q6ifa_k" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" data-oid="_zya.f3" />;
      default:
        return (
          <AlertCircle className="w-4 h-4 text-gray-500" data-oid="jdx8zc." />
        );
    }
  };

  const getSpendingPercentage = (spent: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const getSpendingColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6" data-oid="9jelfmz">
      <div className="flex flex-col space-y-6" data-oid="1gj8.az">
        <div className="flex items-center justify-between" data-oid="qc4if_0">
          <div className="flex items-center space-x-3" data-oid="i-nks:o">
            <div
              className="p-3 from-blue-500 to-purple-600 rounded-xl shadow-lg bg-none bg-[#2F0763]"
              data-oid="89goeiv"
            >
              <Users className="w-6 h-6 text-white" data-oid="50zm.95" />
            </div>
            <div data-oid="8r8-:75">
              <h2
                className="dark:text-white text-2xl font-bold bg-[#F9F1F100] text-[#F8F1F1]"
                data-oid="b.3oj6_"
              >
                {t("linkedStudents")}
              </h2>
              <p
                className="dark:text-gray-400 text-sm bg-[#11000000] text-[#000000FE]"
                data-oid="odq3f94"
              >
                Manage your children's accounts
              </p>
            </div>
          </div>
          <button
            onClick={() => onSetLimits({} as Student)}
            className="flex items-center space-x-2 from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 bg-none bg-brand"
            data-oid="0r:4zrc"
          >
            <Users className="w-5 h-5" data-oid="z46me8-" />
            <span data-oid="f0qn12i">{t("linkStudent")}</span>
          </button>
        </div>

        {/* Search and Filter Section */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          data-oid="2dg8264"
        >
          <div className="flex flex-col md:flex-row gap-4" data-oid="4:38hbj">
            <div className="flex-1 relative" data-oid="av:j:kc">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                data-oid="l-0lb8z"
              />

              <input
                type="text"
                placeholder="Search students by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                data-oid="xp9md_3"
              />
            </div>
            <div className="flex gap-3" data-oid="qanrtvz">
              <div className="relative" data-oid=":zs5a2l">
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-8 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  data-oid="0b5xy-t"
                >
                  <option value="" data-oid="m2m27q4">
                    All Schools
                  </option>
                  {schools.map((school) => (
                    <option key={school} value={school} data-oid="1wlez_o">
                      {school}
                    </option>
                  ))}
                </select>
                <Filter
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
                  data-oid="cj59oje"
                />
              </div>
            </div>
          </div>
          {(searchTerm || selectedSchool) && (
            <div
              className="mt-4 flex items-center justify-between"
              data-oid="2rqe0p9"
            >
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="_alem_d"
              >
                Showing {filteredStudents.length} of {students.length} students
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSchool("");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                data-oid="z0bim1k"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center shadow-sm"
          data-oid="h85kc1z"
        >
          <div
            className="flex flex-col items-center justify-center text-center"
            data-oid="okm2qp7"
          >
            <div className="w-64 h-64 mx-auto mb-6" data-oid="xrzkru5">
              <img
                src="/assets/kids wearing masks at school-bro.svg"
                alt={t("noStudentsLinked")}
                className="w-full h-full object-contain opacity-80"
                draggable={false}
                data-oid="oq8pbvz"
              />
            </div>
            <h3
              className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
              data-oid="066gyqb"
            >
              {students.length === 0
                ? t("noStudentsLinked")
                : "No students match your search"}
            </h3>
            <p
              className="text-gray-500 dark:text-gray-400 text-sm max-w-md"
              data-oid="p-ha38g"
            >
              {students.length === 0
                ? t("linkStudentPrompt")
                : "Try adjusting your search terms or filters"}
            </p>
          </div>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          data-oid="tqr8m4c"
        >
          {filteredStudents.map((student) => {
            const spendingPercentage = getSpendingPercentage(
              student.todaySpent,
              student.dailyLimit,
            );
            const recentTransactions = getRecentTransactions(student.id);

            return (
              <div
                key={student.id}
                className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-[#00000000] bg-[url(/images/o9tA.png)]"
                data-oid="_r_f.zl"
              >
                {/* Student Header */}
                <div
                  className="flex items-center space-x-4 mb-6"
                  data-oid="-58-z_e"
                >
                  <div className="relative" data-oid="_cc0xn6">
                    {student.photo &&
                    student.photo !== "/api/placeholder/48/48" ? (
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-16 h-16 rounded-full object-cover border-3 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                        data-oid="819vd4h"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full from-blue-500 to-purple-600 flex items-center justify-center shadow-lg bg-none bg-brand"
                        data-oid="7iskn5_"
                      >
                        <User
                          className="w-8 h-8 text-white"
                          data-oid="d8v0yhn"
                        />
                      </div>
                    )}
                    <div
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center"
                      data-oid="..x46z7"
                    >
                      <CheckCircle
                        className="w-3 h-3 text-white"
                        data-oid="j.99jtz"
                      />
                    </div>
                  </div>
                  <div className="flex-1" data-oid="r460uf7">
                    <h3
                      className="text-gray-900 dark:text-white font-bold text-lg"
                      data-oid="n4o6587"
                    >
                      {student.name}
                    </h3>
                    <p
                      className="dark:text-blue-400 text-sm font-medium text-[#2C095E]"
                      data-oid="esluo88"
                    >
                      ID: {student.studentId}
                    </p>
                    <p
                      className="text-gray-500 dark:text-gray-400 text-xs"
                      data-oid="7zryia3"
                    >
                      {student.class || t("notSpecified")}
                    </p>
                  </div>
                </div>

                {/* Spending Progress */}
                <div className="mb-6" data-oid="ebrj4qk">
                  <div
                    className="flex justify-between items-center mb-2"
                    data-oid="um-u:r."
                  >
                    <span
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      data-oid="lr4vkgv"
                    >
                      Daily Spending
                    </span>
                    <span
                      className="text-sm font-bold text-gray-900 dark:text-white"
                      data-oid="p-7htee"
                    >
                      {formatLimitDisplay(
                        student.todaySpent,
                        student.dailyLimit,
                      )}
                    </span>
                  </div>
                  <div
                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"
                    data-oid="p1.g9nm"
                  >
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getSpendingColor(spendingPercentage)}`}
                      style={{ width: `${spendingPercentage}%` }}
                      data-oid="h46ovcc"
                    ></div>
                  </div>
                  <p
                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                    data-oid="qxeyhn9"
                  >
                    {spendingPercentage.toFixed(0)}% of daily limit used
                  </p>
                </div>

                {/* Recent Transactions Preview */}
                <div className="mb-6" data-oid="fifopnc">
                  <h4
                    className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"
                    data-oid="9vh34bf"
                  >
                    <Activity className="w-4 h-4 mr-2" data-oid="jlknmsv" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2" data-oid="6py.7mx">
                    {recentTransactions.slice(0, 2).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 dark:bg-brand rounded-lg bg-brand"
                        data-oid="l4:-n-d"
                      >
                        <div
                          className="flex items-center space-x-3"
                          data-oid="zvsxpym"
                        >
                          {getStatusIcon(transaction.status)}
                          <div data-oid="e4c:17t">
                            <p
                              className="text-sm font-medium dark:text-white text-[#FCF2F2FE]"
                              data-oid="8b28yc_"
                            >
                              {transaction.title}
                            </p>
                            <div
                              className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400"
                              data-oid="-xrp.zs"
                            >
                              <Clock className="w-3 h-3" data-oid="t96lgb5" />
                              <span data-oid="lzzv1..">{transaction.time}</span>
                              <MapPin className="w-3 h-3" data-oid="i028m_s" />
                              <span data-oid="ql-r-l4">
                                {transaction.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            transaction.amount > 0
                              ? "text-yellow-400"
                              : "text-yellow-400"
                          }`}
                          data-oid="qj.5t8a"
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {Math.abs(transaction.amount).toLocaleString()} RWF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3" data-oid="8lsv7lg">
                  <button
                    onClick={() => onViewTransactions(student)}
                    className="flex-1 flex items-center justify-center space-x-2 from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 bg-none bg-[#440B6DFC]"
                    data-oid="ja_7:w4"
                  >
                    <Activity className="w-5 h-5" data-oid="t2weuak" />
                    <span data-oid="wuwia3m">View All</span>
                  </button>
                  <button
                    onClick={() => onSetLimits(student)}
                    className="flex-1 flex items-center justify-center space-x-2 from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 bg-none bg-[#EAB500]"
                    data-oid="zm27nzt"
                  >
                    <Settings className="w-5 h-5" data-oid="pnkoetn" />
                    <span data-oid="wrk2qzp">Limits</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LinkedStudents;
