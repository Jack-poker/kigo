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
      data-oid="kz2k678"
    >
      <Card
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-0 overflow-hidden"
        data-oid="07fdqyc"
      >
        <CardHeader
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6"
          data-oid="o3scts3"
        >
          <div className="flex items-center justify-between" data-oid="rgs_nbn">
            <CardTitle
              className="flex items-center space-x-2 text-white"
              data-oid="cg.3jvf"
            >
              <QrCode className="h-6 w-6" data-oid="9dp:nkv" />
              <span className="text-xl font-bold" data-oid="gjcy:j:">
                Scan Student QR Code
              </span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white"
              data-oid="lyb.qbw"
            >
              <X className="h-4 w-4" data-oid="uwtl69i" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6" data-oid="5.9-bx1">
          {cameraError ? (
            <div className="text-center space-y-4 py-8" data-oid="shcxci.">
              <div
                className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center"
                data-oid="tw-.p6h"
              >
                <AlertCircle
                  className="h-8 w-8 text-red-500"
                  data-oid="hoyca0y"
                />
              </div>
              <div data-oid="znrr7t7">
                <h3
                  className="text-lg font-semibold text-gray-900 mb-2"
                  data-oid="whj55a:"
                >
                  Camera Access Denied
                </h3>
                <p className="text-gray-600 mb-6" data-oid="-z4cq67">
                  Please allow camera access to scan QR codes
                </p>
                <Button
                  onClick={startCamera}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  data-oid="p4uyru7"
                >
                  <Camera className="h-4 w-4 mr-2" data-oid="sjas_4o" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : !scanResult ? (
            <>
              <div
                className="relative bg-black rounded-xl overflow-hidden aspect-square mb-6"
                data-oid="j19-8pm"
              >
                {/* Video feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  data-oid="da7grxa"
                />

                {/* Canvas overlay for animations */}
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="absolute inset-0 w-full h-full"
                  data-oid="nsxzdjx"
                />

                {/* Scanning frame */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  data-oid="s:g1s:e"
                >
                  <div
                    className="w-3/4 h-3/4 border-2 border-yellow-400 rounded-lg relative"
                    data-oid="qmdtzgx"
                  >
                    {/* Corner markers */}
                    <div
                      className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl"
                      data-oid="2fm9usj"
                    ></div>
                    <div
                      className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr"
                      data-oid="iousl-t"
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl"
                      data-oid=".cblsmr"
                    ></div>
                    <div
                      className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br"
                      data-oid="pniqu76"
                    ></div>

                    {/* Scanning animation */}
                    {isScanning && (
                      <div
                        className="absolute inset-0 overflow-hidden"
                        data-oid="k8y40k."
                      >
                        <div
                          className="h-1 bg-yellow-400 w-full absolute top-1/2 transform -translate-y-1/2 animate-scan opacity-70 shadow-lg shadow-yellow-300"
                          data-oid="yiuzj60"
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
                  data-oid="nii:z77"
                ></div>
              </div>

              <div className="text-center space-y-4" data-oid="xx-0aga">
                <p className="text-gray-700 font-medium" data-oid="0sfoom9">
                  Position the QR code within the frame
                </p>
                <Button
                  onClick={simulateQRScan}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all w-full"
                  data-oid="l5qrfjq"
                >
                  Simulate QR Scan (Demo)
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6 py-4" data-oid="ye9_vh9">
              {!isLinking ? (
                <div className="space-y-4" data-oid="y41-d4x">
                  <div
                    className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center animate-in zoom-in duration-300"
                    data-oid="agntcwo"
                  >
                    <CheckCircle
                      className="h-10 w-10 text-green-500"
                      data-oid="8s4u9pz"
                    />
                  </div>
                  <div data-oid="6ddlx60">
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-2"
                      data-oid="r5crdc:"
                    >
                      QR Code Detected!
                    </h3>
                    <p className="text-gray-600 mb-2" data-oid="eek:grf">
                      Student ID: {scanResult}
                    </p>
                    <div
                      className="flex space-x-3 justify-center mt-6"
                      data-oid="wpumdjl"
                    >
                      <Button
                        onClick={() => handleStudentLink(scanResult)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
                        data-oid="0_ssr.8"
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
                        data-oid="b1knvvl"
                      >
                        Scan Again
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4" data-oid="zf0emvt">
                  <div
                    className="relative w-20 h-20 mx-auto"
                    data-oid="7r55yab"
                  >
                    <div
                      className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"
                      data-oid="zvqt387"
                    ></div>
                    <div
                      className="absolute inset-3 rounded-full border-4 border-yellow-300 border-b-transparent animate-spin animation-delay-500"
                      data-oid=".c:c4rr"
                    ></div>
                  </div>
                  <div data-oid="0or0ypi">
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-2"
                      data-oid=".q2:wgl"
                    >
                      Linking Student...
                    </h3>
                    <p className="text-gray-600" data-oid="c3m9k_d">
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
