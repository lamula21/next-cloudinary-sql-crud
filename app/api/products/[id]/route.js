import { NextResponse } from 'next/server'
import { connection } from '@/libs/mysql'

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
		const data = await request.json()
		const result = await connection.query('UPDATE product SET ? WHERE id = ?', [
			data,
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
		return NextResponse.json(
			{
				message: error.message,
			},
			{ status: 500 }
		)
	}
}
