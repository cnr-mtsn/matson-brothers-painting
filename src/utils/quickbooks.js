import OAuthClient from "intuit-oauth"
import fs from 'fs'
import path from 'path'

// Get token data from token file
export function getTokenData() {
	try {
		const tokenPath = path.join(process.cwd(), 'qb-tokens.json')
		if (fs.existsSync(tokenPath)) {
			const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
			return tokenData
		}
	} catch (error) {
		console.error('Error reading token file:', error)
	}
	return null
}

// Check if token needs to be refreshed (within 5 minutes of expiring)
export function tokenNeedsRefresh() {
	const tokenData = getTokenData()
	if (!tokenData) return true

	const createdAt = tokenData.created_at
	const expiresIn = tokenData.expires_in * 1000 // convert to milliseconds
	const expiresAt = createdAt + expiresIn
	const now = Date.now()
	const fiveMinutes = 5 * 60 * 1000

	// Refresh if token expires within 5 minutes
	return (expiresAt - now) < fiveMinutes
}

// Refresh the access token
export async function refreshAccessToken() {
	try {
		const tokenPath = path.join(process.cwd(), 'qb-tokens.json')

		if (!fs.existsSync(tokenPath)) {
			throw new Error('No stored tokens found. Please connect to QuickBooks first.')
		}

		const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
		const useProduction = process.env.QB_ENVIRONMENT === 'production'

		const oauthClient = new OAuthClient({
			clientId: useProduction ? process.env.QB_PROD_CLIENT_ID : process.env.QB_DEV_CLIENT_ID,
			clientSecret: useProduction ? process.env.QB_PROD_CLIENT_SECRET : process.env.QB_DEV_CLIENT_SECRET,
			environment: useProduction ? 'production' : 'sandbox',
			redirectUri: process.env.QB_REDIRECT_URI || 'http://localhost:3000/api/qb/callback',
		})

		// Set the existing token
		oauthClient.setToken({
			access_token: tokenData.access_token,
			refresh_token: tokenData.refresh_token,
			token_type: tokenData.token_type,
			expires_in: tokenData.expires_in,
			x_refresh_token_expires_in: tokenData.x_refresh_token_expires_in,
			realmId: tokenData.realm_id,
		})

		// Refresh the token
		console.log('🔄 Refreshing QuickBooks access token...')
		const authResponse = await oauthClient.refresh()
		const newToken = authResponse.getJson()

		// Update stored tokens
		const updatedTokenData = {
			access_token: newToken.access_token,
			refresh_token: newToken.refresh_token,
			expires_in: newToken.expires_in,
			x_refresh_token_expires_in: newToken.x_refresh_token_expires_in,
			token_type: newToken.token_type,
			created_at: Date.now(),
			realm_id: tokenData.realm_id,
		}

		fs.writeFileSync(tokenPath, JSON.stringify(updatedTokenData, null, 2))
		console.log('✅ QuickBooks token refreshed successfully!')

		return updatedTokenData.access_token
	} catch (error) {
		console.error('❌ Error refreshing token:', error)
		throw error
	}
}

// Get access token from environment or token file, auto-refresh if needed
export async function getAccessToken() {
	// First try environment variable
	if (process.env.QB_ACCESS_TOKEN) {
		return process.env.QB_ACCESS_TOKEN
	}

	// Check if token needs refresh
	if (tokenNeedsRefresh()) {
		console.log('⏰ Token is expiring soon, refreshing automatically...')
		return await refreshAccessToken()
	}

	// Return current token
	const tokenData = getTokenData()
	return tokenData?.access_token || null
}

// Initialize QuickBooks OAuth Client
export function getQBClient() {
	// Use QB_ENVIRONMENT to determine if we're using production or sandbox QuickBooks
	const useProduction = process.env.QB_ENVIRONMENT === 'production'

	return new OAuthClient({
		clientId: useProduction ? process.env.QB_PROD_CLIENT_ID : process.env.QB_DEV_CLIENT_ID,
		clientSecret: useProduction ? process.env.QB_PROD_CLIENT_SECRET : process.env.QB_DEV_CLIENT_SECRET,
		environment: useProduction ? 'production' : 'sandbox',
		redirectUri: process.env.QB_REDIRECT_URI || 'http://localhost:3000/api/qb/callback',
	})
}

