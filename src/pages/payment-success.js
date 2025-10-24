import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import { formatMoney } from "@/utils/utils"
import { siteData } from "../data/siteData"

export default function PaymentSuccess() {
	const router = useRouter()
	const [paymentDetails, setPaymentDetails] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!router.isReady) return

		const { payment_intent } = router.query

		if (!payment_intent) {
			setError("No payment information found")
			setLoading(false)
			return
		}

		// Fetch payment details from Stripe
		const fetchPaymentDetails = async () => {
			try {
				const response = await fetch(`/api/payment-details?payment_intent=${payment_intent}`)
				const data = await response.json()

				if (response.ok) {
					setPaymentDetails(data)
				} else {
					setError(data.message || "Failed to load payment details")
				}
			} catch (err) {
				console.error("Error fetching payment details:", err)
				setError("Failed to load payment details")
			} finally {
				setLoading(false)
			}
		}

		fetchPaymentDetails()
	}, [router.isReady, router.query])

	return (
		<>
			<Head>
				<title>{`Payment Successful | ${siteData.name}`}</title>
				<meta name="description" content="Your payment was processed successfully" />
			</Head>

			<main className="payment-page">
				<div className="payment-container">
					<div className="max-w-2xl mx-auto">
						{loading ? (
							<div className="payment-amount-card text-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
								<p className="text-stone-600 dark:text-stone-400">Loading payment details...</p>
							</div>
						) : error ? (
							<div className="payment-amount-card text-center py-12">
								<div className="w-16 h-16 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</div>
								<h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Error</h1>
								<p className="text-stone-600 dark:text-stone-400 mb-6">{error}</p>
								<Link href="/" className="inline-block px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
									Return Home
								</Link>
							</div>
						) : (
							<div className="payment-amount-card">
								{/* Success Icon */}
								<div className="text-center mb-8">
									<div className="w-20 h-20 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
										<svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">
										Payment Successful!
									</h1>
									<p className="text-stone-600 dark:text-stone-400">
										Thank you for your payment. Your transaction has been completed.
									</p>
								</div>

								{/* Payment Details */}
								<div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-6 mb-6">
									<h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
										Payment Details
									</h2>
									<div className="space-y-3">
										<div className="flex justify-between items-center py-2 border-b border-stone-200 dark:border-stone-700">
											<span className="text-stone-600 dark:text-stone-400">Amount Paid:</span>
											<span className="text-2xl font-bold text-green-600 dark:text-green-400">
												{paymentDetails ? formatMoney(paymentDetails.amount) : "—"}
											</span>
										</div>
										<div className="flex justify-between items-center py-2 border-b border-stone-200 dark:border-stone-700">
											<span className="text-stone-600 dark:text-stone-400">Payment Method:</span>
											<span className="font-semibold text-stone-900 dark:text-white">
												{paymentDetails?.paymentMethod === "us_bank_account"
													? "Bank Account (ACH)"
													: paymentDetails?.paymentMethod === "card"
													? `Card ending in ${paymentDetails?.last4 || "****"}`
													: "Card"}
											</span>
										</div>
										<div className="flex justify-between items-center py-2 border-b border-stone-200 dark:border-stone-700">
											<span className="text-stone-600 dark:text-stone-400">Transaction ID:</span>
											<span className="font-mono text-sm text-stone-900 dark:text-white">
												{paymentDetails?.id || "—"}
											</span>
										</div>
										<div className="flex justify-between items-center py-2">
											<span className="text-stone-600 dark:text-stone-400">Date:</span>
											<span className="font-semibold text-stone-900 dark:text-white">
												{paymentDetails?.date
													? new Date(paymentDetails.date * 1000).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit"
													})
													: "—"}
											</span>
										</div>
										{paymentDetails?.invoiceNumber && (
											<div className="flex justify-between items-center py-2 border-t border-stone-200 dark:border-stone-700">
												<span className="text-stone-600 dark:text-stone-400">Invoice Number:</span>
												<span className="font-semibold text-stone-900 dark:text-white">
													#{paymentDetails.invoiceNumber}
												</span>
											</div>
										)}
									</div>
								</div>

								{/* Confirmation Message */}
								{/* <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
									<p className="text-sm text-blue-800 dark:text-blue-300">
										<strong>Confirmation:</strong> A receipt has been sent to your email address.
										Please save this confirmation for your records.
									</p>
								</div> */}

							</div>
						)}
					</div>
				</div>
			</main>
		</>
	)
}
