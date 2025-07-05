import React, { useEffect, useRef, useState } from "react";
import { X, QrCode, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onClose: () => void;
  onScan: (studentId: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
        setCameraError(false);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(true);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const simulateQRScan = () => {
    // Simulate QR code detection with animation
    setIsScanning(false);

    // Animated scanning effect
    const canvas = canvasRef.current;
    if (canvas && videoRef.current) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw a scanning animation
        let y = 0;
        let direction = 1;
        const scanLine = setInterval(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the video frame
          if (videoRef.current) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          }

          // Draw scanning line
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#FFD700";
          ctx.stroke();

          // Add glow effect
          ctx.shadowColor = "#FFD700";
          ctx.shadowBlur = 10;

          y += 5 * direction;
          if (y > canvas.height || y < 0) {
            direction *= -1;
          }
        }, 30);

        // After animation, show result
        setTimeout(() => {
          clearInterval(scanLine);
          const mockStudentId =
            "STU" +
            Math.floor(Math.random() * 1000)
              .toString()
              .padStart(3, "0");
          setScanResult(mockStudentId);
          handleStudentLink(mockStudentId);
        }, 2000);
      }
    }
  };

  const handleStudentLink = async (studentId: string) => {
    setIsLinking(true);

    try {
      // Simulate API call to link student
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onScan(studentId);

      toast({
        title: "QR Code Detected!",
        description: `Student ID: ${studentId} found successfully.`,
      });

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      toast({
        title: "Linking Failed",
        description: "Unable to link student. Please try again.",
        variant: "destructive",
      });
      setIsLinking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      data-oid="tmnwhom"
    >
      <Card
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-0 overflow-hidden"
        data-oid=".fe9nyu"
      >
        <CardHeader
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6"
          data-oid="dy.rux0"
        >
          <div className="flex items-center justify-between" data-oid="e0lu3kz">
            <CardTitle
              className="flex items-center space-x-2 text-white"
              data-oid="9zd4kid"
            >
              <QrCode className="h-6 w-6" data-oid="3tat8qr" />
              <span className="text-xl font-bold" data-oid="oxfse56">
                Scan Student QR Code
              </span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white"
              data-oid="qn7oi29"
            >
              <X className="h-4 w-4" data-oid="7-du5mj" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6" data-oid="bf8sl55">
          {cameraError ? (
            <div className="text-center space-y-4 py-8" data-oid="r67cv9g">
              <div
                className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center"
                data-oid=".t96kqv"
              >
                <AlertCircle
                  className="h-8 w-8 text-red-500"
                  data-oid="mu58xo2"
                />
              </div>
              <div data-oid="gsxxduj">
                <h3
                  className="text-lg font-semibold text-gray-900 mb-2"
                  data-oid="8eegfr2"
                >
                  Camera Access Denied
                </h3>
                <p className="text-gray-600 mb-6" data-oid="u7_drj3">
                  Please allow camera access to scan QR codes
                </p>
                <Button
                  onClick={startCamera}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  data-oid="gskj5:b"
                >
                  <Camera className="h-4 w-4 mr-2" data-oid=".0j3g75" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : !scanResult ? (
            <>
              <div
                className="relative bg-black rounded-xl overflow-hidden aspect-square mb-6"
                data-oid="mn:jo1z"
              >
                {/* Video feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  data-oid="gbejx-d"
                />

                {/* Canvas overlay for animations */}
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="absolute inset-0 w-full h-full"
                  data-oid="qdhbetj"
                />

                {/* Scanning frame */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  data-oid="4.ypu2u"
                >
                  <div
                    className="w-3/4 h-3/4 border-2 border-yellow-400 rounded-lg relative"
                    data-oid="yg_r346"
                  >
                    {/* Corner markers */}
                    <div
                      className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl"
                      data-oid="j.f1uc_"
                    ></div>
                    <div
                      className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr"
                      data-oid="cxw.m-h"
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl"
                      data-oid="hyzdeuu"
                    ></div>
                    <div
                      className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br"
                      data-oid="y3_yy3f"
                    ></div>

                    {/* Scanning animation */}
                    {isScanning && (
                      <div
                        className="absolute inset-0 overflow-hidden"
                        data-oid="6vlub4x"
                      >
                        <div
                          className="h-1 bg-yellow-400 w-full absolute top-1/2 transform -translate-y-1/2 animate-scan opacity-70 shadow-lg shadow-yellow-300"
                          data-oid="8hmb_9g"
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
                  data-oid="4a7otqk"
                ></div>
              </div>

              <div className="text-center space-y-4" data-oid="qt9x0u2">
                <p className="text-gray-700 font-medium" data-oid="6ccugx5">
                  Position the QR code within the frame
                </p>
                <Button
                  onClick={simulateQRScan}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all w-full"
                  data-oid="jyziav1"
                >
                  Simulate QR Scan (Demo)
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6 py-4" data-oid="01_npv8">
              {!isLinking ? (
                <div className="space-y-4" data-oid="1t1srfe">
                  <div
                    className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center animate-in zoom-in duration-300"
                    data-oid="35fxtp:"
                  >
                    <CheckCircle
                      className="h-10 w-10 text-green-500"
                      data-oid="ad:gx4a"
                    />
                  </div>
                  <div data-oid="733dr0h">
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-2"
                      data-oid="yv8jhba"
                    >
                      QR Code Detected!
                    </h3>
                    <p className="text-gray-600 mb-2" data-oid="rg4f8oq">
                      Student ID: {scanResult}
                    </p>
                    <div
                      className="flex space-x-3 justify-center mt-6"
                      data-oid="o52gvt1"
                    >
                      <Button
                        onClick={() => handleStudentLink(scanResult)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
                        data-oid="i7rq3.d"
                      >
                        Continue
                      </Button>
                      <Button
                        onClick={() => {
                          setScanResult(null);
                          setIsScanning(true);
                          startCamera();
                        }}
                        variant="outline"
                        className="border-gray-200 text-gray-700 px-6 py-2 rounded-lg"
                        data-oid="u90fz5q"
                      >
                        Scan Again
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4" data-oid="7tq3q-t">
                  <div
                    className="relative w-20 h-20 mx-auto"
                    data-oid="3mh725."
                  >
                    <div
                      className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"
                      data-oid="gmc7odw"
                    ></div>
                    <div
                      className="absolute inset-3 rounded-full border-4 border-yellow-300 border-b-transparent animate-spin animation-delay-500"
                      data-oid="o:72jp8"
                    ></div>
                  </div>
                  <div data-oid="b75j-w2">
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-2"
                      data-oid="xb8okf-"
                    >
                      Linking Student...
                    </h3>
                    <p className="text-gray-600" data-oid="_h77vfx">
                      Please wait while we connect the student to your account
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Add this to your global CSS
// @keyframes scan {
//   0% { transform: translateY(-100%); }
//   100% { transform: translateY(200%); }
// }
// .animate-scan {
//   animation: scan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
// }
// .animation-delay-500 {
//   animation-delay: 500ms;
// }

export default QRScanner;
