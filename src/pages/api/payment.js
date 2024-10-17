import Stripe from "stripe"

export default async function handler(req, res) {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
		apiVersion: "2024-09-30.acacia",
	})
	console.log("New payment request: ", req.body)
	const {
		cardName,
		email,
		cardNumber,
		expirationDate,
		cvv,
		amount,
		currency,
	} = req.body

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
		})
		console.log("Payment intent: ", paymentIntent)
		const paymentId = paymentIntent.id

		return res.status(200).json({
			message: `Your payment has been processed, thank you!`,
			clientSecret: paymentIntent.client_secret,
			paymentId,
		})
	} catch (error) {
		console.log("Error: ", error)
		return res.status(500).json({
			message: `Sorry, there was a problem creating the payment.`,
		})
	}
}
