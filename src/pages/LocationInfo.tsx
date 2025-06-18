
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Navigation, Clock, Phone, Globe, Users, CreditCard, ChevronRight, Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const [error, setError] = useState<string>('');

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  useEffect(() => {
    if (!lat || !lng) {
      setError('Invalid coordinates provided');
      setIsLoading(false);
      return;
    }

    // Simulate API call to get location information
    setTimeout(() => {
      const mockLocationData: LocationData = {
        name: 'Campus Central Plaza',
        address: '123 University Avenue',
        city: 'Academic City',
        country: 'Education State',
        type: 'Educational Campus',
        description: 'Main campus plaza with student services, dining, and recreational facilities.',
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        },
        nearbyServices: {
          restaurants: 8,
          shops: 12,
          banks: 3
        }
      };
      setLocationData(mockLocationData);
      setIsLoading(false);
    }, 1500);
  }, [lat, lng]);

  if (!lat || !lng) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-2">Invalid Location</div>
            <p className="text-red-700 mb-4">Please provide valid latitude and longitude coordinates.</p>
            <Button onClick={() => navigate('/')} className="bg-emerald-600 hover:bg-emerald-700">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <Card className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">Loading Location</h2>
            <p className="text-emerald-600">Fetching place information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !locationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-2">Error Loading Location</div>
            <p className="text-red-700 mb-4">{error || 'Failed to load location data'}</p>
            <Button onClick={() => navigate('/')} className="bg-emerald-600 hover:bg-emerald-700">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <LanguageSwitcher />
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            <MapPin className="w-4 h-4 mr-1" />
            Location Info
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Location Details */}
          <div className="space-y-6">
            {/* Main Info Card */}
            <Card className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  <span>{locationData.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Navigation className="w-4 h-4 text-emerald-600 mt-1" />
                      <div>
                        <div className="font-medium text-emerald-800">{locationData.address}</div>
                        <div className="text-emerald-600">{locationData.city}, {locationData.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">{locationData.type}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{locationData.description}</p>
                <div className="flex items-center space-x-2 text-sm text-emerald-600">
                  <MapPin className="w-4 h-4" />
                  <span>{locationData.coordinates.lat.toFixed(6)}, {locationData.coordinates.lng.toFixed(6)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Nearby Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-700">{locationData.nearbyServices.restaurants}</div>
                    <div className="text-sm text-emerald-600">Restaurants</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-700">{locationData.nearbyServices.shops}</div>
                    <div className="text-sm text-emerald-600">Shops</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-700">{locationData.nearbyServices.banks}</div>
                    <div className="text-sm text-emerald-600">Banks</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in">
              <CardHeader>
                <CardTitle className="text-emerald-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/student-balance')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Check Student Balance</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => navigate('/qr-redeemer')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>QR Redeemer</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <Card className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center space-x-2">
                  <Map className="w-5 h-5" />
                  <span>Location Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Map Placeholder */}
                <div className="w-full h-96 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-200/30 backdrop-blur-sm"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800 mb-2">Interactive Map</h3>
                    <p className="text-emerald-600 mb-4">Showing location at coordinates:</p>
                    <div className="bg-white/80 px-4 py-2 rounded-lg text-emerald-700 font-mono text-sm">
                      {locationData.coordinates.lat.toFixed(6)}, {locationData.coordinates.lng.toFixed(6)}
                    </div>
                    <div className="mt-4 text-sm text-emerald-600">
                      * Map integration with Mapbox available
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-4 h-4 bg-emerald-400 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute top-8 right-8 w-3 h-3 bg-green-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-6 left-8 w-2 h-2 bg-emerald-500 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>
              </CardContent>
            </Card>

            {/* Location Stats */}
            <Card className="border-emerald-200 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Location Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-700 font-medium">Total Services</span>
                    <span className="text-emerald-800 font-bold">
                      {locationData.nearbyServices.restaurants + locationData.nearbyServices.shops + locationData.nearbyServices.banks}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-700 font-medium">Coordinate Precision</span>
                    <span className="text-emerald-800 font-bold">6 decimal places</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-700 font-medium">Location Type</span>
                    <Badge className="bg-emerald-600 text-white">{locationData.type}</Badge>
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
