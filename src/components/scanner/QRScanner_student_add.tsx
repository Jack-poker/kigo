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
      data-oid="ezpx7vn"
    >
      <Card
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-0 overflow-hidden"
        data-oid="1yzhthv"
      >
        <CardHeader
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6"
          data-oid="2-cxq9-"
        >
          <div className="flex items-center justify-between" data-oid="f3bhzz:">
            <CardTitle
              className="flex items-center space-x-2 text-white"
              data-oid="bls-_0w"
            >
              <QrCode className="h-6 w-6" data-oid=":h4jaot" />
              <span className="text-xl font-bold" data-oid="jdvmozp">
                Scan Student QR Code
              </span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white"
              data-oid="kqepfne"
            >
              <X className="h-4 w-4" data-oid="4wqw:38" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6" data-oid="d8d7uka">
          {cameraError ? (
            <div className="text-center space-y-4 py-8" data-oid="-z8qve8">
              <div
                className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center"
                data-oid="gsiq3zd"
              >
                <AlertCircle
                  className="h-8 w-8 text-red-500"
                  data-oid="cj9ux:4"
                />
              </div>
              <div data-oid="ggo5lv4">
                <h3
                  className="text-lg font-semibold text-gray-900 mb-2"
                  data-oid="gw6dzhp"
                >
                  Camera Access Denied
                </h3>
                <p className="text-gray-600 mb-6" data-oid="fi2v:bk">
                  Please allow camera access to scan QR codes
                </p>
                <Button
                  onClick={startCamera}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  data-oid="ggb54d9"
                >
                  <Camera className="h-4 w-4 mr-2" data-oid="opx1w6m" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : !scanResult ? (
            <>
              <div
                className="relative bg-black rounded-xl overflow-hidden aspect-square mb-6"
                data-oid="bvvjmfe"
              >
                {/* Video feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  data-oid="40a4fo4"
                />

                {/* Canvas overlay for animations */}
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="absolute inset-0 w-full h-full"
                  data-oid="-k6jwqq"
                />

                {/* Scanning frame */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  data-oid="0i7kvka"
                >
                  <div
                    className="w-3/4 h-3/4 border-2 border-yellow-400 rounded-lg relative"
                    data-oid="1bsn8:y"
                  >
                    {/* Corner markers */}
                    <div
                      className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl"
                      data-oid="wrhol21"
                    ></div>
                    <div
                      className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr"
                      data-oid="z784nex"
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl"
                      data-oid="s0j4w.4"
                    ></div>
                    <div
                      className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br"
                      data-oid="bvd2cs8"
                    ></div>

                    {/* Scanning animation */}
                    {isScanning && (
                      <div
                        className="absolute inset-0 overflow-hidden"
                        data-oid="5jfkq8_"
                      >
                        <div
                          className="h-1 bg-yellow-400 w-full absolute top-1/2 transform -translate-y-1/2 animate-scan opacity-70 shadow-lg shadow-yellow-300"
                          data-oid="k:s1xyl"
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
                  data-oid="zs6617o"
                ></div>
              </div>

              <div className="text-center space-y-4" data-oid="wubxx2w">
                <p className="text-gray-700 font-medium" data-oid="nk4t:it">
                  Position the QR code within the frame
                </p>
                <Button
                  onClick={simulateQRScan}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all w-full"
                  data-oid="_3:yxt7"
                >
                  Simulate QR Scan (Demo)
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6 py-4" data-oid="fhyrm-h">
              {!isLinking ? (
                <div className="space-y-4" data-oid="2yylzp1">
                  <div
                    className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center animate-in zoom-in duration-300"
                    data-oid="r-fy2v3"
                  >
                    <CheckCircle
                      className="h-10 w-10 text-green-500"
                      data-oid="rzrmepy"
                    />
                  </div>
                  <div data-oid="cla9ah4">
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-2"
                      data-oid="hey:3h3"
                    >
                      QR Code Detected!
                    </h3>
                    <p className="text-gray-600 mb-2" data-oid="j9fo3t_">
                      Student ID: {scanResult}
                    </p>
                    <div
                      className="flex space-x-3 justify-center mt-6"
                      data-oid="mpn1n.8"
                    >
                      <Button
                        onClick={() => handleStudentLink(scanResult)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
                        data-oid="vcc.m81"
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
                        data-oid="wuw52a5"
                      >
                        Scan Again
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4" data-oid="hk.u5zd">
                  <div
                    className="relative w-20 h-20 mx-auto"
                    data-oid="7h85to9"
                  >
                    <div
                      className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"
                      data-oid="x629h9p"
                    ></div>
                    <div
                      className="absolute inset-3 rounded-full border-4 border-yellow-300 border-b-transparent animate-spin animation-delay-500"
                      data-oid="qs.5.25"
                    ></div>
                  </div>
                  <div data-oid="u5khe3z">
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-2"
                      data-oid="xjds0:0"
                    >
                      Linking Student...
                    </h3>
                    <p className="text-gray-600" data-oid="8t87pjq">
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
