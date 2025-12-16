export default function InvoiceSearchForm({
	invoiceNumber,
	searchEmail,
	searchName,
	isSearching,
	onInvoiceNumberChange,
	onEmailChange,
	onNameChange,
	onSubmit,
}) {
	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<div>
				<label htmlFor="invoiceNumber" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
					Invoice Number
				</label>
				<input
					type="text"
					id="invoiceNumber"
					value={invoiceNumber}
					onChange={onInvoiceNumberChange}
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
					onChange={onEmailChange}
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
					onChange={onNameChange}
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
	)
}