// Make authenticated API request to QuickBooks
export async function makeQBRequest(endpoint, accessToken) {
	// Get company ID from token file (realm_id from OAuth)
	const tokenData = getTokenData()
	const companyId = tokenData?.realm_id || process.env.QB_COMPANY_ID

	// Determine environment - production uses api.intuit.com, sandbox uses sandbox-quickbooks.api.intuit.com
	const useProduction = process.env.QB_ENVIRONMENT === 'production'
	const apiDomain = useProduction
		? 'https://quickbooks.api.intuit.com'
		: 'https://sandbox-quickbooks.api.intuit.com'

	const baseUrl = `${apiDomain}/v3/company/${companyId}`
	const fullUrl = `${baseUrl}${endpoint}`

	console.log('\n=== QuickBooks API Request ===')
	console.log('Environment:', useProduction ? 'production' : 'sandbox')
	console.log('Company ID:', companyId)
	console.log('Full URL:', fullUrl)
	console.log('Access Token (first 50 chars):', accessToken?.substring(0, 50) + '...')
	console.log('==============================\n')

	const response = await fetch(fullUrl, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		const error = await response.text()
		console.error('QuickBooks API Error Response:', error)
		throw new Error(`QuickBooks API Error: ${response.status} - ${error}`)
	}

	return response.json()
}

// Search for customers by email or name
export async function searchCustomers(accessToken, searchParams) {
	const { email, name } = searchParams
	let query = "SELECT * FROM Customer WHERE "
	const conditions = []

	if (email) {
		conditions.push(`PrimaryEmailAddr LIKE '%${email}%'`)
	}

	if (name) {
		conditions.push(`DisplayName LIKE '%${name}%'`)
	}

	if (conditions.length === 0) {
		return { QueryResponse: { Customer: [] } }
	}

	query += conditions.join(' OR ')

	const encodedQuery = encodeURIComponent(query)
	return makeQBRequest(`/query?query=${encodedQuery}`, accessToken)
}

// Search invoices by various criteria
export async function searchInvoices(accessToken, searchParams) {
	const { invoiceNumber, email, name } = searchParams

	// If searching by invoice number only, use direct query
	if (invoiceNumber && !email && !name) {
		const query = `SELECT * FROM Invoice WHERE DocNumber = '${invoiceNumber}' ORDERBY TxnDate DESC`
		const encodedQuery = encodeURIComponent(query)
		return makeQBRequest(`/query?query=${encodedQuery}`, accessToken)
	}

	// If searching by email or name, first find the customers
	if (email || name) {
		const customerResult = await searchCustomers(accessToken, { email, name })
		const customers = customerResult.QueryResponse?.Customer || []

		if (customers.length === 0) {
			return { QueryResponse: { Invoice: [] } }
		}

		// Get all customer IDs
		const customerIds = customers.map(c => c.Id)

		// Build query to get all invoices for these customers
		let query = "SELECT * FROM Invoice WHERE "

		if (customerIds.length === 1) {
			// Single customer - no parentheses needed
			query += `CustomerRef = '${customerIds[0]}'`
		} else {
			// Multiple customers - use OR with parentheses
			const customerConditions = customerIds.map(id => `CustomerRef = '${id}'`)
			query += `(${customerConditions.join(' OR ')})`
		}

		// If invoice number is also provided, add that as an additional filter
		if (invoiceNumber) {
			query += ` AND DocNumber = '${invoiceNumber}'`
		}

		query += " ORDERBY TxnDate DESC"

		const encodedQuery = encodeURIComponent(query)
		return makeQBRequest(`/query?query=${encodedQuery}`, accessToken)
	}

	throw new Error('At least one search parameter is required')
}

// Get payment information for an invoice
export async function getInvoicePayments(accessToken, invoiceId) {
	try {
		const query = `SELECT * FROM Payment WHERE Line.LinkedTxn.TxnId = '${invoiceId}'`
		const encodedQuery = encodeURIComponent(query)
		const result = await makeQBRequest(`/query?query=${encodedQuery}`, accessToken)
		return result.QueryResponse?.Payment || []
	} catch (error) {
		console.error('Error fetching invoice payments:', error)
		return []
	}
}

// Get invoice by ID
export async function getInvoiceById(accessToken, invoiceId) {
	return makeQBRequest(`/invoice/${invoiceId}`, accessToken)
}

// Get customer details
export async function getCustomerById(accessToken, customerId) {
	return makeQBRequest(`/customer/${customerId}`, accessToken)
}
