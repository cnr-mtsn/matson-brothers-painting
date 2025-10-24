'use client'

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import PaymentForm from "@/components/PaymentForm"
import { formatMoney } from "@/utils/utils"
import { stripeElementAppearance } from "@/utils/stripe"
import { siteData } from "../data/siteData"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function OnlinePayment() {
	const router = useRouter()
	const [paymentMethod, setPaymentMethod] = useState("us_bank_account")
	const [subtotal, setSubtotal] = useState(0)
	const [serviceFee, setServiceFee] = useState(0)
	const [totalAmount, setTotalAmount] = useState(0)
	const [isDarkMode, setIsDarkMode] = useState(false)

	// Invoice lookup states
	const [invoiceNumber, setInvoiceNumber] = useState("")
	const [searchEmail, setSearchEmail] = useState("")
	const [searchName, setSearchName] = useState("")
	const [searchResults, setSearchResults] = useState([])
	const [selectedInvoice, setSelectedInvoice] = useState(null)
	const [isSearching, setIsSearching] = useState(false)
	const [searchError, setSearchError] = useState("")
	const [amountLocked, setAmountLocked] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		const handleChange = e => setIsDarkMode(e.matches)
		mediaQuery.addEventListener("change", handleChange)
		setIsDarkMode(mediaQuery.matches)
		return () => mediaQuery.removeEventListener("change", handleChange)
	}, [])

	// Handle URL parameters for automatic invoice lookup
	useEffect(() => {
		if (!router.isReady) return

		const { invoice } = router.query
		if (invoice) {
			// Set the invoice number and automatically search for it
			setInvoiceNumber(invoice)
			// Trigger the search automatically
			searchInvoiceByNumber(invoice)
		}
	}, [router.isReady, router.query])

	useEffect(() => {
		console.log("Payment method: ", paymentMethod)
		if (subtotal === 0) {
			// Don't calculate fees when there's no subtotal
			setServiceFee(0)
			setTotalAmount(0)
		} else if (paymentMethod === "us_bank_account" ) {
			// for ACH, add a .8% fee with a $5 cap
			const achFee = parseInt(subtotal * 0.008)
			setServiceFee(achFee)
			setTotalAmount(parseInt(subtotal + achFee))
		} else {
			// for cards, add a 2.9% + 30 cents fee
			setServiceFee(parseInt(subtotal * 0.029 + 30))
			setTotalAmount(parseInt(subtotal + subtotal * 0.029 + 30))
		}
	}, [subtotal, paymentMethod])

	const handleAmountChange = e => {
		if (amountLocked) return // Don't allow changes if amount is locked
		const input = e.target.value.replace(/\D/g, "")
		const formattedAmount = parseInt(input || 0)
		setSubtotal(formattedAmount)
	}

	const centsToDollars = amount => amount / 100

	// Helper function to search for invoice by number
	const searchInvoiceByNumber = async (invoiceNum) => {
		setSearchError("")
		setSearchResults([])
		setSelectedInvoice(null)
		setIsSearching(true)

		try {
			const response = await fetch("/api/qb/search-invoices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					invoiceNumber: invoiceNum,
					email: "",
					name: "",
				}),
			})

			const data = await response.json()

			if (response.ok) {
				if (data.invoices.length === 0) {
					setSearchError("No invoices found matching your search")
				} else if (data.invoices.length === 1) {
					// Auto-select if only one invoice found
					selectInvoice(data.invoices[0])
				} else {
					// Show list of invoices to choose from
					setSearchResults(data.invoices)
				}
			} else {
				setSearchError(data.message || "Error searching for invoices")
			}
		} catch (error) {
			console.error("Search error:", error)
			setSearchError("Error connecting to server. Please try again.")
		} finally {
			setIsSearching(false)
		}
	}

	// Search for invoices
	const handleInvoiceSearch = async (e) => {
		e.preventDefault()
		setSearchError("")
		setSearchResults([])
		setSelectedInvoice(null)

		if (!invoiceNumber && !searchEmail && !searchName) {
			setSearchError("Please enter at least one search criteria")
			return
		}

		// Check that only ONE field is filled
		const fieldsFilledCount = [invoiceNumber, searchEmail, searchName].filter(Boolean).length
		if (fieldsFilledCount > 1) {
			setSearchError("Please search by only ONE field: invoice number, email, OR name")
			return
		}

		setIsSearching(true)

		try {
			const response = await fetch("/api/qb/search-invoices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					invoiceNumber,
					email: searchEmail,
					name: searchName,
				}),
			})

			const data = await response.json()

			if (response.ok) {
				if (data.invoices.length === 0) {
					setSearchError("No invoices found matching your search")
				} else if (data.invoices.length === 1 && !searchEmail && !searchName) {
					// Auto-select if only one invoice found AND searching by invoice number only
					selectInvoice(data.invoices[0])
				} else {
					// Show list of invoices to choose from (especially for email/name searches)
					setSearchResults(data.invoices)
				}
			} else {
				setSearchError(data.message || "Error searching for invoices")
			}
		} catch (error) {
			console.error("Search error:", error)
			setSearchError("Error connecting to server. Please try again.")
		} finally {
			setIsSearching(false)
		}
	}

	// Select an invoice and populate the payment amount
	const selectInvoice = (invoice) => {
		setSelectedInvoice(invoice)
		setSearchResults([])

		// If invoice is paid, don't set an amount
		if (invoice.isPaid) {
			setSubtotal(0)
			setAmountLocked(false)
		} else {
			// Convert balance to cents (QuickBooks returns dollars)
			const balanceInCents = Math.round(parseFloat(invoice.balance) * 100)
			setSubtotal(balanceInCents)
			setAmountLocked(true)
		}
	}

	// Clear invoice selection
	const clearInvoiceSelection = () => {
		setSelectedInvoice(null)
		setAmountLocked(false)
		setSubtotal(0)
		setInvoiceNumber("")
		setSearchEmail("")
		setSearchName("")
		setSearchResults([])
		setSearchError("")
	}

	return (
		<>
			<Head>
				<title>{`Make a Payment | ${siteData.name}`}</title>
				<meta name="description" content="Securely pay your invoice online with credit card or bank account (ACH)." />
			</Head>

			<main className="payment-page">
				<div className="payment-hero">
					<h1 className="payment-page-title">Make a Payment</h1>
					<p className="payment-page-subtitle">
						Securely pay your invoice using credit card or bank transfer
					</p>
				</div>

				<section className="payment-container">
					<div className="payment-grid">
						{/* Invoice Lookup Section */}
						<div className="payment-amount-card">
							<div className="mb-6">
								<h2 className="text-2xl font-bold mb-2 text-stone-900 dark:text-white">
									Lookup Your Invoice
								</h2>
								<p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
									Search by invoice number, email, or name to auto-fill your payment amount
								</p>
								<p className="text-xs text-amber-600 dark:text-amber-400 mb-4 bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 p-2 rounded">
									Note: Please use only ONE search field at a time
								</p>

								{!selectedInvoice ? (
									<form onSubmit={handleInvoiceSearch} className="space-y-4">
										<div>
											<label htmlFor="invoiceNumber" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
												Invoice Number
											</label>
											<input
												type="text"
												id="invoiceNumber"
												value={invoiceNumber}
												onChange={(e) => {
													setInvoiceNumber(e.target.value)
													// Clear other fields when typing in this field
													if (e.target.value) {
														setSearchEmail("")
														setSearchName("")
													}
												}}
												placeholder="e.g., 1001"
												className="w-full px-4 py-2 rounded-lg bg-white dark:bg-stone-700 border-2 border-stone-200 dark:border-stone-600 text-stone-900 dark:text-white focus:border-brand-blue focus:outline-none"
											/>
										</div>
										<div className="relative">
											<label htmlFor="searchEmail" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
												Email Address
											</label>
											<input
												type="email"
												id="searchEmail"
												value={searchEmail}
												onChange={(e) => {
													setSearchEmail(e.target.value)
													// Clear other fields when typing in this field
													if (e.target.value) {
														setInvoiceNumber("")
														setSearchName("")
													}
												}}
												placeholder="your@email.com"
												className="w-full px-4 py-2 rounded-lg bg-white dark:bg-stone-700 border-2 border-stone-200 dark:border-stone-600 text-stone-900 dark:text-white focus:border-brand-blue focus:outline-none"
											/>
										</div>
										<div>
											<label htmlFor="searchName" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
												Name
											</label>
											<input
												type="text"
												id="searchName"
												value={searchName}
												onChange={(e) => {
													setSearchName(e.target.value)
													// Clear other fields when typing in this field
													if (e.target.value) {
														setInvoiceNumber("")
														setSearchEmail("")
													}
												}}
												placeholder="John Doe"
												className="w-full px-4 py-2 rounded-lg bg-white dark:bg-stone-700 border-2 border-stone-200 dark:border-stone-600 text-stone-900 dark:text-white focus:border-brand-blue focus:outline-none"
											/>
										</div>
										<button
											type="submit"
											disabled={isSearching}
											className="w-full px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
										>
											{isSearching ? "Searching..." : "Search Invoices"}
										</button>
									</form>
								) : selectedInvoice.isPaid ? (
									<div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
										<div className="flex justify-between items-start mb-3">
											<h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
												</svg>
												Invoice Already Paid
											</h3>
											<button
												onClick={clearInvoiceSelection}
												className="text-sm text-stone-600 dark:text-stone-400 hover:text-brand-blue underline"
											>
												Clear
											</button>
										</div>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-stone-600 dark:text-stone-400">Invoice #:</span>
												<span className="font-semibold text-stone-900 dark:text-white">{selectedInvoice.docNumber}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-stone-600 dark:text-stone-400">Customer:</span>
												<span className="font-semibold text-stone-900 dark:text-white">{selectedInvoice.customerName}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-stone-600 dark:text-stone-400">Invoice Date:</span>
												<span className="font-semibold text-stone-900 dark:text-white">{new Date(selectedInvoice.txnDate).toLocaleDateString()}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-stone-600 dark:text-stone-400">Total Amount:</span>
												<span className="font-semibold text-stone-900 dark:text-white">${parseFloat(selectedInvoice.totalAmt).toFixed(2)}</span>
											</div>
											{selectedInvoice.paymentInfo && (
												<>
													<div className="border-t border-blue-200 dark:border-blue-800 my-2"></div>
													<div className="flex justify-between">
														<span className="text-stone-600 dark:text-stone-400">Paid On:</span>
														<span className="font-semibold text-blue-800 dark:text-blue-300">
															{new Date(selectedInvoice.paymentInfo.paidDate).toLocaleDateString()}
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-stone-600 dark:text-stone-400">Payment Method:</span>
														<span className="font-semibold text-blue-800 dark:text-blue-300">
															{selectedInvoice.paymentInfo.paymentMethod}
														</span>
													</div>
												</>
											)}
											<div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
												<span className="text-stone-600 dark:text-stone-400 font-bold">Balance:</span>
												<span className="font-bold text-blue-800 dark:text-blue-300 text-lg">$0.00</span>
											</div>
										</div>
										<div className="mt-4 p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
											<p className="text-sm text-blue-800 dark:text-blue-300 text-center">
												This invoice has been paid in full. Thank you for your payment!
											</p>
										</div>
									</div>
								) : (
									<div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border border-green-200 dark:border-green-800 rounded-lg p-4">
										<div className="flex justify-between items-start mb-3">
											<h3 className="font-bold text-green-800 dark:text-green-300">
												Invoice Selected
											</h3>
											<button
												onClick={clearInvoiceSelection}
												className="text-sm text-stone-600 dark:text-stone-400 hover:text-brand-blue underline"
											>
												Clear
											</button>
										</div>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-stone-600 dark:text-stone-400">Invoice #:</span>
												<span className="font-semibold text-stone-900 dark:text-white">{selectedInvoice.docNumber}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-stone-600 dark:text-stone-400">Customer:</span>
												<span className="font-semibold text-stone-900 dark:text-white">{selectedInvoice.customerName}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-stone-600 dark:text-stone-400">Date:</span>
												<span className="font-semibold text-stone-900 dark:text-white">{new Date(selectedInvoice.txnDate).toLocaleDateString()}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-stone-600 dark:text-stone-400">Due Date:</span>
												<span className="font-semibold text-stone-900 dark:text-white">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
											</div>
											<div className="flex justify-between pt-2 border-t border-green-200 dark:border-green-800">
												<span className="text-stone-600 dark:text-stone-400 font-bold">Balance Due:</span>
												<span className="font-bold text-green-800 dark:text-green-300 text-lg">${parseFloat(selectedInvoice.balance).toFixed(2)}</span>
											</div>
										</div>
									</div>
								)}

								{searchError && (
									<div className="mt-4 p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300 text-sm">
										{searchError}
									</div>
								)}

								{searchResults.length > 0 && (
									<div className="mt-4 space-y-2">
										<p className="text-sm font-medium text-stone-700 dark:text-stone-300">
											Select an invoice:
										</p>
										{searchResults.map((invoice) => (
											<button
												key={invoice.id}
												onClick={() => selectInvoice(invoice)}
												className={`w-full p-3 bg-white dark:bg-stone-700 border rounded-lg transition-colors text-left ${
													invoice.isPaid
														? 'border-blue-200 dark:border-blue-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-stone-600'
														: 'border-stone-200 dark:border-stone-600 hover:border-brand-blue hover:bg-blue-50 dark:hover:bg-stone-600'
												}`}
											>
												<div className="flex justify-between items-start">
													<div className="flex-1">
														<div className="flex items-center gap-2">
															<p className="font-semibold text-stone-900 dark:text-white">
																Invoice #{invoice.docNumber}
															</p>
															{invoice.isPaid && (
																<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium rounded">
																	<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
																		<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
																	</svg>
																	Paid
																</span>
															)}
														</div>
														<p className="text-sm text-stone-600 dark:text-stone-400">
															{invoice.customerName}
														</p>
														<p className="text-xs text-stone-500 dark:text-stone-500">
															{new Date(invoice.txnDate).toLocaleDateString()}
														</p>
													</div>
													<div className="text-right">
														<p className="text-sm text-stone-600 dark:text-stone-400">
															{invoice.isPaid ? 'Total' : 'Balance'}
														</p>
														<p className={`font-bold ${invoice.isPaid ? 'text-blue-600 dark:text-blue-400' : 'text-brand-blue'}`}>
															${parseFloat(invoice.isPaid ? invoice.totalAmt : invoice.balance).toFixed(2)}
														</p>
													</div>
												</div>
											</button>
										))}
									</div>
								)}
							</div>

							<div className="border-t border-stone-200 dark:border-stone-700 pt-6"></div>
						</div>

						{/* Amount Input Section */}
						{(!selectedInvoice || !selectedInvoice.isPaid) && (
							<div className="payment-amount-card">
								<div className="amount-input-group">
									<label htmlFor="subtotal" className="amount-label">
										Amount to Pay {amountLocked && <span className="text-xs text-green-600 dark:text-green-400">(Locked to Invoice)</span>}
									</label>
									<div className="amount-input-wrapper">
										<span className="currency-symbol">$</span>
										<input
											type="text"
											id="subtotal"
											name="subtotal"
											placeholder="0.00"
											value={
												subtotal > 0
													? centsToDollars(subtotal).toFixed(2)
													: ""
											}
											className={`amount-input ${amountLocked ? 'cursor-not-allowed opacity-75' : ''}`}
											onChange={handleAmountChange}
											disabled={amountLocked}
											title={amountLocked ? "Amount is locked to invoice balance" : ""}
										/>
									</div>
								</div>

								{parseFloat(subtotal) > 0 && (
									<div className="cost-breakdown">
										<div className="cost-row">
											<span className="cost-label">Subtotal:</span>
											<span className="cost-value">{formatMoney(subtotal)}</span>
										</div>
										{serviceFee > 0 && (
											<div className="cost-row">
												<div className="flex items-center gap-2">
													<span className="cost-label">Processing Fee:</span>
													<div className="info-tooltip-wrapper">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="info-icon"
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
														<span className="info-tooltip">
															{paymentMethod === "us_bank_account"
																? "Bank transfer (ACH): 0.8%"
																: "Credit card: 2.9% + $0.30"}
														</span>
													</div>
												</div>
												<span className="cost-value">{formatMoney(serviceFee)}</span>
											</div>
										)}
										<div className="cost-row total-row">
											<span className="cost-label-total">Total:</span>
											<span className="cost-value-total">{formatMoney(totalAmount)}</span>
										</div>
									</div>
								)}

								{/* Payment Form Section - now inside the same card */}
								{totalAmount > 0 && stripePromise && (
									<div className="mt-6 w-full">
										<Elements
											stripe={stripePromise}
											options={{
												mode: "payment",
												amount: parseInt(totalAmount),
												currency: "usd",
												business: "Matson Brothers Painting",
												paymentMethodOrder: ['us_bank_account', 'card'],
												appearance: {
													...stripeElementAppearance,
													theme: isDarkMode ? "night" : "stripe",
													rules: {
														...stripeElementAppearance.rules,
														'.Tab': {
															width: '100%',
														},
														'.Tab--selected': {
															width: '100%',
														},
														'.Input': {
															width: '100%',
														},
														'.Block': {
															width: '100%',
														},
													},
												},
											}}
										>
											<PaymentForm
												totalAmount={parseInt(totalAmount)}
												setPaymentMethod={setPaymentMethod}
												setServiceFee={setServiceFee}
												currency="usd"
												invoiceData={selectedInvoice}
											/>
										</Elements>
									</div>
								)}

								<div className="payment-security-badge">
									<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
										<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
									</svg>
									<span>Secure payment powered by Stripe</span>
								</div>
							</div>
						)}
					</div>
				</section>
			</main>
		</>
	)
}
