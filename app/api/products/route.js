import { NextResponse } from 'next/server'
import { connection } from '@/libs/mysql'

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
		const { name, description, price } = await request.json()

		const result = await connection.query('INSERT INTO product SET ?', {
			name,
			description,
			price,
		})

		//console.log(result)

		return NextResponse.json({
			name,
			description,
			price,
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
