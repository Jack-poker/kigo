import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError: (error: Error) => void;
  'data-oid'?: string;
}

interface QRScannerRef {
  stop: () => void;
}

const QRScanner = forwardRef<QRScannerRef, QRScannerProps>(({ onScan, onError, 'data-oid': dataOid }, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    const startScanning = async () => {
      try {
        if (!videoRef.current) {
          throw new Error('Video element not found');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        await videoRef.current.play();

        codeReader.current.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, error) => {
            if (result) {
              onScan(result.getText());
            }
            if (error && error.name !== 'NotFoundException') {
              console.error('QR Scan error:', error.name);
              onError(error);
            }
          },
          { delayBetweenScanAttempts: 500 }
        );
      } catch (err) {
        console.error('Camera access error:', err);
        onError(err as Error);
      }
    };

    startScanning();

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [onScan, onError]);

  useImperativeHandle(ref, () => ({
    stop: () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    },
  }));

  return (
    <div className="relative w-full aspect-square max-w-[320px] mx-auto rounded-lg overflow-hidden" data-oid={dataOid}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
      />
    </div>
  );
});

QRScanner.displayName = 'QRScanner';

export default React.memo(QRScanner);