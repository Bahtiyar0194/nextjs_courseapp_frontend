const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = withPWA({
  reactStrictMode: false,
  env: {
    MAIN_DOMAIN: 'localhost:3000',
    DEV_API: 'http://lms-platform.loc/api/v1',
    PROD_API: 'https://app-nabi-test.kz/api/v1'
  },
  i18n: {
    defaultLocale: "ru",
    locales: ["kk", "ru", "en"],
    localeDetection: false
  }
});

module.exports = nextConfig;