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
          <CheckCircle className="w-4 h-4 text-green-500" data-oid="fcalin2" />
        );
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" data-oid="qipe85k" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" data-oid="y25yp72" />;
      default:
        return (
          <AlertCircle className="w-4 h-4 text-gray-500" data-oid="cc76gih" />
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
    <div className="space-y-6" data-oid=".z5p3si">
      <div className="flex flex-col space-y-6" data-oid="sty6wo.">
        <div className="flex items-center justify-between" data-oid="o8oi9mt">
          <div className="flex items-center space-x-3" data-oid="2ilcus:">
            <div
              className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg"
              data-oid="lisddim"
            >
              <Users className="w-6 h-6 text-white" data-oid="t0lue38" />
            </div>
            <div data-oid="ukzhz_q">
              <h2
                className="text-gray-900 dark:text-white text-2xl font-bold"
                data-oid="ujefjpy"
              >
                {t("linkedStudents")}
              </h2>
              <p
                className="text-gray-500 dark:text-gray-400 text-sm"
                data-oid="n5q:flw"
              >
                Manage your children's accounts
              </p>
            </div>
          </div>
          <button
            onClick={() => onSetLimits({} as Student)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            data-oid="dkc6:st"
          >
            <Users className="w-5 h-5" data-oid="7hpd8:5" />
            <span data-oid="1n7so_.">{t("linkStudent")}</span>
          </button>
        </div>

        {/* Search and Filter Section */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          data-oid="g3sxu46"
        >
          <div className="flex flex-col md:flex-row gap-4" data-oid="a9rs5z6">
            <div className="flex-1 relative" data-oid="8hbdvnq">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                data-oid="n4gg0ev"
              />
              <input
                type="text"
                placeholder="Search students by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                data-oid="x0q9r:f"
              />
            </div>
            <div className="flex gap-3" data-oid="gyf0owl">
              <div className="relative" data-oid="vpfqfbl">
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-8 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  data-oid="1tti9gb"
                >
                  <option value="" data-oid="x6g_fs6">
                    All Schools
                  </option>
                  {schools.map((school) => (
                    <option key={school} value={school} data-oid="7n41m8u">
                      {school}
                    </option>
                  ))}
                </select>
                <Filter
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
                  data-oid="lwzjbj6"
                />
              </div>
            </div>
          </div>
          {(searchTerm || selectedSchool) && (
            <div
              className="mt-4 flex items-center justify-between"
              data-oid="dyoifba"
            >
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="gi8zgtb"
              >
                Showing {filteredStudents.length} of {students.length} students
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSchool("");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                data-oid="1kwfw7-"
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
          data-oid="omi24xi"
        >
          <div
            className="flex flex-col items-center justify-center text-center"
            data-oid="wrzofxp"
          >
            <div className="w-64 h-64 mx-auto mb-6" data-oid="zdnbhls">
              <img
                src="/assets/kids wearing masks at school-bro.svg"
                alt={t("noStudentsLinked")}
                className="w-full h-full object-contain opacity-80"
                draggable={false}
                data-oid="lzfywak"
              />
            </div>
            <h3
              className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
              data-oid="mnys8-p"
            >
              {students.length === 0
                ? t("noStudentsLinked")
                : "No students match your search"}
            </h3>
            <p
              className="text-gray-500 dark:text-gray-400 text-sm max-w-md"
              data-oid="1t.ogua"
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
          data-oid="7kzbhqj"
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
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-oid="4_w3kgl"
              >
                {/* Student Header */}
                <div
                  className="flex items-center space-x-4 mb-6"
                  data-oid="3oz0uri"
                >
                  <div className="relative" data-oid="f6qew9x">
                    {student.photo &&
                    student.photo !== "/api/placeholder/48/48" ? (
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-16 h-16 rounded-full object-cover border-3 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                        data-oid="-bl_ljg"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                        data-oid="f1ie37a"
                      >
                        <User
                          className="w-8 h-8 text-white"
                          data-oid="wur5.__"
                        />
                      </div>
                    )}
                    <div
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center"
                      data-oid="jppmgfp"
                    >
                      <CheckCircle
                        className="w-3 h-3 text-white"
                        data-oid="iqx0vem"
                      />
                    </div>
                  </div>
                  <div className="flex-1" data-oid="r-_nl_j">
                    <h3
                      className="text-gray-900 dark:text-white font-bold text-lg"
                      data-oid="ijb8h02"
                    >
                      {student.name}
                    </h3>
                    <p
                      className="text-blue-600 dark:text-blue-400 text-sm font-medium"
                      data-oid="pcd4xyp"
                    >
                      ID: {student.studentId}
                    </p>
                    <p
                      className="text-gray-500 dark:text-gray-400 text-xs"
                      data-oid="c7rngjw"
                    >
                      {student.class || t("notSpecified")}
                    </p>
                  </div>
                </div>

                {/* Spending Progress */}
                <div className="mb-6" data-oid="y9etkv-">
                  <div
                    className="flex justify-between items-center mb-2"
                    data-oid="ruzhh1r"
                  >
                    <span
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      data-oid=":6t_nkj"
                    >
                      Daily Spending
                    </span>
                    <span
                      className="text-sm font-bold text-gray-900 dark:text-white"
                      data-oid="k-1qk9b"
                    >
                      {formatLimitDisplay(
                        student.todaySpent,
                        student.dailyLimit,
                      )}
                    </span>
                  </div>
                  <div
                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"
                    data-oid="fql5oz."
                  >
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getSpendingColor(spendingPercentage)}`}
                      style={{ width: `${spendingPercentage}%` }}
                      data-oid="zni5e69"
                    ></div>
                  </div>
                  <p
                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                    data-oid=":xph1v0"
                  >
                    {spendingPercentage.toFixed(0)}% of daily limit used
                  </p>
                </div>

                {/* Recent Transactions Preview */}
                <div className="mb-6" data-oid="tb_gf1z">
                  <h4
                    className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center"
                    data-oid="16gltgg"
                  >
                    <Activity className="w-4 h-4 mr-2" data-oid="ldy5fp6" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2" data-oid="5zhher:">
                    {recentTransactions.slice(0, 2).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        data-oid="rw:-kc0"
                      >
                        <div
                          className="flex items-center space-x-3"
                          data-oid="l4eoaig"
                        >
                          {getStatusIcon(transaction.status)}
                          <div data-oid="de1dwtk">
                            <p
                              className="text-sm font-medium text-gray-900 dark:text-white"
                              data-oid="tc.v.v5"
                            >
                              {transaction.title}
                            </p>
                            <div
                              className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400"
                              data-oid="14fq327"
                            >
                              <Clock className="w-3 h-3" data-oid="va-7lrx" />
                              <span data-oid="19ccjf0">{transaction.time}</span>
                              <MapPin className="w-3 h-3" data-oid="sxnq54q" />
                              <span data-oid="zq..8v-">
                                {transaction.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                          data-oid="9cjq_jv"
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {Math.abs(transaction.amount).toLocaleString()} RWF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3" data-oid="r6mhn60">
                  <button
                    onClick={() => onViewTransactions(student)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    data-oid="jmva3y2"
                  >
                    <Activity className="w-5 h-5" data-oid="pctdobx" />
                    <span data-oid="g9cajd0">View All</span>
                  </button>
                  <button
                    onClick={() => onSetLimits(student)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    data-oid="1noij1c"
                  >
                    <Settings className="w-5 h-5" data-oid="5-l3-.b" />
                    <span data-oid="khdg.lg">Limits</span>
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
