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
		invoiceData,
	} = req.body

	try {
		// Create payment intent with invoice metadata if available
		const paymentIntentData = {
			amount,
			currency,
		}

		// Add invoice metadata to Stripe payment if invoice data is provided
		if (invoiceData) {
			paymentIntentData.metadata = {
				qb_invoice_id: invoiceData.invoiceId,
				qb_invoice_number: invoiceData.invoiceNumber,
				customer_name: invoiceData.customerName,
				invoice_balance: invoiceData.balance,
			}
			paymentIntentData.description = `Payment for Invoice #${invoiceData.invoiceNumber} - ${invoiceData.customerName}`
		}

		const paymentIntent = await stripe.paymentIntents.create(paymentIntentData)
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
