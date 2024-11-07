// components/PaymentForm.js

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { formatMoney } from "@/utils/utils"

const PaymentForm = ({
	currency,
	totalAmount,
	setPaymentMethod,
	setServiceFee,
}) => {
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

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center bg-stone-200 dark:bg-stone-800 w-max p-10 mx-auto lg:m-0 rounded-xl"
		>
			<PaymentElement
				business="Matson Brothers Painting"
				onChange={e => {
					const selectedPaymentMethod = e.value.type
					setPaymentMethod(selectedPaymentMethod)
					if (selectedPaymentMethod === "us_bank_account")
						setServiceFee(0)
				}}
			/>
			<button
				type="submit"
				className="mt-6 bg-stripe-green hover:bg-opacity-80 hover:shadow text-white dark:text-stone-800 py-1 px-2 rounded w-1/2"
			>
				Pay {formatMoney(totalAmount, currency)}
			</button>
			{error && <p className="text-red-500 my-6">{error}</p>}
		</form>
	)
}

export default PaymentForm
