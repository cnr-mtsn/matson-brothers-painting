export default async function handler(req, res) {
	try {
		return res.status(200).json({
			message: `Invoice retrieved successfully!`,
		})
	} catch (error) {
		console.log("Error: ", error)
		return res.status(500).json({
			message: `Sorry, there was a problem getting the invoice.`,
		})
	}
}
