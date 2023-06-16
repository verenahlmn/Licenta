/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/logout',
      destination: '/api/logout',
      permanent: true,
    },
    {
      source: '/',
      destination: '/books',
      permanent: true,
    },
  ],
}

module.exports = nextConfig
