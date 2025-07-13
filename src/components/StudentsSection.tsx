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
          <CheckCircle className="w-4 h-4 text-brand" data-oid="yl:e_nb" />
        );

      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" data-oid="odxam9o" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" data-oid="xonca0x" />;
      default:
        return (
          <AlertCircle className="w-4 h-4 text-gray-500" data-oid="w071yu:" />
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
    <div className="space-y-6" data-oid="s.apr7p">
      <div className="flex flex-col space-y-6" data-oid="7yblb2x">
        <div className="flex items-center justify-between" data-oid="gh71v:a">
          <div className="flex items-center space-x-3" data-oid="ffe7inc">
            <div
              className="p-3 from-blue-500 to-purple-600 rounded-xl shadow-lg bg-none bg-brand"
              data-oid="q9v1ebz"
            >
              <Users className="w-6 h-6 text-white" data-oid="2kyoshy" />
            </div>
            <div data-oid="r8:0mcs">
              <h2
                className="dark:text-white text-2xl font-bold bg-[#F9F1F100] text-[#F8F1F1]"
                data-oid="7s0nqjl"
              >
                {t("linkedStudents")}
              </h2>
              <p
                className="dark:text-gray-400 text-sm bg-[#11000000] text-white"
                data-oid="7f5m_ra"
              >
                Manage your children's accounts
              </p>
            </div>
          </div>
          <button
            onClick={() => onSetLimits({} as Student)}
            className="flex items-center space-x-2 from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 bg-none bg-brand"
            data-oid=":8ddkum"
          >
            <Users className="w-5 h-5" data-oid="gvn9:kc" />
            <span data-oid="e2_wa6x">{t("linkStudent")}</span>
          </button>
        </div>

        {/* Search and Filter Section */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          data-oid="u5l12ip"
        >
          <div className="flex flex-col md:flex-row gap-4" data-oid="dp:8saz">
            <div className="flex-1 relative" data-oid="k72918l">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                data-oid="p6nz1u5"
              />

              <input
                type="text"
                placeholder="Search students by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                data-oid="a:1.mva"
              />
            </div>
            <div className="flex gap-3" data-oid="cm-lone">
              <div className="relative" data-oid="5lural8">
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-8 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  data-oid="ygg-igv"
                >
                  <option value="" data-oid="3oegmjl">
                    All Schools
                  </option>
                  {schools.map((school) => (
                    <option key={school} value={school} data-oid="vo1:ljv">
                      {school}
                    </option>
                  ))}
                </select>
                <Filter
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
                  data-oid="karsttd"
                />
              </div>
            </div>
          </div>
          {(searchTerm || selectedSchool) && (
            <div
              className="mt-4 flex items-center justify-between"
              data-oid="2gk4.pj"
            >
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="t_c4:g5"
              >
                Showing {filteredStudents.length} of {students.length} students
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSchool("");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                data-oid="ksz4pi1"
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
          data-oid="08c27py"
        >
          <div
            className="flex flex-col items-center justify-center text-center"
            data-oid="znpcigj"
          >
            <div className="w-64 h-64 mx-auto mb-6" data-oid="oq.he5q">
              <img
                src="/assets/Add User-rafiki.svg"
                alt={t("noStudentsLinked")}
                className="w-full h-full object-contain opacity-100"
                draggable={false}
                data-oid="phw7a79"
              />
            </div>
            <h3
              className="text-xl font-semibold text-brand dark:text-white mb-2"
              data-oid="29e678z"
            >
              {students.length === 0
                ? t("noStudentsLinked")
                : "No students match your search"}
            </h3>
            <p
              className="text-gray-500 dark:text-gray-400 text-sm max-w-md"
              data-oid="3_8yr4w"
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
          data-oid="d60sr5w"
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
  className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white"
  data-oid="01_76a9"
>
  {/* Header */}
  <div className="flex items-center space-x-4 mb-6">
    <div className="relative">
      {student.photo && student.photo !== "/api/placeholder/48/48" ? (
        <img
          src={student.photo}
          alt={student.name}
          className="w-16 h-16 rounded-full object-cover border-3 border-gradient-to-r from-blue-500 to-purple-500 shadow-md"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-lime-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
          {student.name?.[0]?.toUpperCase() || "?"}
        </div>
      )}
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
        <CheckCircle className="w-3 h-3 text-white" />
      </div>
    </div>
    <div className="flex-1">
      <h3 className="text-gray-900 dark:text-white font-bold text-lg">{student.name}</h3>
      <p className="text-brand text-sm font-medium">ID: {student.studentId}</p>
      <p className="text-gray-500 dark:text-gray-400 text-xs">{student.class || t("notSpecified")}</p>
    </div>
  </div>

  {/* Spending */}
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Spending</span>
      <span className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand font-semibold">
        {spendingPercentage.toFixed(0)}% used
      </span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-300 ${getSpendingColor(spendingPercentage)}`}
        style={{ width: `${spendingPercentage}%` }}
      ></div>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      {formatLimitDisplay(student.todaySpent, student.dailyLimit)}
    </p>
  </div>

  {/* Transactions */}
  <div className="mb-6">
    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
      <Activity className="w-4 h-4 mr-2" />
      Recent Activity
    </h4>
    <div className="space-y-2">
      {recentTransactions.slice(0, 2).map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 dark:bg-white rounded-lg bg-white border"
        >
          <div className="flex items-center space-x-3">
            {getStatusIcon(transaction.status)}
            <div>
              <p className="text-sm font-medium text-brand">{transaction.title}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{transaction.time}</span>
                <MapPin className="w-3 h-3" />
                <span>{transaction.location}</span>
              </div>
            </div>
          </div>
          <span className="text-sm font-bold text-brand">
            {transaction.amount > 0 ? "+" : ""}
            {Math.abs(transaction.amount).toLocaleString()} RWF
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Buttons */}
  <div className="flex space-x-3">
    <button
      onClick={() => onViewTransactions(student)}
      className="flex-1 flex items-center justify-center space-x-2 from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-xl transform hover:scale-[1.02] bg-gradient-to-r"
    >
      <Activity className="w-5 h-5" />
      <span>View All</span>
    </button>
    <button
      onClick={() => onSetLimits(student)}
      className="flex-1 flex items-center justify-center space-x-2 from-white to-white hover:from-gray-100 hover:to-gray-200 text-brand border border-brand py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-xl transform hover:scale-[1.02] bg-white"
    >
      <Settings className="w-5 h-5" />
      <span>Limits</span>
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
