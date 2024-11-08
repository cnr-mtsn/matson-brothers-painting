import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useEffect, useState } from "react"
import PaymentForm from "@/components/PaymentForm"
import { formatMoney } from "@/utils/utils"
import { stripeElementAppearance } from "@/utils/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function OnlinePayment() {
	const processingFee = process.env.STRIPE_PROCESSING_FEE || 0.03

	const [paymentMethod, setPaymentMethod] = useState("")
	const [subtotal, setSubtotal] = useState(0)
	const [serviceFee, setServiceFee] = useState(0)
	const [totalAmount, setTotalAmount] = useState(0)
	const [isDarkMode, setIsDarkMode] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		const handleChange = e => setIsDarkMode(e.matches)
		mediaQuery.addEventListener("change", handleChange)
		setIsDarkMode(mediaQuery.matches)
		return () => mediaQuery.removeEventListener("change", handleChange)
	}, [])
	useEffect(() => {
		if (paymentMethod === "card") {
			setServiceFee(parseInt(subtotal * processingFee))
			setTotalAmount(parseInt(subtotal + subtotal * processingFee))
		} else {
			setServiceFee(0)
			setTotalAmount(subtotal)
		}
	}, [subtotal, paymentMethod])

	const handleAmountChange = e => {
		const input = e.target.value.replace(/\D/g, "")
		const formattedAmount = parseInt(input || 0)
		setSubtotal(formattedAmount)
	}
	const centsToDollars = amount => amount / 100

	return (
		<section className="payment-page-container p-4 lg:p-10 flex flex-col-reverse gap-2 lg:gap-20 lg:flex-row lg:justify-center bg-white bg-opacity-50 dark:bg-opacity-10 mx-auto w-max max-w-[95vw] rounded">
			<div className="flex flex-col justify-between p-10">
				<div className="flex items-center justify-center lg:justify-between gap-4 w-full text-base">
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
						className="p-2 bg-stone-200 mb-2 outline-none text-stone-800 focus:text-black focus:outline-none dark:text-gray-400 dark:focus:text-white dark:bg-stone-800 dark:focus:bg-stone-600 hover:bg-opacity-90 transition-all duration-300 ease-in-out text-center"
						onChange={handleAmountChange}
					/>
				</div>
				{parseFloat(subtotal) > 0 && (
					<div className="cost flex flex-col gap-1 mt-4  border-t-2 border-black dark:border-stone-400">
						<p className="flex justify-between">
							Subtotal: <span>{formatMoney(subtotal)}</span>
						</p>
						{serviceFee > 0 && (
							<div className="flex justify-between">
								<span>Processing Fee:</span>
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
										<span className="absolute right-full lg:right-full z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out bg-gray-700 text-white text-sm rounded p-2 w-48">
											A 3% credit card processing fee will
											be added to the total amount.
										</span>
									</div>
								</div>
							</div>
						)}
						<p className="flex justify-between border-t-2 border-black dark:border-stone-400">
							Total: <span>{formatMoney(totalAmount)}</span>
						</p>
					</div>
				)}
			</div>
			{totalAmount > 0 && stripePromise && (
				<Elements
					stripe={stripePromise}
					options={{
						mode: "payment",
						amount: parseInt(totalAmount),
						currency: "usd",
						business: "Matson Brothers Painting",
						appearance: {
							...stripeElementAppearance,
							theme: isDarkMode ? "night" : "stripe",
						},
					}}
				>
					<PaymentForm
						totalAmount={parseInt(totalAmount)}
						setPaymentMethod={setPaymentMethod}
						setServiceFee={setServiceFee}
						currency="usd"
					/>
				</Elements>
			)}
		</section>
	)
}
