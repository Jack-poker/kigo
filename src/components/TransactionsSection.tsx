import React, { useState, useEffect } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  ExternalLink,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  Eye,
  Navigation,
  Calendar,
  CreditCard,
  Shield,
  Info,
  Lock,
  AlertOctagon,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TransactionsSection = ({ transactions, onViewAll }) => {
  const { t } = useLanguage();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [blockStudent, setBlockStudent] = useState(false);
  const [mapError, setMapError] = useState(null);

  const enhanceTransactionData = (transaction) => ({
    ...transaction,
    location: {
      name: transaction.location || "School Cafeteria",
      address: "KG 123 St, Kigali, Rwanda",
      coordinates: {
        lat: -1.9441 + (Math.random() - 0.5) * 0.01,
        lng: 30.0619 + (Math.random() - 0.5) * 0.01,
      },
    },
    merchant: {
      name: transaction.merchant || "School Store",
      category: transaction.category || "Food & Beverages",
      verified: true,
    },
    security: {
      riskLevel:
        Math.random() > 0.9 ? "high" : Math.random() > 0.7 ? "medium" : "low",
      authMethod: "PIN + Biometric",
      deviceId: "DEVICE_" + Math.random().toString(36).substr(2, 9),
    },
    timestamp:
      transaction.date && !isNaN(new Date(transaction.date).getTime())
        ? new Date(transaction.date).toISOString()
        : "",
    receiptUrl: "#",
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return (
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" data-oid="gs7tm58" />
        );

      case "withdraw":
        return (
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" data-oid="_6e2tp." />
        );

      case "payment":
        return (
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" data-oid="l7pc41d" />
        );

      default:
        return (
          <Activity className="w-4 h-4 sm:w-5 sm:h-5" data-oid="4wb4565" />
        );
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "deposit":
        return "from-green-500 to-emerald-600";
      case "withdraw":
        return "from-red-500 to-rose-600";
      case "payment":
        return "from-blue-500 to-indigo-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle
            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
            data-oid="jt_zs9a"
          />
        );

      case "pending":
        return (
          <Clock
            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500"
            data-oid="9fh8s8y"
          />
        );

      case "failed":
        return (
          <XCircle
            className="w-3 h-3 sm:w-4 sm:h-4 text-red-500"
            data-oid="rq6pmmq"
          />
        );

      default:
        return (
          <Info
            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500"
            data-oid="d2gctiy"
          />
        );
    }
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            data-oid="auewu.m"
          >
            <AlertTriangle className="w-3 h-3 mr-1" data-oid="8dzw8gy" />
            High Risk
          </span>
        );

      case "medium":
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            data-oid="qdw-c96"
          >
            <AlertTriangle className="w-3 h-3 mr-1" data-oid="s:osgxk" />
            Medium Risk
          </span>
        );

      default:
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            data-oid="ra_2f3u"
          >
            <Shield className="w-3 h-3 mr-1" data-oid="ra__5ep" />
            Secure
          </span>
        );
    }
  };

  const getReportButtonStyle = (riskLevel) => {
    return riskLevel === "low"
      ? {
          icon: <Lock className="w-4 h-4" data-oid="kii_d:i" />,
          className:
            "flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium min-h-[48px]",
        }
      : {
          icon: <AlertOctagon className="w-4 h-4" data-oid="54bvd8j" />,
          className:
            "flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium min-h-[48px]",
        };
  };

  const handleReportTransaction = (event, transaction) => {
    event.preventDefault();
    console.log("Opening report modal for transaction:", transaction.id);
    setSelectedTransaction(transaction);
    setShowReportModal(true);
    setMapError(null); // Reset map error when opening report modal
  };

  const submitReport = (event) => {
    event.preventDefault();
    console.log(
      "Submitting report for transaction:",
      selectedTransaction?.id,
      "Reason:",
      reportReason,
      "Block Student:",
      blockStudent,
    );
    setShowReportModal(false);
    setReportReason("");
    setBlockStudent(false);
    setSelectedTransaction(null);
    setMapError(null);
  };

  const cancelReport = (event) => {
    event.preventDefault();
    setShowReportModal(false);
    setReportReason("");
    setBlockStudent(false);
    setMapError(null);
  };

  useEffect(() => {
    if (selectedTransaction && !showReportModal) {
      const mapContainer = document.getElementById(
        `map-${selectedTransaction.id}`,
      );
      if (!mapContainer) {
        console.error(`Map container map-${selectedTransaction.id} not found`);
        setMapError("Map could not be loaded. Please try again.");
        return;
      }

      try {
        const map = L.map(`map-${selectedTransaction.id}`, {
          zoomControl: true,
          attributionControl: true,
        }).setView(
          [
            selectedTransaction.location.coordinates.lat,
            selectedTransaction.location.coordinates.lng,
          ],

          15,
        );

        L.tileLayer(
          "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a>, © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 20,
          },
        ).addTo(map);

        const customIcon = L.divIcon({
          className: "custom-icon",
          html: `<div style="background-color: #facc15; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 8px rgba(0,0,0,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="2"></circle></svg></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
        });

        L.marker(
          [
            selectedTransaction.location.coordinates.lat,
            selectedTransaction.location.coordinates.lng,
          ],

          {
            icon: customIcon,
          },
        )
          .addTo(map)
          .bindPopup(selectedTransaction.location.name, {
            className: "custom-popup",
            offset: [0, -10],
          })
          .openPopup();

        return () => {
          map.remove();
        };
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError("Map could not be loaded. Please try again.");
      }
    }
  }, [selectedTransaction, showReportModal]);

  const getRiskExplanation = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return (
          <div
            className="text-sm text-gray-700 dark:text-gray-300"
            data-oid="_glhg-o"
          >
            <p className="mb-2" data-oid="ftqj-y3">
              This transaction has been flagged as high risk due to unusual
              activity, such as an unrecognized device or location.
            </p>
            <p data-oid="gl.gw2t">
              <strong data-oid="uxuh7qz">What you can do:</strong> Review the
              transaction details, contact our support team for assistance, or
              block the student’s account to prevent further transactions until
              resolved.
            </p>
          </div>
        );

      case "medium":
        return (
          <div
            className="text-sm text-gray-700 dark:text-gray-300"
            data-oid="3b6imlh"
          >
            <p className="mb-2" data-oid="9cqyost">
              This transaction is marked as medium risk, possibly due to a new
              merchant or a large amount.
            </p>
            <p data-oid="c6a111w">
              <strong data-oid="6s5kts5">What you can do:</strong> Monitor the
              account for further activity, verify the transaction with the
              student, or contact support for clarification.
            </p>
          </div>
        );

      default:
        return (
          <div
            className="text-sm text-gray-700 dark:text-gray-300"
            data-oid="r:py-5f"
          >
            <p className="mb-2" data-oid="pxt8:z0">
              This transaction is considered secure and low risk, with verified
              authentication and a known location.
            </p>
            <p data-oid="7s98w0j">
              <strong data-oid="6ixs3w:">What you can do:</strong> No immediate
              action is required, but you can report if something seems
              incorrect or block the student’s account if you have concerns.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <style data-oid="pkq6._c">
        {`
          .leaflet-container {
            background: #1a1a1a;
          }
          .custom-popup .leaflet-popup-content-wrapper {
            background: #2d2d2d;
            color: #facc15;
            font-size: 14px;
            font-weight: 500;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }
          .custom-popup .leaflet-popup-tip {
            background: #2d2d2d;
          }
          .leaflet-control-attribution {
            font-size: 10px;
            background: rgba(0,0,0,0.7) !important;
            color: #ccc !important;
          }
          .leaflet-control-zoom a {
            background: #2d2d2d !important;
            color: #facc15 !important;
            border-color: #facc15 !important;
          }
        `}
      </style>
      <div
        className="dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 bg-[#FFFFFF00] bg-[url(/images/lWqp.png)]"
        data-oid="tghkop."
      >
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3"
          data-oid="i:d__6u"
        >
          <div
            className="flex items-center space-x-3 sm:space-x-4"
            data-oid="f3j:clv"
          >
            <div
              className="p-2 sm:p-3 from-purple-500 to-indigo-600 rounded-xl shadow-lg bg-none bg-[#1350D2]"
              data-oid="s_yj2rq"
            >
              <Activity
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                data-oid="l.ga775"
              />
            </div>
            <div data-oid="ef_5ucb">
              <h3
                className="text-lg sm:text-xl font-bold text-brand dark:text-brand"
                data-oid="cphni43"
              >
                Transaction Monitor
              </h3>
              <p
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                data-oid="njp-q.e"
              >
                Real-time activity tracking with location data
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center space-x-2 from-indigo-500 to-purple-600 hover:from-indigo-600 
            hover:to-purple-700 text-white px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 font-medium shadow-lg
             hover:shadow-xl transform hover:scale-105 bg-none bg-brand min-h-[48px] w-full sm:w-auto"
            data-oid="h36k9ne"
          >
            <span data-oid="1fe89nv">{t("viewAll")}</span>
            <ExternalLink
              className="w-4 h-4 bg-[rgba(0,_0,_0,_0)]"
              data-oid="az082hs"
            />
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-4" data-oid="2laeebz">
          {transactions.slice(0, 5).map((transaction) => {
            const enhanced = enhanceTransactionData(transaction);
            const reportButton = getReportButtonStyle(
              enhanced.security.riskLevel,
            );

            return (
              <div
                key={transaction.id}
                className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 border dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 border-[#1C0645E8]"
                data-oid="smx_hs3"
              >
                {/* Transaction Header */}

                <div
                  className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3"
                  data-oid="fm3tobh"
                >
                  <div
                    className="flex items-center space-x-3 sm:space-x-4 w-full"
                    data-oid="1.-xqvu"
                  >
                    <div
                      className={`p-2 sm:p-3 bg-brand ${getTransactionColor(transaction.type)} rounded-xl shadow-lg text-white`}
                      data-oid="ccdt-rv"
                    >
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1" data-oid="f7yk1rm">
                      <div
                        className="flex items-center space-x-2 sm:space-x-3 mb-1 flex-wrap"
                        data-oid="qlwmz.x"
                      >
                        <h4
                          className="font-bold text-base sm:text-lg text-brand dark:text-white"
                          data-oid="upc9i-d"
                        >
                          {transaction.title}
                        </h4>
                        {getStatusIcon(transaction.status)}
                        {getRiskBadge(enhanced.security.riskLevel)}
                      </div>
                      <div
                        className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                        data-oid="nm7mz3n"
                      >
                        <span
                          className="flex items-center space-x-1"
                          data-oid="bo0mie3"
                        >
                          <CreditCard
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            data-oid="ngkmn4q"
                          />

                          <span data-oid="fpbp37-">
                            {transaction.student || "Main Wallet"}
                          </span>
                        </span>
                        <span
                          className="flex items-center space-x-1"
                          data-oid="-psn:fr"
                        >
                          <Calendar
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            data-oid="of6ys0n"
                          />

                          <span data-oid="6pyg2n6">{transaction.date}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right mt-2 sm:mt-0" data-oid="7ocmtjn">
                    <div
                      className={`text-lg sm:text-2xl font-bold ${transaction.amount > 0 ? "text-brand" : "text-red"}`}
                      data-oid="6hsrjbv"
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div
                      className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                      data-oid="p:i_ko4"
                    >
                      {enhanced.security.authMethod}
                    </div>
                  </div>
                </div>
                <div
                  className="dark:bg-brand rounded-xl p-3 sm:p-4 mb-4 border border-brand dark:border-gray-600 bg-brand"
                  data-oid="lnq6ihn"
                >
                  <div
                    className="flex flex-col sm:grid sm:grid-cols-2 gap-3"
                    data-oid="w.g41ny"
                  >
                    <div className="space-y-2" data-oid="ig5eqll">
                      <div
                        className="flex items-center space-x-2"
                        data-oid="u7k06ce"
                      >
                        <MapPin
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBB300]"
                          data-oid="td_543t"
                        />

                        <span
                          className="font-semibold text-sm sm:text-base dark:text-white text-[#FBF4F4]"
                          data-oid="qjrsad_"
                        >
                          {enhanced.location.name}
                        </span>
                        {enhanced.merchant.verified && (
                          <CheckCircle
                            className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                            data-oid="g7bq0q7"
                          />
                        )}
                      </div>
                      <p
                        className="text-xs sm:text-sm dark:text-gray-400 ml-6 text-[#F7EFEFFA]"
                        data-oid="4695_l5"
                      >
                        {enhanced.location.address}
                      </p>
                      <div
                        className="flex items-center space-x-2 ml-6"
                        data-oid="ai57l4l"
                      >
                        <span
                          className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full"
                          data-oid=":0pq1gr"
                        >
                          {enhanced.merchant.category}
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex flex-wrap items-center justify-start sm:justify-end gap-2 sm:gap-3"
                      data-oid="8_x85i:"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedTransaction(enhanced)}
                        className="flex items-center space-x-2 text-brand px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium min-h-[48px] bg-white"
                        data-oid="9h33n61"
                      >
                        <Eye className="w-4 h-4" data-oid="qlhhm5c" />
                        <span data-oid="8hol0bx">Details</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleReportTransaction(e, enhanced)}
                        className={reportButton.className}
                        data-oid="0.larq9"
                      >
                        {reportButton.icon}
                        <span data-oid="qd1_my8">Report</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location & Merchant Info */}

                {/* Security Info */}
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                  data-oid="qmdys5k"
                >
                  <span data-oid="j25hfp4">
                    Device: {enhanced.security.deviceId}
                  </span>
                  <span data-oid=":mnru31">
                    Coordinates: {enhanced.location.coordinates.lat.toFixed(4)},{" "}
                    {enhanced.location.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            );
          })}
          {transactions.length === 0 && (
            <div className="text-center py-8 sm:py-12" data-oid="2yqbwm8">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 dark:bg-brand rounded-full flex items-center justify-center bg-[#1350D2]"
                data-oid="ij_tc9t"
              >
                <Activity
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  data-oid="tha83b_"
                />
              </div>
              <h3
                className="text-base sm:text-lg font-semibold text-brand dark:text-white mb-2 bg-[rgba(0,_0,_0,_0)]"
                data-oid="o.fwvjf"
              >
                No Recent Transactions
              </h3>
              <p
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                data-oid="_7-09zz"
              >
                Transaction history will appear here when available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && !showReportModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6"
          data-oid="3tptuea"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 max-w-md sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            data-oid="228ib:f"
          >
            <div
              className="flex items-center justify-between mb-4 sm:mb-6"
              data-oid="jk7218:"
            >
              <h3
                className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white"
                data-oid="r9tmu37"
              >
                Transaction Details
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedTransaction(null);
                  setMapError(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg min-h-[48px]"
                data-oid="4z1abl5"
              >
                <XCircle
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
                  data-oid="41-putz"
                />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6" data-oid="ouocw_a">
              {/* Amount & Status */}
              <div
                className="text-center p-4 sm:p-6 from-indigo-50 to-purple-50 dark: rounded-xl bg-none bg-brand"
                data-oid="lfy9zp_"
              >
                <div
                  className={`text-2xl sm:text-3xl font-bold mb-2 ${
                    selectedTransaction.amount > 0
                      ? "text-yellow-400"
                      : "text-yellow-400"
                  }`}
                  data-oid="aa63xyf"
                >
                  {selectedTransaction.amount > 0 ? "+" : ""}
                  {formatCurrency(selectedTransaction.amount)}
                </div>
                <div
                  className="flex items-center justify-center space-x-2"
                  data-oid="u4b:w.q"
                >
                  {getStatusIcon(selectedTransaction.status)}
                  <span
                    className="text-base sm:text-lg font-medium dark:text-gray-300 capitalize text-[#F8F4F4]"
                    data-oid="snp8kj6"
                  >
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>

              {/* Location Map Preview */}
              <div
                className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4"
                data-oid="cickaa9"
              >
                <h4
                  className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center"
                  data-oid="mr0fhhq"
                >
                  <MapPin
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                    data-oid="ewi.4s4"
                  />
                  Transaction Location
                </h4>
                <div
                  className="bg-white dark:bg-gray-600 rounded-lg p-4 text-center"
                  data-oid="r0rhizy"
                >
                  <div
                    className="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
                    data-oid="8v:._hw"
                  >
                    {selectedTransaction.location.name}
                  </div>
                  <div
                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3"
                    data-oid="paehdny"
                  >
                    {selectedTransaction.location.address}
                  </div>
                  {mapError ? (
                    <div className="text-red-500 text-sm" data-oid="1efqbx5">
                      {mapError}
                    </div>
                  ) : (
                    <div
                      id={`map-${selectedTransaction.id}`}
                      className="w-full h-64 sm:h-80 rounded-lg"
                      style={{ minHeight: "16rem" }}
                      data-oid="-ryg.2."
                    ></div>
                  )}
                </div>
              </div>

              {/* Security & Device Info */}
              <div
                className="flex flex-col sm:grid sm:grid-cols-2 gap-4"
                data-oid=".0lypt4"
              >
                <div
                  className="dark:bg-gray-700 rounded-xl p-4 bg-[#4E2EBA40]"
                  data-oid="b8r32h:"
                >
                  <h4
                    className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center"
                    data-oid="7:zaa-d"
                  >
                    <Shield
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      data-oid="_26g034"
                    />
                    Security
                  </h4>
                  <div
                    className="space-y-2 text-xs sm:text-sm"
                    data-oid="cuyg3sc"
                  >
                    <div data-oid="rcieu5l">
                      Risk Level:{" "}
                      {getRiskBadge(selectedTransaction.security.riskLevel)}
                    </div>
                    <div data-oid="evd87i7">
                      Auth Method: {selectedTransaction.security.authMethod}
                    </div>
                    <div data-oid="csfpc1z">
                      Device ID: {selectedTransaction.security.deviceId}
                    </div>
                  </div>
                </div>
                <div
                  className="dark:bg-gray-700 rounded-xl p-4 bg-[#381A733A]"
                  data-oid="a.8skss"
                >
                  <h4
                    className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center"
                    data-oid="5ocj8hu"
                  >
                    <Info
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      data-oid="hwfj.xf"
                    />
                    Details
                  </h4>
                  <div
                    className="space-y-2 text-xs sm:text-sm"
                    data-oid="hzghim9"
                  >
                    <div data-oid="rz.gkyl">
                      Merchant: {selectedTransaction.merchant.name}
                    </div>
                    <div data-oid="n.8ck79">
                      Category: {selectedTransaction.merchant.category}
                    </div>
                    <div data-oid="wy01shj">
                      Student: {selectedTransaction.student || "Main Wallet"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && selectedTransaction && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6"
          data-oid="6uce06d"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            data-oid="4o8:gs5"
          >
            <div
              className="flex items-center justify-between mb-4 sm:mb-6"
              data-oid="qo7q4ek"
            >
              <h3
                className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center"
                data-oid="9escdaw"
              >
                <Flag
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500"
                  data-oid="exdhj1_"
                />
                Report Transaction
              </h3>
              <button
                type="button"
                onClick={cancelReport}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg min-h-[48px]"
                data-oid="ryumoh."
              >
                <XCircle
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
                  data-oid="t4_d9-t"
                />
              </button>
            </div>

            <div className="space-y-4" data-oid="r8dqn6g">
              <div data-oid="73_.zya">
                {getRiskExplanation(selectedTransaction.security.riskLevel)}
              </div>
              <div data-oid=":rb6al-">
                <label
                  className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="9h0:drd"
                >
                  Reason for reporting:
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  data-oid="tlhn0ot"
                >
                  <option value="" data-oid="a16gl3q">
                    Select a reason
                  </option>
                  <option value="unauthorized" data-oid="mn-mra0">
                    Unauthorized transaction
                  </option>
                  <option value="wrong_amount" data-oid="nf5lwd4">
                    Wrong amount charged
                  </option>
                  <option value="duplicate" data-oid="ux9ogh2">
                    Duplicate transaction
                  </option>
                  <option value="fraud" data-oid="_bdkbp9">
                    Suspected fraud
                  </option>
                  <option value="location_mismatch" data-oid="wsexdf7">
                    Location doesn't match
                  </option>
                  <option value="other" data-oid="r7.nprv">
                    Other
                  </option>
                </select>
              </div>
              <div data-oid="lmvbe4-">
                <label
                  className="flex items-center space-x-2 text-sm sm:text-base text-gray-700 dark:text-gray-300"
                  data-oid="8.7rd7a"
                >
                  <input
                    type="checkbox"
                    checked={blockStudent}
                    onChange={(e) => setBlockStudent(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                    data-oid="mpaco.b"
                  />

                  <span data-oid="fmdo_vf">
                    Block student account (prevents further transactions)
                  </span>
                </label>
              </div>
              <div
                className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                data-oid="-f9pim7"
              >
                <button
                  type="button"
                  onClick={cancelReport}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg transition-all duration-200 font-medium min-h-[48px]"
                  data-oid="8yobjcu"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitReport}
                  disabled={!reportReason}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 min-h-[48px]"
                  data-oid="2tsc:v2"
                >
                  <Flag className="w-4 h-4" data-oid="_lckfw-" />
                  <span data-oid="8ecr94q">Submit Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionsSection;
