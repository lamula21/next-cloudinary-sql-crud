import { NextResponse } from 'next/server'
import { connection } from '@/libs/mysql'
import cloudinary from '@/libs/cloudinary'
import { processImage } from '@/libs/processImage'
import { unlink } from 'fs/promises'

export async function GET(req, { params }) {
	try {
		// ? maps to the next element in the array
		const result = await connection.query(
			'SELECT * FROM product WHERE id = ?',
			[params.id]
		)

		if (result.length === 0) {
			return NextResponse.json(
				{ message: 'Product not found' },
				{ status: 404 }
			)
		}
		// console.log(result)
		return NextResponse.json(result[0])
	} catch (error) {
		NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export async function DELETE(request, { params }) {
	try {
		const result = await connection.query('DELETE FROM product WHERE id = ?', [
			params.id,
		])

		// Validate result
		if (result.affectedRows === 0) {
			return NextResponse.json(
				{ message: 'Product not found' },
				{ status: 404 }
			)
		}

		return new Response(null, { status: 204 }) // 204: sucesfully deleted one but does not return anything
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export async function PUT(request, { params }) {
	try {
		const data = await request.formData()
		const name = data.get('name')
		const image = data.get('image')
		const updatedData = {
			name: data.get('name'),
			price: data.get('price'),
			description: data.get('description'),
		}

		/**********
		Validating 
		***********/
		if (!name) {
			return NextResponse.json(
				{ message: 'Name is required' },
				{
					status: 400,
				}
			)
		}

		/********************* 
		Edit image is optional 
		**********************/
		if (image) {
			const filePath = await processImage(image) // upload locally
			const res = await cloudinary.uploader.upload(filePath)
			updatedData.image = res.secure_url // if there is an image, append image url

			if (res) {
				await unlink(filePath)
			}
		}

		/***********
		Saving to DB 
		************/
		const result = await connection.query('UPDATE product SET ? WHERE id = ?', [
			updatedData,
			params.id,
		])

		// console.log(result)

		if (result.affectedRows === 0) {
			return NextResponse.json(
				{ message: 'Product not found' },
				{ status: 404 }
			)
		}

		// Another query to get updated product and return it
		const updatedProduct = await connection.query(
			'SELECT * FROM product WHERE id = ?',
			[params.id]
		)

		return NextResponse.json(updatedProduct[0])
	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{
				message: error.message,
			},
			{ status: 500 }
		)
	}
}
