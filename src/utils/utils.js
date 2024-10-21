export const formatMoney = (amount, currency = "USD") =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
	}).format(amount / 100)
