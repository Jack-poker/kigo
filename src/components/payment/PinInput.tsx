import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, X } from "lucide-react";

interface PinInputProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  isProcessing: boolean;
}

const PinInput: React.FC<PinInputProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPin(["", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const fullPin = pin.join("");
    if (fullPin.length === 4) {
      onConfirm(fullPin);
    }
  };

  const handleNumberPadClick = (number: string) => {
    const firstEmptyIndex = pin.findIndex((p) => p === "");
    if (firstEmptyIndex !== -1) {
      handleInputChange(firstEmptyIndex, number);
    }
  };

  const handleClearPin = () => {
    setPin(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const isPinComplete = pin.every((p) => p !== "");

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-oid="_ydn05y">
      <DialogContent
        className="max-w-sm mx-auto bg-white/95 backdrop-blur-sm border-emerald-200"
        data-oid="ia7.yhp"
      >
        <DialogHeader data-oid="xu4.v.9">
          <DialogTitle
            className="text-center text-emerald-800 flex items-center justify-center space-x-2"
            data-oid="u9_673m"
          >
            <Lock className="w-5 h-5" data-oid="_dfk0ie" />
            <span data-oid="lr7:ofi">Enter Card PIN</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4" data-oid="taqt1qg">
          {/* PIN Input */}
          <div className="flex justify-center space-x-3" data-oid="nuvkbvv">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-emerald-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none bg-white"
                disabled={isProcessing}
                data-oid=".3xq:t8"
              />
            ))}
          </div>

          {/* Number Pad */}
          <div
            className="grid grid-cols-3 gap-3 max-w-xs mx-auto"
            data-oid="o084qr-"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                variant="outline"
                onClick={() => handleNumberPadClick(number.toString())}
                disabled={isProcessing}
                className="h-12 text-lg font-semibold border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400"
                data-oid="oubu-dj"
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={handleClearPin}
              disabled={isProcessing}
              className="h-12 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              data-oid="1h2siw."
            >
              <X className="w-4 h-4" data-oid="b2nhcto" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNumberPadClick("0")}
              disabled={isProcessing}
              className="h-12 text-lg font-semibold border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400"
              data-oid="qkasfb5"
            >
              0
            </Button>
            <div data-oid="iz8kzmd"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3" data-oid="v1pkhc5">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              data-oid="r.dxcq6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isPinComplete || isProcessing}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold"
              data-oid="k-jrcqv"
            >
              {isProcessing ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinInput;
