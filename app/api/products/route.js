import path from 'path'
import { NextResponse } from 'next/server'
import { connection } from '@/libs/mysql'
import { writeFile, unlink } from 'fs/promises'
/****** Exported to /libs *******/
// import { v2 as cloudinary } from 'cloudinary'
// cloudinary.config({
// 	cloud_name: 'lamula',
// 	api_key: '948592785846574',
// 	api_secret: process.env.CLOUDINARY_API_SECRET,
// })
import cloudinary from '@/libs/cloudinary'

export async function GET() {
	try {
		const results = await connection.query('SELECT * FROM product')

		return NextResponse.json(results)
	} catch (error) {
		return NextResponse.json(
			{ message: error.message },
			{
				status: 500,
			}
		)
	}
}

export async function POST(request) {
	try {
		// const { name, description, price } = await request.json() // now receiving a formData instead of json
		const data = await request.formData()
		const name = data.get('name')
		const image = data.get('image')

		// Validating Name
		if (!name) {
			return NextResponse.json(
				{
					message: 'Name is required',
				},
				{
					status: 400,
				}
			)
		}

		// Validating Image
		if (!image) {
			return NextResponse.json(
				{
					message: 'Image is required',
				},
				{
					status: 400,
				}
			)
		}

		/********************* 
		Upload image locally 
		*********************/
		// Info in previous commit

		/***********************************
		Upload image directly to Cloudinary 
		***********************************/
		const bytes = await image.arrayBuffer() // image in bytes
		const buffer = Buffer.from(bytes) // convert to a js buffer
		// upload_stream: uploads raw files like buffer

		// need a promise to send a response
		const res = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({}, (error, result) => {
					if (error) {
						reject(error)
					}
					resolve(result)
				})
				.end(buffer)
		})

		const result = await connection.query('INSERT INTO product SET ?', {
			name: data.get('name'),
			price: data.get('price'),
			description: data.get('description'),
			image: res.secure_url,
		})

		return NextResponse.json({
			name: data.get('name'),
			price: data.get('price'),
			description: data.get('description'),
			id: result.insertId,
		})
	} catch (error) {
		return NextResponse.json(
			{ message: error.message },
			{
				status: 500,
			}
		)
	}
}
