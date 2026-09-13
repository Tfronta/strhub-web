// Security headers applied to every response. The Content-Security-Policy is
// deliberately limited to directives that do not affect resource loading
// (frame-ancestors, object-src, base-uri) so it cannot break igv.js, GA or
// react-pdf; a full script-src/connect-src policy needs to be tested first.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      // Redirige www → sin www (fix SEO)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.strhub.app' }],
        destination: 'https://strhub.app/:path*',
        permanent: true,
      },
      {
        source: '/favicon.ico',
        destination: '/strhub-isologo.svg',
        permanent: false,
      },
      {
        source: '/blog',
        destination: '/community',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/community/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig