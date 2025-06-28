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
          "https://api.kaascan.com/admin/get-csrf-token",
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
        "https://api.kaascan.com/admin/transactions",
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
        `https://api.kaascan.com/admin/transactions/${transaction_id}`,
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
      data-oid="0zg:.vo"
    >
      <div className="w-48 h-48 mb-6" data-oid="8k.9.iw">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4ade80"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
          data-oid="aldupx9"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" data-oid="7-f0oc0" />
          <line x1="2" y1="10" x2="22" y2="10" data-oid="3k1e-dr" />
          <path d="M6 15h.01M9 15h.01" data-oid="k:9w9:b" />
          <path d="M6 5v-2" data-oid="i:0qivw" />
          <path d="M18 5v-2" data-oid="in1yclk" />
          <path d="M12 22v-2" data-oid="d0dg5zx" />
          <path d="M12 17v-2" data-oid="v5m_vgm" />
          <path d="M16 15h2" data-oid="a6pmas9" />
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="#4ade80"
            strokeWidth="1"
            strokeDasharray="2 2"
            data-oid="jnbdo85"
          />

          <path d="M12 9v3l1.5 1.5" data-oid="1f:r8w7" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2" data-oid="7b9cr3v">
        No Transactions Yet
      </h3>
      <p className="text-gray-600 mb-6" data-oid="m3sk62i">
        Transactions will appear here once parents start making payments.
      </p>
      <button
        onClick={handleRefresh}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-md flex items-center justify-center"
        data-oid="3zsfx3h"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
          data-oid="9.9f:pk"
        >
          <path
            fillRule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clipRule="evenodd"
            data-oid="l:38sne"
          />
        </svg>
        Refresh
      </button>
    </div>
  );

  // Loading skeleton component
  const TransactionSkeleton = () => (
    <div className="animate-pulse" data-oid="u.rb97w">
      <div
        className="h-8 bg-gray-200 rounded mb-4 w-1/3"
        data-oid="7.h9erk"
      ></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" data-oid="qkbe7ci">
        <div className="lg:col-span-2" data-oid="lxps91w">
          <div className="bg-white rounded-lg shadow p-4" data-oid="uy482th">
            <div
              className="h-8 bg-gray-200 rounded mb-4"
              data-oid="u-g00:3"
            ></div>
            <div className="space-y-3" data-oid="vq89pen">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-7 gap-2"
                  data-oid="csl7h3b"
                >
                  {[...Array(7)].map((_, j) => (
                    <div
                      key={j}
                      className="h-6 bg-gray-200 rounded"
                      data-oid="6cd.3h:"
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div data-oid="w5bzew5">
          <div className="bg-white rounded-lg shadow p-4" data-oid="o741hzf">
            <div
              className="h-6 bg-gray-200 rounded mb-4"
              data-oid="qgki1uf"
            ></div>
            <div className="space-y-2" data-oid="snwl1dy">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 bg-gray-200 rounded"
                  data-oid="h8szeg8"
                ></div>
              ))}
            </div>
            <div
              className="h-8 bg-gray-200 rounded mt-4"
              data-oid="6perp:y"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4" data-oid="z18-508">
      {/* Header with gradient background */}
      <div
        className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 mb-6 text-white flex justify-between items-center"
        data-oid="zz-kdq9"
      >
        <div data-oid="r88qir_">
          <h2 className="text-3xl font-bold" data-oid="94y-j08">
            Transaction Management
          </h2>
          <p className="text-green-100" data-oid="kpfswu_">
            Monitor and manage all financial transactions
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow flex items-center"
          data-oid="0ys:2rr"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            data-oid="9xom1_y"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
              data-oid="8b1zw40"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error message with dismiss button */}
      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md flex justify-between items-center"
          data-oid="l-0hltb"
        >
          <div className="flex items-center" data-oid="b7qkuw.">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="8aphk2q"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                data-oid="y9gvb5o"
              />
            </svg>
            <span data-oid="hpqim_r">{error}</span>
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-700 hover:text-red-800"
            data-oid="4l1-yts"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              data-oid="0108nf3"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
                data-oid="dpvsnx."
              />
            </svg>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && <TransactionSkeleton data-oid="pmr1_4-" />}

      {/* Empty state */}
      {!loading && !error && transactions.length === 0 && (
        <EmptyTransactionState data-oid="3-yxzjn" />
      )}

      {/* Transaction data */}
      {!loading && !error && transactions.length > 0 && (
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          data-oid="-ss7rqx"
        >
          <div className="lg:col-span-2" data-oid="tk9n5ry">
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              data-oid="pv1bvdj"
            >
              <div className="overflow-x-auto" data-oid="a7czl2j">
                <table className="min-w-full" data-oid="6pn7_9l">
                  <thead data-oid="2:7hio6">
                    <tr
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white"
                      data-oid="xkysrwa"
                    >
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid=":uyik_9"
                      >
                        ID
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="ca_wmr0"
                      >
                        Parent
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="4f8:w5r"
                      >
                        Student
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="juq8b13"
                      >
                        Amount
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="w.9itkb"
                      >
                        Fee
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="m8wfi0:"
                      >
                        Date
                      </th>
                      <th
                        className="py-3 px-4 text-left font-semibold"
                        data-oid="mxqehjs"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y divide-gray-200"
                    data-oid="h.58:cr"
                  >
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.transaction_id}
                        className="hover:bg-green-50 transition-colors duration-150 ease-in-out"
                        data-oid="ykgn:ic"
                      >
                        <td
                          className="py-3 px-4 font-mono text-sm"
                          data-oid="j:0pfec"
                        >
                          {transaction.transaction_id.slice(0, 8)}
                        </td>
                        <td className="py-3 px-4" data-oid="t9qh0z8">
                          {transaction.parent?.fullnames || "-"}
                        </td>
                        <td className="py-3 px-4" data-oid="qpbnx0:">
                          {transaction.student?.student_name || "-"}
                        </td>
                        <td
                          className="py-3 px-4 font-semibold text-green-600"
                          data-oid="a1_xexw"
                        >
                          RWF {transaction.amount_sent.toFixed(2)}
                        </td>
                        <td
                          className="py-3 px-4 text-gray-600"
                          data-oid="jbotumq"
                        >
                          RWF {transaction.fee.toFixed(2)}
                        </td>
                        <td className="py-3 px-4" data-oid="0oykl2s">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4" data-oid=":ya4yvm">
                          <button
                            onClick={() =>
                              handleViewTransaction(transaction.transaction_id)
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors duration-150 ease-in-out flex items-center justify-center text-sm"
                            data-oid="36q0::1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              data-oid="7nq-uq9"
                            >
                              <path
                                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                                data-oid="gsr8rga"
                              />

                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                                data-oid="y_uylog"
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
          <div data-oid="ipcvpth">
            {selectedTransaction ? (
              <div
                className="bg-white rounded-lg shadow-lg p-6 sticky top-4 transition-all duration-300 transform hover:shadow-xl"
                data-oid="kzx039x"
              >
                <div
                  className="flex justify-between items-center mb-4"
                  data-oid="p.02qax"
                >
                  <h3
                    className="text-xl font-bold text-gray-800"
                    data-oid="ebtdaox"
                  >
                    Transaction Details
                  </h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-500 hover:text-gray-700"
                    data-oid="8t7msb3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      data-oid="8q-e2ge"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        data-oid="ckbb79p"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  className="bg-green-50 p-4 rounded-lg mb-4"
                  data-oid="mtl7iqb"
                >
                  <div className="flex justify-between" data-oid="k.ampdo">
                    <span className="text-gray-600" data-oid="nt.wlpd">
                      Amount:
                    </span>
                    <span
                      className="font-bold text-green-600"
                      data-oid="6wuyav9"
                    >
                      RWF {selectedTransaction.amount_sent.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1" data-oid="ro6dxdn">
                    <span className="text-gray-600" data-oid="_ms9f4v">
                      Fee:
                    </span>
                    <span className="text-gray-800" data-oid="9e1n_aw">
                      RWF {selectedTransaction.fee.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3" data-oid="ajqbp0_">
                  <div data-oid=":.sk1bw">
                    <label
                      className="block text-sm font-medium text-gray-600"
                      data-oid="lx.cs4d"
                    >
                      Transaction ID
                    </label>
                    <div
                      className="mt-1 font-mono text-sm bg-gray-50 p-2 rounded border border-gray-200 overflow-x-auto"
                      data-oid="qln.2qm"
                    >
                      {selectedTransaction.transaction_id}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4" data-oid="57oeisk">
                    <div data-oid="yg9keq:">
                      <label
                        className="block text-sm font-medium text-gray-600"
                        data-oid="6gv37n1"
                      >
                        Parent
                      </label>
                      <div
                        className="mt-1 bg-gray-50 p-2 rounded border border-gray-200"
                        data-oid=":hbk8-v"
                      >
                        {selectedTransaction.parent?.fullnames || "-"}
                      </div>
                    </div>
                    <div data-oid="h:7-w1p">
                      <label
                        className="block text-sm font-medium text-gray-600"
                        data-oid="-qyw4m7"
                      >
                        Student
                      </label>
                      <div
                        className="mt-1 bg-gray-50 p-2 rounded border border-gray-200"
                        data-oid="56bzx98"
                      >
                        {selectedTransaction.student?.student_name || "-"}
                      </div>
                    </div>
                  </div>

                  <div data-oid="wqm4.p9">
                    <label
                      className="block text-sm font-medium text-gray-600"
                      data-oid="pda9fo4"
                    >
                      Description
                    </label>
                    <div
                      className="mt-1 bg-gray-50 p-2 rounded border border-gray-200 min-h-[60px]"
                      data-oid="nspso0k"
                    >
                      {selectedTransaction.description ||
                        "No description provided"}
                    </div>
                  </div>

                  <div data-oid="_n0.o0q">
                    <label
                      className="block text-sm font-medium text-gray-600"
                      data-oid="84k2.x5"
                    >
                      Date & Time
                    </label>
                    <div
                      className="mt-1 bg-gray-50 p-2 rounded border border-gray-200"
                      data-oid="-.2b3k-"
                    >
                      {new Date(selectedTransaction.timestamp).toLocaleString()}
                    </div>
                  </div>

                  {selectedTransaction.latitude &&
                    selectedTransaction.longitude && (
                      <div data-oid="rmwhhvi">
                        <label
                          className="block text-sm font-medium text-gray-600"
                          data-oid="yirlpgq"
                        >
                          Location
                        </label>
                        <div
                          className="mt-1 bg-gray-50 p-2 rounded border border-gray-200"
                          data-oid="h7gw.0e"
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
                data-oid="q2v3tqz"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-oid="vednr.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    data-oid="ts78q1."
                  />
                </svg>
                <h3
                  className="text-lg font-medium text-gray-600 mb-1"
                  data-oid="y-.pi9c"
                >
                  No Transaction Selected
                </h3>
                <p className="text-gray-500 text-sm" data-oid="htqxj-j">
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
