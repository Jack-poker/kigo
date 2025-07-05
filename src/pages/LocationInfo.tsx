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
        data-oid="1hv49hu"
      >
        <Card className="border-red-200 bg-red-50" data-oid=":99ra5j">
          <CardContent className="p-6 text-center" data-oid="py4q83:">
            <div className="text-red-600 mb-2" data-oid="9lmtuvo">
              Invalid Location
            </div>
            <p className="text-red-700 mb-4" data-oid="6u5f6ml">
              Please provide valid latitude and longitude coordinates.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-oid="t7xd3c5"
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
        data-oid="sbclf1."
      >
        <Card
          className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm"
          data-oid=".dk319s"
        >
          <CardContent className="p-8 text-center" data-oid="if9g09p">
            <div
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse"
              data-oid="3_k6g0z"
            >
              <MapPin className="w-8 h-8 text-white" data-oid="e2ksqk2" />
            </div>
            <h2
              className="text-2xl font-bold text-emerald-800 mb-2"
              data-oid="94ermky"
            >
              Loading Location
            </h2>
            <p className="text-emerald-600" data-oid="mnysha1">
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
        data-oid="8cx_7n6"
      >
        <Card className="border-red-200 bg-red-50" data-oid="l0h7n.9">
          <CardContent className="p-6 text-center" data-oid="vyt1imf">
            <div className="text-red-600 mb-2" data-oid="bh1ghrx">
              Error Loading Location
            </div>
            <p className="text-red-700 mb-4" data-oid="868zp4y">
              {error || "Failed to load location data"}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-oid="w4nwd-t"
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
      data-oid="vvvwd:1"
    >
      <div className="max-w-6xl mx-auto p-4" data-oid="ieb28x4">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="_l4mewf"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-emerald-700 hover:text-emerald-800"
            data-oid="njpiezp"
          >
            <ArrowLeft className="w-4 h-4 mr-2" data-oid="vp4389t" />
            {t("back")}
          </Button>
          <LanguageSwitcher data-oid="-7ky1t1" />
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800"
            data-oid="56hf7gi"
          >
            <MapPin className="w-4 h-4 mr-1" data-oid="3:rlam2" />
            Location Info
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6" data-oid="4lzoaze">
          {/* Location Details */}
          <div className="space-y-6" data-oid="8604jk1">
            {/* Main Info Card */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
              data-oid="xnsrs6s"
            >
              <CardHeader data-oid="nkrz3li">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="vsywvfw"
                >
                  <MapPin
                    className="w-6 h-6 text-emerald-600"
                    data-oid="li4p7j7"
                  />

                  <span data-oid="5kran0k">{locationData.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="y7tnb0u">
                <div
                  className="bg-emerald-50 p-4 rounded-lg"
                  data-oid="noka_7."
                >
                  <div className="space-y-2" data-oid="q99f75r">
                    <div
                      className="flex items-start space-x-2"
                      data-oid="1cgj9ns"
                    >
                      <Navigation
                        className="w-4 h-4 text-emerald-600 mt-1"
                        data-oid="mglt9vn"
                      />

                      <div data-oid="5l8y:e1">
                        <div
                          className="font-medium text-emerald-800"
                          data-oid="l_vwyrl"
                        >
                          {locationData.address}
                        </div>
                        <div className="text-emerald-600" data-oid="k3mlwi.">
                          {locationData.city}, {locationData.country}
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="5oey1c5"
                    >
                      <Globe
                        className="w-4 h-4 text-emerald-600"
                        data-oid="5d53oen"
                      />

                      <span
                        className="text-emerald-700 font-medium"
                        data-oid="2tbnc0-"
                      >
                        {locationData.type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700" data-oid="4p.rb:n">
                  {locationData.description}
                </p>
                <div
                  className="flex items-center space-x-2 text-sm text-emerald-600"
                  data-oid="4jk787t"
                >
                  <MapPin className="w-4 h-4" data-oid="2tbp0x1" />
                  <span data-oid="mt.vime">
                    {locationData.coordinates.lat.toFixed(6)},{" "}
                    {locationData.coordinates.lng.toFixed(6)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in"
              data-oid="6-cg89k"
            >
              <CardHeader data-oid="lubjwpv">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid=":t6a:1l"
                >
                  <Users className="w-5 h-5" data-oid="w-48i1u" />
                  <span data-oid="zpty54x">Nearby Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent data-oid="ilg_o09">
                <div className="grid grid-cols-3 gap-4" data-oid="84q5kls">
                  <div
                    className="text-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="rc01yfv"
                  >
                    <div
                      className="text-2xl font-bold text-emerald-700"
                      data-oid=":98q50."
                    >
                      {locationData.nearbyServices.restaurants}
                    </div>
                    <div
                      className="text-sm text-emerald-600"
                      data-oid="c5n0v2d"
                    >
                      Restaurants
                    </div>
                  </div>
                  <div
                    className="text-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="cuuy9--"
                  >
                    <div
                      className="text-2xl font-bold text-emerald-700"
                      data-oid="212myk0"
                    >
                      {locationData.nearbyServices.shops}
                    </div>
                    <div
                      className="text-sm text-emerald-600"
                      data-oid="l:bct_b"
                    >
                      Shops
                    </div>
                  </div>
                  <div
                    className="text-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="pj:7rbv"
                  >
                    <div
                      className="text-2xl font-bold text-emerald-700"
                      data-oid="b3c4ot0"
                    >
                      {locationData.nearbyServices.banks}
                    </div>
                    <div
                      className="text-sm text-emerald-600"
                      data-oid="0_cc43p"
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
              data-oid="85h3smx"
            >
              <CardHeader data-oid="4g.h2rs">
                <CardTitle className="text-emerald-800" data-oid=":v_p27g">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3" data-oid="85p5i5:">
                <Button
                  onClick={() => navigate("/student-balance")}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 justify-between"
                  data-oid="xktyu7t"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="8-z7v7:"
                  >
                    <CreditCard className="w-5 h-5" data-oid="zquy6i0" />
                    <span data-oid="82tc7pc">Check Student Balance</span>
                  </div>
                  <ChevronRight className="w-5 h-5" data-oid=":zmq0e9" />
                </Button>
                <Button
                  onClick={() => navigate("/qr-redeemer")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 justify-between"
                  data-oid="_:8-owd"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="-w:1xvm"
                  >
                    <Phone className="w-5 h-5" data-oid="okz8.b7" />
                    <span data-oid="zj0sv01">QR Redeemer</span>
                  </div>
                  <ChevronRight className="w-5 h-5" data-oid="i7dn8:c" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <div className="space-y-6" data-oid="c3.zghq">
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
              data-oid="xrbbmwz"
            >
              <CardHeader data-oid="0s6jd:9">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="ofagr:3"
                >
                  <Map className="w-5 h-5" data-oid="7xei8v1" />
                  <span data-oid="d86n-ih">Location Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent data-oid="m95av9d">
                {/* Map Placeholder */}
                <div
                  className="w-full h-96 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex items-center justify-center relative overflow-hidden"
                  data-oid="j91s5nt"
                >
                  <div
                    className="absolute inset-0 bg-emerald-200/30 backdrop-blur-sm"
                    data-oid="lyv439z"
                  ></div>
                  <div className="relative z-10 text-center" data-oid="vinyhn8">
                    <div
                      className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse"
                      data-oid="st9uajf"
                    >
                      <MapPin
                        className="w-10 h-10 text-white"
                        data-oid="apg3-iz"
                      />
                    </div>
                    <h3
                      className="text-xl font-bold text-emerald-800 mb-2"
                      data-oid="vjvzehr"
                    >
                      Interactive Map
                    </h3>
                    <p className="text-emerald-600 mb-4" data-oid="7x49hfv">
                      Showing location at coordinates:
                    </p>
                    <div
                      className="bg-white/80 px-4 py-2 rounded-lg text-emerald-700 font-mono text-sm"
                      data-oid="xxpiobt"
                    >
                      {locationData.coordinates.lat.toFixed(6)},{" "}
                      {locationData.coordinates.lng.toFixed(6)}
                    </div>
                    <div
                      className="mt-4 text-sm text-emerald-600"
                      data-oid="zmcmjg_"
                    >
                      * Map integration with Mapbox available
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div
                    className="absolute top-4 left-4 w-4 h-4 bg-emerald-400 rounded-full opacity-60 animate-pulse"
                    data-oid="b:yvxws"
                  ></div>
                  <div
                    className="absolute top-8 right-8 w-3 h-3 bg-green-400 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                    data-oid="ltcdx::"
                  ></div>
                  <div
                    className="absolute bottom-6 left-8 w-2 h-2 bg-emerald-500 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "1s" }}
                    data-oid="i8on55t"
                  ></div>
                  <div
                    className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "1.5s" }}
                    data-oid="eex5neh"
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Location Stats */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in"
              data-oid="9ygok0w"
            >
              <CardHeader data-oid="_7l35k.">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="w60th7m"
                >
                  <Clock className="w-5 h-5" data-oid="vgrop3j" />
                  <span data-oid="7i9atrs">Location Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent data-oid=".a1lzyu">
                <div className="space-y-4" data-oid="llof5_8">
                  <div
                    className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="qu3ecd4"
                  >
                    <span
                      className="text-emerald-700 font-medium"
                      data-oid="mg3czd-"
                    >
                      Total Services
                    </span>
                    <span
                      className="text-emerald-800 font-bold"
                      data-oid="4ai-:iq"
                    >
                      {locationData.nearbyServices.restaurants +
                        locationData.nearbyServices.shops +
                        locationData.nearbyServices.banks}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="9dw344l"
                  >
                    <span
                      className="text-emerald-700 font-medium"
                      data-oid="gd.3wq9"
                    >
                      Coordinate Precision
                    </span>
                    <span
                      className="text-emerald-800 font-bold"
                      data-oid="4n76mbg"
                    >
                      6 decimal places
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="y.sz1c4"
                  >
                    <span
                      className="text-emerald-700 font-medium"
                      data-oid="w5tpbqv"
                    >
                      Location Type
                    </span>
                    <Badge
                      className="bg-emerald-600 text-white"
                      data-oid="i4m.4s3"
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
