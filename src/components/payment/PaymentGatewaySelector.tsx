import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, Clock, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  color: string;
}

const gateways: PaymentGateway[] = [
  {
    id: "mtn",
    name: "MTN Mobile Money",
    logo: "/placeholder.svg",
    color: "bg-yellow-500",
  },
  {
    id: "airtel",
    name: "Airtel Money",
    logo: "/placeholder.svg",
    color: "bg-red-500",
  },
  {
    id: "tigo",
    name: "Tigo Pesa",
    logo: "/placeholder.svg",
    color: "bg-blue-500",
  },
];

interface PaymentGatewaySelectorProps {
  selectedGateway: string;
  onGatewaySelect: (gatewayId: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (phone: string) => void;
}

const PaymentGatewaySelector: React.FC<PaymentGatewaySelectorProps> = ({
  selectedGateway,
  onGatewaySelect,
  phoneNumber,
  onPhoneNumberChange,
}) => {
  const { t } = useLanguage();
  const [savedNumbers, setSavedNumbers] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load saved phone numbers on component mount
  useEffect(() => {
    const saved = localStorage.getItem("redeemer_phone_numbers");
    if (saved) {
      try {
        const numbers = JSON.parse(saved);
        setSavedNumbers(numbers);
      } catch (error) {
        console.log("Error loading saved numbers:", error);
      }
    }
  }, []);

  // Save phone number to localStorage
  const savePhoneNumber = (phone: string) => {
    if (phone.length >= 10 && !savedNumbers.includes(phone)) {
      const updatedNumbers = [phone, ...savedNumbers.slice(0, 4)]; // Keep only last 5 numbers
      setSavedNumbers(updatedNumbers);
      localStorage.setItem(
        "redeemer_phone_numbers",
        JSON.stringify(updatedNumbers),
      );
    }
  };

  // Remove saved phone number
  const removeSavedNumber = (numberToRemove: string) => {
    const updatedNumbers = savedNumbers.filter((num) => num !== numberToRemove);
    setSavedNumbers(updatedNumbers);
    localStorage.setItem(
      "redeemer_phone_numbers",
      JSON.stringify(updatedNumbers),
    );
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    onPhoneNumberChange(value);
  };

  const handlePhoneBlur = () => {
    if (phoneNumber.length >= 10) {
      savePhoneNumber(phoneNumber);
    }
    setShowSuggestions(false);
  };

  const selectSavedNumber = (number: string) => {
    onPhoneNumberChange(number);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4" data-oid="v:wpsvi">
      <h3
        className="text-emerald-800 font-semibold text-center"
        data-oid="diu8e2q"
      >
        {t("selectPaymentMethod")}
      </h3>
      <div className="grid gap-3" data-oid="avegdc5">
        {gateways.map((gateway) => (
          <Card
            key={gateway.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
              selectedGateway === gateway.id
                ? "ring-2 ring-emerald-500 bg-emerald-50 border-emerald-300"
                : "border-gray-200 hover:border-emerald-300"
            }`}
            onClick={() => onGatewaySelect(gateway.id)}
            data-oid="qydq_cm"
          >
            <CardContent className="p-4" data-oid="g-::s.-">
              <div className="flex items-center space-x-3" data-oid="o8:tv:z">
                <div
                  className={`w-12 h-12 ${gateway.color} rounded-lg flex items-center justify-center shadow-md`}
                  data-oid="fi_48vj"
                >
                  <img
                    src={gateway.logo}
                    alt={gateway.name}
                    className="w-8 h-8 object-contain filter brightness-0 invert"
                    data-oid="jgdn8l3"
                  />
                </div>
                <div className="flex-1" data-oid="icp0w9u">
                  <div
                    className="font-semibold text-gray-800"
                    data-oid="vs0gfpb"
                  >
                    {gateway.name}
                  </div>
                  <div className="text-sm text-gray-500" data-oid="e4a99w.">
                    {t("mobileMoneyPayment")}
                  </div>
                </div>
                {selectedGateway === gateway.id && (
                  <div
                    className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                    data-oid="sq695d_"
                  >
                    <div
                      className="w-2 h-2 bg-white rounded-full"
                      data-oid="frg-f62"
                    ></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Phone Number Input - appears when gateway is selected */}
      {selectedGateway && (
        <div className="space-y-2 animate-fade-in" data-oid="856fot9">
          <Label
            htmlFor="phone"
            className="text-emerald-800 font-medium"
            data-oid="dbeo9b8"
          >
            {t("enterPhoneNumber")}
          </Label>
          <div className="relative" data-oid=":y4z61j">
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-600"
              data-oid="pebgbhv"
            />

            <Input
              id="phone"
              type="tel"
              placeholder="e.g. 0712345678"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onFocus={() =>
                savedNumbers.length > 0 && setShowSuggestions(true)
              }
              onBlur={handlePhoneBlur}
              className="pl-10 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white"
              maxLength={10}
              data-oid="05:fz_l"
            />

            {savedNumbers.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-800"
                onClick={() => setShowSuggestions(!showSuggestions)}
                data-oid="h813fwp"
              >
                <Clock className="w-4 h-4" data-oid="ue1ugs_" />
              </Button>
            )}
          </div>

          {/* Saved Numbers Suggestions */}
          {showSuggestions && savedNumbers.length > 0 && (
            <Card
              className="border-emerald-200 bg-emerald-50/50"
              data-oid="7:0fi3-"
            >
              <CardContent className="p-3" data-oid="ksmbx7k">
                <div
                  className="flex items-center space-x-2 mb-2"
                  data-oid="22df-q1"
                >
                  <Clock
                    className="w-4 h-4 text-emerald-600"
                    data-oid="_hb4z7e"
                  />

                  <span
                    className="text-sm font-medium text-emerald-800"
                    data-oid="py.hhwo"
                  >
                    {t("recentNumbers")}
                  </span>
                </div>
                <div className="space-y-1" data-oid="opbsk3y">
                  {savedNumbers.map((number, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white rounded-lg p-2 hover:bg-emerald-50 transition-colors"
                      data-oid="y4f83xm"
                    >
                      <button
                        type="button"
                        className="flex-1 text-left text-sm text-gray-700 hover:text-emerald-700"
                        onClick={() => selectSavedNumber(number)}
                        data-oid="10u_4:h"
                      >
                        {number}
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedNumber(number);
                        }}
                        data-oid="z1e-10q"
                      >
                        <X className="w-3 h-3" data-oid="q372hmu" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-sm text-emerald-600" data-oid="m1ztnx0">
            {t("phoneRegisteredWith")}{" "}
            {gateways.find((g) => g.id === selectedGateway)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentGatewaySelector;
