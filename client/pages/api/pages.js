// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import client from "@lib/sanity"

export default async function handler(req, res) {
	const data = await client.fetch(`*[_type == "page"]`)
	res.status(200).json(data)
}
