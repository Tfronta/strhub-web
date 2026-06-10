/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
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