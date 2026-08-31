import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statischer Export: das Ergebnis in "out/" wird per FTP auf normalen Webspace
  // (netcup Webhosting) hochgeladen. Kein Node-Prozess, kein Server nötig.
  output: "export",
  images: {
    // next/image's Optimierungs-Server läuft im static export nicht -> unoptimized.
    unoptimized: true,
  },
};

export default nextConfig;
