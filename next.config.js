/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Оптимизация для SEO
  compress: true,
  
  // Для SSG статических страниц
  output: 'standalone',

  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/',
        permanent: true,
      },
    ]
  },
  
  // Оптимизация изображений
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig

