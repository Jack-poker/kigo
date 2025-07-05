import React from "react";

const ScannerOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" data-oid="8_65yb3">
      {/* Scanning animation overlay */}
      <div className="relative w-full h-full" data-oid="c264vqj">
        {/* Corner brackets */}
        <div
          className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-emerald-400 rounded-tl-lg animate-pulse"
          data-oid="sbc94lk"
        ></div>
        <div
          className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-emerald-400 rounded-tr-lg animate-pulse"
          data-oid="r5wg88g"
        ></div>
        <div
          className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-emerald-400 rounded-bl-lg animate-pulse"
          data-oid="c7qduuh"
        ></div>
        <div
          className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-emerald-400 rounded-br-lg animate-pulse"
          data-oid="jx_uw4i"
        ></div>

        {/* Center target */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          data-oid="5kidc_g"
        >
          <div
            className="w-48 h-48 border-2 border-emerald-400 rounded-lg relative"
            data-oid=":f4bkv5"
          >
            {/* Scanning line animation */}
            <div
              className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line"
              data-oid="d1q9i5_"
            ></div>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm"
          data-oid="cj.h_rb"
        >
          Position QR code within the frame
        </div>
      </div>
    </div>
  );
};

export default ScannerOverlay;
