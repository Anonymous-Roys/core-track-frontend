import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // HTML pages (routes)
      urlPattern: /^https?:\/\/[^/]+\/(?!api)[^.]+$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Static assets (images, fonts, etc)
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff2?|ttf|eot)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Next.js static files
      urlPattern: /\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Images
      urlPattern: /\/_next\/image\?url=.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Fallback
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'fallback-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ],
})(nextConfig)
