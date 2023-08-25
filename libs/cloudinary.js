import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
	cloud_name: 'lamula',
	api_key: '948592785846574',
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
