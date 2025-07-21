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
      data-oid="zn5syx."
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        data-oid="xlw--bq"
      >
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200 
          dark:border-gray-800 bg-brand to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
          data-oid="ht1j:5_"
        >
          <h2
            className="text-xl font-bold text-white dark:text-white"
            data-oid="o930_q_"
          >
            {t("profileSettings")}
          </h2>
          <div className="flex items-center space-x-2" data-oid="g0hgir2">
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-200 font-medium"
              disabled={isLoading}
              data-oid="drmylmu"
            >
              {isEditing ? (
                <Save className="w-4 h-4" data-oid="ea3n_g2" />
              ) : (
                <Edit3 className="w-4 h-4" data-oid="bex_6yx" />
              )}
              <span data-oid="l-__56w">
                {isEditing ? t("save") : t("edit")}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              data-oid="bdr0.20"
            >
              <X className="w-5 h-5" data-oid="jloe2-a" />
            </button>
          </div>
        </div>

        {error && (
          <div
            className="m-6 p-4 bg-red-100 text-red-700 rounded-xl"
            data-oid="s1v:f:6"
          >
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-900"
              data-oid="-79-4nr"
            >
              X
            </button>
          </div>
        )}

        <div className="p-6" data-oid="2jbuzw4">
          <div className="flex items-center space-x-6 mb-8" data-oid="sctpocg">
            <div className="relative" data-oid="x56epov">
              <div
                className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl"
                data-oid="kri2p4-"
              >
                <User className="w-12 h-12 text-white" data-oid=":lv-5ik" />
              </div>
              {isEditing && (
                <button
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                  data-oid="rxtl::u"
                >
                  <Camera className="w-4 h-4" data-oid="ut0-cv2" />
                </button>
              )}
            </div>
            <div data-oid="xg8cmku">
              <h3
                className="text-2xl font-bold text-gray-900 dark:text-white"
                data-oid="9j7tbmj"
              >
                {profile.full_name}
              </h3>
              <p
                className="text-gray-600 dark:text-gray-400"
                data-oid="gywxevu"
              >
                {t("trustedGuardian")}
              </p>
              <div
                className="flex items-center space-x-2 mt-2"
                data-oid="u5y_3lz"
              >
                <div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  data-oid="1d-cjle"
                ></div>
                <span
                  className="text-sm text-green-600 dark:text-green-400 font-medium"
                  data-oid="67fofn0"
                >
                  {t("activeAccount")}
                </span>
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-oid="dgni-lo"
          >
            <div className="space-y-6" data-oid="as7xryq">
              <div data-oid="jea0u-q">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="r765x5m"
                >
                  <User className="w-4 h-4 inline mr-2" data-oid="8.ex-ay" />
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
                    data-oid="u91ntq-"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="9g-95w_"
                  >
                    {profile.full_name}
                  </p>
                )}
              </div>

              <div data-oid="53332fr">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="t53eowd"
                >
                  <Mail className="w-4 h-4 inline mr-2" data-oid="bocp8vz" />
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
                    data-oid="ztgiucf"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="9o-2qes"
                  >
                    {profile.email || "N/A"}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6" data-oid="ld61lu4">
              <div data-oid="ar6ken7">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="bpmwwg8"
                >
                  <Phone className="w-4 h-4 inline mr-2" data-oid=":rog1_3" />
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
                    data-oid="xm_vgx1"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="7bmjhe0"
                  >
                    {profile.phone_number}
                  </p>
                )}
              </div>

              <div data-oid="2g_hw9e">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="qpoubdl"
                >
                  <MapPin className="w-4 h-4 inline mr-2" data-oid="9:wlfq2" />
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
                    data-oid=":pxyrgh"
                  />
                ) : (
                  <p
                    className="text-gray-900 dark:text-white font-medium"
                    data-oid="co.6bj3"
                  >
                    {profile.address || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6" data-oid="6ph2s:g">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              data-oid="b1hnk1-"
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
                data-oid="nlg7r2i"
              />
            ) : (
              <p
                className="text-gray-600 dark:text-gray-400"
                data-oid="64aldsj"
              >
                {profile.about || "N/A"}
              </p>
            )}
          </div>

          <div
            className="grid grid-cols-3 gap-4 mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
            data-oid="bdamrx-"
          >
            <div className="text-center" data-oid="c7tq589">
              <p
                className="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                data-oid="tg2p.sd"
              >
                {profile.linked_students}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="2gvm8ip"
              >
                {t("linkedStudents")}
              </p>
            </div>
            <div className="text-center" data-oid="gd9spns">
              <p
                className="text-2xl font-bold text-green-600 dark:text-green-400"
                data-oid="_8z_h8-"
              >
                {profile.total_transactions}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="tfmqh.o"
              >
                {t("totalTransactions")}
              </p>
            </div>
            <div className="text-center" data-oid="na-5o-d">
              <p
                className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                data-oid="numy1jw"
              >
                {profile.days_active}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="h6jq68g"
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
