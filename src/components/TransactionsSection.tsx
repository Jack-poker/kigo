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
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" data-oid="z7a2ge6" />
        );

      case "withdraw":
        return (
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" data-oid="9oo41bc" />
        );

      case "payment":
        return (
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" data-oid="8pkmwqu" />
        );

      default:
        return (
          <Activity className="w-4 h-4 sm:w-5 sm:h-5" data-oid="3qpetfu" />
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
            data-oid="nckbno-"
          />
        );

      case "pending":
        return (
          <Clock
            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500"
            data-oid="vmbb85z"
          />
        );

      case "failed":
        return (
          <XCircle
            className="w-3 h-3 sm:w-4 sm:h-4 text-red-500"
            data-oid="rw30ou6"
          />
        );

      default:
        return (
          <Info
            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500"
            data-oid="bxtpaef"
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
            data-oid="cc2e965"
          >
            <AlertTriangle className="w-3 h-3 mr-1" data-oid="-vfjtrl" />
            High Risk
          </span>
        );

      case "medium":
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            data-oid="2iy-2sz"
          >
            <AlertTriangle className="w-3 h-3 mr-1" data-oid="5h_5b3:" />
            Medium Risk
          </span>
        );

      default:
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            data-oid="8xfqv-b"
          >
            <Shield className="w-3 h-3 mr-1" data-oid="2z4203q" />
            Secure
          </span>
        );
    }
  };

  const getReportButtonStyle = (riskLevel) => {
    return riskLevel === "low"
      ? {
          icon: <Lock className="w-4 h-4" data-oid="vt:rgh9" />,
          className:
            "flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium min-h-[48px]",
        }
      : {
          icon: <AlertOctagon className="w-4 h-4" data-oid="h201.rs" />,
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
            data-oid="risk-explanation-high"
          >
            <p className="mb-2" data-oid="v9lmtx.">
              This transaction has been flagged as high risk due to unusual
              activity, such as an unrecognized device or location.
            </p>
            <p data-oid="4vxz-82">
              <strong data-oid="19c97j-">What you can do:</strong> Review the
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
            data-oid="risk-explanation-medium"
          >
            <p className="mb-2" data-oid="i2f5ozf">
              This transaction is marked as medium risk, possibly due to a new
              merchant or a large amount.
            </p>
            <p data-oid="jrx34kq">
              <strong data-oid="mzqbtl2">What you can do:</strong> Monitor the
              account for further activity, verify the transaction with the
              student, or contact support for clarification.
            </p>
          </div>
        );

      default:
        return (
          <div
            className="text-sm text-gray-700 dark:text-gray-300"
            data-oid="risk-explanation-low"
          >
            <p className="mb-2" data-oid="x2hn4sw">
              This transaction is considered secure and low risk, with verified
              authentication and a known location.
            </p>
            <p data-oid="_yrubim">
              <strong data-oid="cxkv_:j">What you can do:</strong> No immediate
              action is required, but you can report if something seems
              incorrect or block the student’s account if you have concerns.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <style data-oid="lo2fbsf">
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
        data-oid="41h1g2:"
      >
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3"
          data-oid="lscw9h6"
        >
          <div
            className="flex items-center space-x-3 sm:space-x-4"
            data-oid="xcvc8x3"
          >
            <div
              className="p-2 sm:p-3 from-purple-500 to-indigo-600 rounded-xl shadow-lg bg-none bg-[#1350D2]"
              data-oid="9diip6z"
            >
              <Activity
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                data-oid="a0g6tn3"
              />
            </div>
            <div data-oid="-cmtu6_">
              <h3
                className="text-lg sm:text-xl font-bold text-brand dark:text-brand"
                data-oid="l3yrh3b"
              >
                Transaction Monitor
              </h3>
              <p
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                data-oid="xst0adj"
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
            data-oid="8.sk0i-"
          >
            <span data-oid=":4o.-1h">{t("viewAll")}</span>
            <ExternalLink
              className="w-4 h-4 bg-[rgba(0,_0,_0,_0)]"
              data-oid="68ldhft"
            />
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-4" data-oid="7lbk.89">
          {transactions.slice(0, 5).map((transaction) => {
            const enhanced = enhanceTransactionData(transaction);
            const reportButton = getReportButtonStyle(
              enhanced.security.riskLevel,
            );

            return (
              <div
                key={transaction.id}
                className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 border dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 border-[#1C0645E8]"
                data-oid="80p3:tk"
              >
                {/* Transaction Header */}

                <div
                  className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3"
                  data-oid="j5r7cbf"
                >
                  <div
                    className="flex items-center space-x-3 sm:space-x-4 w-full"
                    data-oid="guc5-00"
                  >
                    <div
                      className={`p-2 sm:p-3 bg-brand ${getTransactionColor(transaction.type)} rounded-xl shadow-lg text-white`}
                      data-oid="p5sf26_"
                    >
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1" data-oid="s-mmvbs">
                      <div
                        className="flex items-center space-x-2 sm:space-x-3 mb-1 flex-wrap"
                        data-oid="sb_7r89"
                      >
                        <h4
                          className="font-bold text-base sm:text-lg text-brand dark:text-white"
                          data-oid="p6vvis7"
                        >
                          {transaction.title}
                        </h4>
                        {getStatusIcon(transaction.status)}
                        {getRiskBadge(enhanced.security.riskLevel)}
                      </div>
                      <div
                        className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                        data-oid="dsq_7tq"
                      >
                        <span
                          className="flex items-center space-x-1"
                          data-oid="qe44m67"
                        >
                          <CreditCard
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            data-oid="jsmsq0b"
                          />

                          <span data-oid="zx2d794">
                            {transaction.student || "Main Wallet"}
                          </span>
                        </span>
                        <span
                          className="flex items-center space-x-1"
                          data-oid="xf8nsza"
                        >
                          <Calendar
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            data-oid="ohlzeeo"
                          />

                          <span data-oid="y6-o9oi">{transaction.date}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right mt-2 sm:mt-0" data-oid="yfervje">
                    <div
                      className={`text-lg sm:text-2xl font-bold ${transaction.amount > 0 ? "text-brand" : "text-red"}`}
                      data-oid="_5lwt1w"
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div
                      className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                      data-oid="4zn6lof"
                    >
                      {enhanced.security.authMethod}
                    </div>
                  </div>
                </div>
                <div
                  className="dark:bg-brand rounded-xl p-3 sm:p-4 mb-4 border border-brand dark:border-gray-600 bg-brand"
                  data-oid="e.w75as"
                  key="olk-mnRM"
                >
                  <div
                    className="flex flex-col sm:grid sm:grid-cols-2 gap-3"
                    data-oid="1.bjslb"
                  >
                    <div className="space-y-2" data-oid="uc.xqef">
                      <div
                        className="flex items-center space-x-2"
                        data-oid="aq_wqqt"
                      >
                        <MapPin
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBB300]"
                          data-oid="9c244j7"
                        />

                        <span
                          className="font-semibold text-sm sm:text-base dark:text-white text-[#FBF4F4]"
                          data-oid="ic4pe:."
                        >
                          {enhanced.location.name}
                        </span>
                        {enhanced.merchant.verified && (
                          <CheckCircle
                            className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                            data-oid="27fvk0x"
                          />
                        )}
                      </div>
                      <p
                        className="text-xs sm:text-sm dark:text-gray-400 ml-6 text-[#F7EFEFFA]"
                        data-oid="n2a_acv"
                      >
                        {enhanced.location.address}
                      </p>
                      <div
                        className="flex items-center space-x-2 ml-6"
                        data-oid="jkh5bhc"
                      >
                        <span
                          className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full"
                          data-oid="waff0ph"
                        >
                          {enhanced.merchant.category}
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex flex-wrap items-center justify-start sm:justify-end gap-2 sm:gap-3"
                      data-oid="q31o0x6"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedTransaction(enhanced)}
                        className="flex items-center space-x-2 text-brand px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium min-h-[48px] bg-white"
                        data-oid="mxa1r4f"
                      >
                        <Eye className="w-4 h-4" data-oid="kzm7_2h" />
                        <span data-oid="1gd1jxt">Details</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleReportTransaction(e, enhanced)}
                        className={reportButton.className}
                        data-oid="_j5dyvn"
                      >
                        {reportButton.icon}
                        <span data-oid="2xso77s">Report</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location & Merchant Info */}

                {/* Security Info */}
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                  data-oid="pq3z9kx"
                >
                  <span data-oid="bsc-u0f">
                    Device: {enhanced.security.deviceId}
                  </span>
                  <span data-oid="a764qwr">
                    Coordinates: {enhanced.location.coordinates.lat.toFixed(4)},{" "}
                    {enhanced.location.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            );
          })}
          {transactions.length === 0 && (
            <div className="text-center py-8 sm:py-12" data-oid="vgrmdiv">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 dark:bg-brand rounded-full flex items-center justify-center bg-[#1350D2]"
                data-oid="m:d6s0."
              >
                <Activity
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  data-oid="aj5ujwm"
                />
              </div>
              <h3
                className="text-base sm:text-lg font-semibold text-brand dark:text-white mb-2 bg-[rgba(0,_0,_0,_0)]"
                data-oid="n1q:_k:"
              >
                No Recent Transactions
              </h3>
              <p
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                data-oid="gu9wl30"
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
          data-oid="o7l3kas"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 max-w-md sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            data-oid="dyxm36b"
          >
            <div
              className="flex items-center justify-between mb-4 sm:mb-6"
              data-oid=".ycc-_e"
            >
              <h3
                className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white"
                data-oid="5j.1eti"
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
                data-oid="l9haa2t"
              >
                <XCircle
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
                  data-oid=":6684nw"
                />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6" data-oid="9u7j2pd">
              {/* Amount & Status */}
              <div
                className="text-center p-4 sm:p-6 from-indigo-50 to-purple-50 dark: rounded-xl bg-none bg-brand"
                data-oid="nbo:4.d"
              >
                <div
                  className={`text-2xl sm:text-3xl font-bold mb-2 ${
                    selectedTransaction.amount > 0
                      ? "text-yellow-400"
                      : "text-yellow-400"
                  }`}
                  data-oid="ljmcjzj"
                >
                  {selectedTransaction.amount > 0 ? "+" : ""}
                  {formatCurrency(selectedTransaction.amount)}
                </div>
                <div
                  className="flex items-center justify-center space-x-2"
                  data-oid="c0ongvg"
                >
                  {getStatusIcon(selectedTransaction.status)}
                  <span
                    className="text-base sm:text-lg font-medium dark:text-gray-300 capitalize text-[#F8F4F4]"
                    data-oid="s52yjsz"
                  >
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>

              {/* Location Map Preview */}
              <div
                className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4"
                data-oid="hyntsdo"
              >
                <h4
                  className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center"
                  data-oid="v3bsau1"
                >
                  <MapPin
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                    data-oid="ndc3iyg"
                  />
                  Transaction Location
                </h4>
                <div
                  className="bg-white dark:bg-gray-600 rounded-lg p-4 text-center"
                  data-oid="kmnpg1u"
                >
                  <div
                    className="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
                    data-oid="x:talxg"
                  >
                    {selectedTransaction.location.name}
                  </div>
                  <div
                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3"
                    data-oid="_7xw4dr"
                  >
                    {selectedTransaction.location.address}
                  </div>
                  {mapError ? (
                    <div className="text-red-500 text-sm" data-oid="map-error">
                      {mapError}
                    </div>
                  ) : (
                    <div
                      id={`map-${selectedTransaction.id}`}
                      className="w-full h-64 sm:h-80 rounded-lg"
                      style={{ minHeight: "16rem" }}
                      data-oid="vczott6"
                    ></div>
                  )}
                </div>
              </div>

              {/* Security & Device Info */}
              <div
                className="flex flex-col sm:grid sm:grid-cols-2 gap-4"
                data-oid="hi9cjlq"
              >
                <div
                  className="dark:bg-gray-700 rounded-xl p-4 bg-[#4E2EBA40]"
                  data-oid="soycrdv"
                >
                  <h4
                    className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center"
                    data-oid="duibi.t"
                  >
                    <Shield
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      data-oid="4pzr7m-"
                    />
                    Security
                  </h4>
                  <div
                    className="space-y-2 text-xs sm:text-sm"
                    data-oid="ek4elyq"
                  >
                    <div data-oid="tcxoxl5">
                      Risk Level:{" "}
                      {getRiskBadge(selectedTransaction.security.riskLevel)}
                    </div>
                    <div data-oid="jegma3u">
                      Auth Method: {selectedTransaction.security.authMethod}
                    </div>
                    <div data-oid="o1admda">
                      Device ID: {selectedTransaction.security.deviceId}
                    </div>
                  </div>
                </div>
                <div
                  className="dark:bg-gray-700 rounded-xl p-4 bg-[#381A733A]"
                  data-oid=".vd.j4v"
                >
                  <h4
                    className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center"
                    data-oid="8q:npvv"
                  >
                    <Info
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      data-oid="yq::p58"
                    />
                    Details
                  </h4>
                  <div
                    className="space-y-2 text-xs sm:text-sm"
                    data-oid="772x7b."
                  >
                    <div data-oid="_kkbo_0">
                      Merchant: {selectedTransaction.merchant.name}
                    </div>
                    <div data-oid="ubb_u3q">
                      Category: {selectedTransaction.merchant.category}
                    </div>
                    <div data-oid="r5wm99:">
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
          data-oid="enp0x.-"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            data-oid="s49bc7s"
          >
            <div
              className="flex items-center justify-between mb-4 sm:mb-6"
              data-oid="89ny8ah"
            >
              <h3
                className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center"
                data-oid="uyy-ul."
              >
                <Flag
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500"
                  data-oid="6:u-i78"
                />
                Report Transaction
              </h3>
              <button
                type="button"
                onClick={cancelReport}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg min-h-[48px]"
                data-oid="1f8naa7"
              >
                <XCircle
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
                  data-oid="uxikd6o"
                />
              </button>
            </div>

            <div className="space-y-4" data-oid="kf__nmx">
              <div data-oid="risk-info">
                {getRiskExplanation(selectedTransaction.security.riskLevel)}
              </div>
              <div data-oid="fuogczx">
                <label
                  className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="inv0muo"
                >
                  Reason for reporting:
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  data-oid="73.u9ys"
                >
                  <option value="" data-oid="ft_3kuk">
                    Select a reason
                  </option>
                  <option value="unauthorized" data-oid="xidke.s">
                    Unauthorized transaction
                  </option>
                  <option value="wrong_amount" data-oid=".373u0f">
                    Wrong amount charged
                  </option>
                  <option value="duplicate" data-oid="yw29-4d">
                    Duplicate transaction
                  </option>
                  <option value="fraud" data-oid="u:o52yo">
                    Suspected fraud
                  </option>
                  <option value="location_mismatch" data-oid="r5velsu">
                    Location doesn't match
                  </option>
                  <option value="other" data-oid="c:6hny6">
                    Other
                  </option>
                </select>
              </div>
              <div data-oid="block-student-option">
                <label
                  className="flex items-center space-x-2 text-sm sm:text-base text-gray-700 dark:text-gray-300"
                  data-oid="wnh5ltn"
                >
                  <input
                    type="checkbox"
                    checked={blockStudent}
                    onChange={(e) => setBlockStudent(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                    data-oid="block-student-checkbox"
                  />

                  <span data-oid="block-student-label">
                    Block student account (prevents further transactions)
                  </span>
                </label>
              </div>
              <div
                className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                data-oid="8661onl"
              >
                <button
                  type="button"
                  onClick={cancelReport}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg transition-all duration-200 font-medium min-h-[48px]"
                  data-oid="37sybvh"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitReport}
                  disabled={!reportReason}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 min-h-[48px]"
                  data-oid="dx6rnrf"
                >
                  <Flag className="w-4 h-4" data-oid="fkhyihl" />
                  <span data-oid="aw8_wvq">Submit Report</span>
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
