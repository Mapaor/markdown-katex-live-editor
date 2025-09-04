import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true
    };

    // Handle .wasm files properly
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Add fallbacks for browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
      };
    }

    // Handle typst.ts modules - improved configuration
    config.module.rules.push({
      test: /node_modules\/@myriaddreamin\/.*\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    // Optimize chunks for large modules
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          typst: {
            test: /[\\/]node_modules[\\/]@myriaddreamin[\\/]/,
            name: 'typst',
            chunks: 'async',
            priority: 30,
          },
        },
      },
    };

    return config;
  },
};

export default nextConfig;