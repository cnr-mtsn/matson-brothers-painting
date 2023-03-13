import Stripe from "stripe"

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const session = await stripe.checkout.sessions.create({
				mode: "payment",
				payment_method_types: ["card"],
				line_items: req?.body?.items ?? [],
				success_url: `${req.headers.origin}/success?session_id=${CHECKOUT_SESSION_ID}`,
				cancel_url: `${req.headers.origin}/`,
			})
			res.status(200).json(session)
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: err.message })
		}
	} else {
		res.setHeader("Allow", "POST")
		res.status(405).json({ statusCode: 405, message: "Method not allowed" })
	}
}
