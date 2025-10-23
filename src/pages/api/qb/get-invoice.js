import { getInvoiceById, getCustomerById, getAccessToken, getInvoicePayments } from "@/utils/quickbooks"

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' })
	}

	try {
		const { invoiceId } = req.query

		if (!invoiceId) {
			return res.status(400).json({ message: 'Invoice ID is required' })
		}

		// Get access token from environment or token file (auto-refreshes if needed)
		const accessToken = await getAccessToken()

		if (!accessToken) {
			return res.status(500).json({
				message: 'QuickBooks authentication not configured. Please contact support.',
			})
		}

		// Get invoice details
		const invoiceResult = await getInvoiceById(accessToken, invoiceId)
		const invoice = invoiceResult.Invoice

		// Get customer details
		let customerEmail = ''
		try {
			const customerResult = await getCustomerById(
				accessToken,
				invoice.CustomerRef.value
			)
			customerEmail = customerResult.Customer?.PrimaryEmailAddr?.Address || ''
		} catch (error) {
			console.error('Error fetching customer:', error)
		}

		// Check if invoice is paid and get payment info
		const isPaid = parseFloat(invoice.Balance) === 0
		let paymentInfo = null

		if (isPaid) {
			try {
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
			} catch (error) {
				console.error('Error fetching payments:', error)
			}
		}

		// Format invoice data
		const formattedInvoice = {
			id: invoice.Id,
			docNumber: invoice.DocNumber,
			txnDate: invoice.TxnDate,
			dueDate: invoice.DueDate,
			balance: invoice.Balance,
			totalAmt: invoice.TotalAmt,
			customerName: invoice.CustomerRef.name,
			customerEmail,
			line: invoice.Line,
			customerMemo: invoice.CustomerMemo?.value || '',
			isPaid,
			paymentInfo,
		}

		return res.status(200).json({
			message: 'Invoice retrieved successfully',
			invoice: formattedInvoice,
		})
	} catch (error) {
		console.error('Error getting invoice:', error)
		return res.status(500).json({
			message: 'Error retrieving invoice. Please try again.',
			error: error.message,
		})
	}
}
