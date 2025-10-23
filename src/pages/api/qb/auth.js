import OAuthClient from "intuit-oauth"

export default async function handler(req, res) {
	try {
		// Use QB_ENVIRONMENT to determine if we're using production or sandbox QuickBooks
		const useProduction = process.env.QB_ENVIRONMENT === 'production'

		// Get the origin from headers - check multiple sources
		const origin = req.headers.origin || 'https://matsonbrotherspainting.com'

		const redirectUri = `${origin}/api/qb/callback`

		console.log('OAuth Request Details:')
		console.log('- Origin:', req.headers.origin)
		console.log('- Host:', req.headers.host)
		console.log('- X-Forwarded-Host:', req.headers['x-forwarded-host'])
		console.log('- X-Forwarded-Proto:', req.headers['x-forwarded-proto'])
		console.log('- Referer:', req.headers.referer)
		console.log('- Computed Redirect URI:', redirectUri)

		const oauthClient = new OAuthClient({
			clientId: useProduction ? process.env.QB_PROD_CLIENT_ID : process.env.QB_DEV_CLIENT_ID,
			clientSecret: useProduction ? process.env.QB_PROD_CLIENT_SECRET : process.env.QB_DEV_CLIENT_SECRET,
			environment: useProduction ? 'production' : 'sandbox',
			redirectUri: redirectUri,
		})

		// Generate the authorization URL
		const authUri = oauthClient.authorizeUri({
			scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
			state: 'testState', // You can use this to verify the callback
		})

		// Redirect to QuickBooks authorization page
		res.redirect(authUri)
	} catch (error) {
		console.error('Error generating auth URL:', error)
		return res.status(500).json({
			message: 'Error connecting to QuickBooks',
			error: error.message,
		})
	}
}
