import Link from 'next/link'
import React from 'react'

export default function ProductCard({ product }) {
	return (
		<Link
			className="bg-white rounded-lg border-gray-800 mb-3 overflow-hidden hover:bg-gray-100 hover:cursor-pointer"
			href={`/products/${product.id}`}
		>
			{product.image && <img src={product.image} alt="" className="w-full" />}
			<div className="p-4">
				<h1 className="text-lg">{product.name}</h1>
				<h2 className="text-2xl text-slate-600"> {product.price} </h2>
				<p> {product.description} </p>
			</div>
		</Link>
	)
}
