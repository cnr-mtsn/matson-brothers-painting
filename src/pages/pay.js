'use client'

import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import InvoiceSearchForm from "@/components/InvoiceSearchForm"
import InvoiceDetails from "@/components/InvoiceDetails"
import InvoiceSearchResults from "@/components/InvoiceSearchResults"
import PaymentAmountSection from "@/components/PaymentAmountSection"
import { stripeElementAppearance } from "@/utils/stripe"
import { siteData } from "../data/siteData"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

// Payment fee constants
const FEES = {
	ACH_RATE: 0.008,      // 0.8%
	ACH_CAP: 500,         // $5 cap in cents
	CARD_RATE: 0.029,     // 2.9%
	CARD_FIXED: 30,       // $0.30 in cents
}

// Utility functions
const dollarsToCents = (dollars) => Math.round(parseFloat(dollars) * 100)
const centsToDollars = (cents) => cents / 100

const calculateFees = (subtotal, paymentMethod) => {
	if (subtotal === 0) {
		return { serviceFee: 0, totalAmount: 0 }
	}

	if (paymentMethod === "us_bank_account") {
		const achFee = Math.min(parseInt(subtotal * FEES.ACH_RATE), FEES.ACH_CAP)
		return {
			serviceFee: achFee,
			totalAmount: parseInt(subtotal + achFee)
		}
	}

	// Card payment
	const cardFee = parseInt(subtotal * FEES.CARD_RATE + FEES.CARD_FIXED)
	return {
		serviceFee: cardFee,
		totalAmount: parseInt(subtotal + cardFee)
	}
}

const validateSearchFields = (invoiceNumber, email, name) => {
	if (!invoiceNumber && !email && !name) {
		return "Please enter at least one search criteria"
	}

	const fieldsFilledCount = [invoiceNumber, email, name].filter(Boolean).length
	if (fieldsFilledCount > 1) {
		return "Please search by only ONE field: invoice number, email, OR name"
	}

	return null
}

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
			setInvoiceNumber(invoice)
			searchInvoiceByNumber(invoice)
		}
	}, [router.isReady, router.query])

	useEffect(() => {
		const { serviceFee, totalAmount } = calculateFees(subtotal, paymentMethod)
		setServiceFee(serviceFee)
		setTotalAmount(totalAmount)
	}, [subtotal, paymentMethod])

	const handleAmountChange = e => {
		if (amountLocked) return
		const input = e.target.value.replace(/\D/g, "")
		const formattedAmount = parseInt(input || 0)
		setSubtotal(formattedAmount)
	}

	// Consolidated search function
	const searchInvoices = async (invoiceNumber, email, name) => {
		setSearchError("")
		setSearchResults([])
		setSelectedInvoice(null)
		setIsSearching(true)

		try {
			const response = await fetch("/api/search-invoices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					invoiceNumber,
					email,
					name,
				}),
			})

			const data = await response.json()

			if (response.ok) {
				if (data.invoices.length === 0) {
					setSearchError("No invoices found matching your search")
				} else if (data.invoices.length === 1 && invoiceNumber) {
					selectInvoice(data.invoices[0])
				} else {
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

	const searchInvoiceByNumber = async (invoiceNum) => {
		await searchInvoices(invoiceNum, "", "")
	}

	const handleInvoiceSearch = async (e) => {
		e.preventDefault()

		const validationError = validateSearchFields(invoiceNumber, searchEmail, searchName)
		if (validationError) {
			setSearchError(validationError)
			return
		}

		await searchInvoices(invoiceNumber, searchEmail, searchName)
	}

	const selectInvoice = (invoice) => {
		setSelectedInvoice(invoice)
		setSearchResults([])

		if (invoice.isPaid) {
			setSubtotal(0)
			setAmountLocked(false)
		} else {
			const balanceInCents = dollarsToCents(invoice.balance)
			setSubtotal(balanceInCents)
			setAmountLocked(true)
		}
	}

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

	const createSearchFieldHandler = (setCurrentField, ...otherSetters) => (e) => {
		setCurrentField(e.target.value)
		if (e.target.value) {
			otherSetters.forEach(setter => setter(""))
		}
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
									<InvoiceSearchForm
										invoiceNumber={invoiceNumber}
										searchEmail={searchEmail}
										searchName={searchName}
										isSearching={isSearching}
										onInvoiceNumberChange={createSearchFieldHandler(setInvoiceNumber, setSearchEmail, setSearchName)}
										onEmailChange={createSearchFieldHandler(setSearchEmail, setInvoiceNumber, setSearchName)}
										onNameChange={createSearchFieldHandler(setSearchName, setInvoiceNumber, setSearchEmail)}
										onSubmit={handleInvoiceSearch}
									/>
								) : (
									<InvoiceDetails invoice={selectedInvoice} onClear={clearInvoiceSelection} />
								)}

								{searchError && (
									<div className="mt-4 p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300 text-sm">
										{searchError}
									</div>
								)}

								<InvoiceSearchResults invoices={searchResults} onSelect={selectInvoice} />
							</div>

							<div className="border-t border-stone-200 dark:border-stone-700 pt-6"></div>
						</div>

						{(!selectedInvoice || !selectedInvoice.isPaid) && (
							<PaymentAmountSection
								subtotal={subtotal}
								serviceFee={serviceFee}
								totalAmount={totalAmount}
								amountLocked={amountLocked}
								paymentMethod={paymentMethod}
								selectedInvoice={selectedInvoice}
								stripePromise={stripePromise}
								stripeOptions={{
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
								onAmountChange={handleAmountChange}
								setPaymentMethod={setPaymentMethod}
								setServiceFee={setServiceFee}
							/>
						)}
					</div>
				</section>
			</main>
		</>
	)
}
