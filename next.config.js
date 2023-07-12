module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.pexels.com",
      "res.cloudinary.com",
      "resources.alleghenycounty.us",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // port: '',
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: "resources.alleghenycounty.us",
        // port: '',
        // pathname: '/account123/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};
