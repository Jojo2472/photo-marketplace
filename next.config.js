// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './cloudinaryLoader.js',
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
