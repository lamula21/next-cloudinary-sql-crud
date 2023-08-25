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
		const bytes = await image.arrayBuffer() // image in bytes
		const buffer = Buffer.from(bytes) // convert to a js buffer
		// path to save the image: currentWorkingDirectory, /public,   -> string path
		const filePath = path.join(process.cwd(), 'public', image.name)
		await writeFile(filePath, buffer)

		// Note: When hosted, services like Verce, Onrender, they delete images files since they dont save these
		// Solution: Use Thrid Party Service, Cloudinary to save images as an url

		/*********************** 
		Upload image Cloudinary 
		***********************/
		const res = await cloudinary.uploader.upload(filePath)
		//console.log(res)

		// delete image locally
		if (res) {
			await unlink(filePath)
		}

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
