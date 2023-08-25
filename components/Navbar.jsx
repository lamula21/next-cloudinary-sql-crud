import Link from 'next/link'
import React from 'react'

export default function Navbar() {
	return (
		<nav className="bg-zinc-900 text-white py-3 mb-2">
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/">
					<h3>NextMySQL</h3>
				</Link>
				<ul>
					<li>
						<Link href="/new" className="text-sky-500 hover:text-sky-400">
							New
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	)
}
