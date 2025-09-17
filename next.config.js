/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'k.kakaocdn.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'k.kakaocdn.net',
                port: '',
                pathname: '/**',
            }
        ],
    },
};

module.exports = nextConfig;
