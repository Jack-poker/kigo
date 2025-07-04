import React, { useState, useEffect } from "react";
import axios from "axios";

interface Transaction {
  transaction_id: string;
  parent_id: string;
  student_id?: string;
  amount_sent: number;
  fee: number;
  description?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  parent?: { fullnames: string };
  student?: { student_name: string };
}

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Fetch CSRF token with retry logic and exponential backoff
  const fetchCsrfToken = async (
    retries = 3,
    initialDelay = 1000,
  ): Promise<string | null> => {
    let delay = initialDelay;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(
          "http://localhost:8001/admin/get-csrf-token",
          {
            withCredentials: true, // Send session_id cookie
            timeout: 5000, // 5 second timeout
          },
        );
        console.log("🔑 CSRF Token fetched successfully");
        setCsrfToken(response.data.csrf_token);
        setError("");
        return response.data.csrf_token;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.detail || "Failed to fetch CSRF token";
        console.error(`🚫 CSRF token error (attempt ${attempt}):`, err);
        if (attempt === retries) {
          setError(errorMsg);
          return null;
        }
        // Exponential backoff with jitter
        await new Promise((resolve) =>
          setTimeout(resolve, delay + Math.random() * 300),
        );
        delay *= 2; // Double the delay for next attempt
      }
    }
    return null;
  };

  // Fetch transactions with caching
  const fetchTransactions = async () => {
    if (!csrfToken) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8001/admin/transactions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true, // Send session_id cookie
          timeout: 8000, // 8 second timeout
        },
      );
      setTransactions(response.data);
      // Cache the transactions data with a 2-minute TTL
      localStorage.setItem(
        "cachedTransactions",
        JSON.stringify({
          data: response.data,
          timestamp: Date.now(),
          expiry: Date.now() + 2 * 60 * 1000, // 2 minutes
        }),
      );
      setLoading(false);
      setError("");
    } catch (err: any) {
      // Try to use cached data if available
      const cachedData = localStorage.getItem("cachedTransactions");
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed.expiry > Date.now()) {
            console.log("📦 Using cached transaction data");
            setTransactions(parsed.data);
            setError("Unable to fetch fresh data. Showing cached data.");
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Cache parsing error:", e);
        }
      }

      const errorMsg =
        err.response?.data?.detail || "Failed to fetch transactions";
      setError(errorMsg);
      console.error("🚫 Transactions fetch error:", err);
      setLoading(false);
    }
  };

  // Fetch transaction details
  const handleViewTransaction = async (transaction_id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/admin/transactions/${transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true, // Send session_id cookie
          timeout: 5000, // 5 second timeout
        },
      );
      setSelectedTransaction(response.data);
      setError("");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || "Failed to fetch transaction details";
      setError(errorMsg);
      console.error("🚫 Transaction fetch error:", err);
    }
  };

  // Initial CSRF token fetch
  useEffect(() => {
    fetchCsrfToken();

    // Try to load cached transactions while waiting for fresh data
    const cachedData = localStorage.getItem("cachedTransactions");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.expiry > Date.now()) {
          console.log("📦 Using cached transaction data initially");
          setTransactions(parsed.data);
          setLoading(false);
        }
      } catch (e) {
        console.error("Cache parsing error:", e);
      }
    }

    return () => {
      // Cleanup function
      console.log("🧹 Cleaning up TransactionManagement component");
    };
  }, []);

  // Fetch transactions when CSRF token is available
  useEffect(() => {
    if (csrfToken) {
      fetchTransactions();
    }
  }, [csrfToken]);

  // Handle refresh
  const handleRefresh = async () => {
    const token = await fetchCsrfToken();
    if (token) {
      await fetchTransactions();
    }
  };

  // Empty state component
  const EmptyTransactionState = () => (
    <div
      className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg text-center"
      data-oid="vxjywer"
    >
      <div className="w-48 h-48 mb-6" data-oid="jmx0ojk">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4ade80"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
          data-oid="ngd2qo-"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" data-oid="_t1w5y2" />
          <line x1="2" y1="10" x2="22" y2="10" data-oid="zv3taie" />
          <path d="M6 15h.01M9 15h.01" data-oid=".e60rc3" />
          <path d="M6 5v-2" data-oid=":8ls9f0" />
          <path d="M18 5v-2" data-oid="la4wp3f" />
          <path d="M12 22v-2" data-oid="augbc-b" />
          <path d="M12 17v-2" data-oid=":4.:dcu" />
          <path d="M16 15h2" data-oid="nmtpktj" />
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="#4ade80"
            strokeWidth="1"
            strokeDasharray="2 2"
            data-oid="82zosnd"
          />

          <path d="M12 9v3l1.5 1.5" data-oid="k1nlecg" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2" data-oid="puaf8tf">
        No Transactions Yet
      </h3>
      <p className="text-gray-600 mb-6" data-oid="6:bsb3a">
        Transactions will appear here once parents start making payments.
      </p>
      <button
        onClick={handleRefresh}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-md flex items-center justify-center"
        data-oid="u51is66"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
          data-oid="0z-adsx"
        >
          <path
            fillRule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clipRule="evenodd"
            data-oid="6_84xuh"
          />
        </svg>
        Refresh
      </button>
    </div>
  );

  // Loading skeleton component
  const TransactionSkeleton = () => (
    <div className="animate-pulse" data-oid="rpe-fy2">
      <div
        className="h-8 bg-gray-200 rounded mb-4 w-1/3"
        data-oid="-og.w5w"
      ></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" data-oid="etc_wf2">
        <div className="lg:col-span-2" data-oid="u6iu22l">
          <div className="bg-white rounded-lg shadow p-4" data-oid="osb6ni2">
            <div
              className="h-8 bg-gray-200 rounded mb-4"
              data-oid="pz6v8j2"
            ></div>
            <div className="space-y-3" data-oid="04i15c5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-7 gap-2"
                  data-oid="4pnqzxi"
                >
                  {[...Array(7)].map((_, j) => (
                    <div
                      key={j}
                      className="h-6 bg-gray-200 rounded"
                      data-oid="gjas6h6"
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div data-oid="0pqvv9e">
          <div className="bg-white rounded-lg shadow p-4" data-oid="w6_a4sd">
            <div
              className="h-6 bg-gray-200 rounded mb-4"
              data-oid="vks:6ip"
            ></div>
            <div className="space-y-2" data-oid="eote.cj">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 bg-gray-200 rounded"
                  data-oid="pelwvbt"
                ></div>
              ))}
            </div>
            <div
              className="h-8 bg-gray-200 rounded mt-4"
              data-oid="5cm9ix_"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4" data-oid="3w:be-i">
      {/* Header with gradient background */}
      <div
        className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 mb-6 text-white flex justify-between items-center"
        data-oid="4-q.twf"
      >
        <div data-oid="01jpv4n">
          <h2 className="text-3xl font-bold" data-oid="op1amwd">
            Transaction Management
          </h2>
          <p className="text-green-100" data-oid=":sc_.2_">
            Monitor and manage all financial transactions
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow flex items-center"
          data-oid="gvzom22"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            data-oid="drvt3iw"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
              data-oid="-bc7wl_"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error message with dismiss button */}
      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md flex justify-between items-center"
          data-oid="nnqj._r"
        >
          <div className="flex items-center" data-oid="0-tupj8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="e:xusje"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                data-oid="9:5tm2l"
              />
            </svg>
            <span data-oid="6yuq59q">{error}</span>
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-700 hover:text-red-800"
            data-oid="yi2xlsh"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              data-oid="cnibp8e"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
                data-oid="gg.c-zt"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && <TransactionSkeleton data-oid="dpfgaho" />}

      {/* Empty state */}
      {!loading && !error && transactions.length === 0 && (
        <EmptyTransactionState data-oid="53js3ne" />
      )}

      {/* Transaction data */}
      {!loading && !error && transactions.length > 0 && (
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          data-oid="x-:ax2."
        >
          <div className="lg:col-span-2" data-oid="03:ju85">
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              data-oid="vuvvpz2"
            >
              <div className="overflow-x-auto" data-oid="c._pffw">
                <table className="min-w-full" data-oid="496nlyo">
                  <thead data-oid=".f.b5k5">
                    <tr
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white"
                      data-oid="qgp2c-_"
                    >
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="5wflkd1"
                      >
                        ID
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="2c2ue8e"
                      >
                        Parent
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="hv30.yn"
                      >
                        Student
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="5kt265r"
                      >
                        Amount
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="45-t4v."
                      >
                        Fee
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="m8bg768"
                      >
                        Date
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="k.j_2fc"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y divide-gray-200"
                    data-oid="qsu-u4e"
                  >
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.transaction_id}
                        className="hover:bg-green-50 transition-colors duration-150 ease-in-out"
                        data-oid="o21bjhj"
                      >
                        <td
                          className="py-3 px-4 font-mono text-sm"
                          data-oid="br-h3il"
                        >
                          {transaction.transaction_id.slice(0, 8)}
                        </td>
                        <td className="py-3 px-4" data-oid="21-ovj_">
                          {transaction.parent?.fullnames || "-"}
                        </td>
                        <td className="py-3 px-4" data-oid="krdyc5p">
                          {transaction.student?.student_name || "-"}
                        </td>
                        <td
                          className="py-3 px-4 font-semibold text-green-600"
                          data-oid="314o97i"
                        >
                          RWF {transaction.amount_sent.toFixed(2)}
                        </td>
                        <td
                          className="py-3 px-4 text-gray-600"
                          data-oid="mhxq:e2"
                        >
                          RWF {transaction.fee.toFixed(2)}
                        </td>
                        <td className="py-3 px-4" data-oid="09g1.u2">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4" data-oid="9j13j_0">
                          <button
                            onClick={() =>
                              handleViewTransaction(transaction.transaction_id)
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors duration-150 ease-in-out flex items-center justify-center text-sm"
                            data-oid="qmuwjty"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              data-oid="arpav7p"
                            >
                              <path
                                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                                data-oid="g8ia8ga"
                              />

                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                                data-oid="-0:e57b"
                              />
                            </svg>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Transaction details panel */}
          <div data-oid="u8p_jhg">
            {selectedTransaction ? (
              <div
                className="bg-white rounded-lg shadow-lg p-6 sticky top-4 transition-all duration-300 transform hover:shadow-xl"
                data-oid="trdmiff"
              >
                <div
                  className="flex justify-between items-center mb-4"
                  data-oid="u7wcbis"
                >
                  <h3
                    className="text-xl font-bold text-gray-800"
                    data-oid="n1m.-xx"
                  >
                    Transaction Details
                  </h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-500 hover:text-gray-700"
                    data-oid="0s36o8o"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      data-oid="..0e_1m"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        data-oid="pxt.8:p"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  className="bg-green-50 p-4 rounded-lg mb-4"
                  data-oid="9.5.9k6"
                >
                  <div className="flex justify-between" data-oid="vy3sji3">
                    <span className="text-gray-600" data-oid="b_zbmzc">
                      Amount:
                    </span>
                    <span
                      className="font-bold text-green-600"
                      data-oid="910po80"
                    >
                      RWF {selectedTransaction.amount_sent.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1" data-oid="nrfj.rq">
                    <span className="text-gray-600" data-oid="0hp.:g_">
                      Fee:
                    </span>
                    <span className="text-gray-800" data-oid="wt77jgw">
                      RWF {selectedTransaction.fee.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3" data-oid="a.t:qi9">
                  <div data-oid="lv840.f">
                    <label
                      className="block text-sm font-medium text-gray-600"
                      data-oid="4t73jxn"
                    >
                      Transaction ID
                    </label>
                    <div
                      className="mt-1 font-mono text-sm bg-gray-50 p-2 rounded border border-gray-200 overflow-x-auto"
                      data-oid="qzyjhm0"
                    >
                      {selectedTransaction.transaction_id}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4" data-oid=":k7zjx3">
                    <div data-oid="cdh4u32">
                      <label
                        className="block text-sm font-medium text-gray-600"
                        data-oid="aph9yky"
                      >
                        Parent
                      </label>
                      <div
                        className="mt-1 bg-gray-50 p-2 rounded border border-gray-200"
                        data-oid="mtml63u"
                      >
                        {selectedTransaction.parent?.fullnames || "-"}
                      </div>
                    </div>
                    <div data-oid="-s7o1fe">
                      <label
                        className="block text-sm font-medium text-gray-600"
                        data-oid="e-3kg0j"
                      >
                        Student
                      </label>
                      <div
                        className="mt-1 bg-gray-50 p-2 rounded border border-gray-200"
                        data-oid="flkegix"
                      >
                        {selectedTransaction.student?.student_name || "-"}
                      </div>
                    </div>
                  </div>

                  <div data-oid="w7ars68">
                    <label
                      className="block text-sm font-medium text-gray-600"
                      data-oid="4vaq:g6"
                    >
                      Description
                    </label>
                    <div
                      className="mt-1 bg-gray-50 p-2 rounded border border-gray-200 min-h-[60px]"
                      data-oid="yx9dqco"
                    >
                      {selectedTransaction.description ||
                        "No description provided"}
                    </div>
                  </div>

                  <div data-oid="s6sym0q">
                    <label
                      className="block text-sm font-medium text-gray-600"
                      data-oid="6gkhhm4"
                    >
                      Date & Time
                    </label>
                    <div
                      className="mt-1 bg-gray-50 p-2 rounded border border-gray-200"
                      data-oid="ampsbzw"
                    >
                      {new Date(selectedTransaction.timestamp).toLocaleString()}
                    </div>
                  </div>

                  {selectedTransaction.latitude &&
                    selectedTransaction.longitude && (
                      <div data-oid="bi864gm">
                        <label
                          className="block text-sm font-medium text-gray-600"
                          data-oid="elpmk0a"
                        >
                          Location
                        </label>
                        <div
                          className="mt-1 bg-gray-50 p-2 rounded border border-gray-200"
                          data-oid="46eywef"
                        >
                          Lat: {selectedTransaction.latitude.toFixed(6)}, Long:{" "}
                          {selectedTransaction.longitude.toFixed(6)}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div
                className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center"
                data-oid="7p3.qgg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-oid="uqwaynv"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    data-oid="57kv3yx"
                  />
                </svg>
                <h3
                  className="text-lg font-medium text-gray-600 mb-1"
                  data-oid="od:lk4b"
                >
                  No Transaction Selected
                </h3>
                <p className="text-gray-500 text-sm" data-oid="84ew5_e">
                  Click on "View" button to see transaction details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
