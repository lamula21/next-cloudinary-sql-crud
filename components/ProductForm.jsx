'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation' // app router version

export default function ProductForm() {
	const [product, setProduct] = useState({
		name: '',
		price: '',
		description: '',
	})
	const formRef = useRef(null)
	const router = useRouter()
	const params = useParams() // catch params in a client component
	const [file, setFile] = useState(null) // state for image files

	// if /products/edit/[id]
	useEffect(() => {
		if (params.id) {
			axios.get(`/api/products/${params.id}`).then((res) => {
				setProduct({
					name: res.data.name,
					price: res.data.price,
					description: res.data.description,
				})
			})
		}
	}, [])

	function handleChange(e) {
		//console.log(e.target.value, e.target.name)
		setProduct({
			...product,
			[e.target.name]: e.target.value,
		})
	}

	async function handleSubmit(e) {
		e.preventDefault()

		// mocking a form in javascript (to add a file)
		const formData = new FormData()
		formData.append('name', product.name)
		formData.append('price', product.price)
		formData.append('description', product.description)

		// If uploaded file, add to formData
		if (file) {
			formData.append('image', file)
		}

		/************************
		if creating a new product 
		*************************/
		if (!params.id) {
			const res = await axios.post('/api/products', formData, {
				headers: {
					'Content-Type': 'multipart/form-data', // specifying that sending data with a heavy file (image with several bytes)
				},
			}) // note: client-side no need of full url, server-side needed
		} else {
			/******************** 
			if editing a product 
			*********************/
			// const res = await axios.put(`/api/products/${params.id}`, product)
			const res = await axios.put(`/api/products/${params.id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data', // specifying that sending data with a heavy file (image with several bytes)
				},
			})
		}

		formRef.current.reset()
		router.push('/products')
		router.refresh()
	}

	return (
		<div>
			<form
				ref={formRef}
				className="text-gray-700 bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4"
				onSubmit={handleSubmit}
			>
				<label htmlFor="name" className="block text-sm font-bold mb-2">
					Product Name
				</label>
				<input
					id="name"
					name="name"
					value={product.name} // input default value
					type="text"
					placeholder="name"
					onChange={handleChange}
					autoFocus
					className="shadow appearance-none border rounded w-full py-2 px-3"
				/>

				<label htmlFor="price" className="block text-sm font-bold mb-2">
					Product Price
				</label>
				<input
					id="price"
					name="price"
					value={product.price} // input default value
					type="text"
					placeholder="00.00"
					onChange={handleChange}
					className="shadow appearance-none border rounded w-full py-2 px-3"
				/>

				<label htmlFor="description" className="block text-sm font-bold mb-2">
					Product Description
				</label>
				<textarea
					id="description"
					name="description"
					value={product.description} // input default value
					rows={3}
					placeholder="description"
					onChange={handleChange}
					className="shadow appearance-none border rounded w-full py-2 px-3"
				/>

				{/* Image Input */}
				<label htmlFor="">Product Image:</label>
				<input
					type="file"
					className="shadow appearance-none border rounded w-full py-2 px-3 mb-2"
					onChange={(e) => {
						setFile(e.target.files[0])
					}}
				/>

				{file && (
					<img
						src={URL.createObjectURL(file)}
						alt=""
						className="w-96 object-contain mx-auto my-3"
					/>
				)}

				<button className="text-white font-bold rounded bg-blue-500 hover:bg-blue-700 py-2 px-4">
					{params.id ? 'Edit Product' : 'Save Product'}
				</button>
			</form>
		</div>
	)
}
