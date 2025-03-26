import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "assets.discoveryresortmarketing.com",
          },
          {
            protocol: "https",
            hostname: "tailwindcss.com",
          },
          {
            protocol: "https",
            hostname: "encrypted-tbn0.gstatic.com",
          },
        ],
      },
};

if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
}

export default nextConfig;
