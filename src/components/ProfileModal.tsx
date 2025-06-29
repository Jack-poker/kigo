import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  Camera,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    about: "",
    linked_students: 0,
    total_transactions: 0,
    days_active: 0,
  });
  const [csrfToken, setCsrfToken] = useState("");

  const API_URL = "http://localhost:8001";

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-csrf-token`);
      setCsrfToken(response.data.csrf_token);
      return response.data.csrf_token;
    } catch (err) {
      console.error("Failed to fetch CSRF token:", err);
      setError(t("serverError"));
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.profile);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(t("profileError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCsrfToken();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const csrf = csrfToken || (await fetchCsrfToken());
      await axios.put(
        `${API_URL}/profile`,
        {
          fullnames: profile.full_name,
          email: profile.email || null,
          address: profile.address || null,
          about: profile.about || null,
          csrf_token: csrf,
        },
        { headers: { Authorization: `Bearer ${token}`, "X-CSRF-Token": csrf } },
      );
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(t("profileUpdateError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      data-oid="rp2i5af"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        data-oid="sh4w032"
      >
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
          data-oid="kw4o8g3"
        >
          <h2
            className="text-xl font-bold text-gray-900 dark:text-white"
            data-oid="wejb.u."
          >
            {t("profileSettings")}
          </h2>
          <div className="flex items-center space-x-2" data-oid="alr54ql">
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-200 font-medium"
              disabled={isLoading}
              data-oid="ickp1_w"
            >
              {isEditing ? (
                <Save className="w-4 h-4" data-oid="cuj94b9" />
              ) : (
                <Edit3 className="w-4 h-4" data-oid="j::3olx" />
              )}
              <span data-oid="voza7qv">
                {isEditing ? t("save") : t("edit")}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              data-oid="v74nsx0"
            >
              <X className="w-5 h-5" data-oid="h5:m03o" />
            </button>
          </div>
        </div>

        {error && (
          <div
            className="m-6 p-4 bg-red-100 text-red-700 rounded-xl"
            data-oid="pd0.vz0"
          >
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-900"
              data-oid="asplg.h"
            >
              X
            </button>
          </div>
        )}

        <div className="p-6" data-oid="rx3lauk">
          <div className="flex items-center space-x-6 mb-8" data-oid="bnp_hgb">
            <div className="relative" data-oid="j_zerpr">
              <div
                className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl"
                data-oid="wthawri"
              >
                <User className="w-12 h-12 text-white" data-oid="as104cp" />
              </div>
              {isEditing && (
                <button
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                  data-oid="t_hxyv8"
                >
                  <Camera className="w-4 h-4" data-oid="_p0o5tu" />
                </button>
              )}
            </div>
            <div data-oid="o9bzk8r">
              <h3
                className="text-2xl font-bold text-gray-900 dark:text-white"
                data-oid="i.htnib"
              >
                {profile.full_name}
              </h3>
              <p
                className="text-gray-600 dark:text-gray-400"
                data-oid="kt_vsxi"
              >
                {t("trustedGuardian")}
              </p>
              <div
                className="flex items-center space-x-2 mt-2"
                data-oid="gk9wx6y"
              >
                <div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  data-oid=":wfuo87"
                ></div>
                <span
                  className="text-sm text-green-600 dark:text-green-400 font-medium"
                  data-oid="hyx9i33"
                >
                  {t("activeAccount")}
                </span>
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-oid="057jzui"
          >
            <div className="space-y-6" data-oid="51lm8tj">
              <div data-oid="6i_31fr">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid=":n9.r0b"
                >
                  <User className="w-4 h-4 inline mr-2" data-oid="j5lu.dg" />
                  {t("fullName")}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) =>
                      setProfile({ ...profile, full_name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    data-oid="u368ssf"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="4f72cnd"
                  >
                    {profile.full_name}
                  </p>
                )}
              </div>

              <div data-oid="omiu59r">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="uqut1yc"
                >
                  <Mail className="w-4 h-4 inline mr-2" data-oid="foslll0" />
                  {t("emailAddress")}
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    data-oid="zq7n:6l"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="8ygfa_u"
                  >
                    {profile.email || "N/A"}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6" data-oid="klz4mt8">
              <div data-oid="b9elzq7">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="s9kcs1p"
                >
                  <Phone className="w-4 h-4 inline mr-2" data-oid=":ycy_c1" />
                  {t("phoneNumber")}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone_number}
                    onChange={(e) =>
                      setProfile({ ...profile, phone_number: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    data-oid="69hybhc"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="sm:3vqj"
                  >
                    {profile.phone_number}
                  </p>
                )}
              </div>

              <div data-oid="rja1_tj">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="w_zwkb3"
                >
                  <MapPin className="w-4 h-4 inline mr-2" data-oid="f5:up3z" />
                  {t("address")}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    data-oid="8s85_31"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="yyydpat"
                  >
                    {profile.address || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6" data-oid="8tamaai">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              data-oid="i3h_sih"
            >
              {t("about")}
            </label>
            {isEditing ? (
              <textarea
                value={profile.about}
                onChange={(e) =>
                  setProfile({ ...profile, about: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 resize-none"
                data-oid="hmm:lr1"
              />
            ) : (
              <p
                className="text-gray-600 dark:text-gray-400"
                data-oid="vf_cdwf"
              >
                {profile.about || "N/A"}
              </p>
            )}
          </div>

          <div
            className="grid grid-cols-3 gap-4 mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
            data-oid=".rw7fnx"
          >
            <div className="text-center" data-oid="k0cdclo">
              <p
                className="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                data-oid="1g6632n"
              >
                {profile.linked_students}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="oi8vka2"
              >
                {t("linkedStudents")}
              </p>
            </div>
            <div className="text-center" data-oid="r9eefjp">
              <p
                className="text-2xl font-bold text-green-600 dark:text-green-400"
                data-oid="lc-npl_"
              >
                {profile.total_transactions}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="7jr0f3p"
              >
                {t("totalTransactions")}
              </p>
            </div>
            <div className="text-center" data-oid="zf3ltto">
              <p
                className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                data-oid="tok-1g7"
              >
                {profile.days_active}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="c1p5i9d"
              >
                {t("daysActive")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
