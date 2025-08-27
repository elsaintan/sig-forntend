/** @type {import('next').NextConfig} */
// const path = require("path");
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const nextConfig = {
  
  reactStrictMode: false,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    unoptimized: true,
  },
  compiler: {
    reactRemoveProperties: true,
  },

  
  // Support svg import
  // ref: https://dev.to/dolearning/importing-svgs-to-next-js-nna
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
      // use: [{loader: '@svgr/webpack', options: {icon: true}}],
    })
    return config
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  publicRuntimeConfig: {
    // ! 本機 api
    apiUrl: process.env.BACKEND_API_URL,
    // ! 測試區 api
    // apiUrl: 'https://gcp.i2csolution.com/KaoChangBackend/api'
  },


  // ! npm run build 打包時要開啟assetPrefix & output + close local sever
  // assetPrefix: "https://kc.i2csolution.com",
  // output: 'export',

  // trailingSlash: true,
  // experimental: {
  //   serverActions: true,
  // },
  // "rules": {
  //   "@typescript-eslint/explicit-module-boundary-types": "off"
  // }
  // typescript: {
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   ignoreBuildErrors: true,
  // },
  // 指定打包檔案放置的路徑
  // distDir: "dist",
  // trailingSlash: true,
  

}

export default nextConfig
