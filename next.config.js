const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "media-cdn.tripadvisor.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media0.giphy.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "media1.giphy.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "media2.giphy.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "media3.giphy.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "media4.giphy.com",
        port: "",
        pathname: "/media/**",
      },
    ],
  },
};
