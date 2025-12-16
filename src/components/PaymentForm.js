// components/PaymentForm.js
'use client'

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { formatMoney } from "@/utils/utils"

const PaymentForm = ({
	currency,
	totalAmount,
	setPaymentMethod,
	setServiceFee,
	invoiceData,
}) => {
	const stripe = useStripe()
	const elements = useElements()
	const [error, setError] = useState(null)
	const [isReady, setIsReady] = useState(false)
	const [hasUserInteracted, setHasUserInteracted] = useState(false)

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
					amount: totalAmount,
					currency,
					invoiceData: invoiceData ? {
						invoiceId: invoiceData.id,
						invoiceNumber: invoiceData.docNumber,
						customerId: invoiceData.customerId,
						customerName: invoiceData.customerName,
						balance: invoiceData.balance,
					} : null,
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
			className="flex flex-col items-stretch w-full p-6 bg-transparent"
		>
			<PaymentElement
				business="Matson Brothers Painting"
				onReady={() => {
					console.log("PaymentElement is ready")
					setIsReady(true)
					// Allow onChange events after a short delay to ensure user interactions are captured
					setTimeout(() => setHasUserInteracted(true), 100)
				}}
				onChange={e => {
					const selectedPaymentMethod = e.value.type
					console.log("Payment method changed to:", selectedPaymentMethod, "hasUserInteracted:", hasUserInteracted)

					// Only update payment method if user has interacted (ignore automatic onChange on mount)
					if (hasUserInteracted) {
						setPaymentMethod(selectedPaymentMethod)
					}
				}}
			/>
			<button
				type="submit"
				className="mt-6 bg-stripe-green hover:bg-opacity-80 hover:shadow text-white dark:text-stone-800 py-3 px-6 rounded-lg font-semibold w-full"
			>
				Pay {formatMoney(totalAmount, currency)}
			</button>
			{error && <p className="text-red-500 my-6">{error}</p>}
		</form>
	)
}

export default PaymentForm
