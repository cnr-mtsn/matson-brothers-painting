import Stripe from "stripe"

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export default async function handler(req, res) {
	const id = req.query.id
	try {
		if (!id.startsWith("cs_")) {
			throw Error("Incorrect Checkout Session ID")
		}
		const session = await stripe.checkout.sessions.retrieve(id)
		res.status(200).json(session)
	} catch (err) {
		res.status(500).json({ statusCode: 500, message: err.message })
	}
}
