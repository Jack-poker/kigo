import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

interface QRScannerProps {
  onScan: (result: string) => void;
  onError: (error: Error) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [codeReader] = useState(() => new BrowserMultiFormatReader());
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let scanning = true;

    const startScanning = async () => {
      try {
        if (videoRef.current && !isScanning) {
          setIsScanning(true);

          // Get user media first
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          });

          videoRef.current.srcObject = stream;

          // Wait for video to be ready before starting decode
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && scanning) {
              videoRef.current
                .play()
                .then(() => {
                  // Start decoding after video is playing
                  codeReader.decodeFromVideoDevice(
                    undefined,
                    videoRef.current!,
                    (result, error) => {
                      if (result && scanning) {
                        onScan(result.getText());
                        scanning = false;
                        setIsScanning(false);
                      }
                      if (
                        error &&
                        error.name !== "NotFoundException" &&
                        scanning
                      ) {
                        console.log("QR Scan error:", error.name);
                      }
                    },
                  );
                })
                .catch((playError) => {
                  console.log("Video play error:", playError);
                  onError(playError);
                });
            }
          };
        }
      } catch (err) {
        console.log("Camera access error:", err);
        onError(err as Error);
        setIsScanning(false);
      }
    };

    startScanning();

    return () => {
      scanning = false;
      setIsScanning(false);
      codeReader.reset();

      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [codeReader, onScan, onError]);

  return (
    <div
      className="relative w-full aspect-square bg-black rounded-lg overflow-hidden"
      data-oid="p_alvto"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay={false}
        data-oid="_wdhzvz"
      />

      {!isScanning && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          data-oid="y2_6rnq"
        >
          <div className="text-white text-center" data-oid="q3czaqt">
            <div
              className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"
              data-oid="6rgyacu"
            ></div>
            <p data-oid="05tvsux">Initializing camera...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
