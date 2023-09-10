/** @type {import('next').NextConfig} */
// const nextConfig = {
    // images:{
        // domains:[
            // "image.tmdb.org"
        // ]
    // }
// }


const nextConfig  = {
    images: {
        domains:[
            "image.tmdb.org"
        ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: "image.tmdb.org",
          port: '',
          pathname: '/account123/**',
        },
      ],
    },
  }

module.exports = nextConfig
