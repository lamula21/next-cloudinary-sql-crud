import React from 'react'
import axios from 'axios'
import Buttons from './Buttons'

async function loadProduct(productID) {
	// console.log(productID)
	const res = await axios.get(`http://localhost:3000/api/products/${productID}`) // server component: full route
	return res.data
}

export default async function ProductPage({ params }) {
	const product = await loadProduct(params.id)
	// console.log(product)

	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="flex justify-center items-center max-w-lg">
				{/* // Card */}
				<div className="text-black  bg-white rounded-lg overflow-hidden">
					{product.image && (
						<img
							src={product.image}
							alt="Una description de la imagen"
							className="w-full"
						/>
					)}
					<div className="px-6 py-4">
						<h3 className="text-2xl font-bold mb-3">{product.name}</h3>
						<h4 className="text-4xl font-bold">${product.price}</h4>
						<p className="text-slate-700">{product.description}</p>
						<Buttons productId={product.id} />
					</div>
				</div>
			</div>
		</div>
	)
}
