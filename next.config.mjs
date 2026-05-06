/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // UploadThing v7 — app-scoped subdomain
      { protocol: "https", hostname: "*.ufs.sh" },
      // UploadThing legacy host (kept for compat with older uploads)
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
}

export default nextConfig
