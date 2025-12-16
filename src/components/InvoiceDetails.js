const formatDate = (dateString) => new Date(dateString).toLocaleDateString()

export default function InvoiceDetails({ invoice, onClear }) {
	if (invoice.isPaid) {
		return (
			<div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
				<div className="flex justify-between items-start mb-3">
					<h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
						Invoice Already Paid
					</h3>
					<button
						onClick={onClear}
						className="text-sm text-stone-600 dark:text-stone-400 hover:text-brand-blue underline"
					>
						Clear
					</button>
				</div>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-stone-600 dark:text-stone-400">Invoice #:</span>
						<span className="font-semibold text-stone-900 dark:text-white">{invoice.docNumber}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-stone-600 dark:text-stone-400">Customer:</span>
						<span className="font-semibold text-stone-900 dark:text-white">{invoice.customerName}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-stone-600 dark:text-stone-400">Invoice Date:</span>
						<span className="font-semibold text-stone-900 dark:text-white">{formatDate(invoice.txnDate)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-stone-600 dark:text-stone-400">Total Amount:</span>
						<span className="font-semibold text-stone-900 dark:text-white">${parseFloat(invoice.totalAmt).toFixed(2)}</span>
					</div>
					{invoice.paymentInfo && (
						<>
							<div className="border-t border-blue-200 dark:border-blue-800 my-2"></div>
							<div className="flex justify-between">
								<span className="text-stone-600 dark:text-stone-400">Paid On:</span>
								<span className="font-semibold text-blue-800 dark:text-blue-300">
									{formatDate(invoice.paymentInfo.paidDate)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-stone-600 dark:text-stone-400">Payment Method:</span>
								<span className="font-semibold text-blue-800 dark:text-blue-300">
									{invoice.paymentInfo.paymentMethod}
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
		)
	}

	return (
		<div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border border-green-200 dark:border-green-800 rounded-lg p-4">
			<div className="flex justify-between items-start mb-3">
				<h3 className="font-bold text-green-800 dark:text-green-300">
					Invoice Selected
				</h3>
				<button
					onClick={onClear}
					className="text-sm text-stone-600 dark:text-stone-400 hover:text-brand-blue underline"
				>
					Clear
				</button>
			</div>
			<div className="space-y-2 text-sm">
				<div className="flex justify-between">
					<span className="text-stone-600 dark:text-stone-400">Invoice #:</span>
					<span className="font-semibold text-stone-900 dark:text-white">{invoice.docNumber}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-stone-600 dark:text-stone-400">Customer:</span>
					<span className="font-semibold text-stone-900 dark:text-white">{invoice.customerName}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-stone-600 dark:text-stone-400">Date:</span>
					<span className="font-semibold text-stone-900 dark:text-white">{formatDate(invoice.txnDate)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-stone-600 dark:text-stone-400">Due Date:</span>
					<span className="font-semibold text-stone-900 dark:text-white">{formatDate(invoice.dueDate)}</span>
				</div>
				<div className="flex justify-between pt-2 border-t border-green-200 dark:border-green-800">
					<span className="text-stone-600 dark:text-stone-400 font-bold">Balance Due:</span>
					<span className="font-bold text-green-800 dark:text-green-300 text-lg">${parseFloat(invoice.balance).toFixed(2)}</span>
				</div>
			</div>
		</div>
	)
}
