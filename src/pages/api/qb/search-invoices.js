import { searchInvoices, getCustomerById, getAccessToken, getInvoicePayments } from "@/utils/quickbooks"

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' })
	}

	try {
		const { invoiceNumber, email, name } = req.body

		// Validate that only one search field is provided
		const fieldsProvided = [invoiceNumber, email, name].filter(Boolean).length
		if (fieldsProvided === 0) {
			return res.status(400).json({
				message: 'Please provide at least one search criteria',
			})
		}
		if (fieldsProvided > 1) {
			return res.status(400).json({
				message: 'Please search by only ONE field: invoice number, email, OR name',
			})
		}

		// Get access token from environment or token file (auto-refreshes if needed)
		const accessToken = await getAccessToken()

		if (!accessToken) {
			return res.status(500).json({
				message: 'QuickBooks authentication not configured. Please contact support.',
			})
		}

		// Search for invoices
		const result = await searchInvoices(accessToken, {
			invoiceNumber,
			email,
			name,
		})

		if (!result.QueryResponse || !result.QueryResponse.Invoice) {
			return res.status(404).json({
				message: 'No invoices found matching your search criteria.',
				invoices: [],
			})
		}

		const invoices = result.QueryResponse.Invoice

		// Get customer details and payment info for each invoice
		const invoicesWithCustomer = await Promise.all(
			invoices.map(async (invoice) => {
				try {
					const isPaid = parseFloat(invoice.Balance) === 0
					let paymentInfo = null

					// Fetch customer details
					const customerResult = await getCustomerById(
						accessToken,
						invoice.CustomerRef.value
					)

					// If invoice is paid, get payment information
					if (isPaid) {
						const payments = await getInvoicePayments(accessToken, invoice.Id)
						if (payments.length > 0) {
							// Get the most recent payment
							const lastPayment = payments.sort((a, b) =>
								new Date(b.TxnDate) - new Date(a.TxnDate)
							)[0]
							paymentInfo = {
								paidDate: lastPayment.TxnDate,
								paymentMethod: lastPayment.PaymentMethodRef?.name || 'Unknown',
								totalPayments: payments.length,
							}
						}
					}

					return {
						id: invoice.Id,
						docNumber: invoice.DocNumber,
						txnDate: invoice.TxnDate,
						dueDate: invoice.DueDate,
						balance: invoice.Balance,
						totalAmt: invoice.TotalAmt,
						customerName: invoice.CustomerRef.name,
						customerEmail: customerResult.Customer?.PrimaryEmailAddr?.Address || '',
						line: invoice.Line,
						isPaid,
						paymentInfo,
					}
				} catch (error) {
					// If customer fetch fails, return invoice without detailed customer info
					const isPaid = parseFloat(invoice.Balance) === 0
					return {
						id: invoice.Id,
						docNumber: invoice.DocNumber,
						txnDate: invoice.TxnDate,
						dueDate: invoice.DueDate,
						balance: invoice.Balance,
						totalAmt: invoice.TotalAmt,
						customerName: invoice.CustomerRef.name,
						customerEmail: '',
						line: invoice.Line,
						isPaid,
						paymentInfo: null,
					}
				}
			})
		)

		return res.status(200).json({
			message: 'Invoices found successfully',
			invoices: invoicesWithCustomer,
		})
	} catch (error) {
		console.error('Error searching invoices:', error)
		return res.status(500).json({
			message: 'Error searching for invoices. Please try again.',
			error: error.message,
		})
	}
}
