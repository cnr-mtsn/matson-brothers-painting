import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useState } from "react"
import PaymentForm from "@/components/PaymentForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST)

export default function OnlinePayment() {
	const [amount, setAmount] = useState("0.00")
	const [serviceFee, setServiceFee] = useState("0.00")
	const [totalAmount, setTotalAmount] = useState("0.00")

	const handleAmountChange = e => {
		const input = e.target.value.replace(/\D/g, "")
		const formattedAmount = (parseInt(input || 0) / 100).toFixed(2)
		const serviceFee = (parseFloat(input) * 0.03).toFixed(2)
		const totalAmount = (
			parseFloat(input) + parseFloat(serviceFee)
		).toFixed(2)
		setAmount(formattedAmount)
		setServiceFee(serviceFee)
		setTotalAmount(totalAmount)
	}
	return (
		<section className="payment-page-container p-10 flex flex-col items-center">
			<div className="flex items-center gap-4">
				<label htmlFor="amount">Amount to Pay</label>
				<input
					type="currency"
					id="amount"
					value={amount}
					className="w-auto p-2 focus:pl-6 bg-opacity-90 bg-white text-gray-400 focus:text-black focus:outline-none dark:text-gray-400 dark:focus:text-white bg-gray-200 dark:bg-stone-800 focus:bg-white dark:focus:bg-gray-700 hover:bg-opacity-90 transition-all duration-300 ease-in-out"
					onChange={handleAmountChange}
				/>
			</div>
			{parseFloat(amount) > 0 && (
				<Elements
					stripe={stripePromise}
					options={{
						mode: "payment",
						amount: parseInt(totalAmount),
						currency: "usd",
						appearance: {
							theme: "night",
						},
					}}
				>
					<PaymentForm
						serviceFee={serviceFee}
						amount={parseInt(amount * 100)}
						totalAmount={parseInt(totalAmount)}
						currency="usd"
					/>
				</Elements>
			)}
		</section>
	)
}
