// components/PaymentForm.js

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useRouter } from "next/router"

const PaymentForm = ({ amount, currency, serviceFee, totalAmount }) => {
	const router = useRouter()

	const stripe = useStripe()
	const elements = useElements()
	const [error, setError] = useState(null)

	const handleSubmit = async e => {
		e.preventDefault()
		if (elements == null || stripe == null) {
			return
		}

		const { error: submitError } = await elements.submit()
		if (submitError?.message) {
			setError(submitError.message)
			return
		}
		try {
			const response = await fetch("/api/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					paymentMethod: "card",
					amount: totalAmount,
					currency,
				}),
			})
			const data = await response.json()
			if (response.status === 200) {
				const { clientSecret } = data
				const { error: confirmError } = await stripe.confirmPayment({
					elements,
					clientSecret,
					confirmParams: {
						return_url: `${window.location.origin}/payment-success`,
					},
				})
				if (confirmError) setError(confirmError.message)
			} else {
				setError("error")
			}
		} catch (error) {
			console.log("Error: ", error)
			setError("error")
		}
	}
	const formatMoney = amount =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
		}).format(amount / 100)

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center bg-white dark:bg-stone-900 w-max p-10 mx-auto rounded-xl"
		>
			<PaymentElement />
			<div className="cost">
				<p>Subtotal: {formatMoney(amount)}</p>
				<p>Service Fee: {formatMoney(serviceFee)}</p>
				<p>Total: {formatMoney(totalAmount)}</p>
			</div>
			<button
				type="submit"
				className="mt-6 bg-white dark:bg-stone-700 dark:text-gray-300 hover:bg-gray-100 py-1 px-2 rounded w-1/2 bg-white text-black"
			>
				Pay {formatMoney(totalAmount)}
			</button>
			{error && <p className="text-red-500 my-6">{error}</p>}
		</form>
	)
}

export default PaymentForm
