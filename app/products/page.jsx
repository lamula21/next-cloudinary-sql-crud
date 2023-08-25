import ProductCard from '@/components/ProductCard'
import axios from 'axios'

// import { connection } from '@/libs/mysql'

async function loadProducts() {
	// SERVER-SIDE: CALLING DIRECTLY DATABASE
	// const result = await connection.query('SELECT * FROM product')
	// console.log(result)

	// SERVER-SIDE: CALLING FROM OUR API
	const { data } = await axios.get('http://localhost:3000/api/products') // server-side full route
	//console.log(data)
	return data
}

export default async function ProductPage() {
	const products = await loadProducts()
	return (
		<div className="grid lg:grid-cols-4 gap-4 text-black">
			{products.map((product) => (
				<ProductCard product={product} key={product.id} />
			))}
		</div>
	)
}
