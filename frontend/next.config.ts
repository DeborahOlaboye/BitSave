import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile @mezo-org packages that contain TypeScript
  transpilePackages: [
    '@mezo-org/passport',
    '@mezo-org/orangekit',
    '@mezo-org/orangekit-contracts',
    '@mezo-org/orangekit-smart-account',
  ],

  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Ignore React Native dependencies that MetaMask SDK tries to import
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'react-native': false,
      'react-native-mmkv': false,
    };

    // Fallback for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;
