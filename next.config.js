/** @type {import('next').NextConfig} */
const nextConfig = {
	// set intial root page
	async redirects() {
		return [
			{
				source: '/',
				destination: '/products',
				permanent: true,
			},
		]
	},
}

module.exports = nextConfig
