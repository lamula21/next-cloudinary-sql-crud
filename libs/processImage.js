import { writeFile } from 'fs/promises'
import path from 'path'

export async function processImage(image) {
	const bytes = await image.arrayBuffer() // image in bytes
	const buffer = Buffer.from(bytes) // convert to a js buffer
	// path to save the image: currentWorkingDirectory, /public,   -> string path
	const filePath = path.join(process.cwd(), 'public', image.name)
	await writeFile(filePath, buffer)
	return filePath
}
