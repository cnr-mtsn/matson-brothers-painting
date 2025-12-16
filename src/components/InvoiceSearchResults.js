const formatDate = (dateString) => new Date(dateString).toLocaleDateString()

export default function InvoiceSearchResults({ invoices, onSelect }) {
	if (invoices.length === 0) return null

	return (
		<div className="mt-4 space-y-2">
			<p className="text-sm font-medium text-stone-700 dark:text-stone-300">
				Select an invoice:
			</p>
			{invoices.map((invoice) => (
				<button
					key={invoice.id}
					onClick={() => onSelect(invoice)}
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
								{formatDate(invoice.txnDate)}
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
	)
}
