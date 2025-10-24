import Stripe from "stripe"

export default async function handler(req, res) {
	// Use the same Stripe key as the payment endpoint
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
		apiVersion: "2024-09-30.acacia",
	})

	const { payment_intent } = req.query

	if (!payment_intent) {
		return res.status(400).json({
			message: "Payment intent ID is required",
		})
	}

	try {
		// Retrieve the payment intent from Stripe
		const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

		// Get the payment method details if available
		let paymentMethodType = null
		let last4 = null

		if (paymentIntent.payment_method) {
			const paymentMethod = await stripe.paymentMethods.retrieve(
				paymentIntent.payment_method
			)
			paymentMethodType = paymentMethod.type

			if (paymentMethod.card) {
				last4 = paymentMethod.card.last4
			}
		}

		// Extract invoice information from metadata if available
		const invoiceNumber = paymentIntent.metadata?.qb_invoice_number || null

		return res.status(200).json({
			id: paymentIntent.id,
			amount: paymentIntent.amount,
			currency: paymentIntent.currency,
			status: paymentIntent.status,
			paymentMethod: paymentMethodType,
			last4: last4,
			date: paymentIntent.created,
			invoiceNumber: invoiceNumber,
			description: paymentIntent.description,
		})
	} catch (error) {
		console.error("Error retrieving payment details:", error)
		return res.status(500).json({
			message: "Failed to retrieve payment details",
		})
	}
}
