import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useState } from "react"
import PaymentForm from "@/components/PaymentForm"
import { formatMoney } from "@/utils/utils"
import { stripeElementAppearance } from "@/utils/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function OnlinePayment() {
	const SERVICE_FEE_PERCENTAGE = 0.03

	const [subtotal, setSubtotal] = useState(0)
	const [serviceFee, setServiceFee] = useState(0)
	const [totalAmount, setTotalAmount] = useState(0)

	const handleAmountChange = e => {
		const input = e.target.value.replace(/\D/g, "")
		console.log("Input: ", input, typeof input)
		const formattedAmount = parseInt(input || 0)
		const serviceFee = parseInt(input * SERVICE_FEE_PERCENTAGE)
		// add the formattedAmount and serviceFee to get the total amount in cents
		const totalAmount = parseInt(formattedAmount + serviceFee)

		setSubtotal(formattedAmount)
		setServiceFee(serviceFee)
		setTotalAmount(totalAmount)
	}
	const centsToDollars = amount => amount / 100

	return (
		<section className="payment-page-container p-10 flex flex-col md:flex-row gap-8 bg-white dark:bg-opacity-10 mx-auto w-auto max-w-[95vw] rounded">
			<div className="flex flex-col justify-between py-10">
				<div className="flex items-center gap-4 w-full text-base border-b-2 border-black dark:border-stone-400">
					<label htmlFor="subtotal" className="w-max">
						Amount to Pay
					</label>
					<input
						type="currency"
						id="subtotal"
						name="subtotal"
						placeholder="Enter amount to pay"
						value={
							subtotal > 0
								? centsToDollars(subtotal).toFixed(2)
								: ""
						}
						className="py-1 px-1 bg-stone-200 mb-2 outline-none text-stone-800 focus:text-black focus:outline-none dark:text-gray-400 dark:focus:text-white dark:bg-stone-800 dark:focus:bg-stone-600 hover:bg-opacity-90 transition-all duration-300 ease-in-out"
						onChange={handleAmountChange}
					/>
				</div>
				{parseFloat(subtotal) > 0 && (
					<div className="cost">
						<p className="flex justify-between">
							Subtotal: <span>{formatMoney(subtotal)}</span>
						</p>
						<div className="flex justify-between">
							<span>Service Fee:</span>
							<div className="relative">
								{formatMoney(serviceFee)}
								<div className="absolute group text-gray-500 hover:text-gray-300 transition-all duration-300 ease-in-out cursor-pointer absolute -right-5 -top-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 inline-block ml-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
										/>
									</svg>
									<span className="absolute right-full md:right-full z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out bg-gray-700 text-white text-xs rounded p-2 w-48">
										A 3% credit card processing fee will be
										added to the total amount.
									</span>
								</div>
							</div>
						</div>
						<p className="flex justify-between border-t-2 border-black dark:border-stone-400">
							Total: <span>{formatMoney(totalAmount)}</span>
						</p>
					</div>
				)}
			</div>
			{parseFloat(subtotal) > 0 && stripePromise && (
				<Elements
					stripe={stripePromise}
					options={{
						mode: "payment",
						amount: parseInt(totalAmount),
						currency: "usd",
						appearance: stripeElementAppearance,
					}}
				>
					<PaymentForm
						totalAmount={parseInt(totalAmount)}
						currency="usd"
					/>
				</Elements>
			)}
		</section>
	)
}
