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
        data-oid="np6r:ls"
      >
        <Card className="border-red-200 bg-red-50" data-oid="62tde-0">
          <CardContent className="p-6 text-center" data-oid="8gzjqaz">
            <div className="text-red-600 mb-2" data-oid=":wv-ofu">
              Invalid Location
            </div>
            <p className="text-red-700 mb-4" data-oid="2gp5ish">
              Please provide valid latitude and longitude coordinates.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-oid="tlo:0z9"
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
        data-oid="9g5v1_3"
      >
        <Card
          className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm"
          data-oid="s4pvg74"
        >
          <CardContent className="p-8 text-center" data-oid="ytoqp27">
            <div
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse"
              data-oid="4e69sg4"
            >
              <MapPin className="w-8 h-8 text-white" data-oid="5x_cs26" />
            </div>
            <h2
              className="text-2xl font-bold text-emerald-800 mb-2"
              data-oid="qsvfzxo"
            >
              Loading Location
            </h2>
            <p className="text-emerald-600" data-oid="of9ve.d">
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
        data-oid="1ugem24"
      >
        <Card className="border-red-200 bg-red-50" data-oid="c14.txd">
          <CardContent className="p-6 text-center" data-oid="c_t_2wa">
            <div className="text-red-600 mb-2" data-oid="fh1hxso">
              Error Loading Location
            </div>
            <p className="text-red-700 mb-4" data-oid="_bb7m7_">
              {error || "Failed to load location data"}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-oid="8yc9e3."
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
      data-oid="_6_dub:"
    >
      <div className="max-w-6xl mx-auto p-4" data-oid="o005b:1">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6"
          data-oid="86_zcye"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-emerald-700 hover:text-emerald-800"
            data-oid="2hwy8d3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" data-oid="7hks1lb" />
            {t("back")}
          </Button>
          <LanguageSwitcher data-oid="viln-9e" />
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800"
            data-oid="0c9otjz"
          >
            <MapPin className="w-4 h-4 mr-1" data-oid="z8qid4r" />
            Location Info
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6" data-oid="x.0i26e">
          {/* Location Details */}
          <div className="space-y-6" data-oid="j97.yw.">
            {/* Main Info Card */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
              data-oid="hrkysb7"
            >
              <CardHeader data-oid="k0he_6b">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="d3thtoe"
                >
                  <MapPin
                    className="w-6 h-6 text-emerald-600"
                    data-oid="ixoz1:u"
                  />

                  <span data-oid="93fufmm">{locationData.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="enuvzdz">
                <div
                  className="bg-emerald-50 p-4 rounded-lg"
                  data-oid="h95fwv8"
                >
                  <div className="space-y-2" data-oid="z_dfxtt">
                    <div
                      className="flex items-start space-x-2"
                      data-oid="1d_w_ys"
                    >
                      <Navigation
                        className="w-4 h-4 text-emerald-600 mt-1"
                        data-oid="qectw_l"
                      />

                      <div data-oid="2lr4fc_">
                        <div
                          className="font-medium text-emerald-800"
                          data-oid="xh1sgde"
                        >
                          {locationData.address}
                        </div>
                        <div className="text-emerald-600" data-oid="e:0-9pf">
                          {locationData.city}, {locationData.country}
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="a.:xtw2"
                    >
                      <Globe
                        className="w-4 h-4 text-emerald-600"
                        data-oid="cc04-9o"
                      />

                      <span
                        className="text-emerald-700 font-medium"
                        data-oid="rz6f9j5"
                      >
                        {locationData.type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700" data-oid="hysz0uz">
                  {locationData.description}
                </p>
                <div
                  className="flex items-center space-x-2 text-sm text-emerald-600"
                  data-oid="uhzf-oz"
                >
                  <MapPin className="w-4 h-4" data-oid="yvk.bfz" />
                  <span data-oid="bpya81d">
                    {locationData.coordinates.lat.toFixed(6)},{" "}
                    {locationData.coordinates.lng.toFixed(6)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in"
              data-oid="lb_t10s"
            >
              <CardHeader data-oid="0yega67">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="tqp5eyh"
                >
                  <Users className="w-5 h-5" data-oid="wexizvc" />
                  <span data-oid="_9s4mwy">Nearby Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent data-oid="05vq6v-">
                <div className="grid grid-cols-3 gap-4" data-oid="2zle0rl">
                  <div
                    className="text-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="aifhxgk"
                  >
                    <div
                      className="text-2xl font-bold text-emerald-700"
                      data-oid="n2lxost"
                    >
                      {locationData.nearbyServices.restaurants}
                    </div>
                    <div
                      className="text-sm text-emerald-600"
                      data-oid="6xn-sph"
                    >
                      Restaurants
                    </div>
                  </div>
                  <div
                    className="text-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="88-fker"
                  >
                    <div
                      className="text-2xl font-bold text-emerald-700"
                      data-oid="t-bf-xr"
                    >
                      {locationData.nearbyServices.shops}
                    </div>
                    <div
                      className="text-sm text-emerald-600"
                      data-oid="5fn4:jf"
                    >
                      Shops
                    </div>
                  </div>
                  <div
                    className="text-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="o34_zbh"
                  >
                    <div
                      className="text-2xl font-bold text-emerald-700"
                      data-oid="pfyyysx"
                    >
                      {locationData.nearbyServices.banks}
                    </div>
                    <div
                      className="text-sm text-emerald-600"
                      data-oid="3a4l4k1"
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
              data-oid="rikb:ji"
            >
              <CardHeader data-oid="eu__c:m">
                <CardTitle className="text-emerald-800" data-oid="h3heb1m">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3" data-oid="c4v60oz">
                <Button
                  onClick={() => navigate("/student-balance")}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 justify-between"
                  data-oid="_bhwcmk"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="ub36bq5"
                  >
                    <CreditCard className="w-5 h-5" data-oid="p:6lda1" />
                    <span data-oid="8pkkukm">Check Student Balance</span>
                  </div>
                  <ChevronRight className="w-5 h-5" data-oid="2x72-2q" />
                </Button>
                <Button
                  onClick={() => navigate("/qr-redeemer")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 justify-between"
                  data-oid="b-j0ojs"
                >
                  <div
                    className="flex items-center space-x-2"
                    data-oid="y7gnuwk"
                  >
                    <Phone className="w-5 h-5" data-oid="zy5v:ge" />
                    <span data-oid="aa_686:">QR Redeemer</span>
                  </div>
                  <ChevronRight className="w-5 h-5" data-oid="y1t9inh" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <div className="space-y-6" data-oid="flw77f:">
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
              data-oid="pq_de:1"
            >
              <CardHeader data-oid=".:wpv7_">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="vbka7k0"
                >
                  <Map className="w-5 h-5" data-oid="5sm7go-" />
                  <span data-oid="zv4lnp5">Location Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent data-oid="384kcqp">
                {/* Map Placeholder */}
                <div
                  className="w-full h-96 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex items-center justify-center relative overflow-hidden"
                  data-oid="mmlsb4d"
                >
                  <div
                    className="absolute inset-0 bg-emerald-200/30 backdrop-blur-sm"
                    data-oid="k5abia4"
                  ></div>
                  <div className="relative z-10 text-center" data-oid="j3q0ktm">
                    <div
                      className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse"
                      data-oid="oy6lwli"
                    >
                      <MapPin
                        className="w-10 h-10 text-white"
                        data-oid="n87ek5u"
                      />
                    </div>
                    <h3
                      className="text-xl font-bold text-emerald-800 mb-2"
                      data-oid="qhl4m-y"
                    >
                      Interactive Map
                    </h3>
                    <p className="text-emerald-600 mb-4" data-oid=".hx9r:z">
                      Showing location at coordinates:
                    </p>
                    <div
                      className="bg-white/80 px-4 py-2 rounded-lg text-emerald-700 font-mono text-sm"
                      data-oid="lue6.1d"
                    >
                      {locationData.coordinates.lat.toFixed(6)},{" "}
                      {locationData.coordinates.lng.toFixed(6)}
                    </div>
                    <div
                      className="mt-4 text-sm text-emerald-600"
                      data-oid="l8rd8sb"
                    >
                      * Map integration with Mapbox available
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div
                    className="absolute top-4 left-4 w-4 h-4 bg-emerald-400 rounded-full opacity-60 animate-pulse"
                    data-oid="jhj24lo"
                  ></div>
                  <div
                    className="absolute top-8 right-8 w-3 h-3 bg-green-400 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                    data-oid="eapzj.w"
                  ></div>
                  <div
                    className="absolute bottom-6 left-8 w-2 h-2 bg-emerald-500 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "1s" }}
                    data-oid="d6t8-fi"
                  ></div>
                  <div
                    className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "1.5s" }}
                    data-oid="34cr_0c"
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Location Stats */}
            <Card
              className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in"
              data-oid="v.ls41l"
            >
              <CardHeader data-oid="q69s8uq">
                <CardTitle
                  className="text-emerald-800 flex items-center space-x-2"
                  data-oid="f-:nras"
                >
                  <Clock className="w-5 h-5" data-oid="uaw02yv" />
                  <span data-oid="c717j35">Location Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent data-oid="n_l7a0k">
                <div className="space-y-4" data-oid="0i.ywzu">
                  <div
                    className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="vbjcar-"
                  >
                    <span
                      className="text-emerald-700 font-medium"
                      data-oid="q-phb7a"
                    >
                      Total Services
                    </span>
                    <span
                      className="text-emerald-800 font-bold"
                      data-oid="_vvy7in"
                    >
                      {locationData.nearbyServices.restaurants +
                        locationData.nearbyServices.shops +
                        locationData.nearbyServices.banks}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
                    data-oid=":z:v1y7"
                  >
                    <span
                      className="text-emerald-700 font-medium"
                      data-oid="dpm043c"
                    >
                      Coordinate Precision
                    </span>
                    <span
                      className="text-emerald-800 font-bold"
                      data-oid="4r8bolj"
                    >
                      6 decimal places
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg"
                    data-oid="xd6o74i"
                  >
                    <span
                      className="text-emerald-700 font-medium"
                      data-oid="apcqj0h"
                    >
                      Location Type
                    </span>
                    <Badge
                      className="bg-emerald-600 text-white"
                      data-oid="awap_89"
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
