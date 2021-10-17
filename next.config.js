const AssetsMap = require('./plugins/AssetsMap')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.unshift(new AssetsMap())

    return config
  },
}
