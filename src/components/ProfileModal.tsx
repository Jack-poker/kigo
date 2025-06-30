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

  const API_URL = "https://api.kaascan.com";

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
      data-oid="pfqj6ge"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        data-oid="vjy8t-7"
      >
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
          data-oid=".cc-8k_"
        >
          <h2
            className="text-xl font-bold text-gray-900 dark:text-white"
            data-oid="s9txg:4"
          >
            {t("profileSettings")}
          </h2>
          <div className="flex items-center space-x-2" data-oid="g9ifl0_">
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-200 font-medium"
              disabled={isLoading}
              data-oid="b6r2hj1"
            >
              {isEditing ? (
                <Save className="w-4 h-4" data-oid="becqmro" />
              ) : (
                <Edit3 className="w-4 h-4" data-oid="t:r2:lo" />
              )}
              <span data-oid="no789xy">
                {isEditing ? t("save") : t("edit")}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              data-oid="qbvrjt2"
            >
              <X className="w-5 h-5" data-oid="tyxdd7s" />
            </button>
          </div>
        </div>

        {error && (
          <div
            className="m-6 p-4 bg-red-100 text-red-700 rounded-xl"
            data-oid="0bis8rr"
          >
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-900"
              data-oid="yb5oyr0"
            >
              X
            </button>
          </div>
        )}

        <div className="p-6" data-oid="nrimuna">
          <div className="flex items-center space-x-6 mb-8" data-oid="wq-7zb0">
            <div className="relative" data-oid="g2diesy">
              <div
                className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl"
                data-oid="zn1kxob"
              >
                <User className="w-12 h-12 text-white" data-oid="2kss.pv" />
              </div>
              {isEditing && (
                <button
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                  data-oid="lakqztf"
                >
                  <Camera className="w-4 h-4" data-oid="31xdh6j" />
                </button>
              )}
            </div>
            <div data-oid="8qp0uq4">
              <h3
                className="text-2xl font-bold text-gray-900 dark:text-white"
                data-oid=":l47:6i"
              >
                {profile.full_name}
              </h3>
              <p
                className="text-gray-600 dark:text-gray-400"
                data-oid="c2vqf2:"
              >
                {t("trustedGuardian")}
              </p>
              <div
                className="flex items-center space-x-2 mt-2"
                data-oid="4xfbb9r"
              >
                <div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  data-oid="j1vqk5x"
                ></div>
                <span
                  className="text-sm text-green-600 dark:text-green-400 font-medium"
                  data-oid="ur3utbv"
                >
                  {t("activeAccount")}
                </span>
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-oid="x7pjboc"
          >
            <div className="space-y-6" data-oid="d6kq51o">
              <div data-oid="zbzx_e3">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="4j9hx5y"
                >
                  <User className="w-4 h-4 inline mr-2" data-oid="g3:hwpq" />
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
                    data-oid="y-r059x"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="nyw6jhw"
                  >
                    {profile.full_name}
                  </p>
                )}
              </div>

              <div data-oid="8tlc8h6">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="mnhbazr"
                >
                  <Mail className="w-4 h-4 inline mr-2" data-oid="rtyqrfl" />
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
                    data-oid=":uuflmp"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="sd3rks4"
                  >
                    {profile.email || "N/A"}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6" data-oid="e94fd4z">
              <div data-oid="4hovla:">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="_y6ibqu"
                >
                  <Phone className="w-4 h-4 inline mr-2" data-oid="h7yhepp" />
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
                    data-oid="s_:txoq"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="ziari8-"
                  >
                    {profile.phone_number}
                  </p>
                )}
              </div>

              <div data-oid="tpwa:vq">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="p791qp6"
                >
                  <MapPin className="w-4 h-4 inline mr-2" data-oid="jol:hd6" />
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
                    data-oid="-435jyg"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="am.f0ea"
                  >
                    {profile.address || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6" data-oid="3r_5ni1">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              data-oid="zlf1qxn"
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
                data-oid="hf_-ak3"
              />
            ) : (
              <p
                className="text-gray-600 dark:text-gray-400"
                data-oid="bo2vot6"
              >
                {profile.about || "N/A"}
              </p>
            )}
          </div>

          <div
            className="grid grid-cols-3 gap-4 mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
            data-oid="06iybm_"
          >
            <div className="text-center" data-oid="w.kgv48">
              <p
                className="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                data-oid="c2vo98y"
              >
                {profile.linked_students}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="6w.sibr"
              >
                {t("linkedStudents")}
              </p>
            </div>
            <div className="text-center" data-oid="4_j.:x:">
              <p
                className="text-2xl font-bold text-green-600 dark:text-green-400"
                data-oid="lil9hgv"
              >
                {profile.total_transactions}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="92y1uok"
              >
                {t("totalTransactions")}
              </p>
            </div>
            <div className="text-center" data-oid="mnvef7.">
              <p
                className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                data-oid="y41yyqo"
              >
                {profile.days_active}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="oe24v-n"
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
