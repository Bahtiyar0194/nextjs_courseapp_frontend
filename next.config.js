const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = withPWA({
  reactStrictMode: false,
  i18n: {
    defaultLocale: "ru",
    locales: ["kk", "ru", "en"],
    localeDetection: false
  }
});

module.exports = nextConfig;