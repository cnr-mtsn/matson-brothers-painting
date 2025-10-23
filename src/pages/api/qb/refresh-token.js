import OAuthClient from "intuit-oauth"
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
	try {
		// Read stored tokens
		const tokenPath = path.join(process.cwd(), 'qb-tokens.json')

		if (!fs.existsSync(tokenPath)) {
			return res.status(404).json({
				message: 'No stored tokens found. Please connect to QuickBooks first.',
			})
		}

		const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))

		// Use QB_ENVIRONMENT to determine if we're using production or sandbox QuickBooks
		const useProduction = process.env.QB_ENVIRONMENT === 'production'

		const oauthClient = new OAuthClient({
			clientId: useProduction ? process.env.QB_PROD_CLIENT_ID : process.env.QB_DEV_CLIENT_ID,
			clientSecret: useProduction ? process.env.QB_PROD_CLIENT_SECRET : process.env.QB_DEV_CLIENT_SECRET,
			environment: useProduction ? 'production' : 'sandbox',
			redirectUri: process.env.QB_REDIRECT_URI || `${req.headers.origin || 'http://localhost:3000'}/api/qb/callback`,
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
		const authResponse = await oauthClient.refresh()
		const newToken = authResponse.getJson()

		console.log('Token refreshed successfully!')

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

		return res.status(200).json({
			message: 'Token refreshed successfully!',
			access_token: newToken.access_token.substring(0, 20) + '...',
			expires_in_hours: Math.round(newToken.expires_in / 3600),
		})
	} catch (error) {
		console.error('Error refreshing token:', error)
		return res.status(500).json({
			message: 'Error refreshing token',
			error: error.message,
		})
	}
}
