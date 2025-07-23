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
  Key,
  Trash2,
  MoreVertical,
  Shield,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LinkedStudents = ({
  students = [],
  onViewTransactions = () => {},
  onSetLimits = () => {},
  onResetPin = () => {},
  onRemoveStudent = () => {},
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [newPin, setNewPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  const baseUrl = "https://api.kaascan.com";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount ?? 0);
  };

  const formatLimitDisplay = (spent, limit) => {
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
  const getRecentTransactions = (studentId) => [
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSpendingPercentage = (spent, limit) => {
    if (limit === 0) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const getSpendingColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(`${baseUrl}/get-csrf-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        return data.csrf_token;
      }
      throw new Error("Failed to fetch CSRF token");
    } catch (error) {
      throw new Error("Failed to fetch CSRF token: " + error.message);
    }
  };

  // Generate random PIN
  const generatePin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Handle Reset PIN
  const handleResetPin = async (student) => {
    setSelectedStudent(student);
    setActionInProgress(true);

    try {
      const csrfToken = await fetchCsrfToken();
      const newPin = generatePin();
      const response = await fetch(`${baseUrl}/student/reset-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          student_id: student.studentId,
          new_pin: newPin,
          csrf_token: csrfToken,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        setNewPin(newPin);
        setShowResetModal(true);
        onResetPin(student, newPin);
        toast({
          title: "Success",
          description: data.message || "Student PIN reset successfully",
        });
      } else {
        throw new Error(data.detail || "Failed to reset PIN");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reset PIN. Please try again.",
      });
    } finally {
      setActionInProgress(false);
    }
  };

  // Handle Remove Student
  const handleRemoveStudent = (student) => {
    setSelectedStudent(student);
    setConfirmationText("");
    setShowRemoveModal(true);
  };

  // Confirm Remove Student
  const confirmRemoveStudent = async () => {
    if (confirmationText !== selectedStudent.name) return;
    setActionInProgress(true);

    try {
      const csrfToken = await fetchCsrfToken();
      const response = await fetch(`${baseUrl}/student/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          student_id: selectedStudent.studentId,
          csrf_token: csrfToken,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        setShowRemoveModal(false);
        setSelectedStudent(null);
        setConfirmationText("");
        onRemoveStudent(selectedStudent);
        toast({
          title: "Success",
          description: data.message || "Student removed successfully",
        });
      } else {
        throw new Error(data.detail || "Failed to remove student");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove student. Please try again.",
      });
    } finally {
      setActionInProgress(false);
    }
  };

  // Copy PIN to clipboard
  const copyPin = () => {
    navigator.clipboard.writeText(newPin);
    toast({
      title: "Copied",
      description: "PIN copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-zinc-900 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Linked Students
              </h2>
              <p className="text-gray-300 text-sm">
                Manage your children's accounts
              </p>
            </div>
          </div>
          {/* <button
            onClick={() => onSetLimits({})}
            className="flex items-center space-x-2 bg-zinc-900 hover:bg-gray-800 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Users className="w-5 h-5" />
            <span>Link Student</span>
          </button> */}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-8 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Schools</option>
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>
          {(searchTerm || selectedSchool) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredStudents.length} of {students.length} students
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSchool("");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-64 h-64 mx-auto mb-6">
              <img
                src="/assets/Add User-rafiki.svg"
                alt="No students linked"
                className="w-full h-full object-contain opacity-100"
                draggable={false}
              />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              {students.length === 0
                ? "No Students Linked"
                : "No students match your search"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
              {students.length === 0
                ? "Link your first student to get started"
                : "Try adjusting your search terms or filters"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredStudents.map((student) => {
            const spendingPercentage = getSpendingPercentage(
              student.todaySpent,
              student.dailyLimit,
            );
            const recentTransactions = getRecentTransactions(student.id);

            return (
              <div
                key={student.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
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
                        <img
                          src="assets/young-boy.png"
                          alt="Student Avatar"
                          className="w-16 h-16 rounded-full object-cover shadow-md"
                        />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg">{student.name}</h3>
                    <p className="text-zinc-900 text-sm font-medium">ID: {student.studentId}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{student.class || "Not Specified"}</p>
                  </div>
                </div>

                {/* Spending */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Spending</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900/10 text-zinc-900 font-semibold">
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
                {/* <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2">
                    {recentTransactions.slice(0, 2).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">{transaction.title}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{transaction.time}</span>
                              <MapPin className="w-3 h-3" />
                              <span>{transaction.location}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {transaction.amount > 0 ? "+" : ""}
                          {Math.abs(transaction.amount).toLocaleString()} RWF
                        </span>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Enhanced Action Buttons */}
                <div className="space-y-3">
                  {/* Primary Actions Row */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onViewTransactions(student)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-gray-800 text-white py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <Activity className="w-5 h-5" />
                      <span>View All</span>
                    </button>
                    <button
                      onClick={() => onSetLimits(student)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-zinc-900 border border-zinc-900 py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Limits</span>
                    </button>
                  </div>

                  {/* Student Management Actions Row */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleResetPin(student)}
                      disabled={actionInProgress}
                      className="flex-1 flex items-center justify-center space-x-2 bg-brand hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                    >
                      <Key className="w-5 h-5" />
                      <span>{actionInProgress ? "Resetting..." : "Reset PIN"}</span>
                    </button>
                    <button
                      onClick={() => handleRemoveStudent(student)}
                      disabled={actionInProgress}
                      className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reset PIN Modal */}
      {showResetModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">PIN Reset Successful</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">New PIN generated for {selectedStudent.name}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">New PIN</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                        {showPin ? "••••" : newPin}
                      </span>
                      <button
                        onClick={() => setShowPin(!showPin)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={copyPin}
                    className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Important Security Notes</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Share this PIN only with your child</li>
                      <li>• The old PIN is now invalid</li>
                      <li>• Your child will need this PIN for transactions</li>
                      <li>• Consider helping them memorize it</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={copyPin}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Copy PIN
                </button>
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setSelectedStudent(null);
                    setNewPin("");
                    setShowPin(false);
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Student Modal */}
      {showRemoveModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Remove Student</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 mb-6">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Warning: This will permanently:</h4>
                <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                  <li>• Remove {selectedStudent.name} from your account</li>
                  <li>• Delete all transaction history</li>
                  <li>• Cancel all spending limits</li>
                  <li>• Disable their payment card</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type the student's name to confirm: <span className="font-bold">{selectedStudent.name}</span>
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={selectedStudent.name}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setSelectedStudent(null);
                    setConfirmationText("");
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveStudent}
                  disabled={confirmationText !== selectedStudent.name || actionInProgress}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
                >
                  {actionInProgress ? "Removing..." : "Remove Student"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div></div>
    </div>
  );
};

export default LinkedStudents;