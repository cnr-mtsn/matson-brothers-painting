import { Elements } from "@stripe/react-stripe-js"
import PaymentForm from "@/components/PaymentForm"
import { formatMoney } from "@/utils/utils"

const FEES = {
	ACH_RATE: 0.008,
	ACH_CAP: 500,
	CARD_RATE: 0.029,
	CARD_FIXED: 30,
}

const centsToDollars = (cents) => cents / 100

export default function PaymentAmountSection({
	subtotal,
	serviceFee,
	totalAmount,
	amountLocked,
	paymentMethod,
	selectedInvoice,
	stripePromise,
	stripeOptions,
	onAmountChange,
	setPaymentMethod,
	setServiceFee,
}) {
	return (
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
						onChange={onAmountChange}
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
											? `Bank transfer (ACH): ${(FEES.ACH_RATE * 100).toFixed(1)}%`
											: `Credit card: ${(FEES.CARD_RATE * 100).toFixed(1)}% + $${(FEES.CARD_FIXED / 100).toFixed(2)}`}
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

			{totalAmount > 0 && stripePromise && (
				<div className="mt-6 w-full">
					<Elements
						stripe={stripePromise}
						options={stripeOptions}
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
	)
}
