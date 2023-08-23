// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
	// send a message to the user after submitting a contact form
	res.status(200).json({
		message: "Thank you for reaching out to Sims Custom Homes!",
	})
}
