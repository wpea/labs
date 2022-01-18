module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["images.pexels.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
};
