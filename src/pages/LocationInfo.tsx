import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  ArrowLeft,
  Navigation,
  Clock,
  Phone,
  Globe,
  Users,
  CreditCard,
  ChevronRight,
  Map,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationData {
  name: string;
  address: string;
  city: string;
  country: string;
  type: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyServices: {
    restaurants: number;
    shops: number;
    banks: number;
  };
}

const LocationInfo = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(() => {
    if (!lat || !lng) {
      setError("Invalid coordinates provided");
      setIsLoading(false);
      return;
    }

    // Simulate API call to get location information
    setTimeout(() => {
      const mockLocationData: LocationData = {
        name: "Campus Central Plaza",
        address: "123 University Avenue",
        city: "Academic City",
        country: "Education State",
        type: "Educational Campus",
        description:
          "Main campus plaza with student services, dining, and recreational facilities.",
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
        nearbyServices: {
          restaurants: 8,
          shops: 12,
          banks: 3,
        },
      };
      setLocationData(mockLocationData);
      setIsLoading(false);
    }, 1500);
  }, [lat, lng]);

  if (!lat || !lng) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4 flex items-center justify-center"
        data-oid="c-zjjjk"
      >
        <Card className="border-red-200 bg-red-50" data-oid="o8br68i">
          <CardContent className="p-6 text-center" data-oid="rn3irhv">
            <div className="text-red-600 mb-2" data-oid="jemhl7k">
              Invalid Location
            </div>
            <p className="text-red-700 mb-4" data-oid=":p8spq-">
              Please provide valid latitude and longitude coordinates.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-oid="u0d2xpn"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4 flex items-center justify-center"
        data-oid="pdqza-v"
      >
        <Card
          className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm"
          data-oid="uprvjgs"
        >
          <CardContent className="p-8 text-center" data-oid="m:bwh:s">
            <div
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse"
              data-oid="fv1ij-4"
            >
              <MapPin className="w-8 h-8 text-white" data-oid="u60120c" />
            </div>
            <h2
              className="text-2xl font-bold text-emerald-800 mb-2"
              data-oid=":c4stmt"
            >
              Loading Location
            </h2>
            <p className="text-emerald-600" data-oid="6w.cci5">
              Fetching place information...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !locationData) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4 flex items-center justify-center"
        data-oid="yf0kt83"
      >
        <Card className="border-red-200 bg-red-50" data-oid="lo3hes6">
          <CardContent className="p-6 text-center" data-oid="l3lomt0">
            <div className="text-red-600 mb-2" data-oid="f:9:d33">
              Error Loading Location
            </div>
            <p className="text-red-700 mb-4" data-oid="erts:o4">
              {error || "Failed to load location data"}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-oid="ztauuks"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100"
      data-oid="-39wmc6"
    >
      <div className="max-w-6xl mx-auto p-4" data-oid="shx0__u">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="rav.2g5"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-emerald-700 hover:text-emerald-800"
            data-oid="dacm2h_"
          >
            <ArrowLeft className="w-4 h-4 mr-2" data-oid="y:q876a" />
            {t("back")}
          </Button>
          <LanguageSwitcher data-oid="xd58os-" />
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800"
            data-oid="6jxoo0c"
          >
            <MapPin className="w-4 h-4 mr-1" data-oid="18f:dl0" />
            Location Info
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6" data-oid="vljp51a">
          {/* Location Details */}
          <div className="space-y-6" data-oid="0uhjx_1">
            {/* Main Info Card */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
              data-oid="fffzyyr"
            >
              <CardHeader data-oid="mjcc_2x">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="9s9z7n_"
                >
                  <MapPin
                    className="w-6 h-6 text-emerald-600"
                    data-oid="e3178i5"
                  />

                  <span data-oid="reweize">{locationData.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="0k002nw">
                <div
                  className="bg-emerald-50 p-4 rounded-lg"
                  data-oid="vf_wdop"
                >
                  <div className="space-y-2" data-oid="o2-jy1w">
                    <div
                      className="flex items-start space-x-2"
                      data-oid="js.03g5"
                    >
                      <Navigation
                        className="w-4 h-4 text-emerald-600 mt-1"
                        data-oid="idelsg0"
                      />

                      <div data-oid="9g8nsnq">
                        <div
                          className="font-medium text-emerald-800"
                          data-oid="7lns40o"
                        >
                          {locationData.address}
                        </div>
                        <div className="text-emerald-600" data-oid="f3mh98:">
                          {locationData.city}, {locationData.country}
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="k910s4t"
                    >
                      <Globe
                        className="w-4 h-4 text-emerald-600"
                        data-oid="8hmh.d8"
                      />

                      <span
                        className="text-emerald-700 font-medium"
                        data-oid="oet:rb4"
                      >
                        {locationData.type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700" data-oid="6x3vzzt">
                  {locationData.description}
                </p>
                <div
                  className="flex items-center space-x-2 text-sm text-emerald-600"
                  data-oid="a3ct9sn"
                >
                  <MapPin className="w-4 h-4" data-oid="tiz:o6:" />
                  <span data-oid="xavk3l1">
                    {locationData.coordinates.lat.toFixed(6)},{" "}
                    {locationData.coordinates.lng.toFixed(6)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in"
              data-oid="1hfgphe"
            >
              <CardHeader data-oid="8cvitiq">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="44rupn3"
                >
                  <Users className="w-5 h-5" data-oid="8:vs0de" />
                  <span data-oid="0o9:_ul">Nearby Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent data-oid="tav6z6j">
                <div className="grid grid-cols-3 gap-4" data-oid="_1_uskm">
                  <div
                    className="text-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="whgk6y5"
                  >
                    <div
                      className="text-2xl font-bold text-emerald-700"
                      data-oid="jb7ryu0"
                    >
                      {locationData.nearbyServices.restaurants}
                    </div>
                    <div
                      className="text-sm text-emerald-600"
                      data-oid="1600h.8"
                    >
                      Restaurants
                    </div>
                  </div>
                  <div
                    className="text-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="j8lunjc"
                  >
                    <div
                      className="text-2xl font-bold text-emerald-700"
                      data-oid="ouzjvkr"
                    >
                      {locationData.nearbyServices.shops}
                    </div>
                    <div
                      className="text-sm text-emerald-600"
                      data-oid="qxxo7-x"
                    >
                      Shops
                    </div>
                  </div>
                  <div
                    className="text-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="brscf85"
                  >
                    <div
                      className="text-2xl font-bold text-emerald-700"
                      data-oid="1ix:m0."
                    >
                      {locationData.nearbyServices.banks}
                    </div>
                    <div
                      className="text-sm text-emerald-600"
                      data-oid="xtwpgvd"
                    >
                      Banks
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in"
              data-oid="8i7ez67"
            >
              <CardHeader data-oid="dd.nui9">
                <CardTitle className="text-emerald-800" data-oid="x4vi74v">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3" data-oid="6y6cn1m">
                <Button
                  onClick={() => navigate("/student-balance")}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 justify-between"
                  data-oid="xe_m_hj"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="6b4hazj"
                  >
                    <CreditCard className="w-5 h-5" data-oid="40rvy7_" />
                    <span data-oid="f9g6ahk">Check Student Balance</span>
                  </div>
                  <ChevronRight className="w-5 h-5" data-oid="ui2v_0d" />
                </Button>
                <Button
                  onClick={() => navigate("/qr-redeemer")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 justify-between"
                  data-oid="38cbqma"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="rymtj9h"
                  >
                    <Phone className="w-5 h-5" data-oid="4nml8nl" />
                    <span data-oid="0z5pou6">QR Redeemer</span>
                  </div>
                  <ChevronRight className="w-5 h-5" data-oid="3k3o:we" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <div className="space-y-6" data-oid="lorb9:a">
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
              data-oid="egmz-py"
            >
              <CardHeader data-oid="gu46.tf">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="tjuvmmw"
                >
                  <Map className="w-5 h-5" data-oid="wmwcvfs" />
                  <span data-oid="srlpyes">Location Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent data-oid="71dj.ur">
                {/* Map Placeholder */}
                <div
                  className="w-full h-96 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex items-center justify-center relative overflow-hidden"
                  data-oid="ppo83ls"
                >
                  <div
                    className="absolute inset-0 bg-emerald-200/30 backdrop-blur-sm"
                    data-oid="m7opvju"
                  ></div>
                  <div className="relative z-10 text-center" data-oid="89kcot8">
                    <div
                      className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse"
                      data-oid="bhu85o4"
                    >
                      <MapPin
                        className="w-10 h-10 text-white"
                        data-oid="gj12v0j"
                      />
                    </div>
                    <h3
                      className="text-xl font-bold text-emerald-800 mb-2"
                      data-oid="q.:wplq"
                    >
                      Interactive Map
                    </h3>
                    <p className="text-emerald-600 mb-4" data-oid="6:7ya0t">
                      Showing location at coordinates:
                    </p>
                    <div
                      className="bg-white/80 px-4 py-2 rounded-lg text-emerald-700 font-mono text-sm"
                      data-oid="_ui2v35"
                    >
                      {locationData.coordinates.lat.toFixed(6)},{" "}
                      {locationData.coordinates.lng.toFixed(6)}
                    </div>
                    <div
                      className="mt-4 text-sm text-emerald-600"
                      data-oid="6ozsyh5"
                    >
                      * Map integration with Mapbox available
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div
                    className="absolute top-4 left-4 w-4 h-4 bg-emerald-400 rounded-full opacity-60 animate-pulse"
                    data-oid="0mz89rj"
                  ></div>
                  <div
                    className="absolute top-8 right-8 w-3 h-3 bg-green-400 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                    data-oid="r5-6c29"
                  ></div>
                  <div
                    className="absolute bottom-6 left-8 w-2 h-2 bg-emerald-500 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "1s" }}
                    data-oid="5fkuphq"
                  ></div>
                  <div
                    className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "1.5s" }}
                    data-oid="mx9-.nx"
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Location Stats */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in"
              data-oid="55vl4ie"
            >
              <CardHeader data-oid="wab3f:c">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="dgoyki8"
                >
                  <Clock className="w-5 h-5" data-oid="dl-w9wp" />
                  <span data-oid="sa3z07m">Location Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent data-oid="j7_a.:k">
                <div className="space-y-4" data-oid="4cets48">
                  <div
                    className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="l.cw0cw"
                  >
                    <span
                      className="text-emerald-700 font-medium"
                      data-oid="u1td5e0"
                    >
                      Total Services
                    </span>
                    <span
                      className="text-emerald-800 font-bold"
                      data-oid="oub580l"
                    >
                      {locationData.nearbyServices.restaurants +
                        locationData.nearbyServices.shops +
                        locationData.nearbyServices.banks}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="f5p1cho"
                  >
                    <span
                      className="text-emerald-700 font-medium"
                      data-oid="5eldl.r"
                    >
                      Coordinate Precision
                    </span>
                    <span
                      className="text-emerald-800 font-bold"
                      data-oid="r6.p1c5"
                    >
                      6 decimal places
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="z13cpg1"
                  >
                    <span
                      className="text-emerald-700 font-medium"
                      data-oid="6p67u38"
                    >
                      Location Type
                    </span>
                    <Badge
                      className="bg-emerald-600 text-white"
                      data-oid="6o94pt:"
                    >
                      {locationData.type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
