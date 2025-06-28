import React from "react";

const ScannerOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" data-oid="7-2tz4z">
      {/* Scanning animation overlay */}
      <div className="relative w-full h-full" data-oid="1yb9:n:">
        {/* Corner brackets */}
        <div
          className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-emerald-400 rounded-tl-lg animate-pulse"
          data-oid="bfvt:wa"
        ></div>
        <div
          className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-emerald-400 rounded-tr-lg animate-pulse"
          data-oid="b-wimtk"
        ></div>
        <div
          className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-emerald-400 rounded-bl-lg animate-pulse"
          data-oid="dugo-lh"
        ></div>
        <div
          className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-emerald-400 rounded-br-lg animate-pulse"
          data-oid="nahqxye"
        ></div>

        {/* Center target */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          data-oid="zmd_snj"
        >
          <div
            className="w-48 h-48 border-2 border-emerald-400 rounded-lg relative"
            data-oid="h8gn2_m"
          >
            {/* Scanning line animation */}
            <div
              className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line"
              data-oid="8kc3jre"
            ></div>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm"
          data-oid=".9dn._v"
        >
          Position QR code within the frame
        </div>
      </div>
    </div>
  );
};

export default ScannerOverlay;
